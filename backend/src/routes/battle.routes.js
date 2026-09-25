import express from "express";
import { protect } from "../middlewares/auth.js";
import validateRequest from "../middlewares/validateRequest.js";
import idempotency from "../middlewares/idempotency.js";
import { cacheMiddleware } from "../config/redis.js";
import {
  createBattleSchema,
  joinBattleSchema,
  finishBattleSchema,
  battleQuerySchema,
} from "../validators/battle.validator.js";
import {
  createBattle,
  getBattles,
  getBattleById,
  getBattleByCode,
  joinBattle,
  leaveBattle,
  toggleReady,
  startBattle,
  finishBattle,
  cancelBattle,
  getMyBattles,
  getBattleLeaderboard,
} from "../controllers/battleController.js";

const router = express.Router();

// Public leaderboard — cached 30s (hot path, safe to serve stale briefly)
router.get("/leaderboard", cacheMiddleware("battles:leaderboard", 30), getBattleLeaderboard);

// Protected — user specific (must be before /:id)
router.get("/my", protect, getMyBattles);
router.get("/code/:code", protect, getBattleByCode);

// Public browsable with query validation
router.get("/", validateRequest(battleQuerySchema, "query"), getBattles);
router.get("/:id", getBattleById);

// State-changing — idempotency-aware so retries never double-apply
router.post("/", protect, validateRequest(createBattleSchema), idempotency, createBattle);
router.post("/:id/join", protect, validateRequest(joinBattleSchema), idempotency, joinBattle);
router.post("/:id/leave", protect, leaveBattle);
router.post("/:id/ready", protect, toggleReady);
router.post("/:id/start", protect, idempotency, startBattle);
router.post("/:id/finish", protect, validateRequest(finishBattleSchema), idempotency, finishBattle);
router.post("/:id/cancel", protect, idempotency, cancelBattle);

export default router;
