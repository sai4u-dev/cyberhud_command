import User, { ROLES } from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from "../utils/tokens.js";

const generateTokensAndSetCookie = async (user, res) => {
  const payload = { id: user._id, role: user.role, email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ id: user._id });

  // Persist refresh token (rotation strategy - keep last 3)
  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  if (user.refreshTokens.length > 3) user.refreshTokens.shift();
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  setAuthCookies(res, accessToken, refreshToken);
  return { accessToken, refreshToken };
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password, displayName, role } = req.body;

    // Prevent privilege escalation: only allow 'user' on public register
    // If role is provided and not 'user', only admin can create - but this is public route
    let assignedRole = ROLES.USER;
    if (role && role !== ROLES.USER) {
      // For now, reject non-user roles on public register
      throw new ApiError(403, "Cannot self-assign elevated roles. Contact admin.");
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      throw new ApiError(409, "User already exists with this email or username");
    }

    const user = await User.create({
      username,
      email,
      password,
      displayName: displayName || username,
      role: assignedRole,
    });

    const { accessToken, refreshToken } = await generateTokensAndSetCookie(user, res);

    res.status(201).json(
      new ApiResponse(201, {
        user: user.toSafeObject(),
        accessToken,
        refreshToken,
      }, "User registered successfully")
    );
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new ApiError(401, "Invalid credentials");

    if (user.status !== "active") throw new ApiError(403, `Account is ${user.status}`);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new ApiError(401, "Invalid credentials");

    const { accessToken, refreshToken } = await generateTokensAndSetCookie(user, res);

    res.status(200).json(
      new ApiResponse(200, {
        user: user.toSafeObject(),
        accessToken,
        refreshToken,
      }, "Login successful")
    );
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const tokenFromCookie = req.cookies?.refreshToken;
    const tokenFromBody = req.body?.refreshToken;
    const token = tokenFromCookie || tokenFromBody;

    if (!token) throw new ApiError(401, "Refresh token missing");

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);

    if (!user) throw new ApiError(401, "Invalid refresh token - user not found");

    const stored = user.refreshTokens.find((t) => t.token === token);
    if (!stored) throw new ApiError(401, "Refresh token not recognized (possibly reused)");

    // Rotate: remove old, add new
    user.refreshTokens = user.refreshTokens.filter((t) => t.token !== token);

    const payload = { id: user._id, role: user.role, email: user.email };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken({ id: user._id });

    user.refreshTokens.push({
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await user.save({ validateBeforeSave: false });

    setAuthCookies(res, newAccessToken, newRefreshToken);

    res.status(200).json(
      new ApiResponse(200, { accessToken: newAccessToken, refreshToken: newRefreshToken }, "Tokens refreshed")
    );
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (token && req.user) {
      // If protect middleware ran, we have req.user ; else try to decode refresh
      try {
        const fetchedUser = req.user || await User.findOne({ "refreshTokens.token": token });
        if (fetchedUser) {
          fetchedUser.refreshTokens = fetchedUser.refreshTokens.filter((t) => t.token !== token);
          await fetchedUser.save({ validateBeforeSave: false });
        }
      } catch { /* ignore */ }
    } else if (token) {
      const decoded = verifyRefreshToken(token);
      const user = await User.findById(decoded.id);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((t) => t.token !== token);
        await user.save({ validateBeforeSave: false });
      }
    }

    clearAuthCookies(res);
    res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.status(200).json(new ApiResponse(200, { user: req.user }, "Current user fetched"));
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { displayName, avatar, location } = req.body;
    const updates = {};
    if (displayName) updates.displayName = displayName;
    if (avatar) updates.avatar = avatar;
    if (location) updates.location = location;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.status(200).json(new ApiResponse(200, { user: user.toSafeObject() }, "Profile updated"));
  } catch (err) {
    next(err);
  }
};
