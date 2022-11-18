const { User } = require("../models/usersSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../helpers/envImport");

const { LoginAuthError } = require("../helpers/errWrapper");

const registrationController = async (req, res, next) => {
	const { email, password } = req.body;
	const user = new User({ email, password });
	await user.save();
	res.json();
};
const loginController = async (req, res, next) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		throw new LoginAuthError(`No user whit ${email} found`);
	}
	if (!(await bcrypt.compare(password, user.password))) {
		throw new LoginAuthError(`Wrong password`);
	}
	const token = jwt.sign({ _id: user._id }, SECRET);
	await User.findByIdAndUpdate(user._id, { token }, { runValidators: true });
	res.json({ token });
};

module.exports = { registrationController, loginController };
