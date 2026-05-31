import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../store';

vi.mock('../store');

const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;

describe('LoginForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            login: vi.fn(),
            logout: vi.fn(),
            restoreSession: vi.fn(),
        });
    });

    it('renders login form', () => {
        render(<LoginForm />);

        expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('calls login with form data on submit', async () => {
        const loginMock = vi.fn().mockResolvedValue(undefined);
        mockUseAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            login: loginMock,
            logout: vi.fn(),
            restoreSession: vi.fn(),
        });

        render(<LoginForm />);

        fireEvent.change(screen.getByLabelText(/username or email/i), {
            target: { value: 'admin' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'password123' },
        });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(loginMock).toHaveBeenCalledWith({
                username: 'admin',
                password: 'password123',
            });
        });
    });

    it('displays error message on login failure', async () => {
        const loginMock = vi.fn().mockRejectedValue(new Error('Login failed'));
        mockUseAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            login: loginMock,
            logout: vi.fn(),
            restoreSession: vi.fn(),
        });

        render(<LoginForm />);

        fireEvent.change(screen.getByLabelText(/username or email/i), {
            target: { value: 'admin' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'wrong' },
        });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent('Invalid username or password');
        });
    });

    it('disables inputs and button when loading', () => {
        mockUseAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            isLoading: true,
            login: vi.fn(),
            logout: vi.fn(),
            restoreSession: vi.fn(),
        });

        render(<LoginForm />);

        expect(screen.getByLabelText(/username or email/i)).toBeDisabled();
        expect(screen.getByLabelText(/password/i)).toBeDisabled();
        expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
    });

    it('shows loading text when loading', () => {
        mockUseAuth.mockReturnValue({
            user: null,
            isAuthenticated: false,
            isLoading: true,
            login: vi.fn(),
            logout: vi.fn(),
            restoreSession: vi.fn(),
        });

        render(<LoginForm />);

        expect(screen.getByRole('button')).toHaveTextContent(/signing in/i);
    });
});
