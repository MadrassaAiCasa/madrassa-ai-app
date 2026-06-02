import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useAuth } from '../store/useAuth';
import authReducer from '../store/authSlice';
import * as authApi from '../api/auth';
import React from 'react';

vi.mock('../api/auth');

const createTestStore = () =>
    configureStore({
        reducer: {
            auth: authReducer,
        },
    });

const Wrapper = ({
    store,
    children,
}: {
    store: ReturnType<typeof createTestStore>;
    children: React.ReactNode;
}) => <Provider store={store}>{children}</Provider>;

describe('useAuth', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('initial state', () => {
        it('returns initial auth state', () => {
            const store = createTestStore();
            const { result } = renderHook(() => useAuth(), {
                wrapper: ({ children }) => <Wrapper store={store}>{children}</Wrapper>,
            });

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.isLoading).toBe(true);
        });
    });

    describe('login', () => {
        it('logs in user and sets credentials', async () => {
            const mockUser = {
                id: '1',
                username: 'admin',
                email: 'admin@example.com',
                roles: ['Admin'],
            };

            vi.mocked(authApi.authApi.login).mockResolvedValue({
                accessToken: 'mock-token',
                expiresAt: '2025-01-01T00:00:00.000Z',
            });
            vi.mocked(authApi.authApi.getSession).mockResolvedValue({
                user: mockUser,
                expiresAt: '2025-01-01T00:00:00.000Z',
            });

            const store = createTestStore();
            const { result } = renderHook(() => useAuth(), {
                wrapper: ({ children }) => <Wrapper store={store}>{children}</Wrapper>,
            });

            await act(async () => {
                await result.current.login({ username: 'admin', password: 'password123' });
            });

            expect(result.current.user).toEqual(mockUser);
            expect(result.current.isAuthenticated).toBe(true);
            expect(result.current.isLoading).toBe(false);
        });

        it('clears credentials on login failure', async () => {
            vi.mocked(authApi.authApi.login).mockRejectedValue(new Error('Login failed'));

            const store = createTestStore();
            const { result } = renderHook(() => useAuth(), {
                wrapper: ({ children }) => <Wrapper store={store}>{children}</Wrapper>,
            });

            await act(async () => {
                try {
                    await result.current.login({ username: 'admin', password: 'wrong' });
                } catch {
                    // Expected to throw
                }
            });

            expect(result.current.isLoading).toBe(false);
        });
    });

    describe('logout', () => {
        it('clears credentials on logout', async () => {
            vi.mocked(authApi.authApi.logout).mockResolvedValue();

            const store = createTestStore();
            const { result } = renderHook(() => useAuth(), {
                wrapper: ({ children }) => <Wrapper store={store}>{children}</Wrapper>,
            });

            await act(async () => {
                await result.current.logout();
            });

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.isLoading).toBe(false);
        });
    });

    describe('restoreSession', () => {
        it('restores session and sets credentials', async () => {
            const mockUser = {
                id: '1',
                username: 'admin',
                email: 'admin@example.com',
                roles: ['Admin'],
            };

            vi.mocked(authApi.authApi.getSession).mockResolvedValue({
                user: mockUser,
                expiresAt: '2025-01-01T00:00:00.000Z',
            });

            const store = createTestStore();
            const { result } = renderHook(() => useAuth(), {
                wrapper: ({ children }) => <Wrapper store={store}>{children}</Wrapper>,
            });

            await act(async () => {
                await result.current.restoreSession();
            });

            expect(result.current.user).toEqual(mockUser);
            expect(result.current.isAuthenticated).toBe(true);
            expect(result.current.isLoading).toBe(false);
        });

        it('clears credentials on restore failure', async () => {
            vi.mocked(authApi.authApi.getSession).mockRejectedValue(new Error('No session'));

            const store = createTestStore();
            const { result } = renderHook(() => useAuth(), {
                wrapper: ({ children }) => <Wrapper store={store}>{children}</Wrapper>,
            });

            await act(async () => {
                await result.current.restoreSession();
            });

            expect(result.current.user).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
        });
    });
});
