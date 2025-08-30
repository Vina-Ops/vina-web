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
  callApi: (...args: Args) => Promise<T | null>;
}

type ApiFunc<T, Args extends any[]> = (...args: Args) => Promise<T>;

const useApi = <T, Args extends any[] = any[]>(
  apiFunc: ApiFunc<T, Args>,
  initialData: T | null = null
): UseApiReturn<T, Args> => {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = async (...args: Args): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunc(...args);
      setData(result);
      return result; // Return result directly for further checks
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        err?.detail ||
        "Something went wrong";
      setError(errorMessage);
      // console.log("error from api", errorMessage);
      // console.log("error from api", err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, callApi };
};

export default useApi;
