import { useRef, useState } from 'react';
import type { SyntheticEvent } from 'react';
import styled from 'styled-components';
import { useTodos } from '../contexts/useTodos';
import { useNavigate } from 'react-router';
import { PrimaryButton, TextInput } from './ui';

const Form = styled.form`
  /* 입력창과 추가 버튼을 가로로 배치. */
  display: flex;
  gap: 8px;

  button {
    flex-shrink: 0;
  }
`;

export default function TodoAddForm() {
  const { addTodo } = useTodos();
  const navigate = useNavigate();

  const [text, setText] = useState('');

  // 추가
  const [pending, setPending] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // async 추가
  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const newText = text.trim();

    if (newText === '' || pending) return;

    setPending(true);

    try {
      const success = await addTodo(newText);

      if (success) {
        navigate('/todos/all');
        setText('');
      }
    } finally {
      setPending(false);
      inputRef.current?.focus();
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <TextInput
        ref={inputRef}
        type="text"
        aria-label="새 할 일"
        placeholder="새 할 일을 입력하세요"
        value={text}
        readOnly={pending}
        onChange={(event) =>
          setText(event.currentTarget.value)
        }
      />

      <PrimaryButton
        type="submit"
        disabled={text.trim() === '' || pending}
      >
        {pending ? '추가 중...' : '추가'}
      </PrimaryButton>
    </Form>
  );
}

