import type { Todo } from '../types';

function isTodoArray(value: unknown): value is Todo[] {
  return (
    Array.isArray(value) &&
    value.every(
      (todo: unknown) =>
        typeof todo === 'object' &&
        todo !== null &&
        'id' in todo &&
        typeof todo.id === 'number' &&
        Number.isFinite(todo.id) &&
        'text' in todo &&
        typeof todo.text === 'string' &&
        'done' in todo &&
        typeof todo.done === 'boolean',
    )
  );
}

export function loadTodos(storageKey: string): Todo[] {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === null) return [];

    const parsed: unknown = JSON.parse(saved);
    return isTodoArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
