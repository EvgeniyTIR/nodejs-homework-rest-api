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
	const { user } = req;

	await User.findByIdAndUpdate(user._id, { token: null });

	return res.status(204).json({ message: "No Content" });
};

module.exports = { registrationController, loginController, logoutController };
