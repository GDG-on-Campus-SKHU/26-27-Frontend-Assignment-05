import { useEffect, useState } from 'react';
import { ErrorMessage } from '../components/formStyles';
import { Navigate, useParams } from 'react-router';
import styled from 'styled-components';
import TodoAddForm from '../components/TodoAddForm';
import TodoFilters from '../components/TodoFilters';
import TodoList from '../components/TodoList';
import TodoSummary from '../components/TodoSummary';
import { Button, Card } from '../components/ui';
import { useTodos } from '../contexts/useTodos';

const Description = styled.p`
  /* 설명은 제목보다 옅은 색으로 표시. */
  margin: 0 0 24px;
  color: #566173;
`;

const Celebration = styled.p`
  /* 모두 완료했을 경우, 연한 초록배경. + 가운데 정렬처리함. */
  padding: 12px;
  border-radius: 8px;
  color: #166534;
  background: #ecfdf3;
  text-align: center;
`;

const ClearButton = styled(Button)`
  /* 일괄 삭제 버튼은 목록 아래 가운데에 배치. 삭제 글자는 빨간색으로 표시되게 처리함. */
  display: block;
  margin: 16px auto 0;
  color: #b42318;
`;

const LoadingMessage = styled.p`
  /* */
  padding: 24px;
  color: #566173;
  text-align: center;
  background: #f4f6fa;
  border-radius: 8px;
`;

export default function TodoPage() {
  const {
    todos,
    sortTodos,
    clearDoneTodos,
    isLoading,
    error
  } = useTodos();

  const { filter } = useParams();

  const [clearing, setClearing] = useState(false);

  const doneCount = todos.filter((todo) => todo.done).length;
  const activeCount = todos.length - doneCount;
  const allDone = todos.length > 0 && activeCount === 0;

  useEffect(() => {
    document.title = activeCount > 0
      ? `할 일 ${activeCount}개 남음`
      : '오늘의 할 일';

    return () => {
      document.title = '오늘의 할 일';
    };
  }, [activeCount]);

  // 추가
  async function handleClearDone() {
    if (clearing) return;

    setClearing(true);

    try {
      await clearDoneTodos();
    } finally {
      setClearing(false);
    }
  }

  // 기존 URL 필터 검사
  if (
    filter !== 'all' &&
    filter !== 'active' &&
    filter !== 'done'
  ) {
    return <Navigate to="/todos/all" replace />;
  }

  // 추가: 로딩 검사
  if (isLoading) {
    return (
      <Card>
        <h1>오늘의 할 일</h1>
        <LoadingMessage role="status">
          할 일을 불러오는 중...
        </LoadingMessage>
      </Card>
    );
  }

  // 추가: 오류 검사
  if (error) {
    return (
      <Card>
        <h1>오늘의 할 일</h1>
        <ErrorMessage role="alert">
          {error}
        </ErrorMessage>
      </Card>
    );
  }

  // 기존 필터 처리
  const visibleTodos = todos.filter((todo) =>
    filter === 'active'
      ? !todo.done
      : filter === 'done'
        ? todo.done
        : true
  );

  const emptyMessage = todos.length === 0
    ? '아직 등록된 할 일이 없어요'
    : filter === 'active'
      ? '진행 중인 할 일이 없어요'
      : filter === 'done'
        ? '완료한 할 일이 없어요'
        : '';

  const emptyDescription = todos.length === 0
    ? '위 입력창에 할 일을 입력하고 [추가] 버튼을 눌러 보세요.'
    : '';

  return (
    <Card aria-labelledby="todo-title">
      <h1 id="todo-title">오늘의 할 일</h1>

      <Description>
        작은 일부터 하나씩 완료해 보세요.
      </Description>

      <TodoAddForm />

      <TodoSummary
        totalCount={todos.length}
        doneCount={doneCount}
        onSort={sortTodos}
      />

      <TodoFilters filter={filter} />

      {allDone && (
        <Celebration role="status">
          모든 할 일을 완료했어요!
        </Celebration>
      )}

      <TodoList
        todos={visibleTodos}
        emptyMessage={emptyMessage}
        emptyDescription={emptyDescription}
      />

      {doneCount > 0 && (
        <ClearButton
          type="button"
          onClick={handleClearDone}
          disabled={clearing}
        >
          {clearing
            ? '지우는 중...'
            : `완료한 할 일 지우기 (${doneCount})`
          }
        </ClearButton>
      )}
    </Card>
  );
}
