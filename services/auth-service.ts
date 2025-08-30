import { fetchRefreshToken } from "@/helpers/get-refresh-token";
import { fetchToken } from "@/helpers/get-token";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// Get the base URL for API calls
const getBaseUrl = () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_ENVIRONMENT === "development"
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.NEXT_PUBLIC_API_URL_PROD;

  return baseUrl;
};

// Get the base URL for internal API calls
const getInternalApiUrl = () => {
  // If running in browser, use window.location.origin
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // Fallback for server-side
  return process.env.NEXT_PUBLIC_INTERNAL_API_URL || "http://localhost:3000";
};

// API client setup
const apiClient = axios.create({
  baseURL: getBaseUrl(),
});

const api = axios.create({
  baseURL: getBaseUrl(),
});

// General request function to avoid duplication
export const reque = async <T>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  data: any = null,
  config: AxiosRequestConfig = {}
): Promise<T> => {
  try {
    const response = await api[method](url, data, config);
    return response.data;
  } catch (error: any) {
    throw error?.response ? error?.response?.data : new Error("Network error");
  }
};

// General request function to avoid duplication
export const request = async <T>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  data: any = null,
  config: AxiosRequestConfig = {}
): Promise<T> => {
  try {
    const response = await apiClient[method](url, data, config);
    return response.data;
  } catch (error: any) {
    throw error?.response ? error?.response?.data : new Error("Network error");
  }
};

// Adding token to every request if available
apiClient.interceptors.request.use(
  async (config) => {
    const token = await fetchToken();

    // Check if localStorage is available (browser environment)
    let storedData: { token?: string } = {};
    if (typeof window !== "undefined") {
      storedData = JSON.parse(localStorage.getItem("data") ?? "{}");
    }

    const accessToken = token || storedData.token;
    // console.log("API Client Interceptor:", {
    //   url: config.url,
    //   token: token ? "exists" : "missing",
    //   storedToken: storedData.token ? "exists" : "missing",
    //   accessToken: accessToken ? "exists" : "missing",
    // });

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Function to store the return URL
const storeReturnUrl = () => {
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== "/auth/login") {
      localStorage.setItem("returnUrl", currentPath);
    }
  }
};

// Function to get and clear the return URL
const getAndClearReturnUrl = (): string => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("screen");
    localStorage.removeItem("2fa_data");
    localStorage.removeItem("new_setup");

    const returnUrl = localStorage.getItem("returnUrl");
    localStorage.removeItem("returnUrl");
    return returnUrl || "/dashboard";
  }
  return "/dashboard";
};

// Handling token expiration in response interceptor
apiClient.interceptors.response.use(
  (response) => response, // Return response if successful
  async (error) => {
    const originalRequest = error.config;
    // console.log("Original request error:", error);

    // If the request URL is the refresh token endpoint, avoid recursion
    if (originalRequest.url?.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

    // Check if the error indicates an unauthorized or not authenticated state,
    // and that the request hasn't been retried yet.
    if (
      (error?.response?.data?.detail === "Not authenticated" ||
        error?.response?.data?.detail === "Expired Token " ||
        error?.response?.data?.detail === "Invalid token") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Avoid looping

      // Store current URL before redirecting
      storeReturnUrl();

      // Redirect to login if refresh fails

      window.location.href = "/auth/login";
      return Promise.reject();
    }

    // For any other errors, reject the promise
    return Promise.reject(error);
  }
);

// API functions remain unchanged

export const verifyOTP = (otpData: Record<string, any>) =>
  request("post", "/otps/verify", otpData, {
    headers: { "Content-Type": "application/json" },
  });

export const requestOTP = (otpData: Record<string, any>) =>
  request("post", "/otps/generate", otpData, {
    headers: { "Content-Type": "application/json" },
  });

export const registerUser = (userData: Record<string, any>) =>
  request("post", "/auth/register-customer", userData, {
    headers: { "Content-Type": "application/json" },
  });

export const registerAdmin = (userData: Record<string, any>) =>
  request("post", "/auth/register-admin", userData, {
    headers: { "Content-Type": "application/json" },
  });

export const registerTherapist = (userData: Record<string, any>) =>
  request("post", "/auth/register-therapist", userData, {
    headers: { "Content-Type": "application/json" },
  });

export const loginUser = (credentials: {
  username: string;
  password: string;
}) =>
  request("post", "/auth/login", credentials, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

export const logout = () => {
  return request("post", "/auth/logout/", null, {
    headers: { "Content-Type": "application/json" },
  });
};
export const getUserProfile = () => {
  // console.log("getUserProfile: Making API call to /auth/me");
  return request("get", "/auth/me", null, {
    headers: { "Content-Type": "application/json" },
  });
};

export const updateUserProfile = (data: Record<string, any>) =>
  request("put", "/auth/me", data, {
    headers: { "Content-Type": "application/json" },
  });

export const passwordResetRequest = (email: string) =>
  request(
    "post",
    "/auth/password-reset",
    { email },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

export const verifyPasswordResetToken = (data: {
  uid: string;
  token: string;
}) =>
  request("post", "/auth/password-reset/verify-token", data, {
    headers: { "Content-Type": "application/json" },
  });

export const changePassword = (data: {
  uid: string;
  token: string;
  newPassword: string;
}) =>
  request("post", "/auth/password-reset/new-password", data, {
    headers: { "Content-Type": "application/json" },
  });

export const RefreshToken = async () => {
  try {
    const response = await axios.get("/auth/refresh-token", {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    // console.error("Error fetching refresh token:", error);
    throw error;
  }
};
