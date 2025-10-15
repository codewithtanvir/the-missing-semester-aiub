# Admin Role Setup - Quick Reference

## Current Admin Users ✅

| Email | Role | Admin Status | Notes |
|-------|------|--------------|-------|
| `tanvir@admin.com` | `admin` | ✅ Active | Email domain + role metadata |

## How Admin Access Works

Your application grants admin access through **TWO methods** (either one works):

### Method 1: Email Domain (Automatic) ⚡
- Any email ending with `@admin.com` gets admin access
- Examples: `admin@admin.com`, `manager@admin.com`, `tanvir@admin.com`
- No database changes needed
- Instant admin access on login

### Method 2: Role Metadata (Manual) 🔧
- Set `role: "admin"` in user's `raw_user_meta_data`
- Works with any email address
- Requires SQL update
- User must log out/in after change

## Quick Admin Setup

### Add New Admin User

**Option A: Create with @admin.com email**
```
Email: newadmin@admin.com
Password: YourSecurePassword123!
```
✅ Instant admin access!

**Option B: Promote Existing User**
```sql
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'user@example.com';
```
⚠️ User must log out and back in!

### Verify Admin Access

```sql
SELECT 
  email,
  raw_user_meta_data->>'role' as role,
  CASE 
    WHEN email LIKE '%@admin.com' THEN 'Admin'
    WHEN raw_user_meta_data->>'role' = 'admin' THEN 'Admin'
    ELSE 'User'
  END as status
FROM auth.users
WHERE email = 'YOUR_EMAIL_HERE';
```

## Admin Capabilities

Once logged in as admin, you have access to:

| Feature | URL | Description |
|---------|-----|-------------|
| **Dashboard** | `/admin/dashboard` | Overview & stats |
| **Broadcast** | `/admin/dashboard/broadcast` | Create announcement messages |
| **Files** | `/admin/dashboard/files` | Upload/manage course files |
| **Courses** | `/admin/dashboard/courses` | Manage courses |
| **Analytics** | `/admin/dashboard/analytics` | View statistics |
| **Settings** | `/admin/dashboard/settings` | System settings |

## Testing Admin Access

### Step 1: Check Current Status
Run this SQL:
```sql
SELECT email, raw_user_meta_data->>'role' 
FROM auth.users 
WHERE email = 'tanvir@admin.com';
```

Expected result: `{"role": "admin"}`

### Step 2: Login as Admin
1. Go to `/admin`
2. Use credentials:
   - Email: `tanvir@admin.com`
   - Password: (your admin password)
3. Should redirect to `/admin/dashboard`

### Step 3: Test Broadcast Feature
1. Navigate to `/admin/dashboard/broadcast`
2. Create a test message
3. Should succeed ✅

## Troubleshooting

### "Failed to create broadcast message"
**Cause**: Session not updated after role change

**Fix**:
1. Log out completely
2. Clear browser cache (Ctrl + Shift + Delete)
3. Log back in
4. Try again

### "Access Denied" on Admin Pages
**Cause**: User is not an admin

**Fix**:
1. Verify email ends with `@admin.com` OR
2. Run SQL to check role:
   ```sql
   SELECT email, raw_user_meta_data->>'role' as role
   FROM auth.users WHERE email = 'YOUR_EMAIL';
   ```
3. If role is missing, add it using setup script

### Admin Menu Not Showing
**Cause**: Middleware not recognizing admin status

**Fix**:
1. Ensure logged in with admin account
2. Check browser console for errors
3. Verify middleware.ts has admin checks

## Security Notes

⚠️ **Important Security Considerations**:

1. **Never share admin credentials**
2. **Use strong passwords** for @admin.com accounts
3. **Limit admin users** to trusted individuals only
4. **Monitor admin activity** through `admin_activity` table
5. **Regular audits** of who has admin access

## Admin Account Best Practices

✅ **DO**:
- Use unique strong passwords
- Enable 2FA when available
- Regularly review admin activity logs
- Remove admin role when no longer needed
- Use @admin.com emails for clarity

❌ **DON'T**:
- Share admin credentials
- Use simple passwords
- Leave inactive admins with access
- Grant admin to untrusted users
- Use admin account for regular browsing

## Database Schema Reference

Admin role is stored in `auth.users` table:

```json
{
  "email": "tanvir@admin.com",
  "raw_user_meta_data": {
    "role": "admin",
    "email_verified": true
  }
}
```

## RLS Policy Reference

Admin access is enforced through these policies:

```sql
-- Example: Broadcast messages INSERT policy
CREATE POLICY "Admins can insert broadcast messages"
  ON public.broadcast_messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND (
        raw_user_meta_data->>'role' = 'admin'
        OR email LIKE '%@admin.com'
      )
    )
  );
```

## Quick Commands Cheat Sheet

```sql
-- List all admins
SELECT email FROM auth.users 
WHERE raw_user_meta_data->>'role' = 'admin' 
OR email LIKE '%@admin.com';

-- Add admin role
UPDATE auth.users SET raw_user_meta_data = 
raw_user_meta_data || '{"role": "admin"}'::jsonb 
WHERE email = 'user@example.com';

-- Remove admin role
UPDATE auth.users SET raw_user_meta_data = 
raw_user_meta_data - 'role' 
WHERE email = 'user@example.com';

-- Check specific user
SELECT email, raw_user_meta_data->>'role' 
FROM auth.users WHERE email = 'user@example.com';
```

## Support

For more detailed SQL commands, see:
- `docs/admin-role-setup.sql` - Complete SQL script
- `docs/BROADCAST-TROUBLESHOOTING.md` - Broadcast feature issues

---

**Status**: ✅ Admin role system is fully functional  
**Last Updated**: October 15, 2025  
**Current Admins**: 1 (tanvir@admin.com)
