import { createContext } from 'react';
import type { Todo } from '../types';

interface TodoContextValue {
  todos: Todo[];

  // 추가
  isLoading: boolean;
  error: string;

  // 반환 타입 수정
  addTodo: (text: string) => Promise<boolean>;
  toggleTodo: (id: number) => Promise<boolean>;
  editTodo: (id: number, text: string) => Promise<boolean>;
  deleteTodo: (id: number) => Promise<boolean>;
  clearDoneTodos: () => Promise<boolean>;

  // 기존 유지(요청하지는 않으므로 void 유지)
  sortTodos: () => void;
}

export const TodoContext =
  createContext<TodoContextValue | undefined>(undefined);
