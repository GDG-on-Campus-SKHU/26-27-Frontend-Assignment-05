import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

// baseURL 설정 코드
export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError<{ message?: string }>(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const isAuthRequest =
      error.config?.url?.startsWith("/auth") ?? false;

    if (status === 401 && !isAuthRequest) {
      useAuthStore.getState().logout();
    }

    const serverMessage = error.response?.data?.message;
    const message =
  typeof serverMessage === "string"
    ? serverMessage
    : error.response
      ? `요청을 처리하지 못했습니다. (${status})`
      : "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해 주세요.";

    return Promise.reject(new Error(message));
  },
);
