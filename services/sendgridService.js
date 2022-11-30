const sgMail = require("@sendgrid/mail");
const { SENDGRID_API_KEY, PORT, EMAIL } = require("../helpers/envImport");

sgMail.setApiKey(SENDGRID_API_KEY);

const verificationMail = async (email, verificationToken) => {
	const msg = {
		to: email, // Change to your recipient
		from: EMAIL, // Change to your verified sender
		subject: "Thank you for registration",
		text: "Please verify your email address",
		html: `Please <a href="http://localhost:${PORT}/api/users/verify/${verificationToken}">verify</a> your email address`,
	};
	await sgMail.send(msg);
};

const verificationSuccsessMail = async (email) => {
	const msg = {
		to: email,
		from: EMAIL,
		subject: "Thank you for verification",
		text: "Verification successful",
		html: "Verification successful",
	};
	await sgMail.send(msg);
};

module.exports = {
	verificationMail,
	verificationSuccsessMail,
};
