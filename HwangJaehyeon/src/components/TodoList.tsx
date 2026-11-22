import styled from 'styled-components';
import type { TodoListProps } from '../types';
import TodoItem from './TodoItem';

const Empty = styled.div`
  /* 빈 목록 안내는 가운데 정렬, 위아래에 여백을 추가함. */
  padding: 24px 0;
  color: #566173;
  text-align: center;
`;

const List = styled.ul`
  /* ul의 기본 들여쓰기와 목록 기호를 없애서 할 일 항목만 보이게 했음. */
  padding: 0;
  list-style: none;
`;

export default function TodoList({
  todos,
  emptyMessage,
  emptyDescription,
}: TodoListProps) {
  return todos.length === 0 ? (
    <Empty>
      <p>{emptyMessage}</p>
      {emptyDescription && <p>{emptyDescription}</p>}
    </Empty>
  ) : (
    <List>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
        />
      ))}
    </List>
  );
}
