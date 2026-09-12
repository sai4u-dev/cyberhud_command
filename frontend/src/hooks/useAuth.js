import { useSelector } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated, selectUserRole } from "../features/auth/authSlice";

export const ROLES = {
  USER: "user",
  MODERATOR: "moderator",
  ORGANIZER: "organizer",
  ADMIN: "admin",
};

export const ROLE_HIERARCHY = {
  user: 1,
  moderator: 2,
  organizer: 3,
  admin: 4,
};

export function useAuth() {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

  const hasRole = (...allowedRoles) => {
    if (!role) return false;
    return allowedRoles.includes(role);
  };

  const hasAtLeastRole = (minimumRole) => {
    if (!role) return false;
    return (ROLE_HIERARCHY[role] || 0) >= (ROLE_HIERARCHY[minimumRole] || 0);
  };

  return { user, isAuthenticated, role, hasRole, hasAtLeastRole };
}
