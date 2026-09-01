import Joi from "joi";

const createBlogSchema = Joi.object({
  title: Joi.string().min(3).max(30).required().messages({
    "string.min": "Title must be at least 3 characters long.",
    "string.max": "Title cannot exceed 30 characters.",
    "any.required": "Title is required.",
  }),

  description: Joi.string().min(10).max(200).required().messages({
    "string.min": "Description must be at least 10 characters long.",
    "string.max": "Description cannot exceed 200 characters.",
    "any.required": "Description is required.",
  }),
});

const updateBlogSchema = Joi.object({
  title: Joi.string().min(3).max(30),
  description: Joi.string().min(10).max(200),
});
export { createBlogSchema, updateBlogSchema };
