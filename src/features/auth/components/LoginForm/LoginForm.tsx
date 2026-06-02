import React, { useState } from 'react';
import { Alert, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes/paths';
import { useAuth } from '../../hooks/useAuth';

export const LoginForm = () => {
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await login({ username, password });
            navigate(paths.dashboard, { replace: true });
        } catch {
            setError('Invalid username or password');
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: 360,
                mx: 'auto',
                mt: 8,
                p: 4,
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: 'background.paper',
            }}
        >
            <Typography variant="h5" component="h1" sx={{ textAlign: 'center' }}>
                Sign in
            </Typography>

            {error && (
                <Alert severity="error" role="alert">
                    {error}
                </Alert>
            )}

            <TextField
                id="username"
                label="Username or Email"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
                fullWidth
            />

            <TextField
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                fullWidth
            />

            <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : null}
            >
                {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
        </Box>
    );
};
