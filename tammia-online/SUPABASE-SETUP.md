# Tammia Online — Supabase Setup Guide

Real authentication is **ENABLED**. Project ref: `ddfgarqzpanskgaojmkg`.

This guide walks through the remaining one-time setup so Google OAuth
and password-reset emails actually work end-to-end.

---

## 1. Enable Google OAuth provider

1. Go to <https://app.supabase.com/project/ddfgarqzpanskgaojmkg>.
2. **Authentication → Providers → Google** → toggle **on**.
3. In a new tab, go to <https://console.cloud.google.com>.
   - Create (or pick) a project.
   - Open **APIs & Services → OAuth consent screen**, choose
     **External**, fill in app name (`Tammia Online`), support
     email, etc. Add the production domain under **Authorized
     domains**: `marshella-eunike.vercel.app`.
   - Open **APIs & Services → Credentials**, click **Create
     Credentials → OAuth client ID → Web application**.
   - **Authorized JavaScript origins**:
     - `https://marshella-eunike.vercel.app`
     - `http://localhost:5500` *(optional, for local testing)*
   - **Authorized redirect URIs**:
     - `https://ddfgarqzpanskgaojmkg.supabase.co/auth/v1/callback`
   - Click **Create**. Copy the **Client ID** and **Client Secret**.
4. Back in Supabase, paste them into the Google provider screen →
   **Save**.

---

## 2. Configure Site URL + redirect URLs in Supabase

In **Authentication → URL Configuration**:

- **Site URL**: `https://marshella-eunike.vercel.app/tammia-online/`
- **Redirect URLs** (add each on its own line):
  - `https://marshella-eunike.vercel.app/tammia-online/`
  - `https://marshella-eunike.vercel.app/tammia-online/index.html`
  - `http://localhost:5500/tammia-online/` *(optional, local dev)*

Save.

---

## 3. (Optional) Enable email confirmations

By default Supabase requires users to verify their email before they
can log in. For a demo site you may want to disable this:

**Authentication → Providers → Email** → toggle off
**Confirm email**.

For production, keep it ON so users prove they own the email.

---

## 4. (Optional) Newsletter subscribers table

If you want newsletter subscriptions to land in Supabase rather than
only `localStorage`:

In **SQL Editor → New query**, paste and run:

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

The newsletter form will insert into this table best-effort.

---

## 5. (Optional) Orders table

Same pattern, for storing real customer orders:

```sql
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  order_no text unique,
  status text default 'diproses',
  items jsonb,
  subtotal numeric,
  shipping numeric default 0,
  discount numeric default 0,
  total numeric,
  shipping_address jsonb,
  created_at timestamp with time zone default now()
);

alter table public.orders enable row level security;

create policy "users can read their own orders"
on public.orders for select
to authenticated
using (auth.uid() = user_id);

create policy "users can create their own orders"
on public.orders for insert
to authenticated
with check (auth.uid() = user_id);
```

---

## Security

The repo contains the **anon public** key. That's safe — it's bound by
Row Level Security policies (set up above for sensitive tables).

The **service_role** key was sent in chat for reference but must
**never** be committed or pasted into client-side code. It bypasses
RLS and gives full DB access. Use it only in:

- Supabase Edge Functions
- Server-side scripts (Node, Python, etc)
- `.env` files that are git-ignored

If the service_role key is ever exposed publicly, rotate it
immediately in **Settings → API → Reset service_role key**.

---

## Troubleshooting

- **OAuth redirect lands on `localhost`** — Site URL in Supabase is
  wrong. Update under **Authentication → URL Configuration**.
- **`Invalid login credentials`** on email/password — confirm the
  user was created (check **Authentication → Users**) and that
  email confirmation isn't blocking them.
- **Password reset email never arrives** — check spam, then confirm
  the SMTP settings under **Authentication → Email Templates**.
  Supabase provides a default sender for low volume; for production
  hook up your own SMTP (SendGrid, Resend, Mailgun, etc).
