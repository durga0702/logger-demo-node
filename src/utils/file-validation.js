import Joi from "joi";

export const fileValidation = Joi.object({
  subject_id: Joi.string(),
  original_name: Joi.string(),
  file_name: Joi.string(),
  path: Joi.string(),
});
