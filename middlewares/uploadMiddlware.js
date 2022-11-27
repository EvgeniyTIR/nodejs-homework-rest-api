const multer = require("multer");
const path = require("path");
const uuid = require("react-uuid");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.resolve(__dirname, "tmp"));
	},
	filename: (req, file, cb) => {
		const [filename, extension] = file.originalname.split(".");
		cb(null, `${uuid()}.${extension}`);
	},
});

const uploadMiddleware = multer({ storage });

module.exports = { uploadMiddleware };
