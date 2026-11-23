import styled from "styled-components";
import { useAxios } from "../hooks/useAxios";
import type { Todo } from "../types";

const SummaryCard = styled.div<{ $variant?: "default" | "error" }>`
  max-width: 440px;
  margin: 0 auto 24px;
  padding: 14px 20px;
  border-radius: 12px;
  background-color: ${({ $variant }) =>
    $variant === "error" ? "#fef2f2" : "#ffffff"};
  border: 1px solid
    ${({ $variant }) => ($variant === "error" ? "#fecaca" : "#dbeafe")};
  box-shadow: 0 2px 10px rgba(37, 99, 235, 0.06);
  font-size: 15px;
  font-weight: 600;
  color: ${({ $variant }) => ($variant === "error" ? "#dc2626" : "#1e293b")};
`;

const AccentNumber = styled.strong`
  color: #2563eb;
  font-weight: 800;
`;

const MutedText = styled.span`
  color: #64748b;
  font-weight: 500;
`;

// [도전 과제 1] 홈 화면에서 로그인한 사용자의 할 일 요약을 보여 주는 컴포넌트
// - useAxios 커스텀 훅을 TodoContext 외의 다른 컴포넌트에서 한 번 더 재사용한다.
export default function TodoSummary() {
  const { data: todos, error, isLoading } = useAxios<Todo[]>("/todos", []);

  // 검사 순서: 로딩 → 오류 → 빈 목록 → 요약 데이터
  if (isLoading) {
    return (
      <SummaryCard role="status">
        <MutedText>할 일 요약을 불러오는 중...</MutedText>
      </SummaryCard>
    );
  }

  if (error) {
    return (
      <SummaryCard $variant="error" role="alert">
        {error}
      </SummaryCard>
    );
  }

  if (todos.length === 0) {
    return (
      <SummaryCard>
        <MutedText>등록된 할 일이 아직 없어요. 새 할 일을 추가해 보세요!</MutedText>
      </SummaryCard>
    );
  }

  const remainingCount = todos.filter((todo) => !todo.done).length;

  return (
    <SummaryCard>
      전체 <AccentNumber>{todos.length}개</AccentNumber> 중{" "}
      <AccentNumber>{remainingCount}개</AccentNumber>가 남았어요.
    </SummaryCard>
  );
}
