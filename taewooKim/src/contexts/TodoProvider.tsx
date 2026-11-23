import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Todo } from '../types';
import { TodoContext } from './TodoContext';
import { loadTodos } from '../utils/todoStorage';

interface TodoProviderProps {
  userId: number;
  children: ReactNode;
}

export default function TodoProvider({ userId, children }: TodoProviderProps) {
  const storageKey = `todos-${userId}`;
  // 먼저 저장된 목록을 읽어야 첫 렌더링에서 빈 배열로 덮어쓰지 않는다.
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos(storageKey));

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(todos));
  }, [storageKey, todos]);

  const addTodo = (text: string) => {
    const trimmed = text.trim();
    if (trimmed === '') return;

    const newTodo: Todo = { id: Date.now(), text: trimmed, done: false };
    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)));
  };

  const editTodo = (id: number, text: string) => {
    const trimmed = text.trim();
    if (trimmed === '') return;

    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, text: trimmed } : todo)));
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const sortTodos = () => {
    setTodos((prev) => [...prev].sort((a, b) => a.text.localeCompare(b.text, 'ko')));
  };

  const clearDone = () => {
    setTodos((prev) => prev.filter((todo) => !todo.done));
  };

  return (
    <TodoContext.Provider
      value={{ todos, addTodo, toggleTodo, editTodo, deleteTodo, sortTodos, clearDone }}
    >
      {children}
    </TodoContext.Provider>
  );
}
