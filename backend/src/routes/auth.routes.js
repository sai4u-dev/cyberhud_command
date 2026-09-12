import express from "express";
import { register, login, refresh, logout, getMe, updateMe } from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";
import validateRequest from "../middlewares/validateRequest.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many requests, try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, validateRequest(registerSchema), register);
router.post("/login", authLimiter, validateRequest(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// Protected
router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);
router.post("/logout-all", protect, logout);

export default router;
