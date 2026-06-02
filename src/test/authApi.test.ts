import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { server } from '../mocks/server';
import { authApi, setAccessToken, getAccessToken } from '@/features/auth/api';
import { mockStore } from '../mocks/handlers/auth';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('authApi', () => {
    beforeEach(() => {
        setAccessToken(null);
        mockStore.isAuthenticated = false;
    });

    describe('login', () => {
        it('returns access token on successful login', async () => {
            const result = await authApi.login({
                username: 'admin',
                password: 'password123',
            });

            expect(result.accessToken).toBeDefined();
            expect(result.expiresAt).toBeDefined();
            expect(getAccessToken()).toBe(result.accessToken);
        });

        it('sets access token in memory', async () => {
            await authApi.login({
                username: 'admin',
                password: 'password123',
            });

            expect(getAccessToken()).not.toBeNull();
        });

        it('throws on invalid credentials', async () => {
            await expect(
                authApi.login({
                    username: 'admin',
                    password: 'wrongpassword',
                })
            ).rejects.toThrow();
        });
    });

    describe('getSession', () => {
        it('returns user and expiresAt on valid session', async () => {
            mockStore.isAuthenticated = true;

            const result = await authApi.getSession();

            expect(result.user).toBeDefined();
            expect(result.user.username).toBe('admin');
            expect(result.expiresAt).toBeDefined();
        });
    });

    describe('refresh', () => {
        it('returns new access token', async () => {
            mockStore.isAuthenticated = true;

            const result = await authApi.refresh();

            expect(result.accessToken).toBeDefined();
            expect(result.expiresAt).toBeDefined();
        });

        it('updates access token in memory', async () => {
            mockStore.isAuthenticated = true;
            const initialToken = 'initial-token';
            setAccessToken(initialToken);

            const result = await authApi.refresh();

            expect(getAccessToken()).toBe(result.accessToken);
            expect(getAccessToken()).not.toBe(initialToken);
        });
    });

    describe('logout', () => {
        it('clears access token', async () => {
            setAccessToken('some-token');

            await authApi.logout();

            expect(getAccessToken()).toBeNull();
        });
    });
});
