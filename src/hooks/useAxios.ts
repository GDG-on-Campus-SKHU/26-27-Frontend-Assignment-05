import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { axiosInstance } from "../api/axiosInstance";

interface UseAxiosResult<T> {
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  error: string | null;
  isLoading: boolean;
}

// GET 요청의 data / error / isLoading 상태를 공통으로 관리하는 커스텀 훅
// - 추가·수정·삭제 후 재요청(GET) 없이 화면 상태를 바로 고칠 수 있도록 setData도 함께 반환한다.
export function useAxios<T>(url: string, initialData: T): UseAxiosResult<T> {
  const [data, setData] = useState<T>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 컴포넌트가 언마운트되거나 url이 바뀌었을 때 이전 응답으로 상태를 덮어쓰지 않기 위한 플래그
    let ignore = false;

    const fetchData = async () => {
      // 요청 시작 시 로딩·오류 상태 초기화
      setIsLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get<T>(url);
        if (!ignore) {
          setData(response.data);
        }
      } catch (e) {
        if (!ignore) {
          setError(
            e instanceof Error ? e.message : "데이터를 불러오지 못했습니다.",
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      ignore = true;
    };
  }, [url]);

  return { data, setData, error, isLoading };
}
