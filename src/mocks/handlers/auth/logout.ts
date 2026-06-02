import { http, HttpResponse } from 'msw';
import { setMockAuthenticated } from './mockStore';

export const logoutHandlers = [
    http.post('/auth/logout', () => {
        setMockAuthenticated(false);
        return new HttpResponse(null, { status: 204 });
    }),
];
