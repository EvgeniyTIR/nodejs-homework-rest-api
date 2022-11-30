const { User } = require("../models/usersSchema");
const { Conflict, Unauthorized, NotFound } = require("http-errors");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("react-uuid");

const { SECRET } = require("../helpers/envImport");

const {
	verificationMail,
	verificationSuccsessMail,
} = require("../services/sendgridService");

const registrationController = async (req, res, next) => {
	const { email, password } = req.body;

	const verificationToken = uuid();
	const user = new User({
		email,
		password,
		verificationToken,
	});

	try {
		await user.save();
		await verificationMail(user.email, verificationToken);
	} catch (error) {
		if (error.message.includes("duplicate key error collection")) {
			console.log(error.message);
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
	const user = await User.findOne({ email, verify: true });
	if (!user) {
		throw new Unauthorized(
			`No user whith ${email} found or email not avtorised`
		);
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

const emailVerifyController = async (req, res, next) => {
	const { verificationToken } = req.params;

	const user = await User.findOne({ verificationToken });

	if (!user) {
		throw new NotFound("User not found");
	}

	if (user.verify) {
		throw new NotFound("User already avtorized");
	}

	await User.findByIdAndUpdate(user._id, {
		verify: true,
		verificationToken: null,
	});

	await verificationSuccsessMail(user.email);

	return res.json({
		message: "Verification successful",
	});
};

const repitVerifyMail = async (req, res, next) => {
	const { email } = req.body;

	const user = await User.findOne({ email });

	if (user.verify) {
		return res
			.status(400)
			.json({ message: "Verification has already been passed" });
	}

	if (!user) {
		throw new NotFound("User not found");
	}

	await verificationMail(user.email, user.verificationToken);

	return res.json({
		message: "Verification email sent",
	});
};

module.exports = {
	registrationController,
	loginController,
	logoutController,
	getCurrentUserController,
	emailVerifyController,
	repitVerifyMail,
};
