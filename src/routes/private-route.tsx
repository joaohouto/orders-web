import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/hooks/auth";

export function PrivateRoute() {
  const { user } = useAuth();

  const location = useLocation();

  if (!user) {
    localStorage.setItem("@Orders:AuthRedirectsTo", location.pathname);
    return <Navigate to="auth" replace />;
  }

  return <Outlet />;
}
