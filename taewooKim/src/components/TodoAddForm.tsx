import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import { useTodos } from '../hooks/useTodos';

const Form = styled.form`
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font: inherit;
  transition: border-color 0.15s;

  &:focus {
    border-color: #4a7dff;
    outline: none;
  }
`;

const AddButton = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  background-color: #4a7dff;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover:not(:disabled) {
    background-color: #3366e6;
  }

  &:disabled {
    background-color: #e2e8f0;
    color: #66758b;
    cursor: not-allowed;
  }
`;

export default function TodoAddForm() {
  const { addTodo } = useTodos();
  const { filter } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim() === '') return;

    addTodo(text);
    setText('');
    if (filter !== 'all') navigate('/todos/all');
    inputRef.current?.focus(); // 추가한 뒤에도 바로 다음 할 일을 입력할 수 있도록
  };

  return (
    <Form onSubmit={submitHandler}>
      <Input
        ref={inputRef}
        type="text"
        aria-label="새로운 할 일"
        placeholder="새로운 할 일을 입력하세요."
        value={text}
        onChange={handleChange}
      />
      <AddButton type="submit" disabled={text.trim() === ''}>
        추가
      </AddButton>
    </Form>
  );
}
