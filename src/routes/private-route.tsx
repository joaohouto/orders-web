import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/auth";

export function PrivateRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
