const { asyncWrapper } = require("../../helpers/errWrapper");
const { uploadMiddleware } = require("../../middlewares/uploadMiddleware");
const {
	updateAvatarsControler,
} = require("../../controllers/avatarsController");
const { authMiddlware } = require("../../middlewares/authMiddleware");

const express = require("express");

const router = express.Router();

router.patch(
	"/avatars",
	authMiddlware,
	uploadMiddleware.single("avatar"),
	asyncWrapper(updateAvatarsControler)
);

module.exports = { avatarsRouter: router };
