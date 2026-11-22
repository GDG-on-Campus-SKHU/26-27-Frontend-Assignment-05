import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import type { Track } from '../types/user';
import { Card } from '../components/ui';
import {
  Form,
  Interests,
  SubmitButton,
  ErrorMessage
} from '../components/formStyles';

// 추가
import { updateTrackApi } from '../api/auth';

export default function MyPage() {
  const user = useAuthStore((state) => state.user);

  const updateTrack = useAuthStore(
    (state) => state.updateTrack
  );

  const [track, setTrack] = useState<Track>(
    user?.track ?? 'frontend'
  );

  // 추가
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  // 수정
  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (track === user?.track || pending) return;

    setPending(true);
    setError('');

    try {
      const updatedUser = await updateTrackApi(track);

      updateTrack(updatedUser.track);

      window.alert('관심 분야를 변경했습니다.');

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : '관심 분야 변경에 실패했습니다.'
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <h1>마이페이지</h1>

      <p>아이디 {user?.userId}</p>

      <p>
        관심 분야 {
          user?.track === 'frontend'
            ? '프론트엔드'
            : '백엔드'
        }
      </p>

      <Form onSubmit={handleSubmit}>
        <Interests disabled={pending}>
          <legend>관심 분야 변경</legend>

          <label>
            <input
              type="radio"
              name="track"
              checked={track === 'frontend'}
              onChange={() => setTrack('frontend')}
            />
            프론트엔드
          </label>

          <label>
            <input
              type="radio"
              name="track"
              checked={track === 'backend'}
              onChange={() => setTrack('backend')}
            />
            백엔드
          </label>
        </Interests>

        <SubmitButton
          disabled={track === user?.track || pending}
        >
          {pending ? '저장 중...' : '저장'}
        </SubmitButton>
      </Form>

      {error && (
        <ErrorMessage role="alert">
          {error}
        </ErrorMessage>
      )}
    </Card>
  );
}
