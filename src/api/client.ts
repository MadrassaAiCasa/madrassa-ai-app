import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Empty by default: requests are relative ("/auth/..."), which MSW intercepts.
// Set VITE_API_BASE_URL (e.g. http://localhost:3001) to talk to the real server.
export const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

export const createApiClient = (baseUrl: string = ''): AxiosInstance => {
    const instance = axios.create({
        baseURL: baseUrl,
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });

    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            if (accessToken && config.headers) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & {
                _retry?: boolean;
            };

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const newToken = await refreshAccessToken();
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    }
                    return instance(originalRequest);
                } catch {
                    setAccessToken(null);
                    return Promise.reject(error);
                }
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = (async () => {
        const response = await axios.post<{ accessToken: string; expiresAt: string }>(
            `${BASE_URL}/auth/refresh`,
            {},
            { withCredentials: true }
        );
        setAccessToken(response.data.accessToken);
        return response.data.accessToken;
    })();

    try {
        return await refreshPromise;
    } finally {
        refreshPromise = null;
    }
};

export const apiClient = createApiClient(BASE_URL);
