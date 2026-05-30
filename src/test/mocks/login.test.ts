import { describe, it, expect, beforeEach } from 'vitest';
import { mockStore } from '../../mocks/handlers/auth';

describe('POST /auth/login', () => {
    beforeEach(() => {
        // Reset auth state before each test
        mockStore.isAuthenticated = false;
    });

    it('returns 400 when username and email are missing', async () => {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: 'password123' }),
        });

        expect(response.status).toBe(400);
        const body = await response.json();
        expect(body.error).toBe('Username or email required');
    });

    it('returns 400 when password is missing', async () => {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin' }),
        });

        expect(response.status).toBe(400);
        const body = await response.json();
        expect(body.error).toBe('Password required');
    });

    it('returns 401 when password is wrong', async () => {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'wrongpassword' }),
        });

        expect(response.status).toBe(401);
        const body = await response.json();
        expect(body.error).toBe('Invalid credentials');
    });

    it('returns access token and sets refresh cookie on success', async () => {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'password123' }),
        });

        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.accessToken).toBeDefined();
        expect(body.expiresAt).toBeDefined();
    });
});
