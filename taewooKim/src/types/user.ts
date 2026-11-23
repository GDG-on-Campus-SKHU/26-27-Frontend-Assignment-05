export type Track = "frontend" | "backend";

export interface User {
  id: number;
  userId: string;
  track: Track;
}

// 로그인·회원가입 API의 응답
export interface AuthResponse {
  user: User;
  accessToken: string;
}
