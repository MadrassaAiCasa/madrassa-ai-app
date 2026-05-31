import { http, HttpResponse } from 'msw';

export const logoutHandlers = [
    // POST /auth/logout - revoke refresh token
    http.post('/auth/logout', () => {
        // In a real implementation, this would revoke the refresh token in DB
        // For mock, we just return success
        return new HttpResponse(null, { status: 204 });
    }),
];
