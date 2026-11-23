import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '../stores/useAuthStore';

export default function GuestLayout() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  // 로그인 성공 후의 이동도 여기서 처리해 페이지의 navigate와 겹치지 않게 한다.
  const destination = location.state?.from === '/mypage' ? '/mypage' : '/todos/all';
  return user ? <Navigate to={destination} replace /> : <Outlet />;
}
