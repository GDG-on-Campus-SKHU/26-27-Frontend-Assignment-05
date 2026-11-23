export type Track = "frontend" | "backend";

export interface User {
  id: number;
  userId: string;
  track: Track;
}
