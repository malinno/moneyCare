import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL, API_TIMEOUT, STORAGE_KEYS } from "@constants/index";
import { ApiResponse, ApiError } from "@types/index";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token refresh promise to prevent multiple refresh calls
let refreshTokenPromise: Promise<string> | null = null;

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting token from storage:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with improved token refresh logic
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Use existing refresh promise or create new one
        if (!refreshTokenPromise) {
          refreshTokenPromise = refreshAccessToken();
        }

        const newAccessToken = await refreshTokenPromise;
        refreshTokenPromise = null;

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        refreshTokenPromise = null;
        // Refresh failed, clear tokens and redirect to login
        await clearAuthTokens();

        // Emit logout event for app-wide handling
        // You can use EventEmitter or a global state manager here
        console.log("Token refresh failed, user needs to login again");

        return Promise.reject(refreshError);
      }
    }

    // Transform error response
    const apiError: ApiError = {
      message:
        error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.status || 500,
      errors: error.response?.data?.errors,
    };

    return Promise.reject(apiError);
  }
);

// Token refresh function
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });

    console.log('Refresh token response:', response.data);

    // Handle different response formats
    let accessToken, newRefreshToken;
    
    if (response.data.success && response.data.data) {
      // Format: {success: true, data: {accessToken, refreshToken}}
      accessToken = response.data.data.accessToken;
      newRefreshToken = response.data.data.refreshToken;
    } else if (response.data.accessToken) {
      // Format: {accessToken, refreshToken}
      accessToken = response.data.accessToken;
      newRefreshToken = response.data.refreshToken;
    } else {
      throw new Error("Invalid refresh token response format");
    }

    if (!accessToken) {
      throw new Error("No access token in refresh response");
    }

    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
      [STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken || refreshToken],
    ]);

    return accessToken;
  } catch (error: any) {
    console.error('Refresh token error:', error);
    throw new Error("Token refresh failed: " + (error.message || "Unknown error"));
  }
};

// Clear auth tokens
const clearAuthTokens = async (): Promise<void> => {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.ACCESS_TOKEN,
    STORAGE_KEYS.REFRESH_TOKEN,
    STORAGE_KEYS.USER_DATA,
  ]);
};

// API helper functions with better error handling
export const api = {
  get: async <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.get<ApiResponse<T>>(url, config);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Request failed");
  },

  post: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Request failed");
  },

  put: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Request failed");
  },

  patch: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Request failed");
  },

  delete: async <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await apiClient.delete<ApiResponse<T>>(url, config);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Request failed");
  },
};

// Export raw axios instance for special cases
export { apiClient };
export default api;
