import { NavLink, Outlet } from 'react-router';
import styled from 'styled-components';
import { useAuthStore } from '../stores/useAuthStore';

const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 24px;
  border-bottom: 1px solid #e5e7eb;
  background-color: white;
`;

const Logo = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  color: #4a7dff;

  &::before {
    content: '✓';
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    border-radius: 7px;
    background-color: #eaf0ff;
  }
`;

// NavLink는 <a> 태그로 그려지므로, Nav 안의 a와 a.active에 스타일을 준다
const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;

  a {
    padding: 6px 12px;
    border-radius: 6px;
    color: #4b5563;
    text-decoration: none;
    white-space: nowrap;
    transition:
      background-color 0.15s,
      color 0.15s;
  }

  a:hover {
    background-color: #eef2ff;
  }

  a.active {
    background-color: #eaf0ff;
    color: #315bbd;
    font-weight: bold;
  }
`;

const UserName = styled.span`
  padding: 6px 8px;
  font-weight: bold;
  white-space: nowrap;
`;

const LogoutButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  color: #4b5563;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const Main = styled.main`
  width: calc(100% - 32px);
  max-width: 620px;
  margin: 36px auto;
  padding: 28px;
  border: 1px solid #e5e9f0;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 6px 20px #24324b08;

  @media (max-width: 480px) {
    margin: 24px auto;
    padding: 20px 16px;
  }
`;

export default function RootLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <>
      <Header>
        <Logo>오늘의 할 일</Logo>
        <Nav aria-label="주 메뉴">
          {/* end: '/'는 모든 경로의 앞부분이라, 정확히 '/'일 때만 활성으로 표시한다 */}
          <NavLink to="/" end>
            홈
          </NavLink>
          {/* end가 없으므로 /todos/all, /todos/active, /todos/done 모두 활성으로 표시된다 */}
          <NavLink to="/todos">할 일</NavLink>
          {user ? (
            <>
              <NavLink to="/mypage">마이페이지</NavLink>
              <UserName>{user.userId}님</UserName>
              <LogoutButton type="button" onClick={logout}>
                로그아웃
              </LogoutButton>
            </>
          ) : (
            <>
              <NavLink to="/login">로그인</NavLink>
              <NavLink to="/signup">회원가입</NavLink>
            </>
          )}
        </Nav>
      </Header>
      <Main>
        <Outlet />
      </Main>
    </>
  );
}
