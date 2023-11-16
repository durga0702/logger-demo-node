import Joi from "joi";

export const attendanceValidation = Joi.object({
  student: Joi.string().required(),
  date: Joi.date().required(),
  is_present: Joi.boolean().default(true),
});
