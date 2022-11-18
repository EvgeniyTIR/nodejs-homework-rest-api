const {
	loginController,
	registrationController,
} = require("../../controllers/authController");

const express = require("express");

const { asyncWrapper } = require("../../helpers/errWrapper");

const router = express.Router();

router.post("/signup", asyncWrapper(registrationController));
router.post("/login", asyncWrapper(loginController));

module.exports = { authRouter: router };
