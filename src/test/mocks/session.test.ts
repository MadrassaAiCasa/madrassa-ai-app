import { describe, it, expect, beforeEach } from 'vitest';
import { mockStore } from '../../mocks/handlers/auth';

describe('GET /auth/session', () => {
    beforeEach(() => {
        // Reset refresh token expiry to 24 hours (valid)
        mockStore.refreshTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    });

    it('returns 401 when no refresh token cookie', async () => {
        const response = await fetch('/auth/session');

        expect(response.status).toBe(401);
    });

    it('returns 401 when refresh token is expired', async () => {
        // Set refresh token to expired
        mockStore.refreshTokenExpiresAt = new Date(Date.now() - 1000).toISOString();

        const response = await fetch('/auth/session', {
            headers: { Cookie: 'refreshToken=mock-refresh-token' },
        });

        expect(response.status).toBe(401);
    });

    it('returns user data when refresh token is valid', async () => {
        const response = await fetch('/auth/session', {
            headers: { Cookie: 'refreshToken=mock-refresh-token' },
        });

        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.user).toBeDefined();
        expect(body.user.username).toBe('admin');
        expect(body.expiresAt).toBeDefined();
    });
});
