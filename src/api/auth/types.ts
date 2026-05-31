export interface User {
    id: string;
    username: string;
    email: string;
    roles: string[];
}

export interface LoginRequest {
    username?: string;
    email?: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    expiresAt: string;
}

export interface SessionResponse {
    user: User;
    expiresAt: string;
}

export interface RefreshResponse {
    accessToken: string;
    expiresAt: string;
}

export interface AuthError {
    error: string;
}
