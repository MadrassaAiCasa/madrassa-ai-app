import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { setCredentials, clearCredentials, setLoading } from '../store/authSlice';
import { authApi } from '../api';
import type { LoginRequest } from '../api';

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
            // Guard against a non-JSON response (e.g. dev-server HTML leaking through)
            // being mistaken for a valid session.
            if (!session?.user) {
                throw new Error('Invalid session response');
            }
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
