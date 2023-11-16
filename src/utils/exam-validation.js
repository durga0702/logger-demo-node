import Joi from "joi";

export const examValidation = Joi.object({
  title: Joi.string().required(),
  date: Joi.date().required(),
  student: Joi.string().required(),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});
