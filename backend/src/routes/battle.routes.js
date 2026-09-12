import express from "express";
import { protect } from "../middlewares/auth.js";
import { authorizeAtLeast } from "../middlewares/authorize.js";
import { ROLES } from "../models/User.js";
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

// Public leaderboard
router.get("/leaderboard", getBattleLeaderboard);

// Protected - user specific (must be before /:id)
router.get("/my", protect, getMyBattles);
router.get("/code/:code", protect, getBattleByCode);

// Public browsable (still accessible without auth for discovery)
router.get("/", getBattles);
router.get("/:id", getBattleById);

// Create
router.post("/", protect, createBattle);
router.post("/:id/join", protect, joinBattle);
router.post("/:id/leave", protect, leaveBattle);
router.post("/:id/ready", protect, toggleReady);
router.post("/:id/start", protect, startBattle);
router.post("/:id/finish", protect, finishBattle);
router.post("/:id/cancel", protect, cancelBattle);

export default router;
