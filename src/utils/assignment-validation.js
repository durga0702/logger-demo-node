import Joi from "joi";

export const assignmentValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  dueDate: Joi.date().required(),
  student: Joi.string(),
  submitted_work: Joi.string(),
  submitted_by: Joi.string(),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});
