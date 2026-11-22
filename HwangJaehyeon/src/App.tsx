import { Navigate, Route, Routes } from 'react-router';
import Layout from './components/Layout';
import TodoLayout, { GuestRoute, ProtectedRoute } from './components/AuthRoutes';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import MyPage from './pages/MyPage';
import TodoPage from './pages/TodoPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route element={<GuestRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="mypage" element={<MyPage />} />
          <Route path="todos" element={<TodoLayout />}>
            <Route index element={<Navigate to="/todos/all" replace />} />
            <Route path=":filter" element={<TodoPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
