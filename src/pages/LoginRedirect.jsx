import { Navigate } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";
import Login from "./login";

export default function LoginRedirect() {
  const { isAuthenticated, isBootstrapping, role } = useAuth();

  if (isBootstrapping) {
    return null;
  }

  if (isAuthenticated) {
    if (role === "admin") {
      return <Navigate to="/warehouses" replace />;
    }

    if (role === "client") {
      return <Navigate to="/leases" replace />;
    }
  }

  return <Login />;
}