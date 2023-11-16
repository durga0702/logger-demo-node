import Joi from "joi";

export const parentValidation = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  auth_token: Joi.string(),
  children: Joi.array().items(Joi.string()),
  role: Joi.string().required(),
  messages: Joi.array().items(Joi.string()),
  reports: Joi.array().items(Joi.string()),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});
