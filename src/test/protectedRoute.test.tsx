import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('@/features/auth/hooks/useAuth');

const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;

describe('ProtectedRoute', () => {
    it('shows loading when isLoading is true', () => {
        mockUseAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            isLoading: true,
            login: vi.fn(),
            logout: vi.fn(),
            restoreSession: vi.fn(),
        });

        render(
            <MemoryRouter>
                <ProtectedRoute>
                    <div>Protected Content</div>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.getByTestId('auth-loading')).toBeInTheDocument();
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('redirects to /login when not authenticated', () => {
        mockUseAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            login: vi.fn(),
            logout: vi.fn(),
            restoreSession: vi.fn(),
        });

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/login" element={<div>Login Page</div>} />
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute>
                                <div>Protected Content</div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Login Page')).toBeInTheDocument();
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('renders children when authenticated', () => {
        mockUseAuth.mockReturnValue({
            user: { id: '1', username: 'admin', email: 'admin@test.com', roles: ['Admin'] },
            isAuthenticated: true,
            isLoading: false,
            login: vi.fn(),
            logout: vi.fn(),
            restoreSession: vi.fn(),
        });

        render(
            <MemoryRouter>
                <ProtectedRoute>
                    <div>Protected Content</div>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
        expect(screen.queryByTestId('auth-loading')).not.toBeInTheDocument();
    });
});
