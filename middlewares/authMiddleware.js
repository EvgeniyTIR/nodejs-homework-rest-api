const jwt = require("jsonwebtoken");
const { LoginAuthError } = require("../helpers/errWrapper");
const { User } = require("../models/usersSchema");
const { SECRET } = require("../helpers/envImport");

const authMiddlware = async (req, res, next) => {
	try {
		const [tokenType, token] = authorization.split(" ");
		if (!token) {
			next(new LoginAuthError("Not authorized"));
		}

		const user = jwt.decode(token, SECRET);
		const verifyUser = await User.findById(user._id);
		if (!verifyUser || token !== verifyUser.token) {
			throw new LoginAuthError("Not authorized");
		}
		req.user = user;
		req.token = token;
		next();
	} catch (err) {
		next(new LoginAuthError("Invalid token"));
	}
};

module.exports = { authMiddlware };
