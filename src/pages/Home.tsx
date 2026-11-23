import type { ReactNode } from "react";
import { Link } from "react-router";
import styled from "styled-components";
import { useAuthStore } from "../store/useAuthStore";
import TodoSummary from "../components/TodoSummary";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 56px;
`;

const HeroSection = styled.section`
  position: relative;
  padding: 56px 24px 44px;
  border-radius: 24px;
  text-align: center;
  background-color: transparent;
  background-image:
    radial-gradient(
      circle at 50% 35%,
      rgba(59, 130, 246, 0.12) 0%,
      rgba(255, 255, 255, 0.6) 55%,
      transparent 80%
    ),
    linear-gradient(to right, rgba(148, 163, 184, 0.12) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(148, 163, 184, 0.12) 1px, transparent 1px);
  background-size:
    100% 100%,
    28px 28px,
    28px 28px;
  background-position: center;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 14px;
  letter-spacing: -0.02em;
`;

const Highlight = styled.span`
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 55%, #0ea5e9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #2563eb;
`;

const Description = styled.p`
  font-size: 17px;
  line-height: 1.6;
  color: #475569;
  margin: 0 0 32px;
`;

const LinkGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const ActionLink = styled(Link)<{ $primary?: boolean }>`
  padding: 13px 28px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 700;
  background-color: ${({ $primary }) => ($primary ? "#3b82f6" : "#e2e8f0")};
  color: ${({ $primary }) => ($primary ? "#ffffff" : "#334155")};
  box-shadow: ${({ $primary }) =>
    $primary ? "0 4px 12px rgba(59, 130, 246, 0.28)" : "none"};
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ $primary }) => ($primary ? "#2563eb" : "#cbd5e1")};
    transform: translateY(-1px);
  }
`;

const FeatureSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionHeader = styled.div`
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 8px;
`;

const SectionSubtitle = styled.p`
  font-size: 15px;
  color: #64748b;
  margin: 0;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

const FeatureIconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
`;

const FeatureCard = styled.article`
  padding: 28px 24px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: #93c5fd;
    box-shadow: 0 12px 24px rgba(37, 99, 235, 0.08);
  }

  &:hover ${FeatureIconBox} {
    background-color: #3b82f6;
    color: #ffffff;
    transform: scale(1.05);
  }
`;

const CardTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FeatureBadge = styled.span`
  width: fit-content;
  padding: 5px 10px;
  border-radius: 8px;
  background-color: #eff6ff;
  color: #2563eb;
  font-size: 12px;
  font-weight: 700;
`;

const FeatureTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 4px 0 0;
`;

const FeatureDesc = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
  margin: 0;
`;

const features: {
  badge: string;
  title: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    badge: "할 일 관리",
    title: "빠른 할 일 등록 및 D-Day 설정",
    description:
      "새로운 할 일과 남은 일수(D-Day)를 간편하게 등록하고, 인라인 수정 기능으로 내용을 즉시 변경할 수 있습니다.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    badge: "필터 & 정렬",
    title: "상태별 필터링과 스마트 정렬",
    description:
      "전체·진행 중·완료 탭으로 할 일을 분류해 확인하고, 이름순·남은 시간순 정렬로 우선순위를 한눈에 파악해 보세요.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>
    ),
  },
  {
    badge: "마이페이지",
    title: "내 프로필 및 관심 트랙 관리",
    description:
      "마이페이지에서 계정 정보와 프로필 사진을 관리하고, 프론트엔드·백엔드 등 관심 분야를 언제든 설정할 수 있습니다.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function Home() {
  const user = useAuthStore((state) => state.user);

  return (
    <PageContainer>
      <HeroSection>
        <Title>
          <Highlight>오늘의 할 일</Highlight>에 오신 것을 환영합니다
        </Title>
        {user ? (
          <>
            <Description>
              {user.userId}님, 오늘 할 일을 확인해 보세요.
            </Description>
            {/* [도전 과제 1] 훅은 조건문 안에서 호출할 수 없으므로 로그인 시에만 별도 컴포넌트로 마운트 */}
            <TodoSummary />
            <LinkGroup>
              <ActionLink to="/todos/all" $primary>
                할 일 관리하기
              </ActionLink>
            </LinkGroup>
          </>
        ) : (
          <>
            <Description>
              로그인하고 하루의 할 일을 손쉽게 추가하며 진행 상태별로 관리해 보세요.
            </Description>
            <LinkGroup>
              <ActionLink to="/login" $primary>
                로그인
              </ActionLink>
              <ActionLink to="/signup">회원가입</ActionLink>
            </LinkGroup>
          </>
        )}
      </HeroSection>

      <FeatureSection>
        <SectionHeader>
          <SectionTitle>주요 기능 소개</SectionTitle>
          <SectionSubtitle>
            하루의 일정을 체계적으로 관리할 수 있는 핵심 기능을 제공합니다.
          </SectionSubtitle>
        </SectionHeader>

        <FeatureGrid>
          {features.map((item) => (
            <FeatureCard key={item.title}>
              <CardTopRow>
                <FeatureBadge>{item.badge}</FeatureBadge>
                <FeatureIconBox aria-hidden="true">{item.icon}</FeatureIconBox>
              </CardTopRow>
              <FeatureTitle>{item.title}</FeatureTitle>
              <FeatureDesc>{item.description}</FeatureDesc>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </FeatureSection>
    </PageContainer>
  );
}
