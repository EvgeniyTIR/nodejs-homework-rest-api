const { asyncWrapper } = require("../../helpers/errWrapper");
const { uploadController } = require("../../controllers/avatarsController");
const { uploadMiddleware } = require("../../middlewares/uploadMiddlware");

const express = require("express");
const multer = require("multer");

const router = express.Router();

router.patch(
	"/avatars",
	uploadMiddleware.single("avatar"),
	asyncWrapper(uploadController)
);

module.exports = { avatarsRouter: router };
