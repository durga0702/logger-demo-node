import Joi from "joi";

export const classValidation = Joi.object({
  standard: Joi.string().required(),
  teachers: Joi.array().items(Joi.string()),
  students: Joi.array().items(Joi.string()),
  subjects: Joi.array().items(Joi.string()),
  schedule: Joi.object({
    days: Joi.array().items(Joi.string()),
    periods: Joi.array().items(
      Joi.object({
        day: Joi.string(),
        start_time: Joi.string(),
        end_time: Joi.string(),
        subject: Joi.string(),
        teacher: Joi.string(),
      })
    ),
  }),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});
