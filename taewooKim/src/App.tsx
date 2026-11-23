import { Navigate, Route, Routes } from 'react-router';
import RootLayout from './layouts/RootLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import GuestLayout from './layouts/GuestLayout';
import TodosLayout from './layouts/TodosLayout';
import Home from './pages/Home';
import Todos from './pages/Todos';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyPage from './pages/MyPage';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      {/* 레이아웃 라우트: path 없이 모든 페이지(404 포함)를 공통 레이아웃으로 감싼다 */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route element={<GuestLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
        <Route element={<ProtectedLayout />}>
          <Route path="todos" element={<TodosLayout />}>
            <Route index element={<Navigate to="/todos/all" replace />} />
            <Route path=":filter" element={<Todos />} />
          </Route>
          <Route path="mypage" element={<MyPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
