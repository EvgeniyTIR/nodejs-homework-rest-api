const MONGO_URL = process.env.MONGO_URL_ENV;
const PORT = +process.env.PORT_ENV || 3000;
const SECRET = process.env.JWT_SECRET || "secret";
const SENDGRID_API_KEY = process.env.SENDGRID;

module.exports = {
	PORT,
	MONGO_URL,
	SECRET,
	SENDGRID_API_KEY,
};
