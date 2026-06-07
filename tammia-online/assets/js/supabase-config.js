/* ============================================================
   TAMMIA ONLINE - Supabase Configuration
   ============================================================
   Replace these with your actual project credentials before going
   to production. Get them from:
   https://app.supabase.com -> Your Project -> Settings -> API
   ============================================================ */

window.TAMMIA_SUPABASE_URL = 'https://YOUR-PROJECT-REF.supabase.co';
window.TAMMIA_SUPABASE_ANON_KEY = 'YOUR-ANON-PUBLIC-KEY';

/* Set this to true once you have real Supabase credentials
   configured. Until then, login falls back to localStorage demo
   mode (no real OAuth, no real password verification). */
window.TAMMIA_USE_REAL_AUTH = false;

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
