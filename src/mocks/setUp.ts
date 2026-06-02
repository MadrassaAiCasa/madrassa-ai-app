import { worker } from './handlers/browser';

// Cache the start() promise so React StrictMode's double-invoked effect awaits the
// SAME activation instead of starting the worker twice (which throws "already enabled")
// or resolving early before the service worker is active (which lets requests leak
// through to the dev server before MSW can intercept them).
let startPromise: Promise<ServiceWorkerRegistration | undefined> | null = null;

function enableMocking() {
    if (import.meta.env.VITE_USE_MOCKS !== 'true') {
        return Promise.resolve();
    }

    if (!startPromise) {
        startPromise = worker.start({
            onUnhandledRequest: 'bypass',
        });
    }

    return startPromise;
}

export default enableMocking;
