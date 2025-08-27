"use client";

import { useState } from "react";

// interface UseAuthApi<T> {
//   execute: (...args: any[]) => Promise<T | null>;
//   loading: boolean;
//   error: string | null;
//   data: T | null;
//   success: string | null;
// }

interface UseAuthApiResult<T, Args extends any[]> {
  execute: (...args: Args) => Promise<T | null>;
  loading: boolean;
  error: string | null;
  data: T | null;
  success: string | null;
}

type ApiFunc<T, Args extends any[]> = (...args: Args) => Promise<T>;

const useAuthApi = <T = any, Args extends any[] = any[]>(
  apiFunc: ApiFunc<T, Args>
): UseAuthApiResult<T, Args> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const execute = async (...args: Args): Promise<T | null> => {
    setLoading(true);
    setError(null);
    setData(null);
    setSuccess(null);

    try {
      const result = await apiFunc(...args);
      setData((result as any) || (result as any)?.data);
      setSuccess((result as any)?.success ?? null);
      return result; // Return result directly for further checks
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        err?.detail ||
        "Something went wrong";
      setError(errorMessage);
      console.log("error from auth api", errorMessage);
      console.log("error from auth api", err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, data, success };
};

export default useAuthApi;
