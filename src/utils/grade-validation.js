import Joi from "joi";

export const gradeValidation = Joi.object({
  student_id: Joi.string().required(),
  assignment_id: Joi.string().required(),
  exam_id: Joi.string().required(),
  grade: Joi.number().required(),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});
