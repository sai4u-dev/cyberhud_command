import ApiError from "../utils/ApiError.js";
import { ROLE_HIERARCHY, ROLES } from "../models/User.js";

/**
 * RBAC middleware
 * @param  {...string} allowedRoles - roles that can access route. If empty, any authenticated user.
 * Uses hierarchy: admin > organizer > moderator > user
 * Pass `ROLES.ADMIN` to restrict to admin only.
 * For hierarchical access use `authorizeAtLeast(ROLES.MODERATOR)`
 */
export const authorize = (...allowedRoles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Not authenticated"));
    }

    // If no roles specified, any authenticated user passes
    if (allowedRoles.length === 0) return next();

    // Strict role check (only listed roles)
    if (allowedRoles.includes(req.user.role)) return next();

    return next(new ApiError(403, `Forbidden: Requires role ${allowedRoles.join(" or ")}. Your role: ${req.user.role}`));
  };
};

// Hierarchical: user with higher role can access lower role routes
export const authorizeAtLeast = (minimumRole) => {
  return (req, _res, next) => {
    if (!req.user) return next(new ApiError(401, "Not authenticated"));

    const userLevel = ROLE_HIERARCHY[req.user.role] || 0;
    const requiredLevel = ROLE_HIERARCHY[minimumRole] || 0;

    if (userLevel >= requiredLevel) return next();

    return next(new ApiError(403, `Forbidden: Requires at least ${minimumRole} role`));
  };
};

// Permission based (future extensibility)
export const requirePermission = (permission) => {
  return (req, _res, next) => {
    if (!req.user) return next(new ApiError(401, "Not authenticated"));
    if (req.user.role === ROLES.ADMIN) return next(); // admin bypass
    if (req.user.permissions?.includes(permission)) return next();
    return next(new ApiError(403, `Missing permission: ${permission}`));
  };
};
