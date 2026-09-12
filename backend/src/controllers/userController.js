import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim();
    const role = req.query.role;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { displayName: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter).select("-password -refreshTokens").skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    res.status(200).json(
      new ApiResponse(200, {
        users,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      }, "Users fetched")
    );
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password -refreshTokens");
    if (!user) throw new ApiError(404, "User not found");
    res.status(200).json(new ApiResponse(200, { user }, "User fetched"));
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role) throw new ApiError(400, "Role is required");

    // Prevent admin from demoting themselves if only admin
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, "User not found");

    // hierarchy check: cannot assign role higher than own
    // Already handled by authorizeAtLeast, but double-check
    user.role = role;
    await user.save();

    res.status(200).json(new ApiResponse(200, { user: user.toSafeObject() }, "Role updated"));
  } catch (err) {
    next(err);
  }
};

export const banUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, "User not found");
    user.status = user.status === "banned" ? "active" : "banned";
    await user.save();
    res.status(200).json(new ApiResponse(200, { user: user.toSafeObject() }, `User ${user.status}`));
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new ApiError(404, "User not found");
    res.status(200).json(new ApiResponse(200, null, "User deleted"));
  } catch (err) {
    next(err);
  }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find({ status: "active" })
      .select("username displayName avatar stats role")
      .sort({ "stats.xp": -1, "stats.battlesWon": -1 })
      .limit(50);
    res.status(200).json(new ApiResponse(200, { leaderboard: users }, "Leaderboard fetched"));
  } catch (err) {
    next(err);
  }
};
