import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../stores/useAuthStore';
import TodoProvider from '../contexts/TodoContext';

export function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);

  return user
    ? <Outlet />
    : <Navigate to="/login" replace />;
}

export function GuestRoute() {
  const user = useAuthStore((state) => state.user);

  return user
    ? <Navigate to="/todos/all" replace />
    : <Outlet />;
}

export default function TodoLayout() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <TodoProvider key={user.id}>
      <Outlet />
    </TodoProvider>
  );
}
