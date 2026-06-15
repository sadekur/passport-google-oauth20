# AGENTS.md

## Quick start

```bash
npm start          # nodemon index.js (dev server on :4000 by default)
```

Requires `.env` with:

```
MONGO_URL=mongodb://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
SESSION_SECRET=<any random string>       # optional, falls back to "keyboard cat"
PORT=4000                                 # optional, defaults to 4000
```

## Key files

| File | Role |
|---|---|
| `index.js` | Server entrypoint — loads dotenv, requires app, listens on `PORT` |
| `app.js` | Express app setup — session, passport, EJS, middleware, static files |
| `routes/auth.routes.js` | All route handlers — login, register, profile, logout, Google OAuth |
| `config/passport.js` | Google OAuth 2.0 + Local strategy, serialize/deserialize |
| `config/database.js` | Mongoose connect via `MONGO_URL` |
| `models/user.model.js` | Mongoose schema: `username`, `email`, `password`, `googleId`, `avatar`, timestamps |
| `views/layout/header.ejs` | Bootstrap 5 navbar, flash messages, dynamic `<title>`, active link highlighting |
| `public/css/style.css` | Custom layout styles |

## Auth flows

- **Local** — register (username + email + password) at `/register`, login at `/login`
- **Google OAuth 2.0** — click "Login with Google", callback at `/auth/google/callback`
- Session stored in MongoDB via `connect-mongo`
- Flash messages (`connect-flash`) shown as dismissible Bootstrap alerts

## Callback URL

`config/passport.js:13` uses a dynamic callback URL based on `process.env.PORT`. It defaults to `http://localhost:4000/auth/google/callback`.

## No tests / No linter

`npm test` is a placeholder. No ESLint, Prettier, or typecheck config.

## Git note

`.gitignore` has `*.md` — this file is ignored by git. Use `git add -f AGENTS.md` to track it.
