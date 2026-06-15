# AGENTS.md

## Quick start

```bash
npm start          # nodemon index.js (dev server on :4000 by default)
```

## Setup

Copy `.env.example` to `.env` and fill in:

| Variable | Required | Notes |
|---|---|---|
| `MONGO_URL` | Yes | e.g. `mongodb://localhost:27017/passport-auth` |
| `GOOGLE_CLIENT_ID` | No | App runs with local auth only if missing |
| `GOOGLE_CLIENT_SECRET` | No | |
| `SESSION_SECRET` | No | Falls back to `"keyboard cat"` |
| `PORT` | No | Defaults to `4000` |

## Key files

| File | Role |
|---|---|
| `index.js` | Entrypoint — loads dotenv, requires app, listens on `PORT` |
| `app.js` | Express app setup — session, passport, EJS, middleware, static files |
| `routes/auth.routes.js` | All route handlers — login, register, profile, logout, Google OAuth |
| `config/passport.js` | Google OAuth 2.0 + Local strategy, serialize/deserialize |
| `config/database.js` | Mongoose connect via `MONGO_URL` |
| `models/user.model.js` | Mongoose schema: `username`, `email`, `password`, `googleId`, `avatar`, timestamps |
| `views/layout/header.ejs` | Bootstrap 5 navbar, flash messages, dynamic `<title>`, active link highlighting |
| `public/css/style.css` | Custom layout styles |

## Architecture notes

- **Google strategy is conditional** — if `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET` is missing, the Google OAuth strategy and its routes (`/auth/google`, `/auth/google/callback`) are never registered. Templates check `locals.googleEnabled` to conditionally show the Google login button.
- **Dynamic callback URL** — `config/passport.js` builds the callback URL from `process.env.PORT` (defaults to `http://localhost:4000/auth/google/callback`).
- **Session** stored in MongoDB via `connect-mongo` (`sessions` collection).
- **Flash messages** (`connect-flash`) shown as dismissible Bootstrap alerts.

## Auth flows

- **Local** — register (`username`, `email`, `password`) at `/register`, login at `/login`
- **Google OAuth 2.0** — click "Login with Google", callback at `/auth/google/callback`; requests `profile` + `email` scopes

## No tests / No linter

`npm test` is a placeholder. No ESLint, Prettier, or typecheck config.

## Git note

`.gitignore` has `*.md` — this file is ignored by git. Use `git add -f AGENTS.md` to commit it.
