# Role-Based Access Control (RBAC) System

## Overview

The application now uses a **dedicated `role` column** in the `user_profiles` table for managing user permissions. This is cleaner and more reliable than using auth metadata.

## Database Schema

### user_profiles.role Column

```sql
Column: role
Type: VARCHAR(20)
Default: 'user'
Constraint: CHECK (role IN ('user', 'admin'))
Values: 'user' | 'admin'
```

## How It Works

### 1. User Registration Flow

When a new user registers:

1. User signs up via Google OAuth or creates account
2. Profile is created in `user_profiles` table
3. **Auto-role assignment trigger runs**:
   - If email ends with `@admin.com` → role = `'admin'`
   - Otherwise → role = `'user'`

### 2. Admin Creation (Supabase Dashboard)

**Step-by-step to create admin:**

1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add user** → **Create new user**
4. Enter:
   ```
   Email: newadmin@admin.com
   Password: YourSecurePassword123!
   ✅ Auto confirm user (check this)
   ```
5. Click **Create user**
6. User automatically gets `role = 'admin'` (due to @admin.com email)

### 3. Manual Role Assignment

To promote existing user to admin:

```sql
-- Promote user to admin
UPDATE public.user_profiles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'user@example.com'
);
```

To demote admin to user:

```sql
-- Demote admin to user
UPDATE public.user_profiles
SET role = 'user'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'admin@example.com'
);
```

## Permissions by Role

| Feature | User | Admin |
|---------|------|-------|
| View courses | ✅ | ✅ |
| View files | ✅ | ✅ |
| Download files | ✅ | ✅ |
| Pin courses | ✅ | ✅ |
| View profile | ✅ | ✅ |
| **Admin Dashboard** | ❌ | ✅ |
| **Upload files** | ❌ | ✅ |
| **Manage courses** | ❌ | ✅ |
| **Broadcast messages** | ❌ | ✅ |
| **View analytics** | ❌ | ✅ |
| **Manage settings** | ❌ | ✅ |

## RLS Policies Using Role

All admin-protected tables now check the `user_profiles.role` column:

### Example: Broadcast Messages

```sql
-- Only admins can create broadcasts
CREATE POLICY "Admins can insert broadcast messages"
  ON public.broadcast_messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );
```

### Example: Files Upload

```sql
-- Only admins can upload files
CREATE POLICY "Admins can insert files"
  ON public.files
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );
```

## Check User Role

### From SQL

```sql
-- Check specific user
SELECT 
  u.email,
  up.full_name,
  up.role,
  CASE 
    WHEN up.role = 'admin' THEN '🔑 Admin Access'
    ELSE '👤 Regular User'
  END as access_level
FROM auth.users u
JOIN public.user_profiles up ON u.id = up.user_id
WHERE u.email = 'user@example.com';
```

### From Application Code

```typescript
// Get user's role
const { data: profile } = await supabase
  .from('user_profiles')
  .select('role')
  .eq('user_id', user.id)
  .single();

const isAdmin = profile?.role === 'admin';
```

## Current Admins

```sql
-- List all admin users
SELECT 
  u.email,
  up.full_name,
  up.created_at as admin_since
FROM auth.users u
JOIN public.user_profiles up ON u.id = up.user_id
WHERE up.role = 'admin'
ORDER BY up.created_at DESC;
```

Current result:
- ✅ `tanvir@admin.com` - Md Tanvir Rahman (admin)

## Quick Commands

### Promote to Admin
```sql
UPDATE public.user_profiles
SET role = 'admin'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
```

### Demote to User
```sql
UPDATE public.user_profiles
SET role = 'user'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

### Bulk Promote
```sql
UPDATE public.user_profiles
SET role = 'admin'
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('admin1@admin.com', 'admin2@admin.com')
);
```

### Check Role Count
```sql
SELECT 
  role,
  COUNT(*) as count
FROM public.user_profiles
GROUP BY role;
```

## Auto-Role Assignment

The system has a trigger that automatically assigns roles:

```sql
CREATE TRIGGER set_role_on_profile_creation
  BEFORE INSERT ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_role_on_profile_creation();
```

**Logic**:
- Email ends with `@admin.com` → `role = 'admin'`
- Any other email → `role = 'user'`

## Middleware Protection

Admin routes are protected in `middleware.ts`:

```typescript
// Check if trying to access admin routes
if (pathname.startsWith('/admin/dashboard')) {
  if (!profile || profile.role !== 'admin') {
    // Not an admin, redirect to home
    return NextResponse.redirect(new URL('/', request.url))
  }
}
```

## Benefits of This Approach

✅ **Clean Architecture**: Dedicated column instead of scattered metadata  
✅ **Type Safety**: Role is defined in TypeScript types  
✅ **Easy Queries**: Simple WHERE role = 'admin' instead of JSON parsing  
✅ **Auto-Assignment**: @admin.com emails get admin automatically  
✅ **Flexible**: Can easily add more roles later (e.g., 'moderator', 'teacher')  
✅ **Performant**: Indexed column for fast lookups  
✅ **Auditable**: Clear role history in database  

## Migration from Old System

If you were using `raw_user_meta_data->>'role'`:

```sql
-- Migrate roles from metadata to user_profiles
UPDATE public.user_profiles up
SET role = 'admin'
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE raw_user_meta_data->>'role' = 'admin'
);
```

## Future Enhancements

Possible additional roles:
- `moderator` - Can manage content but not system settings
- `teacher` - Can upload files for specific courses
- `student_leader` - Can pin announcements
- `readonly_admin` - Can view admin dashboard but not modify

To add new role:

```sql
-- Update constraint
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_role_check;

ALTER TABLE public.user_profiles
ADD CONSTRAINT user_profiles_role_check 
CHECK (role IN ('user', 'admin', 'moderator', 'teacher'));
```

## Testing

### Test Admin Access
1. Create user: `test@admin.com`
2. Verify role is automatically 'admin'
3. Login and access `/admin/dashboard`
4. Should see admin panel ✅

### Test User Access
1. Create user: `test@gmail.com`
2. Verify role is 'user'
3. Try to access `/admin/dashboard`
4. Should redirect to home ❌

## Troubleshooting

### "Access Denied" on Admin Routes

**Check user's role:**
```sql
SELECT u.email, up.role 
FROM auth.users u
JOIN public.user_profiles up ON u.id = up.user_id
WHERE u.email = 'YOUR_EMAIL';
```

**If role is wrong, fix it:**
```sql
UPDATE public.user_profiles
SET role = 'admin'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL');
```

Then **log out and log back in**.

### Role Not Auto-Assigned for @admin.com

**Check if trigger exists:**
```sql
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name = 'set_role_on_profile_creation';
```

**Re-create trigger if missing:**
```sql
-- See migration script above
```

### Can't Create Broadcast Messages

**Verify RLS policies check the role column:**
```sql
SELECT policyname, cmd, with_check, qual
FROM pg_policies 
WHERE tablename = 'broadcast_messages';
```

## Security Notes

⚠️ **Important**:
1. Never expose admin credentials
2. Use strong passwords for admin accounts
3. Regularly audit admin users
4. Log all admin actions (use `admin_activity` table)
5. Consider 2FA for admin accounts

---

**Status**: ✅ Role system fully implemented  
**Last Updated**: October 15, 2025  
**Current Admins**: 1 (tanvir@admin.com)
