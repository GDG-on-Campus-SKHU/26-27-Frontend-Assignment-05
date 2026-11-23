import { axiosInstance } from './axiosInstance';
import type { AuthResponse, Track, User } from '../types/user';

export async function loginApi(userId: string, password: string): Promise<AuthResponse> {
  const response = await axiosInstance.post<AuthResponse>('/auth/login', { userId, password });
  return response.data;
}

export async function signupApi(
  userId: string,
  password: string,
  track: Track,
): Promise<AuthResponse> {
  const response = await axiosInstance.post<AuthResponse>('/auth/signup', {
    userId,
    password,
    track,
  });
  return response.data;
}

export async function updateTrackApi(track: Track): Promise<User> {
  const response = await axiosInstance.patch<User>('/users/me', { track });
  return response.data;
}

export async function checkIdApi(userId: string): Promise<boolean> {
  // params는 주소 뒤에 ?userId=아이디 로 붙는다
  const response = await axiosInstance.get<{ available: boolean }>('/auth/check-id', {
    params: { userId },
  });
  return response.data.available;
}
