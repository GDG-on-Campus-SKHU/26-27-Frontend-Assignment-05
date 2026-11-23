import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

// 로그인한 사용자만 접근할 수 있는 레이아웃 라우트
export function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    return (
      <Navigate to="/login" state={{ from: location.pathname }} replace />
    );
  }

  return <Outlet />;
}

// 로그인하지 않은 사용자만 접근할 수 있는 레이아웃 라우트
export function GuestRoute() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (user) {
    const fromState = (
      location.state as { from?: string | { pathname?: string } } | null
    )?.from;
    const redirectTo =
      typeof fromState === "string"
        ? fromState
        : fromState?.pathname || "/todos/all";
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
