import express from "express";
import { protect } from "../middlewares/auth.js";
import { authorize, authorizeAtLeast } from "../middlewares/authorize.js";
import { ROLES } from "../models/User.js";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  banUser,
  deleteUser,
  getLeaderboard,
} from "../controllers/userController.js";

const router = express.Router();

// Public leaderboard
router.get("/leaderboard", getLeaderboard);

// All below require auth
router.use(protect);

// Any authenticated user can view profile by id (for battle zones)
router.get("/:id", getUserById);

// Admin / Moderator routes
router.get("/", authorizeAtLeast(ROLES.MODERATOR), getAllUsers);
router.patch("/:id/role", authorize(ROLES.ADMIN), updateUserRole);
router.patch("/:id/ban", authorizeAtLeast(ROLES.MODERATOR), banUser);
router.delete("/:id", authorize(ROLES.ADMIN), deleteUser);

export default router;
