import Joi from "joi";

const userSignupSchema = Joi.object({
	// name: Joi.string().required(),
	email: Joi.string().required(),
	password: Joi.string().min(6).required(),
});

const userEmailSchema = Joi.object({
	email: Joi.string().required(),
});

const userSigninSchema = Joi.object({
	email: Joi.string().required(),
	password: Joi.string().min(6).required(),
});
export default {
	userSignupSchema,
    userEmailSchema,
	userSigninSchema,
};