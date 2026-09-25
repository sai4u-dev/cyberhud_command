# CYBERHUD Backend

Battling Gaming Zone API - Node.js + Express + MongoDB

## Setup

1. Copy env:
```bash
cp .env.example .env
# edit MONGO_URI and JWT secrets
```

2. Install:
```bash
npm install
```

3. Dev:
```bash
npm run dev
```

Health: `GET http://localhost:5000/api/health`

## Auth Flow

- `POST /api/auth/register` { username, email, password, displayName }
- `POST /api/auth/login` { email, password } -> sets httpOnly cookies + returns tokens
- `POST /api/auth/refresh` (cookie or body)
- `POST /api/auth/logout`
- `GET /api/auth/me` (Bearer or cookie)

## RBAC Roles

Hierarchy: `admin (4) > organizer (3) > moderator (2) > user (1)`

- `user`: default, can play, view profile, battle zones
- `moderator`: manage users, ban, view user list
- `organizer`: tournament organizer (same as moderator + create events - extensible)
- `admin`: full access, role management, stats

Middleware: `protect` + `authorize(...roles)` or `authorizeAtLeast(role)`

## Frontend integration

Store `accessToken` in memory (Redux) and `refreshToken` in httpOnly cookie.
Use axios interceptor to refresh on 401.

## Performance & Scalability

- Rate limiting on auth routes
- Helmet, CORS, httpOnly cookies
- Pagination, indexed queries
- Stateless JWT + refresh rotation

## License

MIT — see root [LICENSE](../LICENSE). By contributing you agree your contributions are licensed under the same terms and that you abide by the [Code of Conduct](../CODE_OF_CONDUCT.md).
