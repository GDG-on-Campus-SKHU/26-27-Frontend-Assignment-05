import { Link } from 'react-router';
import styled from 'styled-components';
import { useAuthStore } from '../stores/useAuthStore';
import TodoSummary from '../components/TodoSummary';

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 28px;
`;

const Intro = styled.div`
  margin-bottom: 24px;
  padding: 20px;
  border-radius: 12px;
  background-color: #f0f4ff;
`;

const Description = styled.p`
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
  overflow-wrap: anywhere;
`;

const Links = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionLink = styled(Link)<{ $secondary?: boolean }>`
  flex: 1;
  padding: 12px;
  border: 1px solid #4a7dff;
  border-radius: 10px;
  background-color: ${({ $secondary }) => ($secondary ? 'white' : '#4a7dff')};
  color: ${({ $secondary }) => ($secondary ? '#315bbd' : 'white')};
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.15s;

  &:hover {
    background-color: ${({ $secondary }) => ($secondary ? '#f0f4ff' : '#3366e6')};
  }
`;

export default function Home() {
  const user = useAuthStore((state) => state.user);

  return (
    <section>
      <Intro>
        <Title>오늘의 할 일</Title>
        <Description>
          {user ? (
            `${user.userId}님, 오늘 할 일을 확인해 보세요.`
          ) : (
            <>
              해야 할 일을 적고, 끝낸 일은 체크해 보세요.
              <br />
              로그인하면 나의 할 일을 이어서 관리할 수 있어요.
            </>
          )}
        </Description>
      </Intro>
      {user && <TodoSummary />}
      <Links>
        {user ? (
          <ActionLink to="/todos/all">할 일 관리하기</ActionLink>
        ) : (
          <>
            <ActionLink to="/login">로그인</ActionLink>
            <ActionLink to="/signup" $secondary>
              회원가입
            </ActionLink>
          </>
        )}
      </Links>
    </section>
  );
}
