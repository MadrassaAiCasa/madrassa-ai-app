import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from '../mocks/server';

// Start MSW server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test (避免 handlers 在测试间污染)
afterEach(() => server.resetHandlers());

// Close server after all tests
afterAll(() => server.close());
