import { NavLink, Outlet } from 'react-router';
import styled from 'styled-components';
import { useAuthStore } from '../stores/useAuthStore';
import { Button } from './ui';

const Header = styled.header`
  /* 헤더는 흰 배경과 아래쪽 테두리로 본문 영역과 구분함. */
  background: white;
  border-bottom: 1px solid #e0e5ef;
`;

const Menu = styled.nav`
  /* 본문과 최대 너비를 맞추고 가운데 정렬한다. 양옆에는 최소 16px씩 여백. */
  /* 메뉴가 좁은 화면의 경우, 다음 줄로 내려갈 수 있도록 처리. */
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  width: min(900px, calc(100% - 32px));
  margin: 0 auto;
  padding: 14px 0;
`;

const MenuLink = styled(NavLink)`
  /* NavLink가 현재 경로에 붙여 주는 aria-current 속성으로 선택된 메뉴의 배경과 글자 굵기가 바꿔지도록 처리함. */
  padding: 8px 12px;
  border-radius: 8px;
  color: #455068;
  text-decoration: none;

  &[aria-current='page'] {
    color: #4338ca;
    background: #eef0ff;
    font-weight: 700;
  }
`;

const Content = styled.main`
  width: min(900px, calc(100% - 32px));
  margin: 32px auto;
`;

// 아이디와 '님' 사이에서는 줄이 바뀌지 않도록 하나의 묶음으로 표시한다.
const UserName = styled.span`
  white-space: nowrap;
  margin-left: auto;
`;

export default function Layout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  return (
    <>
      <Header>
        <Menu aria-label="주 메뉴">
          <MenuLink to="/" end>홈</MenuLink>
          <MenuLink to="/todos">할 일</MenuLink>
          {user ? <>
            <MenuLink to="/mypage">마이페이지</MenuLink>
            <UserName>{user.userId}님</UserName>
            <Button type="button" onClick={logout}>로그아웃</Button>
          </> : <>
            <MenuLink to="/login">로그인</MenuLink>
            <MenuLink to="/signup">회원가입</MenuLink>
          </>}
        </Menu>
      </Header>
      <Content>
        <Outlet />
      </Content>
    </>
  );
}
