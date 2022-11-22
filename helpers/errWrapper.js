const asyncWrapper = (controller) => {
	return (req, res, next) => {
		controller(req, res).catch(next);
	};
};

class LoginAuthError extends Error {
	constructor(message) {
		super(message);
		this.status = 401;
	}
}

module.exports = { asyncWrapper, LoginAuthError };
