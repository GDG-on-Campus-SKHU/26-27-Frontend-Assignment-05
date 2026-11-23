// 실제 백엔드 서버와 통신하는 인증·사용자 API 함수 모음
// - 모든 요청은 제네릭으로 응답 타입을 지정하고 response.data만 반환한다.
// - 실패 처리는 각 함수 안에서 하지 않고 호출한 컴포넌트의 catch로 넘긴다.
import { axiosInstance } from "./axiosInstance";
import type { AuthResponse, Track, User } from "../types/user";

export interface CheckIdResponse {
  available: boolean;
}

// 로그인 요청 (POST /auth/login)
export async function loginApi(
  userId: string,
  password: string,
): Promise<AuthResponse> {
  const response = await axiosInstance.post<AuthResponse>("/auth/login", {
    userId,
    password,
  });
  return response.data;
}

// 회원가입 요청 (POST /auth/signup)
export async function signupApi(
  userId: string,
  password: string,
  track: Track,
): Promise<AuthResponse> {
  const response = await axiosInstance.post<AuthResponse>("/auth/signup", {
    userId,
    password,
    track,
  });
  return response.data;
}

// 마이페이지 관심 분야 변경 요청 (PATCH /users/me)
export async function updateTrackApi(track: Track): Promise<User> {
  const response = await axiosInstance.patch<User>("/users/me", { track });
  return response.data;
}

// [도전 과제 2] 회원가입 아이디 중복 확인 요청 (GET /auth/check-id?userId=...)
export async function checkUserIdApi(userId: string): Promise<CheckIdResponse> {
  const response = await axiosInstance.get<CheckIdResponse>("/auth/check-id", {
    params: { userId },
  });
  return response.data;
}
