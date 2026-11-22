import { useEffect, useState } from 'react';
import { axiosInstance } from '../api/axiosInstance';

export function useAxios<T>(url: string, initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setIsLoading(true);
      setError('');

      try {
        const response = await axiosInstance.get<T>(url);

        if (!cancelled) {
          setData(response.data);
        }

      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : '데이터를 불러오지 못했습니다.'
          );
        }

      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };

  }, [url]);

  return { data, setData, error, isLoading };
}
