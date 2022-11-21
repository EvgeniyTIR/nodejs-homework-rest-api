const {
	loginController,
	registrationController,
	logoutController,
} = require("../../controllers/authController");
const { authMiddlware } = require("../../middlewares/authMiddleware");
const { loginValidation } = require("../../middlewares/validation");

const express = require("express");

const { asyncWrapper } = require("../../helpers/errWrapper");

const router = express.Router();

router.post("/signup", loginValidation, asyncWrapper(registrationController));
router.post("/login", loginValidation, asyncWrapper(loginController));
router.post("/logout", authMiddlware, asyncWrapper(logoutController));

module.exports = { authRouter: router };
