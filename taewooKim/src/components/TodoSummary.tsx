import styled from 'styled-components';
import type { Todo } from '../types';
import { useAxios } from '../hooks/useAxios';

const Summary = styled.p<{ $error?: boolean }>`
  margin: 0 0 16px;
  padding: 14px 16px;
  border: 1px solid ${({ $error }) => ($error ? '#ffc9c9' : '#e5e7eb')};
  border-radius: 10px;
  background-color: ${({ $error }) => ($error ? '#fff5f5' : 'white')};
  color: ${({ $error }) => ($error ? '#d32f3c' : '#4b5563')};
  text-align: center;
  overflow-wrap: anywhere;

  strong {
    color: #315bbd;
  }
`;

// 훅은 조건문 안에서 부를 수 없어서, 로그인했을 때만 그리는 컴포넌트로 따로 뺐다.
export default function TodoSummary() {
  const { data: todos, error, isLoading } = useAxios<Todo[]>('/todos', []);
  const remainingCount = todos.filter((todo) => !todo.done).length;

  if (isLoading) return <Summary>할 일을 불러오는 중...</Summary>;
  if (error) {
    return (
      <Summary $error role="alert">
        {error}
      </Summary>
    );
  }
  if (todos.length === 0) return <Summary>아직 등록된 할 일이 없어요.</Summary>;

  return (
    <Summary>
      전체 <strong>{todos.length}개</strong> 중 <strong>{remainingCount}개</strong>가 남았어요.
    </Summary>
  );
}
