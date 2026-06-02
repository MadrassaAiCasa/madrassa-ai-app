import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../api/types';

export interface AuthTokens {
    accessToken: string | null;
    expiresAt: string | null;
}

export interface AuthState {
    user: User | null;
    tokens: AuthTokens;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const initialState: AuthState = {
    user: null,
    tokens: {
        accessToken: null,
        expiresAt: null,
    },
    isAuthenticated: false,
    isLoading: true,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: User; tokens: AuthTokens }>) => {
            state.user = action.payload.user;
            state.tokens = action.payload.tokens;
            state.isAuthenticated = true;
            state.isLoading = false;
        },
        clearCredentials: (state) => {
            state.user = null;
            state.tokens = { accessToken: null, expiresAt: null };
            state.isAuthenticated = false;
            state.isLoading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setCredentials, clearCredentials, setLoading } = authSlice.actions;

export default authSlice.reducer;
