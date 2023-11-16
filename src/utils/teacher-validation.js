import Joi from "joi";

export const teacherValidation = Joi.object({
  employee_id: Joi.string().required(),
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  auth_token: Joi.string(),
  class: Joi.array().items(Joi.string()),
  subjects: Joi.array().items(Joi.string()),
  role: Joi.string().required(),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});
