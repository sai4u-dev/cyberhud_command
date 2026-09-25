import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ children, allowedRoles, requireAtLeast }) {
  const { isAuthenticated, hasRole, hasAtLeastRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!hasRole(...allowedRoles)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  if (requireAtLeast) {
    if (!hasAtLeastRole(requireAtLeast)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}
