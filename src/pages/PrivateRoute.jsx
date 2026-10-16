import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";

export default function PrivateRoute({ allowedRoles = [] }) {
  const { isAuthenticated, isBootstrapping, role } = useAuth();

  if (isBootstrapping) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}