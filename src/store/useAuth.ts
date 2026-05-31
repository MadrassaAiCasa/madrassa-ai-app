import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { setCredentials, clearCredentials, setLoading } from './authSlice';
import { authApi } from '../api/auth';
import type { LoginRequest } from '../api/auth';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

    const login = useCallback(
        async (data: LoginRequest) => {
            dispatch(setLoading(true));
            try {
                const response = await authApi.login(data);
                const sessionResponse = await authApi.getSession();
                dispatch(
                    setCredentials({
                        user: sessionResponse.user,
                        tokens: {
                            accessToken: response.accessToken,
                            expiresAt: response.expiresAt,
                        },
                    })
                );
            } catch {
                dispatch(setLoading(false));
                throw new Error('Login failed');
            }
        },
        [dispatch]
    );

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } finally {
            dispatch(clearCredentials());
        }
    }, [dispatch]);

    const restoreSession = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const session = await authApi.getSession();
            dispatch(
                setCredentials({
                    user: session.user,
                    tokens: {
                        accessToken: null,
                        expiresAt: session.expiresAt,
                    },
                })
            );
        } catch {
            dispatch(clearCredentials());
        }
    }, [dispatch]);

    return {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        restoreSession,
    };
};
