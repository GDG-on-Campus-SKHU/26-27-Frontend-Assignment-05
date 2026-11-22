// 기본 type
export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export type TodoFilter = 'all' | 'active' | 'done';

// Props로 채워질 type 선언
export interface TodoFiltersProps {
  filter: TodoFilter;
}

export interface TodoSummaryProps {
  totalCount: number;
  doneCount: number;
  onSort: () => void;
}

export interface TodoItemProps {
  todo: Todo;
}

export interface TodoListProps {
  todos: Todo[];
  emptyMessage: string;
  emptyDescription: string;
}

// 회원가입 기능의 type
export interface SignupValues {
  username: string;
  password: string;
  passwordConfirm: string;
  interest: 'frontend' | 'backend';
  agreed: boolean;
}
