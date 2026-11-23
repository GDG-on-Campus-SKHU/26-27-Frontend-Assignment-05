import { Outlet } from 'react-router';
import TodoProvider from '../contexts/TodoProvider';
import { useAuthStore } from '../stores/useAuthStore';

export default function TodosLayout() {
  const userId = useAuthStore((state) => state.user?.id);
  if (userId === undefined) return null;

  return (
    // 사용자가 바뀌면 Provider도 새로 만들어 이전 사람의 목록이 섞이지 않게 한다.
    <TodoProvider key={userId} userId={userId}>
      <Outlet />
    </TodoProvider>
  );
}
