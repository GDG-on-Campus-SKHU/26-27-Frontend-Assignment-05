import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import styled from 'styled-components';
import { useTodos } from '../contexts/useTodos';
import type { TodoItemProps } from '../types';
import { Button, PrimaryButton, TextInput } from './ui';

const Item = styled.li`
  /* 완료 버튼, 할 일 내용, 작업 버튼을 가로로 배치.*/
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid #e0e5ef;
`;

const ToggleButton = styled(Button) <{ $done: boolean }>`
  /* $done은 스타일에만 쓰는 transient prop. */
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  padding: 0;
  color: ${({ $done }) => ($done ? 'white' : 'inherit')};
  background: ${({ $done }) => ($done ? '#4f46e5' : 'white')};
`;

const TodoText = styled.span<{ $done: boolean }>`
  /* 글자가 남은 공간을 차지하게 했다. 긴 단어도 줄바꿈하고, 완료한 경우에는 취소선 적용 */
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
  color: ${({ $done }) => ($done ? '#667085' : 'inherit')};
  text-decoration: ${({ $done }) => ($done ? 'line-through' : 'none')};
`;

const EditForm = styled.form`
  /* 수정 입력창이 남은 공간 채움. 버튼까지 한 줄에 들어가지 않으면 다음 줄로 넘김처리. */
  display: flex;
  flex: 1;
  min-width: 0;
  flex-wrap: wrap;
  gap: 8px;

  input {
    flex: 1 1 120px;
    width: auto;
  }
`;

const DeleteButton = styled(Button)`
  /* 삭제 동작은 붉은 글자로 구분, 공통 버튼의 나머지 모양은 재사용. */
  color: #b42318;
`;

export default function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, editTodo, deleteTodo } = useTodos();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');

  function handleStartEdit() {
    setDraft(todo.text);
    setIsEditing(true);
  }

  async function handleSave(
    event: SyntheticEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    const text = draft.trim();
    if (text === '') return;

    const success = await editTodo(todo.id, text);

    if (success) {
      setIsEditing(false);
    }
  }

  return (
    <Item>
      <ToggleButton
        type="button"
        $done={todo.done}
        aria-label={`${todo.text} 완료 상태`}
        aria-pressed={todo.done}
        onClick={() => toggleTodo(todo.id)}
      >
        {todo.done ? '✔' : ''}
      </ToggleButton>

      {isEditing ? (
        <EditForm onSubmit={handleSave}>
          <TextInput
            type="text"
            aria-label="할 일 수정"
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.currentTarget.value)}
          />
          <PrimaryButton type="submit">저장</PrimaryButton>
          <Button type="button" onClick={() => setIsEditing(false)}>취소</Button>
        </EditForm>
      ) : (
        <>
          <TodoText $done={todo.done}>{todo.text}</TodoText>
          <Button type="button" onClick={handleStartEdit}>수정</Button>
        </>
      )}

      <DeleteButton type="button" onClick={() => deleteTodo(todo.id)}>삭제</DeleteButton>
    </Item>
  );
}
