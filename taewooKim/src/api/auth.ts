// 서버 대신 쓰는 가짜 인증 API
// - 다음 주차(API 연동)에서 실제 서버 요청으로 바꿀 예정이다.
// - 회원 목록은 메모리에만 있어서 새로고침하면 처음 상태로 돌아간다.
//   (테스트 계정 test1234 / password1234 는 항상 있다)
import type { Track, User } from "../types/user";

interface Account extends User {
  password: string;
}

const accounts: Account[] = [
  { id: 1, userId: "test1234", password: "password1234", track: "frontend" },
];

export interface AuthResponse {
  user: User;
  accessToken: string;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toAuthResponse(account: Account): AuthResponse {
  const user: User = { id: account.id, userId: account.userId, track: account.track };
  return { user, accessToken: `fake-token-${account.id}-${Date.now()}` };
}

// 로그인: 성공하면 { user, accessToken }, 실패하면 Error를 던진다
export async function fakeLoginApi(userId: string, password: string): Promise<AuthResponse> {
  await delay(600);
  const account = accounts.find((a) => a.userId === userId && a.password === password);
  if (!account) {
    throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
  }
  return toAuthResponse(account);
}

// 회원가입: 성공하면 바로 로그인된 것처럼 { user, accessToken }을 돌려준다
export async function fakeSignupApi(
  userId: string,
  password: string,
  track: Track,
): Promise<AuthResponse> {
  await delay(600);
  if (accounts.some((a) => a.userId === userId)) {
    throw new Error("이미 사용 중인 아이디입니다.");
  }
  const account: Account = { id: Date.now(), userId, password, track };
  accounts.push(account);
  return toAuthResponse(account);
}
