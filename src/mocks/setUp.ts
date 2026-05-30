import { worker } from './handlers/browser';

async function enableMocking() {
    if (import.meta.env.VITE_USE_MOCKS !== 'true') {
        return;
    }

    // Wait for the service worker to be ready
    await worker.start({
        onUnhandledRequest: 'bypass',
    });
}

export default enableMocking;
