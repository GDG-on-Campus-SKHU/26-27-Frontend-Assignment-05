import { createContext } from 'react';
import type { Todo } from '../types';

interface TodoContextValue {
  todos: Todo[];
  isLoading: boolean;
  error: string;
  // 성공하면 true, 실패하면 false
  addTodo: (text: string) => Promise<boolean>;
  toggleTodo: (id: number) => Promise<boolean>;
  editTodo: (id: number, text: string) => Promise<boolean>;
  deleteTodo: (id: number) => Promise<boolean>;
  clearCompleted: () => Promise<boolean>;
  sortTodos: () => void;
}

export const TodoContext = createContext<TodoContextValue | null>(null);
