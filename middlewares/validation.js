const Joi = require("joi");
const customJoi = Joi.extend(require("joi-ext-phonenumber"));

const validation = (req, res, next) => {
	const schema = Joi.object({
		name: Joi.string()
			.pattern(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/)
			.min(3)
			.max(20)
			.required()
			.messages({ "any.required": `missing required name field` }),
		email: Joi.string()
			.email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ua"] } })
			.required()
			.messages({ "any.required": `missing required email field` }),
		phone: customJoi
			.string()
			.phoneNumber()
			.min(7)
			.max(20)
			.required()
			.messages({ "any.required": `missing required phone field` }),
		favorite: Joi.boolean().optional(),
	});
	const result = schema.validate(req.body);
	if (result.error) {
		return res.status(400).json({ message: result.error.message });
	}

	next();
};
const validationPUT = (req, res, next) => {
	const schema = Joi.object({
		name: Joi.string()
			.pattern(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/)
			.min(3)
			.max(20)
			.required()
			.messages({ "object.length": `missing field` }),
		email: Joi.string()
			.email({
				minDomainSegments: 2,
				tlds: { allow: ["com", "net", "ua"] },
			})
			.required()
			.messages({ "object.length": `missing field` }),
		phone: customJoi.string().phoneNumber().min(7).max(20).optional(),
		favorite: Joi.boolean(),
	});
	const result = schema.validate(req.body);
	if (result.error) {
		return res.status(400).json({ message: result.error.message });
	}

	next();
};
const validationFavorite = (req, res, next) => {
	const schema = Joi.object({
		favorite: Joi.boolean()
			.required()
			.messages({ "any.required": "missing field favorite" }),
	});

	const result = schema.validate(req.body);
	if (result.error) {
		return res.status(400).json({ message: result.error.message });
	}

	next();
};

const loginValidation = (req, res, next) => {
	const schema = Joi.object({
		email: Joi.string()
			.email({
				minDomainSegments: 2,
				tlds: { allow: ["com", "net", "ua"] },
			})
			.required(),
		password: Joi.string().min(4).required(),
	});

	const result = schema.validate(req.body);
	if (result.error) {
		return res.status(400).json({ message: result.error.message });
	}

	next();
};

const emailValidation = (req, res, next) => {
	const schema = Joi.object({
		email: Joi.string()
			.email({
				minDomainSegments: 2,
				tlds: { allow: ["com", "net", "ua"] },
			})
			.required(),
	});

	const result = schema.validate(req.body);
	if (result.error) {
		return res.status(400).json({ message: "missing required field email" });
	}

	next();
};

module.exports = {
	validation,
	validationPUT,
	validationFavorite,
	loginValidation,
	emailValidation,
};
