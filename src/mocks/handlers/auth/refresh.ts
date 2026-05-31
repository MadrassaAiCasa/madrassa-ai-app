import { http, HttpResponse } from 'msw';
import { mockStore, hasRefreshToken } from './mockStore';

export const refreshHandlers = [
    // POST /auth/refresh - rotate refresh token and issue new access token
    http.post('/auth/refresh', ({ request }) => {
        if (!hasRefreshToken(request)) {
            return HttpResponse.json({ error: 'No refresh token' }, { status: 401 });
        }

        // Rotate access token
        mockStore.accessToken = `mock-access-token-${Date.now()}`;
        mockStore.expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

        return HttpResponse.json({
            accessToken: mockStore.accessToken,
            expiresAt: mockStore.expiresAt,
        });
    }),
];
