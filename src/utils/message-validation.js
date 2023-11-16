import Joi from "joi";

export const messageValidation = Joi.object({
  from: Joi.string().required(),
  to: Joi.string().required(),
  content: Joi.string().required(),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});
