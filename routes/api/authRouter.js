const {
	loginController,
	registrationController,
	logoutController,
	getCurrentUserController,
	emailVerifyController,
	repitVerifyMail,
} = require("../../controllers/authController");
const { authMiddlware } = require("../../middlewares/authMiddleware");
const {
	loginValidation,
	emailValidation,
} = require("../../middlewares/validation");

const express = require("express");

const { asyncWrapper } = require("../../helpers/errWrapper");

const router = express.Router();

router.post("/signup", loginValidation, asyncWrapper(registrationController));
router.post("/login", loginValidation, asyncWrapper(loginController));
router.get("/logout", authMiddlware, asyncWrapper(logoutController));
router.get("/current", authMiddlware, asyncWrapper(getCurrentUserController));
router.get("/verify/:verificationToken", asyncWrapper(emailVerifyController));
router.post("/verify", emailValidation, asyncWrapper(repitVerifyMail));

module.exports = { authRouter: router };
