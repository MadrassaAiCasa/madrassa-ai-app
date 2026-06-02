import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAuth } from './store';
import { ProtectedRoute, PublicRoute, LoginForm } from './components/auth';
import { Dashboard } from './components/dashboard/Dashboard';
import enableMocking from './mocks/setUp';
import './App.css';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
    },
});

const AppContent = () => {
    const { restoreSession } = useAuth();

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <LoginForm />
                    </PublicRoute>
                }
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

function App() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        enableMocking().then(() => {
            setIsReady(true);
        });
    }, []);

    if (!isReady) {
        return null;
    }

    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <AppContent />
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    );
}

export default App;
