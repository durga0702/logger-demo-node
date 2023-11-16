import Joi from "joi";

export const subjectValidation = Joi.object({
  name: Joi.string().required(),
  teacher: Joi.array().items(Joi.string()),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});
