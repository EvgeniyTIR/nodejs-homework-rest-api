const MONGO_URL = process.env.MONGO_URL_ENV;
const PORT = process.env.PORT_ENV;
const SECRET = process.env.JWT_SECRET;

module.exports = {
	PORT,
	MONGO_URL,
	SECRET,
};
