import express from "express";
import { protect } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import { ROLES } from "../models/User.js";
import User from "../models/User.js";
import ApiResponse from "../utils/ApiResponse.js";

const router = express.Router();

// All admin routes require admin role
router.use(protect, authorize(ROLES.ADMIN));

router.get("/stats", async (req, res, next) => {
  try {
    const [totalUsers, byRole, banned, active] = await Promise.all([
      User.countDocuments(),
      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
      User.countDocuments({ status: "banned" }),
      User.countDocuments({ status: "active" }),
    ]);

    const recentUsers = await User.find().select("username email role createdAt").sort({ createdAt: -1 }).limit(5);

    res.status(200).json(
      new ApiResponse(200, {
        totalUsers,
        byRole: Object.fromEntries(byRole.map((r) => [r._id, r.count])),
        banned,
        active,
        recentUsers,
      }, "Admin stats fetched")
    );
  } catch (err) {
    next(err);
  }
});

router.get("/health", (req, res) => {
  res.status(200).json(new ApiResponse(200, { uptime: process.uptime(), user: req.user.username }, "Admin health OK"));
});

export default router;
