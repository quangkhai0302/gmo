import { tokenStorage } from "@/utils/tokenStorage";
import axios, { type InternalAxiosRequestConfig } from "axios";
import type { ApiResponse, AuthRefreshResponse } from "@/api/axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

type RetryRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.request.use((config) => {
    const accessToken = tokenStorage.getAccessToken();
    const url = config.url ?? '';
    const isPublicAuthApi = 
        url.includes('/api/auth/login') ||
        url.includes('/api/auth/register') ||
        url.includes('/api/auth/refresh');
    
    if (accessToken && !isPublicAuthApi) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as RetryRequestConfig | undefined;
        const status = error.response?.status;
        const url = originalRequest?.url ?? '';

        if (!originalRequest || status !== 401 || originalRequest._retry || url.includes('/api/auth/refresh')) {
            return Promise.reject(error);
        }
        originalRequest._retry = true;

        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) {
            tokenStorage.clearTokens();
            window.location.href = '/login?expired=1';
            return Promise.reject(error);
        }

        try {
            const refreshRes = await axios.post<ApiResponse<AuthRefreshResponse>>(
                `${API_BASE_URL}/api/auth/refresh`,
                { refreshToken },
                { headers: { "Content-Type": "application/json" } }
            );

            const { accessToken, refreshToken: newRefreshToken } = refreshRes.data.result;
            tokenStorage.setTokens(accessToken, newRefreshToken);

            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            return api(originalRequest);
        } catch (refreshError) {
            tokenStorage.clearTokens();
            window.location.href = "/login?expired=1";
            return Promise.reject(refreshError);
        }
    }
)


export default api;
