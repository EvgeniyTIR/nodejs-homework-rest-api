const { User } = require("../models/usersSchema");
const { Conflict, Unauthorized, NotFound } = require("http-errors");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const uuid = require("react-uuid");

const { SECRET } = require("../helpers/envImport");
const { SENDGRID_API_KEY } = require("../helpers/envImport");
const { PORT } = require("../helpers/envImport");

sgMail.setApiKey(SENDGRID_API_KEY);

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
		const msg = {
			to: user.email, // Change to your recipient
			from: "tirairdrop@gmail.com", // Change to your verified sender
			subject: "Thank you for registration",
			text: "Please verify your email address",
			html: `Please <a href="http://localhost:${PORT}/api/users/verify/${verificationToken}">verify</a> your email address`,
		};
		await sgMail.send(msg);
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

	if (user === null) {
		throw new NotFound("User already avtorized");
	}
	if (!user && user !== null) {
		throw new NotFound("User not found");
	}

	await User.findByIdAndUpdate(user._id, {
		verify: true,
		verificationToken: null,
	});

	const msg = {
		to: user.email,
		from: "tirairdrop@gmail.com",
		subject: "Thank you for verification",
		text: "Verification successful",
		html: "Verification successful",
	};
	await sgMail.send(msg);

	return res.json({
		message: "Verification successful",
	});
};

const repitVerifyMail = async (req, res, next) => {
	const { email } = req.body;

	const user = await User.findOne({ email, verify: false });
	const alreadyVerifedUser = await User.findOne({ email, verify: true });

	if (!user && alreadyVerifedUser) {
		return res
			.status(400)
			.json({ message: "Verification has already been passed" });
	}

	if (!user && !alreadyVerifedUser) {
		throw new NotFound("User not found");
	}

	const msg = {
		to: user.email,
		from: "tirairdrop@gmail.com",
		subject: "Thank you for registration",
		text: "Please verify your email address",
		html: `Please <a href="http://localhost:${PORT}/api/users/verify/${user.verificationToken}">verify</a> your email address`,
	};
	await sgMail.send(msg);

	return res.json({
		message: "Check you email, verification messege already send",
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
