# Templatizer — Setup

The app is a Vite SPA backed by Supabase (Postgres + Auth). Follow these steps once to wire your Supabase project to the app.

## 1. Create the Supabase project

1. Go to https://supabase.com → **New project**.
2. Pick an organisation, name (e.g. `templatizer`), database password, and a region close to your users.
3. Wait ~1 min for provisioning.

## 2. Run the SQL schema

1. In the Supabase dashboard → **SQL Editor** → **New query**.
2. Paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
3. The script is idempotent — safe to re-run on either a fresh or existing database. If you've run an earlier version, re-running this file will add the new lock columns and replace the RLS policies with the shared-workspace ones.

This creates:
- `profiles` (extends `auth.users`)
- `projects` (snapshot stored as JSONB, plus `locked_by` / `locked_at` for the edit lock)
- A trigger that auto-creates a profile row when a user signs up
- **Shared-workspace RLS policies** — every authenticated admin can see and edit every project
- Three RPC functions for the soft edit-lock: `try_lock_project`, `heartbeat_project`, `release_project_lock`

## 3. Configure Magic Link auth

1. Dashboard → **Authentication** → **Providers** → make sure **Email** is enabled.
2. Under **Email** → **Magic Link** is enabled by default.
3. Dashboard → **Authentication** → **URL Configuration** → add to **Redirect URLs**:
   - `http://localhost:5173` (Vite default — adjust if your dev server runs on another port)
   - Your eventual OVH/production URL once you have it
4. *(Optional)* Customise the email template under **Authentication → Email Templates → Magic Link**.

## 4. Wire the env vars

1. In the Supabase dashboard → **Project Settings** → **API**.
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon / public key** → `VITE_SUPABASE_ANON_KEY`
3. In the repo, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Paste both values into `.env.local`. **Do not commit it** — `.env*` is gitignored.

## 5. Run the app

```bash
npm install
npm run dev
```

Open the dev URL, enter your e-mail on the login screen, click the link Supabase sends you, and you're in.

## 6. Adding more admins

For now, anyone with the magic link to `your-app.com` can sign up by entering their email. To restrict signups:

- Dashboard → **Authentication** → **Sign-Ups** → enable **"Allow new users to sign up"** OFF.
- Then create users manually: **Authentication → Users → Add user**, enter their email, the auto-trigger creates a `profiles` row.

You can also keep self-signup ON and instead manage access via a Lecko-only email domain check (would need a custom RLS rule) — let me know if you want that wired up.

## 7. Switching from Magic Link to Microsoft OAuth (later)

Once Lecko's IT registers an Azure AD app:

1. Dashboard → **Authentication → Providers → Azure (Microsoft)** → toggle ON.
2. Paste the **Client ID** and **Client Secret** from the Azure portal.
3. Set **Tenant URL** if single-tenant.
4. In `LoginScreen.tsx`, swap `signInWithOtp` for `signInWithOAuth({ provider: 'azure' })`.

That's a 10-minute change once the Azure registration exists.

## Edit lock behaviour

- When an admin opens a project, the app calls `try_lock_project` to atomically claim the lock.
- While the project is open, a heartbeat refreshes `locked_at` every **30 s**.
- Closing the project (Back button, sign-out) releases the lock.
- If a tab dies without releasing (browser crash, network drop), the lock auto-expires after **3 min** without a heartbeat — another admin can then take over.
- Other admins see a 🔒 badge on the project card with the holder's email and a relative timestamp; the **Open** and **Suppr.** buttons are disabled.
- The admin list refetches automatically when the window regains focus.

## Where things live

- `src/lib/supabase.ts` — client singleton (returns `null` if env vars are missing, so the app still boots locally without crashing)
- `src/lib/database.types.ts` — TypeScript types matching the schema
- `src/auth/` — login screen, session hook
- `src/store/projectsRegistry.ts` — fetches/inserts/updates projects via Supabase + lock RPCs
- `src/store/projectStore.ts` — local working state for the active project (unchanged)
- `src/App.tsx` — auth gate, session bar, fetches projects on login, debounced auto-save (1.2 s), 30 s lock heartbeat, focus refetch

## Migration note

Old projects stored in `localStorage` under `templatizer_registry` are no longer used. They'll stay there harmlessly until the browser cache is cleared. Re-create them in the new flow.
