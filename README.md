# CYBERHUD_COMMAND — Battling Gaming Zone

> High-end gaming platform — Single & Multiplayer battle arenas, real-time telemetry, 3D cyber core, Google Maps zones, and role-based command control. Inspired by Awwwards & Framer — built with performant, modular, scalable architecture.

![Stack](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-8ff5ff?style=for-the-badge)
![State](https://img.shields.io/badge/State-Redux%20Toolkit-d674ff?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-Node%20%7C%20Express%20%7C%20MongoDB-00eefc?style=for-the-badge)
![Anim](https://img.shields.io/badge/Animation-Framer%20%7C%20GSAP%20%7C%20Anime.js-ff6e81?style=for-the-badge)

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Backend
```bash
cd backend
cp .env.example .env   # fill MONGO_URI + JWT secrets
npm install
npm run seed           # creates admin@cyberhud.io / Admin@1234 etc.
npm run dev            # http://localhost:5000/api/health
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env   # set VITE_API_URL and VITE_GOOGLE_MAPS_API_KEY (optional)
npm install
npm run dev            # http://localhost:5173
```

Test creds after seed:

| Role | Email | Password |
|------|-------|----------|
| admin | admin@cyberhud.io | Admin@1234 |
| moderator | mod@cyberhud.io | Mod@1234 |
| organizer | organizer@cyberhud.io | Organizer@1234 |
| user | player@cyberhud.io | Player@1234 |

---

## 📁 Architecture

```
cyberhud_command/
├── backend/                 # Express API
│   └── src/
│       ├── config/db.js     # Mongoose connection
│       ├── models/User.js   # RBAC-ready user (user/moderator/organizer/admin)
│       ├── controllers/     # authController, userController
│       ├── routes/          # /api/auth, /api/users, /api/admin
│       ├── middlewares/     # protect, authorize, authorizeAtLeast, errorHandler
│       ├── utils/tokens.js  # JWT access/refresh + httpOnly cookies
│       └── server.js
│
└── frontend/                # React + Vite
    └── src/
        ├── app/store.js     # Redux Toolkit store
        ├── features/auth/   # authSlice (login/register/fetchMe/logout)
        ├── services/api.js  # axios instance with refresh interceptor
        ├── hooks/useAuth.js # hasRole / hasAtLeastRole helpers
        ├── components/
        │   ├── ui/Navbar, ProtectedRoute
        │   ├── canvas/CyberCore.jsx   # Three.js @react-three/fiber + drei
        │   └── maps/ZoneMap.jsx       # Google Maps (@react-google-maps/api)
        └── pages/
            ├── EnhancedLandingPage.jsx # Awwwards-level 3D + GSAP + Framer
            ├── BattleZone.jsx          # Solo/Squad/Royale + Maps
            ├── auth/Login, Register
            ├── dashboard/Dashboard
            └── admin/AdminPanel
```

### Why this is scalable
- **Stateless JWT** with refresh rotation (httpOnly cookies, 15m access / 7d refresh)
- **RBAC hierarchy**: `admin(4) > organizer(3) > moderator(2) > user(1)` — `authorize()` for strict, `authorizeAtLeast()` for hierarchical gates
- **Modular routes & controllers** — easy to add `battle`, `tournament`, `matchmaking` modules
- **Pagination, indexing, 2dsphere** for battle zones location queries
- **Code-splitting**: vendor/three/animation/maps chunks + lazy 3D
- **Rate limiting, Helmet, CORS, validator, Joi** for security & validation

---

## 🔐 Authentication & RBAC

- **Flow**: Register/Login → accessToken + refreshToken in httpOnly cookies + localStorage (for fast UI) → axios interceptor auto-refreshes on 401
- **Protect**: `protect` middleware verifies JWT, attaches `req.user`
- **Authorize**: 
  ```js
  authorize(ROLES.ADMIN)               // strict
  authorizeAtLeast(ROLES.MODERATOR)    // hierarchical
  ```
- **Frontend guards**: `<ProtectedRoute allowedRoles={['admin']} />` or `requireAtLeast="moderator"`
- **Hierarchy** editable in `backend/src/models/User.js` & `frontend/src/hooks/useAuth.js`

Change JWT expiry in `backend/.env`:
```
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

---

## 🗺️ Google Maps Integration

`frontend/src/components/maps/ZoneMap.jsx` (`zone:28`)

- Uses `@react-google-maps/api`. Set `VITE_GOOGLE_MAPS_API_KEY` in `frontend/.env`
- Dark cyber theme (`mapOptions.styles`) matches HUD
- Markers + Circles for live zones, click-to-join
- **No key?** Falls back to offline tactical grid (still functional, shows zones)

Enable APIs in GCP: **Maps JavaScript API + Geocoding API**

---

## 🎮 Battling Gaming Zone Modes

`frontend/src/pages/BattleZone.jsx` (`zone:42`)

- **SOLO_PROTOCOL** — 1v1 duel
- **SQUAD_ASSAULT** — 4v4
- **VOID_ROYALE** — 16 players, shrinking grid

Extend with WebSockets (Socket.io) for real-time matchmaking — structure ready.

---

## 🎨 High-End Visuals — Framer + Anime.js + GSAP + Three.js

- **Framer Motion**: page transitions, hover lift, scale taps (`Navbar:42`, `Login:52`)
- **GSAP + ScrollTrigger**: hero stagger, stats reveal, feature cards (`EnhancedLandingPage:28`)
- **Anime.js**: word-by-word hero entrance (`EnhancedLandingPage:18`)
- **Three.js / R3F + Drei**: interactive TorusKnot cyber core, particles, OrbitControls, `MeshDistortMaterial` (`CyberCore:18`)
- **Tailwind CSS v4** with cyber theme (`index.css:3` — primary `#8ff5ff`, secondary `#d674ff`, tertiary `#ff6e81` on `#0e0e0e`)

Performance: chunks split (`vite.config.js:10`) → vendor 613KB, three 758KB, animation 256KB. 3D canvas is DPR-aware and can be `React.lazy` + `Suspense` if needed.

---

## 🚀 Performance Optimization

- **Frontend**: Vite + manual chunks, `React.StrictMode`, memoized Three geometries (`useMemo`), `dpr={[1,2]}`, `antialias`, lazy images, `useTransform` scroll parallax
- **Backend**: Helmet, rate-limit on `/auth`, pagination (`?page&limit&search`), indexed queries, `express.json({limit:"10kb"})`, httpOnly cookies
- **DB**: compound indexes on `role`, `status`, `location:2dsphere`
- **API**: `axios` timeout 15s, refresh queue to avoid thundering herd

---

## 🧪 API Reference

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | public | Create user (only `user` role) |
| POST | /api/auth/login | public | Login |
| POST | /api/auth/refresh | public (cookie) | Rotate tokens |
| POST | /api/auth/logout | public | Clear cookies |
| GET | /api/auth/me | private | Current user |
| GET | /api/users | moderator+ | List users (paginated) |
| GET | /api/users/leaderboard | public | Top 50 by XP |
| PATCH | /api/users/:id/role | admin | Change role |
| PATCH | /api/users/:id/ban | moderator+ | Toggle ban |
| GET | /api/admin/stats | admin | Dashboard stats |

Health: `GET /api/health`

---

## 🔧 Environment Variables

**backend/.env** — see `backend/.env.example`

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=...
```

---

## 🛠️ Roadmap

- [ ] Socket.io matchmaking & live battle state
- [ ] Google OAuth (passport) — model already has `googleId`
- [ ] Tournament CRUD (organizer role)
- [ ] WebGL post-processing (bloom, glitch) for landing
- [ ] E2E tests (Playwright) + CI

---

Built with clean, modular code • Responsive • Ready for Awwwards-level polish. PRs welcome.

---

## 📜 License & Community

- **License:** MIT — see [LICENSE](./LICENSE).
- **Code of Conduct:** [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) (Contributor Covenant 2.1). By participating you agree to uphold it; violations can be reported to the maintainers listed in [CODEOWNERS](./CODEOWNERS).
- **Contributing:** [CONTRIBUTING.md](./CONTRIBUTING.md) • **Security:** [SECURITY.md](./SECURITY.md)
