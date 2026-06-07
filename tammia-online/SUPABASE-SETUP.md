# Tammia Online — Supabase Setup Guide

By default, **Tammia Online runs in Demo Mode**: login uses fake
localStorage state so the UI works end-to-end on a static host
without any backend. To enable real authentication (Google + Facebook
OAuth, email/password, password reset), follow these steps.

---

## 1. Create a Supabase project

1. Go to <https://app.supabase.com> and sign in (or sign up — free
   tier is fine for testing).
2. Click **New project**, pick an org, give it a name (e.g.
   `tammia-online`), choose a strong DB password and the region
   nearest your customers (`Southeast Asia (Singapore)` for Indonesia).
3. Wait ~1 minute for provisioning to finish.

---

## 2. Enable Google OAuth provider

1. In your Supabase project, go to **Authentication → Providers →
   Google**.
2. Toggle it **on**.
3. In a new tab, go to <https://console.cloud.google.com>.
   - Create (or pick) a project.
   - Open **APIs & Services → OAuth consent screen**, choose
     **External**, fill in app name, support email, etc.
   - Open **APIs & Services → Credentials**, click **Create
     Credentials → OAuth client ID → Web application**.
   - Authorized JavaScript origins:
     - `https://marshella-eunike.vercel.app`
   - Authorized redirect URIs:
     - `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
   - Copy the **Client ID** and **Client Secret**.
4. Paste them into Supabase's Google provider screen → **Save**.

---

## 3. Enable Facebook OAuth provider

1. In Supabase, **Authentication → Providers → Facebook** → toggle on.
2. Go to <https://developers.facebook.com> and create a new
   **Consumer** app.
3. Add the **Facebook Login** product.
4. Under **Facebook Login → Settings**, add the redirect URI:
   - `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
5. Under **App Settings → Basic**, copy the **App ID** and
   **App Secret**.
6. Paste them into Supabase's Facebook provider screen → **Save**.

---

## 4. Set Site URL and redirect URLs in Supabase

In **Authentication → URL Configuration**:

- **Site URL**: `https://marshella-eunike.vercel.app/tammia-online/`
- **Redirect URLs** (add each on its own line):
  - `https://marshella-eunike.vercel.app/tammia-online/`
  - `https://marshella-eunike.vercel.app/tammia-online/index.html`
  - `https://marshella-eunike.vercel.app/tammia-online/auth/callback`
  - `http://localhost:5500/tammia-online/` *(if testing locally with Live Server)*

---

## 5. Copy project URL + anon key into `supabase-config.js`

1. Open **Supabase → Settings → API** and copy:
   - **Project URL** (e.g. `https://abcd1234.supabase.co`)
   - **anon public** key
2. Open `assets/js/supabase-config.js` in this repo.
3. Replace the placeholder values:
   ```js
   window.TAMMIA_SUPABASE_URL = 'https://abcd1234.supabase.co';
   window.TAMMIA_SUPABASE_ANON_KEY = 'eyJhbGciOi...';
   ```

---

## 6. Flip the feature flag

In `assets/js/supabase-config.js`, change:

```js
window.TAMMIA_USE_REAL_AUTH = false;
```

to:

```js
window.TAMMIA_USE_REAL_AUTH = true;
```

Save, push, and the demo-mode banner in the login modal will
disappear. Real Google/Facebook OAuth, real email+password sign-in,
sign-up, and password-reset emails will all flow through Supabase.

---

## 7. (Optional) Newsletter table

If you want newsletter subscriptions to land in Supabase rather than
only in localStorage:

1. **SQL Editor → New query**, paste and run:
   ```sql
   create table public.newsletter_subscribers (
     id uuid primary key default gen_random_uuid(),
     email text not null unique,
     created_at timestamp with time zone default now()
   );

   alter table public.newsletter_subscribers enable row level security;

   create policy "allow inserts from anyone"
   on public.newsletter_subscribers
   for insert
   to anon
   with check (true);
   ```
2. With `TAMMIA_USE_REAL_AUTH = true`, the newsletter form will also
   insert into this table (best-effort — failure does not break the
   user-facing success card).

---

## Troubleshooting

- **"Demo Mode" banner still shows** — make sure the script tag for
  `assets/js/supabase-config.js` loads BEFORE `assets/js/main.js`,
  and that the Supabase SDK tag loads before both.
- **OAuth redirect lands on `localhost`** — your Site URL in
  Supabase is wrong. Update it under **Authentication → URL
  Configuration**.
- **`Invalid login credentials`** on email/password — confirm the
  user was actually created (Supabase auto-disables sign-ups unless
  you turn it on under **Authentication → Providers → Email**).
- **Password reset email never arrives** — check your spam folder,
  and confirm the SMTP settings under **Authentication → Email
  Templates** (Supabase provides a default sender for low volume).
