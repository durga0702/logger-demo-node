import Joi from "joi";

export const studentValidation = Joi.object({
  student_id: Joi.string().required(),
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  class: Joi.string(),
  section: Joi.string().valid("A", "B").required(),
  role: Joi.string().required(),
  auth_token: Joi.string(),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});
