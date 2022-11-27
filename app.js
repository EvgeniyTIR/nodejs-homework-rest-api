const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const contactsRouter = require("./routes/api/contacts");
const { authRouter } = require("./routes/api/authRouter");
const { avatarsRouter } = require("./routes/api/avatarsRouter");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/users", authRouter);
app.use("/api/users", avatarsRouter);
app.use(express.static("public"));

app.use((req, res) => {
	res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
	console.error(`app error: ${err.message} ${err.name}`);

	if (err.name === "ValidationError") {
		return res.status(400).json({
			message: err.message,
		});
	}

	if (err.status) {
		return res.status(err.status).json({
			message: err.message,
		});
	}

	return res.status(500).json({
		message: `Internal server error ${err.message}`,
	});
});

module.exports = app;
