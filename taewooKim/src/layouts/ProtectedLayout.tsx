import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '../stores/useAuthStore';

export default function ProtectedLayout() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
