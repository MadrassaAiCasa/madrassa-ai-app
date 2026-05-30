export { mockStore, hasRefreshToken } from './mockStore';
export type { MockUser, SessionResponse, RefreshResponse, LoginRequest } from './mockStore';

import { loginHandlers } from './login';
import { sessionHandlers } from './session';
import { refreshHandlers } from './refresh';
import { logoutHandlers } from './logout';

export { loginHandlers, sessionHandlers, refreshHandlers, logoutHandlers };

export const authHandlers = [
    ...loginHandlers,
    ...sessionHandlers,
    ...refreshHandlers,
    ...logoutHandlers,
];
