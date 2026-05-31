import { http, HttpResponse } from 'msw';
import { mockStore, hasRefreshToken } from './mockStore';

export const sessionHandlers = [
    // GET /auth/session - validate token and return user
    http.get('/auth/session', ({ request }) => {
        if (!hasRefreshToken(request)) {
            return HttpResponse.json({ error: 'No refresh token' }, { status: 401 });
        }

        return HttpResponse.json({
            user: mockStore.user,
            expiresAt: mockStore.expiresAt,
        });
    }),
];
