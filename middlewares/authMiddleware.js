const jwt = require("jsonwebtoken");
const { LoginAuthError } = require("../helpers/errWrapper");
const { User } = require("../models/usersSchema");
const { SECRET } = require("../helpers/envImport");

const authMiddlware = async (req, res, next) => {
	try {
		const { authorization } = req.headers;
		if (!authorization) {
			next(
				new LoginAuthError(
					"Please,provide a token in request authorization header"
				)
			);
		}
		const [tokenType, token] = authorization.split(" ");
		if (!token) {
			next(new LoginAuthError("Please,provide a token"));
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
