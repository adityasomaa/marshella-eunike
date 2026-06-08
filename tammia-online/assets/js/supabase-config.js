/* ============================================================
   TAMMIA ONLINE - Supabase Configuration
   ============================================================
   Project: oootnvqwtndgesohhpzh
   Dashboard: https://app.supabase.com/project/oootnvqwtndgesohhpzh
   ============================================================ */

window.TAMMIA_SUPABASE_URL = 'https://oootnvqwtndgesohhpzh.supabase.co';
window.TAMMIA_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vb3RudnF3dG5kZ2Vzb2hocHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NjE0MTcsImV4cCI6MjA5NDEzNzQxN30.400Cb--r_AhK8hQarIMfJhu1_PSN4HlzfBftOVLN84o';

/* Real auth is ON. Make sure Google OAuth provider is enabled in
   Supabase dashboard: Authentication -> Providers -> Google.
   See SUPABASE-SETUP.md for step-by-step setup. */
window.TAMMIA_USE_REAL_AUTH = true;

/* ============================================================
   SECURITY NOTE
   ============================================================
   - anon_public key above is PUBLIC and safe to expose in client
     code. Supabase Row Level Security (RLS) policies protect data.
   - NEVER paste the service_role key anywhere client-side. It
     bypasses RLS and gives full DB access. Use it only on server
     (Edge Functions, backend API, scripts).
   ============================================================ */

/* ---------- One-time cleanup of stale sessions from prior project ---------- */
/* Old project ref ddfgarqzpanskgaojmkg was decommissioned. If a returning
   user still has its session token in localStorage, wipe it to prevent
   any confusion. Safe to keep — does nothing once cleared. */
(function migrationCleanup() {
  try {
    const OLD_KEYS = ['sb-ddfgarqzpanskgaojmkg-auth-token'];
    OLD_KEYS.forEach(k => {
      if (localStorage.getItem(k)) {
        localStorage.removeItem(k);
        // Also clear the legacy app-level user shim if it was synced from old
        localStorage.removeItem('tammia_user');
      }
    });
  } catch (e) { /* localStorage blocked, ignore */ }
})();

/* ---------- Auto-init Supabase client when real auth is on ---------- */
(function initSupabase() {
  if (!window.TAMMIA_USE_REAL_AUTH) return;
  if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
    // SDK not loaded yet — main.js will warn the user.
    return;
  }
  try {
    window.tammiaSupabase = window.supabase.createClient(
      window.TAMMIA_SUPABASE_URL,
      window.TAMMIA_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        }
      }
    );
  } catch (e) {
    console.warn('Tammia Supabase init failed:', e);
  }
})();
