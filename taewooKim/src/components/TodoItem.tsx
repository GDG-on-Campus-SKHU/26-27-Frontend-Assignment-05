import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import styled, { css } from 'styled-components';
import type { Todo } from '../types';
import { useTodos } from '../hooks/useTodos';

const Item = styled.li<{ $done: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background-color: ${({ $done }) => ($done ? '#edf5f0' : 'white')};
  transition: background-color 0.15s;
`;

const CheckButton = styled.button<{ $done: boolean }>`
  width: 28px;
  height: 28px;
  flex: none;
  border: 2px solid #4a7dff;
  border-radius: 6px;
  background-color: white;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background-color: #eef2ff;
  }

  ${({ $done }) =>
    $done &&
    css`
      background-color: #4a7dff;

      &:hover {
        background-color: #3366e6;
      }
    `}
`;

const Text = styled.span<{ $done: boolean }>`
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;

  ${({ $done }) =>
    $done &&
    css`
      color: #9ca3af;
      text-decoration: line-through;
    `}
`;

const EditForm = styled.form`
  display: flex;
  flex: 1;
  min-width: 0;
  gap: 8px;
`;

const EditInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 4px 8px;
  border: 1px solid #4a7dff;
  border-radius: 6px;
  font: inherit;

  /* 브라우저 기본 검은 외곽선 대신 다른 입력창과 같은 연한 파란 외곽선 */
  &:focus {
    outline: 2px solid #dbe5ff;
  }
`;

const Button = styled.button<{ $danger?: boolean }>`
  flex: none;
  padding: 4px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background-color: #f3f4f6;
  }

  ${({ $danger }) =>
    $danger &&
    css`
      border-color: #ff8a8a;
      color: #e5484d;

      &:hover {
        background-color: #fff1f1;
      }
    `}
`;

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, editTodo, deleteTodo } = useTodos();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const editInputRef = useRef<HTMLInputElement>(null);

  // 입력창이 화면에 나타난 뒤에 커서를 옮긴다
  useEffect(() => {
    if (isEditing) editInputRef.current?.focus();
  }, [isEditing]);

  const handleEditClick = () => {
    setEditText(todo.text); // 입력창에 기존 내용을 채워 둔다
    setIsEditing(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  // 입력 UI는 여기서 처리하고, 내용 검사와 목록 변경은 Context가 맡는다.
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editText.trim() === '') {
      editInputRef.current?.focus();
      return;
    }
    editTodo(todo.id, editText);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Item $done={todo.done}>
        <EditForm
          onSubmit={submitHandler}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsEditing(false);
          }}
        >
          <EditInput
            ref={editInputRef}
            type="text"
            aria-label="할 일 수정"
            value={editText}
            onChange={handleChange}
          />
          <Button type="submit">저장</Button>
          <Button type="button" onClick={() => setIsEditing(false)}>
            취소
          </Button>
        </EditForm>
      </Item>
    );
  }

  return (
    <Item $done={todo.done}>
      <CheckButton
        type="button"
        $done={todo.done}
        aria-label={todo.done ? '완료 취소' : '완료'}
        aria-pressed={todo.done}
        onClick={() => toggleTodo(todo.id)}
      >
        {todo.done && '✓'}
      </CheckButton>
      <Text $done={todo.done}>{todo.text}</Text>
      <Button type="button" onClick={handleEditClick}>
        수정
      </Button>
      <Button type="button" $danger onClick={() => deleteTodo(todo.id)}>
        삭제
      </Button>
    </Item>
  );
}
