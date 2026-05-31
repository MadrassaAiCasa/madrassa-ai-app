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

// Mock data store (can be manipulated by tests)
export const mockStore = {
    user: {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123',
        roles: ['Admin', 'Superadmin'],
    } as MockUser,
    isAuthenticated: false,
    accessToken: 'mock-access-token-12345',
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
    refreshToken: 'mock-refresh-token',
    refreshTokenExpiresAt: new Date(Date.now() + 30 * 1000).toISOString(), // 30 seconds from now (for testing expiry)
};

// Helper to check for refresh token cookie and validate expiry
export const hasRefreshToken = (request: Request): boolean => {
    const cookies = request.headers.get('Cookie') || '';
    if (!cookies.includes('refreshToken=')) {
        return false;
    }
    // Check if refresh token is expired
    const now = new Date();
    const expiresAt = new Date(mockStore.refreshTokenExpiresAt);
    return now < expiresAt;
};
