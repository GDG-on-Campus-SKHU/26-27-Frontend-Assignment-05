import { NavLink, Link, Outlet } from "react-router";
import styled from "styled-components";
import { useAuthStore } from "../store/useAuthStore";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Test404Link = styled(Link)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 20;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  background-color: #1e293b;
  color: #f8fafc;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.18);
  transition: transform 0.15s ease, background-color 0.15s ease;

  &:hover {
    background-color: #334155;
    transform: translateY(-2px);
  }
`;

const HeaderInner = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  text-decoration: none;
  white-space: nowrap;
`;

const BrandIcon = styled.span`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background-color: #3b82f6;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.35);
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const MenuLink = styled(NavLink)`
  padding: 8px 12px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    background-color: #f1f5f9;
    color: #0f172a;
  }

  &.active {
    background-color: #3b82f6;
    color: #ffffff;
  }
`;

const UserInfo = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  white-space: nowrap;
  flex-shrink: 0;
`;

const HeaderAvatar = styled.img`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #cbd5e1;
`;

const LogoutButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background-color: #ffffff;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: #fef2f2;
    border-color: #fecaca;
    color: #dc2626;
  }
`;

const Main = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px 32px;
`;

export default function Layout() {
  const user = useAuthStore((state) => state.user);
  // 마이페이지에서 등록한 프로필 사진을 상단 헤더 아바타에도 실시간 반영
  const profilePhoto = useAuthStore((state) =>
    state.user ? state.profilePhotos[state.user.userId] : undefined,
  );
  const logout = useAuthStore((state) => state.logout);

  return (
    <Container>
      {/* 우측 하단 플로팅 404 테스트용 배지 버튼 */}
      <Test404Link to="/not-found-test">404 테스트</Test404Link>

      {/* 공통 상단 헤더 */}
      <Header>
        <HeaderInner>
          <Brand to="/">
            <BrandIcon aria-hidden="true">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </BrandIcon>
            오늘의 할 일
          </Brand>
          <Nav>
            <MenuLink to="/">홈</MenuLink>
            <MenuLink to="/todos">할 일</MenuLink>

            {user ? (
              <>
                <MenuLink to="/mypage">마이페이지</MenuLink>
                <UserInfo>
                  {profilePhoto && (
                    <HeaderAvatar
                      src={profilePhoto}
                      alt={`${user.userId} 프로필`}
                    />
                  )}
                  {user.userId}님
                </UserInfo>
                <LogoutButton type="button" onClick={logout}>
                  로그아웃
                </LogoutButton>
              </>
            ) : (
              <>
                <MenuLink to="/login">로그인</MenuLink>
                <MenuLink to="/signup">회원가입</MenuLink>
              </>
            )}
          </Nav>
        </HeaderInner>
      </Header>

      {/* 페이지별 본문 영역 */}
      <Main>
        <Outlet />
      </Main>
    </Container>
  );
}
