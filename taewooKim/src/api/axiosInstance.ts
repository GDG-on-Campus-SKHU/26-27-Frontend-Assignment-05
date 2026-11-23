// 과제 서버와 통신할 Axios 인스턴스
// 아래 두 가지를 자동으로 처리한다. 지금은 코드를 다 이해하지 않아도 된다.
//  1) 요청을 보낼 때: 로그인 상태라면 요청 헤더에 토큰(Authorization: Bearer 토큰)을 붙인다.
//  2) 응답이 실패했을 때: 서버가 보낸 한글 오류 문구로 Error를 만들어 던진다.
//     → catch에서 e instanceof Error 로 확인하고 e.message를 쓰면 된다.
//     토큰이 맞지 않아 401이 오면(로그인 요청 제외) 자동으로 로그아웃한다.
import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

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
    const isAuthRequest = error.config?.url?.startsWith("/auth") ?? false;
    if (status === 401 && !isAuthRequest) {
      useAuthStore.getState().logout();
    }

    const serverMessage = error.response?.data?.message;
    let message: string;
    if (typeof serverMessage === "string") {
      message = serverMessage;
    } else if (error.response) {
      message = `요청을 처리하지 못했습니다. (${status})`;
    } else {
      message = "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해 주세요.";
    }
    return Promise.reject(new Error(message));
  },
);
