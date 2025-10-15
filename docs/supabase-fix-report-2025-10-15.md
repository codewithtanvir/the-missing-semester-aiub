Supabase fixes performed — 2025-10-15

Summary
-------
Applied safe migrations to fix RLS and function issues in the project's Supabase database.

Project URL
-----------
https://zkjoqhkwdvotsavwqwkt.supabase.co

Migrations applied (this session)
--------------------------------
- fix_rls_and_functions_v3
- fix_functions_set_search_path

What I changed
---------------
- Rewrote trigger functions to set a stable search_path (used SQL-level SET where supported).
- Ensured logging function `log_admin_activity` is SECURITY DEFINER and uses an explicit search_path.
- Recreated triggers to reference the public schema explicitly.
- Tightened RLS policies:
  - `admin_activity`: SELECT allowed only to row owner (admin_id = auth.uid()) or role 'admin'. INSERT requires admin role or matching auth.uid().
  - `downloads`: SELECT allowed only to uploader (user_id) or admins. INSERT remains allowed for tracking (WITH CHECK true).
- Fixed incorrect INSERT policy syntax that caused `ERROR: 42601` by using `WITH CHECK` only for INSERT policies.

Verification
------------
- Ran Supabase security advisors. Remaining warning(s):
  - auth_leaked_password_protection: Leaked password protection is disabled (recommend enabling HaveIBeenPwned check).
- Confirmed RLS policies on `public` schema reflect the tightened policies (SELECT/INSERT/UPDATE/DELETE clauses follow correct syntax).

Next recommended steps
----------------------
1. Enable leaked-password protection in Supabase Auth (recommendation only).
2. Review `admin` role assignment and ensure admin users exist before relying on role checks.
3. Run application-level integration tests that exercise uploads/downloads and admin actions.
4. Add CI step to run `supabase` linter/advisors periodically.

Files & docs updated locally
---------------------------
- Updated `RLS-POLICY-FIX.md` (manual notes) — see file in repo for guidance and verification queries.
- Added this report file: `supabase-fix-report-2025-10-15.md`.

If you want, I can:
- Enable the leaked-password protection (requires Supabase project settings changes that I can prepare guidance for),
- Create a migration to add an `is_admin` boolean on `users` or maintain an `admins` table if your app uses role mapping, or
- Run a small local TypeScript check to ensure no Supabase client code assumptions broke.

Done by automated assistant.