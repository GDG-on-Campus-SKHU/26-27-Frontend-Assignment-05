import type { ReactNode } from 'react';
import type { Todo } from '../types';
import { TodoContext } from './todoContextValue';

// 추가
import { useAxios } from '../hooks/useAxios';
import { axiosInstance } from '../api/axiosInstance';

export default function TodoProvider({
  children
}: {
  children: ReactNode
}) {
  const {
    data: todos,
    setData: setTodos,
    error,
    isLoading
  } = useAxios<Todo[]>('/todos', []);

  // 공통 오류 처리 함수 추가
  function handleError(err: unknown) {
    window.alert(
      err instanceof Error
        ? err.message
        : '요청에 실패했습니다.'
    );
  }

  // 할 일 추가
  async function addTodo(input: string): Promise<boolean> {
    const text = input.trim();

    if (!text) return false;

    try {
      const response = await axiosInstance.post<Todo>(
        '/todos',
        { text }
      );

      setTodos((previous) => [
        ...previous,
        response.data
      ]);

      return true;

    } catch (err) {
      handleError(err);
      return false;
    }
  }

  // 완료 상태 변경
  async function toggleTodo(id: number): Promise<boolean> {
    try {
      const response = await axiosInstance.patch<Todo>(
        `/todos/${id}/done`
      );

      setTodos((previous) =>
        previous.map((todo) =>
          todo.id === id ? response.data : todo
        )
      );

      return true;

    } catch (err) {
      handleError(err);
      return false;
    }
  }

  // 할 일 수정
  async function editTodo(
    id: number,
    input: string
  ): Promise<boolean> {
    const text = input.trim();

    if (!text) return false;

    try {
      const response = await axiosInstance.put<Todo>(
        `/todos/${id}`,
        { text }
      );

      setTodos((previous) =>
        previous.map((todo) =>
          todo.id === id ? response.data : todo
        )
      );

      return true;

    } catch (err) {
      handleError(err);
      return false;
    }
  }

  // 할 일 삭제
  async function deleteTodo(id: number): Promise<boolean> {
    try {
      await axiosInstance.delete<void>(
        `/todos/${id}`
      );

      setTodos((previous) =>
        previous.filter((todo) => todo.id !== id)
      );

      return true;

    } catch (err) {
      handleError(err);
      return false;
    }
  }

  // 이름순 정렬 (기존 코드 유지)
  function sortTodos() {
    setTodos((previous) =>
      [...previous].sort((a, b) =>
        a.text.localeCompare(b.text, 'ko')
      )
    );
  }

  // 완료한 할 일 모두 삭제
  async function clearDoneTodos(): Promise<boolean> {
    try {
      await axiosInstance.delete<void>(
        '/todos/completed'
      );

      setTodos((previous) =>
        previous.filter((todo) => !todo.done)
      );

      return true;

    } catch (err) {
      handleError(err);
      return false;
    }
  }

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
        sortTodos,
        clearDoneTodos
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}
