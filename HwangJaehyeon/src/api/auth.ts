import type { Track, User, AuthResponse } from "../types/user";
import { axiosInstance } from "./axiosInstance";

// 로그인
export async function loginApi(
  userId: string,
  password: string,
): Promise<AuthResponse> {
  const response = await axiosInstance.post<AuthResponse>(
    "/auth/login",
    { userId, password },
  );

  return response.data;
}

// 회원가입
export async function signupApi(
  userId: string,
  password: string,
  track: Track,
): Promise<AuthResponse> {
  const response = await axiosInstance.post<AuthResponse>(
    "/auth/signup",
    { userId, password, track },
  );

  return response.data;
}

// 관심 분야 변경
export async function updateTrackApi(
  track: Track,
): Promise<User> {
  const response = await axiosInstance.patch<User>(
    "/users/me",
    { track },
  );

  return response.data;
}
