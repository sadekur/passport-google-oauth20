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
```

## Key files

| File | Role |
|---|---|
| `index.js` | Server entrypoint — loads dotenv, requires app, listens on `PORT` (default 4000) |
| `app.js` | Express app — session, passport, EJS views, routes |
| `config/database.js` | Mongoose connect via `MONGO_URL` |
| `config/passport.js` | Google OAuth 2.0 strategy, serialize/deserialize |
| `models/user.model.js` | Mongoose schema: `username`, `googleId` |

## Callback URL mismatch

`config/passport.js:13` hardcodes `callbackURL: "http://localhost:5000/auth/google/callback"` but the server defaults to port **4000** (`index.js:4`). This will break OAuth unless you change one to match the other.

## No test suite

`npm test` is a placeholder. The repo has no test framework.

## No linter / formatter

No ESLint, Prettier, or typecheck config.

## Git note

`.gitignore` has `*.md` — any new `.md` file (including this one) is ignored by git. Use `git add -f AGENTS.md` to track it, or remove the pattern from `.gitignore`.
