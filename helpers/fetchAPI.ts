export async function executeApiRequest<T>(
  apiFunc: (...args: any[]) => Promise<T>,
  ...args: any[]
): Promise<{ data: T | null; success: string | null; error: string | null }> {
  try {
    const result = await apiFunc(...args);
    return {
      data: (result as any)?.data || result,
      success: (result as any)?.success ?? null,
      error: null,
    };
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.message ||
      err?.message ||
      err?.detail ||
      "Something went wrong";
    return { data: null, success: null, error: errorMessage };
  }
}
