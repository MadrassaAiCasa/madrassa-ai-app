import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from '@/store';
import enableMocking from '@/mocks/setUp';
import { AppRoutes } from '@/routes';
import './App.css';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
    },
});

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
                    <AppRoutes />
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    );
}

export default App;
