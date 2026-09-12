import express from "express";
import { protect } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import { ROLES } from "../models/User.js";
import {
  getAllThemes,
  getThemeByKey,
  getMyTheme,
  updateMyTheme,
  updateMySettings,
  createTheme,
  updateTheme,
  deleteTheme,
} from "../controllers/themeController.js";

const router = express.Router();

// Protected - user settings (must be before param route)
router.get("/user/me", protect, getMyTheme);
router.patch("/user/theme", protect, updateMyTheme);
router.patch("/user/settings", protect, updateMySettings);

// Public - list themes (for login page preview, etc.)
router.get("/", getAllThemes);
router.get("/:key", getThemeByKey);

// Admin
router.post("/", protect, authorize(ROLES.ADMIN), createTheme);
router.patch("/:key", protect, authorize(ROLES.ADMIN), updateTheme);
router.delete("/:key", protect, authorize(ROLES.ADMIN), deleteTheme);

export default router;
