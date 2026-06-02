import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { paths } from './paths';

export const AppRoutes = () => {
    const { restoreSession } = useAuth();

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    return (
        <Routes>
            <Route
                path={paths.login}
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />
            <Route
                path={paths.dashboard}
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route path={paths.root} element={<Navigate to={paths.dashboard} replace />} />
        </Routes>
    );
};
