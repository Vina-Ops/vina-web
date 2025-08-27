"use client";

import { useState, useEffect } from "react";

// interface UseApiReturn<T> {
//   data: T | null;
//   loading: boolean;
//   error: string | null;
//   callApi: (...args: any[]) => Promise<void>;
// }

interface UseApiReturn<T, Args extends any[]> {
  data: T | null;
  loading: boolean;
  error: string | null;
  callApi: (...args: Args) => Promise<void>;
}

type ApiFunc<T, Args extends any[]> = (...args: Args) => Promise<T>;

const useApi = <T, Args extends any[] = any[]>(
  apiFunc: ApiFunc<T, Args>,
  initialData: T | null = null
): UseApiReturn<T, Args> => {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = async (...args: Args): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunc(...args);
      setData(result);
    } catch (err: any) {
      let errorMsg = "Something went wrong";
      if (err && typeof err === "object") {
        errorMsg =
          (err as any)?.detail ||
          (err as any)?.response?.data?.details ||
          (err as any)?.response?.data?.message ||
          (err as any)?.message ||
          errorMsg;
      }
      setError(errorMsg);
      if (process.env.NODE_ENV !== "production") {
        // Only log in development
        // eslint-disable-next-line no-console
        console.log(err);
      }
      // Re-throw the error so consumers can catch it
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, callApi };
};

export default useApi;
