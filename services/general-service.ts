import { fetchRefreshToken } from "@/helpers/get-refresh-token";
import { fetchToken } from "@/helpers/get-token";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// Create the axios instance for the API client
const apiClient = axios.create({
  baseURL: `${
    process.env.ENVIRONMENT === "development"
      ? process.env.NEXT_PUBLIC_API_URL
      : process.env.NEXT_PUBLIC_API_URL_PROD
  }`,
});

// Function to refresh the access token using the refresh token
const refreshToken = async () => {
  const refreshToken = fetchRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available.");
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      { refresh_token: refreshToken }
    );

    console.log(response.status);

    if (response.status === 401) {
      window.location.href = "/login";
      throw new Error(response?.data?.detail || "An error occurred");
    }

    const newAccessToken = response.data.accessToken;

    const result = await fetch("/api/set-cookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: (response as any)?.access_token,
        refreshToken: (response as any)?.refresh_token,
      }),
    });

    if (!result.ok) {
      throw new Error("Failed to set cookie");
    }

    if (result.ok) {
      console.log("Cookies set successfully");

      return newAccessToken;
    }
  } catch (error) {
    throw new Error("Failed to refresh token");
  }
};

// General request function to avoid repetition
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
    throw error.response ? error.response.data : new Error("Network error");
  }
};

// Adding token to every request if available
apiClient.interceptors.request.use(
  async (config) => {
    const token = await fetchToken();
    const storedData = JSON.parse(localStorage.getItem("data") ?? "{}");

    // Use the token from fetchToken() or fallback to one in localStorage
    const accessToken = token || storedData.token;
    if (Object.entries(accessToken).length > 0) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handling token expiration in response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response, // Return response if successful
  async (error) => {
    const originalRequest = error.config;
    const storedData = JSON.parse(localStorage.getItem("data") ?? "{}");

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retries

      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest); // Retry the original request with the new token
      } catch (refreshError) {
        console.error("Token refresh failed: ", refreshError);
        return Promise.reject(refreshError); // Handle failure to refresh token
      }
    }

    return Promise.reject(error); // Return other errors as-is
  }
);

// API functions

// Create an organization
export const createOrganization = (organizationData: Record<string, any>) =>
  request("post", "/organization/add", organizationData, {
    headers: { "Content-Type": "application/json" },
  });

// Create a volunteer
export const createVolunteer = (volunteerData: Record<string, any>) =>
  request("post", "/volunteer/", volunteerData, {
    headers: { "Content-Type": "application/json" },
  });
