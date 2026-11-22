import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Track, User } from '../types/user';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  updateTrack: (track: Track) => void;
}

export const useAuthStore = create<AuthState>()(persist((set) => ({
  user: null,
  accessToken: null,
  login: (user, accessToken) => set({ user, accessToken }),
  logout: () => set({ user: null, accessToken: null }),
  updateTrack: (track) => set((state) => ({
    user: state.user ? { ...state.user, track } : null,
  })),
}), {
  name: 'auth-storage',
  // 저장할 항목을 명시해서 폼의 비밀번호가 저장되지 않게 한다.
  partialize: ({ user, accessToken }) => ({ user, accessToken }),
}));
