import { Routes, Route, Navigate, Outlet } from "react-router";
import Layout from "./components/Layout";
import { ProtectedRoute, GuestRoute } from "./components/AuthRoutes";
import { TodoProvider } from "./contexts/TodoContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TodoPage from "./pages/Todo";
import MyPage from "./pages/MyPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* 누구나 접근 가능 */}
        <Route path="/" element={<Home />} />

        {/* 로그인하지 않은 사용자만 접근 가능 */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* 로그인한 사용자만 접근 가능 */}
        <Route element={<ProtectedRoute />}>
          {/* TodoProvider는 /todos 아래 경로만 감싼다 */}
          <Route
            path="/todos"
            element={
              <TodoProvider>
                <Outlet />
              </TodoProvider>
            }
          >
            <Route index element={<Navigate to="/todos/all" replace />} />
            <Route path=":filter" element={<TodoPage />} />
          </Route>
          <Route path="/mypage" element={<MyPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
