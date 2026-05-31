# Endpoints

## Auth

| Method | Path            | Description                                     |
| ------ | --------------- | ----------------------------------------------- |
| POST   | `/auth/login`   | Authenticate user, return access token + cookie |
| GET    | `/auth/session` | Get current session from refresh token cookie   |
| POST   | `/auth/refresh` | Rotate refresh token, issue new access token    |
| POST   | `/auth/logout`  | Revoke session                                  |

See [openapi.yaml](./openapi.yaml) for full contract (request/response shapes, errors).
