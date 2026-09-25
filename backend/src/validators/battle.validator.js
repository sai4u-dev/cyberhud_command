import Joi from "joi";
import { BATTLE_TYPES, BATTLE_MODES } from "../models/Battle.js";

/**
 * Battle validators — defense in depth alongside Mongoose schema validation.
 * Controllers enforce domain invariants (capacity, state machine); these
 * enforce wire-format shape so malformed payloads fail fast with 400.
 */

export const createBattleSchema = Joi.object({
  title: Joi.string().trim().min(3).max(80).required(),
  description: Joi.string().max(300).allow("").optional(),
  type: Joi.string().valid(...Object.values(BATTLE_TYPES)).required(),
  mode: Joi.string().valid(...Object.values(BATTLE_MODES)).optional(),
  maxParticipants: Joi.number().integer().min(2).max(32).optional(),
  mapZone: Joi.object({
    name: Joi.string().max(100).optional(),
    coordinates: Joi.array().items(Joi.number()).length(2).optional(),
    googlePlaceId: Joi.string().max(128).allow("").optional(),
  }).optional(),
  entryFee: Joi.number().min(0).max(1000000).optional(),
  isPrivate: Joi.boolean().optional(),
  password: Joi.string().max(128).allow(null, "").optional(),
});

export const joinBattleSchema = Joi.object({
  password: Joi.string().max(128).allow("").optional(),
});

export const finishBattleSchema = Joi.object({
  winnerId: Joi.string().hex().length(24).allow(null).optional(),
});

export const battleQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(50).optional(),
  type: Joi.string().valid(...Object.values(BATTLE_TYPES)).optional(),
  status: Joi.string().valid("waiting", "in_progress", "completed", "cancelled").optional(),
  mode: Joi.string().valid(...Object.values(BATTLE_MODES)).optional(),
  search: Joi.string().max(80).allow("").optional(),
});
