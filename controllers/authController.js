const { User } = require("../models/usersSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../helpers/envImport");
const { Conflict, Unauthorized } = require("http-errors");

const registrationController = async (req, res, next) => {
	const { email, password } = req.body;
	const user = new User({ email, password });
	try {
		await user.save();
	} catch (error) {
		if (error.message.includes("duplicate key error collection")) {
			throw new Conflict("Email in use");
		}

		throw error;
	}

	res.status(201).json({
		user: {
			email: user.email,
			subscription: user.subscription,
		},
	});
};
const loginController = async (req, res, next) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		throw new Unauthorized(`No user whith ${email} found`);
	}
	if (!(await bcrypt.compare(password, user.password))) {
		throw new Unauthorized(`Email or password is wrong`);
	}
	const token = jwt.sign({ _id: user._id }, SECRET);
	await User.findByIdAndUpdate(user._id, { token }, { runValidators: true });
	res.json({
		user: {
			email: user.email,
			subscription: user.subscription,
		},
		token,
	});
};

const logoutController = async (req, res, next) => {
	const { _id } = req.user;

	await User.findByIdAndUpdate(_id, { token: null });

	res.status(204).json({ message: "No Content" });
};
const getCurrentUserController = async (req, res, next) => {
	const { _id } = req.user;

	const currentUser = await User.findById(_id).select({
		email: 1,
		subscription: 1,
		_id: 0,
	});

	return res.status(200).json(currentUser);
};

module.exports = {
	registrationController,
	loginController,
	logoutController,
	getCurrentUserController,
};
