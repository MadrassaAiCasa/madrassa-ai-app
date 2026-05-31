import { http, HttpResponse } from 'msw';
import { mockStore } from './mockStore';

export const loginHandlers = [
    // POST /auth/login - authenticate user and issue tokens
    http.post('/auth/login', async ({ request }) => {
        const body = (await request.json()) as {
            username?: string;
            email?: string;
            password?: string;
        };

        const { username, email, password } = body;

        // Validate credentials
        if (!username && !email) {
            return HttpResponse.json({ error: 'Username or email required' }, { status: 400 });
        }

        if (!password) {
            return HttpResponse.json({ error: 'Password required' }, { status: 400 });
        }

        // Check password against mock store
        if (password !== mockStore.user.password) {
            return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Mock successful login
        // In real app: verify password hash, check isActive, check isLocked
        mockStore.isAuthenticated = true;

        return HttpResponse.json(
            {
                accessToken: mockStore.accessToken,
                expiresAt: mockStore.expiresAt,
            },
            {
                headers: {
                    'Set-Cookie':
                        'refreshToken=mock-refresh-token; HttpOnly; SameSite=Strict; Path=/',
                },
            }
        );
    }),
];
