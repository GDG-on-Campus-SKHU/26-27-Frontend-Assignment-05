import { useContext } from 'react';
import { TodoContext } from '../contexts/TodoContext';

export function useTodos() {
  const context = useContext(TodoContext);
  if (context === null) {
    throw new Error('useTodos는 TodoProvider 안에서 사용해야 합니다.');
  }
  return context;
}
