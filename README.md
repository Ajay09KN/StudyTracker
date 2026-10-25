# StudyTracker

A full-stack study time tracker: log study sessions, keep a streak alive, hit
monthly/yearly goals, and stay focused with a built-in Pomodoro timer.

**Stack:** React 18 + Vite + Tailwind CSS · Node.js + Express · MongoDB + Mongoose · JWT auth

---

## Features

- Email/password authentication with JWT (register, login, logout)
- Dashboard: today/week/month/year totals, current & longest streak, subject
  breakdown, recent sessions, goal progress
- Full CRUD for study sessions (subject, topic, date, start/end time or
  duration, notes)
- Analytics charts: daily, weekly, monthly, and yearly study time (Recharts)
- Color-coded study calendar (GitHub-style heatmap) with day-level detail
- Monthly & yearly goals with live progress bars
- Pomodoro timer with configurable work/break lengths that automatically logs
  completed focus blocks as study sessions
- Editable profile, daily study target, password change
- Light/dark mode, fully responsive, toast notifications, loading & error states

## Project structure

```
studytracker/
├── backend/              Express API
│   ├── config/           MongoDB connection
│   ├── controllers/      Route handlers (auth, sessions, goals, analytics, users)
│   ├── middleware/       JWT auth guard, validation, centralized error handling
│   ├── models/           Mongoose schemas (User, StudySession, Goal)
│   ├── routes/           Express routers
│   ├── utils/            JWT helper, date-range & streak calculations
│   └── server.js         App entry point
├── frontend/              React app (Vite)
│   └── src/
│       ├── api/           Axios instance + service functions per resource
│       ├── components/    layout / ui / dashboard / sessions / charts /
│       │                  calendar / goals / pomodoro — reusable pieces
│       ├── context/       AuthContext, ThemeContext
│       ├── pages/         One component per route
│       └── routes/        ProtectedRoute wrapper
└── package.json           Convenience scripts to run both apps together
```

## Prerequisites

- **Node.js 18+** and npm
- **MongoDB** — either:
  - a local instance (`mongod` running on `localhost:27017`), or
  - a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (recommended if you don't want to install MongoDB locally)
  - MongoDB **5.0+** is required (the analytics endpoints use `$dateTrunc`)

## Setup

1. **Install dependencies** (installs both backend and frontend):

   ```bash
   npm run install:all
   ```

2. **Configure the backend.** Copy the example env file and fill in your values:

   ```bash
   cp backend/.env.example backend/.env
   ```

   ```ini
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/studytracker   # or your Atlas connection string
   JWT_SECRET=replace_this_with_a_long_random_secret_string
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:5173
   ```

3. **Configure the frontend** (usually no changes needed for local dev — Vite
   proxies `/api` to the backend automatically):

   ```bash
   cp frontend/.env.example frontend/.env
   ```

4. **Run both apps together:**

   ```bash
   npm run dev
   ```

   - Backend API: `http://localhost:5000`
   - Frontend: `http://localhost:5173`

   Or run them separately in two terminals with `npm run dev:backend` and
   `npm run dev:frontend`.

5. Open `http://localhost:5173`, sign up for an account, and start logging sessions.

## Building for production

```bash
npm run build:frontend      # outputs static files to frontend/dist
npm run start:backend       # runs the API with `node` instead of nodemon
```

Deploy the backend anywhere that runs Node (Render, Railway, Fly.io, a VPS,
etc.) and the frontend's `dist/` folder to any static host (Vercel, Netlify,
S3 + CloudFront). Set `CLIENT_URL` on the backend and `VITE_API_URL` on the
frontend to point at each other's production URLs.

## API overview

All routes are prefixed with `/api`. Protected routes require an
`Authorization: Bearer <token>` header.

| Method | Route | Description |
|---|---|---|
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Log in |
| GET | `/auth/me` | Current user *(protected)* |
| POST | `/auth/logout` | Log out *(protected)* |
| GET/POST | `/sessions` | List / create study sessions |
| GET/PUT/DELETE | `/sessions/:id` | Read / update / delete a session |
| GET | `/sessions/subjects/list` | Distinct subjects studied |
| GET/POST | `/goals` | List / upsert monthly & yearly goals |
| DELETE | `/goals/:id` | Delete a goal |
| GET | `/analytics/dashboard` | Totals, streaks, subject breakdown, recents |
| GET | `/analytics/charts?period=daily\|weekly\|monthly\|yearly` | Chart series |
| GET | `/analytics/calendar?year=&month=` | Heatmap data for the calendar |
| PUT | `/users/profile` | Update name/email/timezone |
| PUT | `/users/preferences` | Update daily target & Pomodoro defaults |
| PUT | `/users/password` | Change password |

## Notes on the design

Colors, type, and the "streak ledger" heatmap follow a small custom design
system (defined in `frontend/tailwind.config.js`) rather than a default
Tailwind theme — pine green and amber accents on an ink/paper palette, with
Fraunces for display type and IBM Plex Mono for all numeric stats.

## Security notes for production

- The JWT is stored in `localStorage` for simplicity. For production
  hardening, consider moving to an httpOnly cookie + refresh-token flow.
- Set a strong, unique `JWT_SECRET`.
- Add rate limiting (e.g. `express-rate-limit`) on `/auth` routes before
  deploying publicly.
