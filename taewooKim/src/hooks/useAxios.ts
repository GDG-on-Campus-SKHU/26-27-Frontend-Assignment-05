import { useEffect, useState } from 'react';
import { axiosInstance } from '../api/axiosInstance';

export function useAxios<T>(url: string, initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get<T>(url);
        setData(response.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, setData, error, isLoading };
}
