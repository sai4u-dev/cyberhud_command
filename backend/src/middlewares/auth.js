import { verifyAccessToken } from "../utils/tokens.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

export const protect = async (req, res, next) => {
  try {
    let token = null;

    // Prefer Authorization header, fallback to cookie
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new ApiError(401, "Not authorized, token missing. Please login");
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select("-password").populate("selectedTheme");

    if (!user) throw new ApiError(401, "User not found for this token");
    if (user.status !== "active") throw new ApiError(403, `Account is ${user.status}. Contact support.`);

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Optional auth - does not fail if no token, just attaches user if present
export const optionalAuth = async (req, _res, next) => {
  try {
    let token = null;
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }
    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id).select("-password").populate("selectedTheme");
      if (user) req.user = user;
    }
    next();
  } catch {
    next();
  }
};
