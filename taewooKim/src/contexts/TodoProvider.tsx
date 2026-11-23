import type { ReactNode } from 'react';
import type { Todo } from '../types';
import { TodoContext } from './TodoContext';
import { axiosInstance } from '../api/axiosInstance';
import { useAxios } from '../hooks/useAxios';

interface TodoProviderProps {
  children: ReactNode;
}

function alertError(e: unknown) {
  alert(e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.');
}

export default function TodoProvider({ children }: TodoProviderProps) {
  const { data: todos, setData: setTodos, error, isLoading } = useAxios<Todo[]>('/todos', []);

  // 성공하면 다시 GET 하지 않고 응답으로 목록만 고친다.
  const addTodo = async (text: string) => {
    try {
      const response = await axiosInstance.post<Todo>('/todos', { text: text.trim() });
      setTodos((prev) => [...prev, response.data]);
      return true;
    } catch (e) {
      alertError(e);
      return false;
    }
  };

  const toggleTodo = async (id: number) => {
    try {
      const response = await axiosInstance.patch<Todo>(`/todos/${id}/done`);
      setTodos((prev) => prev.map((todo) => (todo.id === id ? response.data : todo)));
      return true;
    } catch (e) {
      alertError(e);
      return false;
    }
  };

  const editTodo = async (id: number, text: string) => {
    try {
      const response = await axiosInstance.put<Todo>(`/todos/${id}`, { text: text.trim() });
      setTodos((prev) => prev.map((todo) => (todo.id === id ? response.data : todo)));
      return true;
    } catch (e) {
      alertError(e);
      return false;
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await axiosInstance.delete<void>(`/todos/${id}`);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      return true;
    } catch (e) {
      alertError(e);
      return false;
    }
  };

  const clearCompleted = async () => {
    try {
      await axiosInstance.delete<void>('/todos/completed');
      setTodos((prev) => prev.filter((todo) => !todo.done));
      return true;
    } catch (e) {
      alertError(e);
      return false;
    }
  };

  // 정렬은 요청 없이 화면에서만 바꾼다.
  const sortTodos = () => {
    setTodos((prev) => [...prev].sort((a, b) => a.text.localeCompare(b.text, 'ko')));
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        isLoading,
        error,
        addTodo,
        toggleTodo,
        editTodo,
        deleteTodo,
        clearCompleted,
        sortTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}
