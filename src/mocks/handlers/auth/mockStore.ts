export interface MockUser {
    id: string;
    username: string;
    email: string;
    roles: string[];
    password?: string; // only for mock testing
}

export interface SessionResponse {
    user: MockUser;
    expiresAt: string;
}

export interface RefreshResponse {
    accessToken: string;
    expiresAt: string;
}

export interface LoginRequest {
    username?: string;
    email?: string;
    password?: string;
}

// The mock cannot replicate the real httpOnly refresh cookie, so the session flag is
// persisted in localStorage. This is the stand-in for "browser holds a valid refresh
// token": login writes it (session survives reload), logout removes it (reload stays
// logged out). No-ops safely in node/test environments where localStorage is absent.
const SESSION_KEY = 'mock_session_active';

const readPersistedAuth = (): boolean => {
    try {
        return localStorage.getItem(SESSION_KEY) === 'true';
    } catch {
        return false;
    }
};

// Mock data store (can be manipulated by tests)
export const mockStore = {
    user: {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123',
        roles: ['Admin', 'Superadmin'],
    } as MockUser,
    isAuthenticated: readPersistedAuth(),
    accessToken: 'mock-access-token-12345',
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
    refreshToken: 'mock-refresh-token',
    refreshTokenExpiresAt: new Date(Date.now() + 30 * 1000).toISOString(), // 30 seconds from now (for testing expiry)
};

export const setMockAuthenticated = (value: boolean): void => {
    mockStore.isAuthenticated = value;
    try {
        if (value) {
            localStorage.setItem(SESSION_KEY, 'true');
        } else {
            localStorage.removeItem(SESSION_KEY);
        }
    } catch {
        // localStorage unavailable (node) — in-memory flag is enough there
    }
};

// mockStore.isAuthenticated is checked first: an explicit logout always wins.
// When authenticated, cookie expiry is validated for node/test environments where
// real Cookie headers are sent.
export const hasRefreshToken = (request: Request): boolean => {
    if (!mockStore.isAuthenticated) return false;

    const cookies = request.headers.get('Cookie') || '';
    if (cookies.includes('refreshToken=')) {
        const now = new Date();
        const expiresAt = new Date(mockStore.refreshTokenExpiresAt);
        return now < expiresAt;
    }

    return true;
};
