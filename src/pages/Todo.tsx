import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useParams, useNavigate, Navigate } from "react-router";
import styled, { keyframes } from "styled-components";
import type { Filter } from "../types";
import { useTodos } from "../contexts/TodoContext";
import TodoForm from "../components/TodoForm";
import TodoItem from "../components/TodoItem";

// 필터 탭 목록
const tabs: { value: Filter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행 중" },
  { value: "done", label: "완료" },
];

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const StatusBox = styled.div`
  padding: 64px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
`;

const Spinner = styled.div`
  width: 36px;
  height: 36px;
  margin-bottom: 16px;
  border: 3.5px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
`;

const StatusTitle = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const StatusSub = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
  color: #64748b;
`;

const ErrorBox = styled.div`
  padding: 56px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 16px;
`;

const ErrorIconBadge = styled.div`
  width: 48px;
  height: 48px;
  margin-bottom: 14px;
  border-radius: 50%;
  background-color: #fee2e2;
  color: #dc2626;
  font-size: 22px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorTitle = styled.p`
  font-size: 17px;
  font-weight: 700;
  color: #991b1b;
  margin: 0;
`;

const ErrorMessageText = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
  font-weight: 500;
  color: #dc2626;
`;

const Summary = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const SummaryLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 240px;
`;

const SummaryText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
`;

const ProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: 220px;
`;

const ProgressTrack = styled.div`
  flex: 1;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => `${$percent}%`};
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 999px;
  transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1);
`;

const ProgressPercent = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #2563eb;
  min-width: 34px;
`;

const SortGroup = styled.div`
  display: flex;
  gap: 6px;
`;

const SortButton = styled.button`
  padding: 7px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background-color: #ffffff;
  color: #334155;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover:not(:disabled) {
    background-color: #f1f5f9;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
  padding: 4px;
  background-color: #e2e8f0;
  border-radius: 10px;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 9px 12px;
  border: none;
  border-radius: 8px;
  background-color: ${({ $active }) => ($active ? "#ffffff" : "transparent")};
  color: ${({ $active }) => ($active ? "#0f172a" : "#475569")};
  box-shadow: ${({ $active }) =>
    $active ? "0 1px 3px rgba(0, 0, 0, 0.08)" : "none"};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
`;

const Congrats = styled.p`
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 10px;
  background-color: #dcfce7;
  color: #15803d;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EmptyBox = styled.div`
  padding: 64px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #ffffff;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
`;

const EmptyIconWrapper = styled.div`
  width: 56px;
  height: 56px;
  margin-bottom: 16px;
  border-radius: 16px;
  background-color: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyTitle = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: #334155;
  margin: 0;
`;

const EmptySub = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
  color: #94a3b8;
`;

const ClearButton = styled.button`
  width: 100%;
  margin-top: 16px;
  padding: 12px 16px;
  border: 1px solid #fecaca;
  border-radius: 10px;
  background-color: #fff1f2;
  color: #e11d48;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease, opacity 0.15s ease;

  &:hover:not(:disabled) {
    background-color: #ffe4e6;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function TodoPage() {
  const {
    todos,
    isLoading,
    error,
    isNameAsc,
    isTimeAsc,
    sortByName,
    sortByTime,
    clearDone,
  } = useTodos();
  const { filter } = useParams<{ filter: string }>();
  const navigate = useNavigate();

  // [완료한 할 일 지우기] 요청 중 버튼 비활성화 및 "지우는 중..." 표시를 위한 상태
  const [isClearing, setIsClearing] = useState(false);

  // 파생 데이터 계산
  const doneCount = todos.filter((todo) => todo.done).length;
  const activeCount = todos.length - doneCount;
  const isAllDone = todos.length > 0 && doneCount === todos.length;
  const progressPercent =
    todos.length > 0 ? Math.round((doneCount / todos.length) * 100) : 0;

  // 할 일 페이지에서만 남은 할 일 수에 따라 브라우저 탭 제목 변경
  useEffect(() => {
    if (isLoading || error) {
      document.title = "오늘의 할 일";
    } else {
      document.title =
        activeCount > 0 ? `할 일 ${activeCount}개 남음` : "오늘의 할 일";
    }
    return () => {
      document.title = "Todo App";
    };
  }, [activeCount, isLoading, error]);

  // 유효하지 않은 필터 URL은 /todos/all로 이동
  const isValidFilter =
    filter === "all" || filter === "active" || filter === "done";
  if (!isValidFilter) {
    return <Navigate to="/todos/all" replace />;
  }

  // 검사 순서: 로딩 → 오류 → 데이터 (요구사항에 따라 순서를 지켜 분기 렌더링)
  if (isLoading) {
    return (
      <StatusBox role="status">
        <Spinner aria-hidden="true" />
        <StatusTitle>할 일을 불러오는 중...</StatusTitle>
        <StatusSub>서버에서 목록을 가져오고 있습니다.</StatusSub>
      </StatusBox>
    );
  }

  if (error) {
    return (
      <ErrorBox role="alert">
        <ErrorIconBadge aria-hidden="true">!</ErrorIconBadge>
        <ErrorTitle>할 일을 불러오지 못했습니다</ErrorTitle>
        <ErrorMessageText>{error}</ErrorMessageText>
      </ErrorBox>
    );
  }

  // 완료 항목 일괄 삭제 요청 중 중복 클릭 방지
  const handleClearDone = async () => {
    if (isClearing) return;
    setIsClearing(true);
    try {
      await clearDone();
    } finally {
      setIsClearing(false);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.done;
    if (filter === "done") return todo.done;
    return true;
  });

  // 빈 목록 안내 문구 분기
  let emptyMessage: ReactNode;
  if (todos.length === 0) {
    emptyMessage = (
      <>
        <EmptyTitle>아직 등록된 할 일이 없어요</EmptyTitle>
        <EmptySub>위의 입력창에서 새로운 할 일을 추가해 보세요.</EmptySub>
      </>
    );
  } else if (filter === "active") {
    emptyMessage = (
      <>
        <EmptyTitle>진행 중인 할 일이 없어요</EmptyTitle>
        <EmptySub>남은 할 일을 모두 마쳤거나 새 할 일을 추가해 보세요.</EmptySub>
      </>
    );
  } else {
    emptyMessage = (
      <>
        <EmptyTitle>완료한 할 일이 없어요</EmptyTitle>
        <EmptySub>할 일 왼쪽의 체크 버튼을 눌러 완료 처리해 보세요.</EmptySub>
      </>
    );
  }

  return (
    <div>
      {/* 할 일 추가 폼 */}
      <TodoForm />

      {/* 요약 정보, 진행률 바 및 정렬 */}
      <Summary>
        <SummaryLeft>
          <SummaryText>
            전체 {todos.length}개 / 완료 {doneCount}개
          </SummaryText>
          <ProgressWrapper aria-label={`진행률 ${progressPercent}%`}>
            <ProgressTrack>
              <ProgressFill $percent={progressPercent} />
            </ProgressTrack>
            <ProgressPercent>{progressPercent}%</ProgressPercent>
          </ProgressWrapper>
        </SummaryLeft>
        <SortGroup>
          <SortButton
            type="button"
            disabled={todos.length < 2}
            onClick={sortByName}
          >
            이름순 정렬 {isNameAsc ? "↑" : "↓"}
          </SortButton>
          <SortButton
            type="button"
            disabled={todos.length < 2}
            onClick={sortByTime}
          >
            남은 시간순 정렬 {isTimeAsc ? "↑" : "↓"}
          </SortButton>
        </SortGroup>
      </Summary>

      {/* 필터 탭 (URL 기반) */}
      <Tabs>
        {tabs.map((tab) => (
          <FilterButton
            key={tab.value}
            type="button"
            $active={filter === tab.value}
            onClick={() => navigate(`/todos/${tab.value}`)}
          >
            {tab.label}
          </FilterButton>
        ))}
      </Tabs>

      {/* 모두 완료 축하 문구 */}
      {isAllDone && <Congrats>모든 할 일을 완료했어요!</Congrats>}

      {/* 할 일 목록 또는 빈 목록 안내 */}
      {filteredTodos.length === 0 ? (
        <EmptyBox>
          <EmptyIconWrapper aria-hidden="true">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <path d="m9 14 2 2 4-4" />
            </svg>
          </EmptyIconWrapper>
          {emptyMessage}
        </EmptyBox>
      ) : (
        <List>
          {filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </List>
      )}

      {/* 완료한 할 일 일괄 삭제 */}
      {doneCount > 0 && (
        <ClearButton
          type="button"
          disabled={isClearing}
          onClick={handleClearDone}
        >
          {isClearing ? "지우는 중..." : `완료한 할 일 지우기 (${doneCount})`}
        </ClearButton>
      )}
    </div>
  );
}
