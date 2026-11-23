import { Outlet } from 'react-router';
import TodoProvider from '../contexts/TodoProvider';

export default function TodosLayout() {
  return (
    // /todos에 들어올 때마다 서버에서 목록을 다시 불러온다.
    <TodoProvider>
      <Outlet />
    </TodoProvider>
  );
}
