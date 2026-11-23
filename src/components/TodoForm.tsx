import { useState, useRef } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";
import { useTodos } from "../contexts/TodoContext";

const Form = styled.form`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 15px;
  background-color: #ffffff;
  color: #0f172a;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: #3b82f6;
  }

  &:disabled {
    background-color: #f8fafc;
    color: #94a3b8;
  }
`;

const DateInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background-color: #ffffff;
  color: #0f172a;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: #3b82f6;
  }

  &:disabled {
    background-color: #f8fafc;
    color: #94a3b8;
  }
`;

const SubmitButton = styled.button<{ $active: boolean }>`
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  background-color: ${({ $active }) => ($active ? "#3b82f6" : "#cbd5e1")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#64748b")};
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  cursor: ${({ $active }) => ($active ? "pointer" : "not-allowed")};
  transition: background-color 0.15s ease;

  &:hover:not(:disabled) {
    background-color: #2563eb;
  }
`;

export default function TodoForm() {
  const { addTodo } = useTodos();
  const { filter } = useParams<{ filter: string }>();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  // 추가 요청 대기 중 "추가 중..." 표시 및 중복 제출 방지용 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 빈 할 일 제출 시 서버의 400 오류 응답도 확인할 수 있도록 요청 중일 때만 버튼 비활성화
  const canSubmit = !isSubmitting;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const ok = await addTodo(text, dueDate || undefined);
      // 추가에 성공했을 때만 입력창을 비우고, 실패 시 입력한 내용을 그대로 유지한다
      if (ok) {
        setText("");
        setDueDate("");
        inputRef.current?.focus();

        if (filter !== "all") {
          navigate("/todos/all");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="새로운 할 일을 입력하세요"
        disabled={isSubmitting}
      />
      <DateInput
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        aria-label="마감일"
        disabled={isSubmitting}
      />
      <SubmitButton type="submit" disabled={!canSubmit} $active={canSubmit}>
        {isSubmitting ? "추가 중..." : "추가"}
      </SubmitButton>
    </Form>
  );
}
