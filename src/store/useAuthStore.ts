import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Track, User } from "../types/user";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  // 계정(userId)별 프로필 사진 Data URL 저장소 (로그아웃 후 재로그인해도 유지)
  profilePhotos: Record<string, string>;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  updateTrack: (track: Track) => void;
  setProfilePhoto: (userId: string, photoDataUrl: string) => void;
  removeProfilePhoto: (userId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      profilePhotos: {},
      login: (user, accessToken) => set({ user, accessToken }),
      // 로그아웃 시 인증 정보(user, accessToken)만 비우고 계정별 프로필 사진 맵은 유지한다
      logout: () => set({ user: null, accessToken: null }),
      updateTrack: (track) =>
        set((state) => ({
          user: state.user ? { ...state.user, track } : null,
        })),
      // 현재 계정의 프로필 사진 저장/변경
      setProfilePhoto: (userId, photoDataUrl) =>
        set((state) => ({
          profilePhotos: {
            ...state.profilePhotos,
            [userId]: photoDataUrl,
          },
        })),
      // 현재 계정의 프로필 사진 삭제
      removeProfilePhoto: (userId) =>
        set((state) => {
          const next = { ...state.profilePhotos };
          delete next[userId];
          return { profilePhotos: next };
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
