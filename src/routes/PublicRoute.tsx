import React from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from '@/features/auth';
import { paths } from './paths';

interface PublicRouteProps {
    children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (isAuthenticated) {
        return <Navigate to={paths.dashboard} replace />;
    }

    return <>{children}</>;
};
