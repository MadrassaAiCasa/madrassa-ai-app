import { apiClient, setAccessToken, getAccessToken } from '../client';
import type { LoginRequest, LoginResponse, SessionResponse, RefreshResponse } from './types';

export { setAccessToken, getAccessToken };

export const authApi = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/login', data);
        setAccessToken(response.data.accessToken);
        return response.data;
    },

    getSession: async (): Promise<SessionResponse> => {
        const response = await apiClient.get<SessionResponse>('/auth/session');
        return response.data;
    },

    refresh: async (): Promise<RefreshResponse> => {
        const response = await apiClient.post<RefreshResponse>('/auth/refresh');
        setAccessToken(response.data.accessToken);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout');
        setAccessToken(null);
    },
};

export default authApi;
