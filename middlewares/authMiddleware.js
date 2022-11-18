const jwt = require("jsonwebtoken");
const { LoginAuthError } = require("../helpers/errWrapper");
const { SECRET } = require("../helpers/envImport");

const authMiddlware = (req, res, next) => {
	const [tokenType, token] = req.headers.authorization.split(" ");
	if (!token) {
		next(new LoginAuthError("Please,provide a token"));
	}

	try {
		const user = jwt.decode(token, SECRET);
		req.user = user;
		req.token = token;
		next();
	} catch (err) {
		next(new LoginAuthError("Invalid token"));
	}
};

module.exports = { authMiddlware };
