import { describe, it, expect } from 'vitest';
import authReducer, {
    setCredentials,
    clearCredentials,
    setLoading,
} from '@/features/auth/store/authSlice';
import type { AuthState } from '@/features/auth/store/authSlice';

describe('authSlice', () => {
    const initialState: AuthState = {
        user: null,
        tokens: { accessToken: null, expiresAt: null },
        isAuthenticated: false,
        isLoading: true,
    };

    describe('setCredentials', () => {
        it('sets user, tokens and marks as authenticated', () => {
            const user = {
                id: '1',
                username: 'admin',
                email: 'admin@example.com',
                roles: ['Admin'],
            };
            const tokens = {
                accessToken: 'mock-token',
                expiresAt: '2025-01-01T00:00:00.000Z',
            };

            const nextState = authReducer(initialState, setCredentials({ user, tokens }));

            expect(nextState.user).toEqual(user);
            expect(nextState.tokens).toEqual(tokens);
            expect(nextState.isAuthenticated).toBe(true);
            expect(nextState.isLoading).toBe(false);
        });
    });

    describe('clearCredentials', () => {
        it('clears user, tokens and marks as unauthenticated', () => {
            const authenticatedState: AuthState = {
                user: {
                    id: '1',
                    username: 'admin',
                    email: 'admin@example.com',
                    roles: ['Admin'],
                },
                tokens: {
                    accessToken: 'mock-token',
                    expiresAt: '2025-01-01T00:00:00.000Z',
                },
                isAuthenticated: true,
                isLoading: false,
            };

            const nextState = authReducer(authenticatedState, clearCredentials());

            expect(nextState.user).toBeNull();
            expect(nextState.tokens.accessToken).toBeNull();
            expect(nextState.tokens.expiresAt).toBeNull();
            expect(nextState.isAuthenticated).toBe(false);
            expect(nextState.isLoading).toBe(false);
        });
    });

    describe('setLoading', () => {
        it('sets isLoading to true', () => {
            const nextState = authReducer(initialState, setLoading(true));
            expect(nextState.isLoading).toBe(true);
        });

        it('sets isLoading to false', () => {
            const loadingState: AuthState = { ...initialState, isLoading: true };
            const nextState = authReducer(loadingState, setLoading(false));
            expect(nextState.isLoading).toBe(false);
        });
    });
});
