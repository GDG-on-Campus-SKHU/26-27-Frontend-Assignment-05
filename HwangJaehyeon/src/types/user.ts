export type Track = "frontend" | "backend";

export interface User {
  id: number;
  userId: string;
  track: Track;
}

// data(API) 요청을 위한 type 추가
export interface AuthResponse {
  user: User;
  accessToken: string;
}
