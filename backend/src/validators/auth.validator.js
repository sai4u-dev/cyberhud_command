import Joi from "joi";
import { ROLES } from "../models/User.js";

export const registerSchema = Joi.object({
  username: Joi.string().pattern(/^[a-zA-Z0-9_\-]+$/).min(3).max(30).required().messages({ "string.pattern.base": "Username can only contain alphanumeric, underscore and hyphen" }),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
    .message("Password must contain uppercase, lowercase, number and special character"),
  displayName: Joi.string().max(50).optional(),
  role: Joi.string().valid(...Object.values(ROLES)).optional(), // only admin can assign non-user, validated in controller
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const refreshSchema = Joi.object({
  refreshToken: Joi.string().optional(), // can come from cookie
});
