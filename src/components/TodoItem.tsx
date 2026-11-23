import { useState, useRef, useEffect } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import styled, { keyframes, css } from "styled-components";
import type { Todo } from "../types";
import { useTodos } from "../contexts/TodoContext";

interface TodoItemProps {
  todo: Todo;
}

type PendingAction = "idle" | "toggle" | "edit" | "delete";

// 마감일(YYYY-MM-DD)과 오늘 날짜를 비교하여 남은 일수를 계산
function calculateDaysLeft(dueDate: string): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const [year, month, day] = dueDate.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function formatDueDate(dueDate: string, daysLeft: number): string {
  if (daysLeft < 0) {
    return `${Math.abs(daysLeft)}일 지남 (${dueDate})`;
  }
  return `${daysLeft}일 남음 (${dueDate})`;
}

const popAnimation = keyframes`
  0% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.18);
  }
  100% {
    transform: scale(1);
  }
`;

const Item = styled.li<{ $done: boolean; $busy: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background-color: ${({ $done }) => ($done ? "#f8fafc" : "#ffffff")};
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  opacity: ${({ $busy }) => ($busy ? 0.72 : 1)};
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    opacity 0.15s ease;

  &:hover {
    border-color: #cbd5e1;
  }
`;

const ToggleButton = styled.button<{ $done: boolean }>`
  width: 28px;
  height: 28px;
  padding: 0;
  border: 2px solid ${({ $done }) => ($done ? "#3b82f6" : "#cbd5e1")};
  border-radius: 50%;
  background-color: ${({ $done }) => ($done ? "#3b82f6" : "#ffffff")};
  color: ${({ $done }) => ($done ? "#ffffff" : "transparent")};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.15s ease,
    transform 0.15s ease;

  ${({ $done }) =>
    $done &&
    css`
      animation: ${popAnimation} 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
    `}

  &:hover:not(:disabled) {
    border-color: #3b82f6;
    color: ${({ $done }) => ($done ? "#ffffff" : "#93c5fd")};
    transform: scale(1.06);
  }

  &:active:not(:disabled) {
    transform: scale(0.92);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const TodoText = styled.span<{ $done: boolean }>`
  flex: 1;
  font-size: 15px;
  color: ${({ $done }) => ($done ? "#94a3b8" : "#1e293b")};
  text-decoration: ${({ $done }) => ($done ? "line-through" : "none")};
  word-break: break-word;
`;

const DateBadge = styled.span<{ $done: boolean; $daysLeft: number }>`
  padding: 4px 9px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;

  ${({ $done, $daysLeft }) => {
    if ($done) {
      return css`
        background-color: #f1f5f9;
        color: #94a3b8;
      `;
    }
    if ($daysLeft <= 3) {
      return css`
        background-color: #fee2e2;
        color: #b91c1c;
      `;
    }
    if ($daysLeft <= 7) {
      return css`
        background-color: #fef3c7;
        color: #d97706;
      `;
    }
    return css`
      background-color: #eff6ff;
      color: #2563eb;
    `;
  }}
`;

const EditForm = styled.form`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const EditInput = styled.input`
  flex: 1;
  padding: 7px 10px;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  font-size: 15px;
  color: #0f172a;
  outline: none;

  &:disabled {
    background-color: #f8fafc;
    color: #94a3b8;
  }
`;

const EditDateInput = styled.input`
  padding: 6px 8px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background-color: #ffffff;
  color: #0f172a;
  font-size: 13px;
  font-family: inherit;
  outline: none;

  &:focus {
    border-color: #3b82f6;
  }

  &:disabled {
    background-color: #f8fafc;
    color: #94a3b8;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

const ActionButton = styled.button<{ $variant?: "primary" | "danger" }>`
  padding: 6px 10px;
  border: 1px solid
    ${({ $variant }) =>
      $variant === "primary"
        ? "#3b82f6"
        : $variant === "danger"
          ? "#fecaca"
          : "#e2e8f0"};
  border-radius: 8px;
  background-color: ${({ $variant }) =>
    $variant === "primary" ? "#3b82f6" : "#ffffff"};
  color: ${({ $variant }) =>
    $variant === "primary"
      ? "#ffffff"
      : $variant === "danger"
        ? "#ef4444"
        : "#475569"};
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;

  &:hover:not(:disabled) {
    background-color: ${({ $variant }) =>
      $variant === "primary"
        ? "#2563eb"
        : $variant === "danger"
          ? "#fef2f2"
          : "#f1f5f9"};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export default function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, editTodo, deleteTodo } = useTodos();

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ?? "");
  // [도전 과제 3] 이 항목에서 진행 중인 요청 종류 (idle이 아니면 모든 버튼 비활성화)
  const [pendingAction, setPendingAction] = useState<PendingAction>("idle");
  const editInputRef = useRef<HTMLInputElement>(null);

  const isBusy = pendingAction !== "idle";

  const daysLeft =
    todo.dueDate !== undefined ? calculateDaysLeft(todo.dueDate) : undefined;

  // 수정 모드 진입 시 입력창에 자동 포커스 및 Esc 키 취소 처리 (저장 요청 중에는 취소 불가)
  useEffect(() => {
    if (!isEditing) return;

    editInputRef.current?.focus();

    const handleWindowKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && !isBusy) {
        setEditText(todo.text);
        setEditDueDate(todo.dueDate ?? "");
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleWindowKeyDown);
    return () => window.removeEventListener("keydown", handleWindowKeyDown);
  }, [isEditing, isBusy, todo.text, todo.dueDate]);

  // 완료 토글 요청 (진행 중 중복 클릭 방지)
  const handleToggle = async () => {
    if (isBusy) return;
    setPendingAction("toggle");
    try {
      await toggleTodo(todo.id);
    } finally {
      setPendingAction("idle");
    }
  };

  // 단건 삭제 요청 (진행 중 중복 클릭 방지)
  const handleDelete = async () => {
    if (isBusy) return;
    setPendingAction("delete");
    try {
      await deleteTodo(todo.id);
    } finally {
      setPendingAction("idle");
    }
  };

  const handleStartEdit = () => {
    if (isBusy) return;
    setEditText(todo.text);
    setEditDueDate(todo.dueDate ?? "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (isBusy) return;
    setEditText(todo.text);
    setEditDueDate(todo.dueDate ?? "");
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape" && !isBusy) {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  // 수정 저장 요청: 성공(ok === true)했을 때만 수정 모드를 끝내고, 실패 시 수정 모드를 유지한다
  const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isBusy) return;

    setPendingAction("edit");
    try {
      const ok = await editTodo(todo.id, editText, editDueDate || undefined);
      if (ok) {
        setIsEditing(false);
      }
    } finally {
      setPendingAction("idle");
    }
  };

  return (
    <Item $done={todo.done} $busy={isBusy}>
      {/* 완료 상태 토글 */}
      <ToggleButton
        type="button"
        $done={todo.done}
        disabled={isBusy}
        onClick={handleToggle}
        aria-label={todo.done ? "완료 취소" : "완료"}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </ToggleButton>

      {isEditing ? (
        /* 인라인 수정 폼 */
        <EditForm onSubmit={handleEditSubmit} onKeyDown={handleEditKeyDown}>
          <EditInput
            ref={editInputRef}
            type="text"
            value={editText}
            disabled={isBusy}
            onChange={(e) => setEditText(e.target.value)}
          />
          <EditDateInput
            type="date"
            value={editDueDate}
            disabled={isBusy}
            onChange={(e) => setEditDueDate(e.target.value)}
            aria-label="마감일 수정"
          />
          <ActionButton type="submit" $variant="primary" disabled={isBusy}>
            {pendingAction === "edit" ? "저장 중..." : "저장"}
          </ActionButton>
          <ActionButton
            type="button"
            disabled={isBusy}
            onClick={handleCancelEdit}
          >
            취소
          </ActionButton>
        </EditForm>
      ) : (
        <>
          {/* 할 일 내용 */}
          <TodoText $done={todo.done}>{todo.text}</TodoText>

          {/* N일 남음 표시(수정 버튼 왼쪽) / 수정 / 삭제 버튼 */}
          <Actions>
            {todo.dueDate !== undefined && daysLeft !== undefined && (
              <DateBadge $done={todo.done} $daysLeft={daysLeft}>
                {formatDueDate(todo.dueDate, daysLeft)}
              </DateBadge>
            )}
            <ActionButton
              type="button"
              disabled={isBusy}
              onClick={handleStartEdit}
            >
              수정
            </ActionButton>
            <ActionButton
              type="button"
              $variant="danger"
              disabled={isBusy}
              onClick={handleDelete}
            >
              삭제
            </ActionButton>
          </Actions>
        </>
      )}
    </Item>
  );
}
