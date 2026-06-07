/* ============================================================
   TAMMIA ONLINE - Supabase Configuration
   ============================================================
   Project: ddfgarqzpanskgaojmkg
   Dashboard: https://app.supabase.com/project/ddfgarqzpanskgaojmkg
   ============================================================ */

window.TAMMIA_SUPABASE_URL = 'https://ddfgarqzpanskgaojmkg.supabase.co';
window.TAMMIA_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZmdhcnF6cGFuc2tnYW9qbWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NzQyMzIsImV4cCI6MjA5NjM1MDIzMn0.XB8hz3bvUXSuF27gk9iqxgTbm_PYHUpWKqNfXO3gLV4';

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
