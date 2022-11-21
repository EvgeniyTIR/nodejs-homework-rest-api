const {
	loginController,
	registrationController,
} = require("../../controllers/authController");
const { loginValidation } = require("../../middlewares/validation");

const express = require("express");

const { asyncWrapper } = require("../../helpers/errWrapper");

const router = express.Router();

router.post("/signup", loginValidation, asyncWrapper(registrationController));
router.post("/login", loginValidation, asyncWrapper(loginController));

module.exports = { authRouter: router };
