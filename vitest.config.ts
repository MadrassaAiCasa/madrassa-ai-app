import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['@testing-library/jest-dom'],
        // Pin tests to mock mode so they don't depend on the dev .env toggle
        // (the real-API base URL would bypass the MSW node server).
        env: {
            VITE_USE_MOCKS: 'true',
            VITE_API_BASE_URL: '',
        },
    },
});
