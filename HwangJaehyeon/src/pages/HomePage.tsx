import styled from 'styled-components';
import { useAuthStore } from '../stores/useAuthStore';
import { ButtonLink, Card } from '../components/ui';

const Links = styled.div`
  /* 폭이 부족하면 다음 줄로 내려가고, 설명과는 24px 간격 추가함. */
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
`;

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  return (
    <Card>
      <h1>오늘의 할 일</h1>
      <p>{user ? `${user.userId}님, 오늘 할 일을 확인해 보세요.` : '할 일을 정리하고 작은 일부터 하나씩 완료해 보세요.'}</p>
      <Links>
        {user ? <ButtonLink to="/todos/all">할 일 관리하기</ButtonLink> : <>
          <ButtonLink to="/login">로그인</ButtonLink>
          <ButtonLink to="/signup">회원가입</ButtonLink>
        </>}
      </Links>
    </Card>
  );
}
