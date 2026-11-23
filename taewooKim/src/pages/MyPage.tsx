import { useState } from 'react';
import type { FormEvent } from 'react';
import styled from 'styled-components';
import { useAuthStore } from '../stores/useAuthStore';
import type { Track } from '../types/user';
import { Title, Form, Fieldset, OptionLabel, SubmitButton } from '../styles/FormStyles';

const Profile = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px 20px;
  margin: 0 0 24px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background-color: white;

  dt {
    color: #6b7280;
  }

  dd {
    min-width: 0;
    margin: 0;
    font-weight: bold;
    overflow-wrap: anywhere;
  }
`;

export default function MyPage() {
  const user = useAuthStore((state) => state.user);
  const updateTrack = useAuthStore((state) => state.updateTrack);
  const [track, setTrack] = useState<Track>(() => user?.track ?? 'frontend');
  const canSave = user !== null && track !== user.track;

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSave) return;

    updateTrack(track);
    alert('관심 분야를 변경했습니다.');
  };

  return (
    <section>
      <Title>마이페이지</Title>
      <Profile>
        <dt>아이디</dt>
        <dd>{user?.userId}</dd>
        <dt>관심 분야</dt>
        <dd>{user?.track === 'frontend' ? '프론트엔드' : '백엔드'}</dd>
      </Profile>
      <Form onSubmit={submitHandler}>
        <Fieldset>
          <legend>관심 분야 변경</legend>
          <OptionLabel>
            <input
              type="radio"
              name="track"
              value="frontend"
              checked={track === 'frontend'}
              onChange={() => setTrack('frontend')}
            />
            프론트엔드
          </OptionLabel>
          <OptionLabel>
            <input
              type="radio"
              name="track"
              value="backend"
              checked={track === 'backend'}
              onChange={() => setTrack('backend')}
            />
            백엔드
          </OptionLabel>
        </Fieldset>
        <SubmitButton type="submit" $active={canSave} disabled={!canSave}>
          저장
        </SubmitButton>
      </Form>
    </section>
  );
}
