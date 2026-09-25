import Joi from "joi";
import { ROLES } from "../models/User.js";

/**
 * User query validator — whitelist for GET /api/users.
 * Rejects operator objects/arrays outright (e.g. `?role[$gt]=`), so
 * NoSQL-injection payloads fail closed with 400 even before Mongoose.
 */
export const userQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  search: Joi.string().max(80).allow("").optional(),
  role: Joi.string().valid(...Object.values(ROLES)).allow("").optional(),
});
