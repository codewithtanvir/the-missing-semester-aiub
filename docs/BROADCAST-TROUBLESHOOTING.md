# Broadcast Message Feature - Troubleshooting & Setup

## Quick Fix for "Failed to create broadcast message" Error

### Solution 1: Log Out and Log Back In (Recommended)
If you just set up the feature, you need to refresh your session:

1. **Log out** from the admin dashboard
2. **Log back in** with your admin credentials
3. Try creating a broadcast message again

### Solution 2: Verify Admin Access

The broadcast feature requires admin permissions. Your account needs one of these:

✅ **Option A**: Email ending with `@admin.com`
- Example: `tanvir@admin.com` ✅
- Example: `admin@admin.com` ✅

✅ **Option B**: Admin role in user metadata
- User metadata must have `"role": "admin"`

### How to Check/Fix Admin Access

#### Check Current User Status
Run this SQL in Supabase SQL Editor:

```sql
-- Check if you have admin access
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'role' as role,
  CASE 
    WHEN email LIKE '%@admin.com' THEN 'Yes (via email)'
    WHEN raw_user_meta_data->>'role' = 'admin' THEN 'Yes (via role)'
    ELSE 'No - Need to fix this!'
  END as has_admin_access
FROM auth.users
WHERE email = 'YOUR_EMAIL_HERE';
```

#### Give Admin Access to a User

**Method 1: Set admin role in metadata**
```sql
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'your-email@example.com';
```

**Method 2: Change email to admin domain**
```sql
UPDATE auth.users 
SET email = 'yourusername@admin.com'
WHERE email = 'your-old-email@example.com';
```

⚠️ **Important**: After updating, you MUST log out and log back in!

## Common Issues

### Issue 1: "Failed to create broadcast message"

**Cause**: No admin permissions or stale session

**Fix**:
1. Verify admin access (see above)
2. Log out and log back in
3. Clear browser cache if needed

### Issue 2: Message created but not showing on courses page

**Cause**: Message might be set to inactive

**Fix**:
1. Go to Admin Dashboard → Broadcast
2. Check if message shows with "Inactive" badge
3. Click "Activate" button

### Issue 3: TypeScript errors in IDE

**Cause**: Supabase types not regenerated after adding new table

**Fix**: These are safe to ignore, the feature works fine. Or:
```bash
# Regenerate types (optional)
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

## Testing the Feature

### Step 1: Create Your First Broadcast
1. Navigate to `/admin/dashboard/broadcast`
2. Enter message: "Welcome! This is a test broadcast 🎉"
3. Select type: "Info"
4. Click "Create Broadcast"

### Step 2: View on Courses Page
1. Open `/courses` in a new tab
2. You should see the floating message at the top
3. Click the X to dismiss it

### Step 3: Manage Messages
Back in admin dashboard:
- Click "Deactivate" to hide the message
- Click "Activate" to show it again
- Click trash icon to delete permanently

## RLS Policies Explained

The feature uses these Row Level Security policies:

```sql
-- Anyone can VIEW active messages
SELECT: is_active = true

-- Only admins can CREATE messages
INSERT: user has role='admin' OR email LIKE '%@admin.com'

-- Only admins can UPDATE messages
UPDATE: user has role='admin' OR email LIKE '%@admin.com'

-- Only admins can DELETE messages
DELETE: user has role='admin' OR email LIKE '%@admin.com'
```

## Developer Notes

### Database Structure
```sql
Table: broadcast_messages
- id: UUID (Primary Key)
- message: TEXT (Required)
- type: VARCHAR ('info'|'warning'|'success'|'error')
- is_active: BOOLEAN
- created_by: UUID (Foreign Key to auth.users)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### Real-time Updates
The component subscribes to Postgres changes:
```typescript
supabase
  .channel('broadcast_messages')
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'broadcast_messages' 
  })
  .subscribe()
```

## Quick Reference

| Task | Location | Action |
|------|----------|--------|
| Create message | `/admin/dashboard/broadcast` | Fill form, click Create |
| View message | `/courses` | Auto-shows if active |
| Toggle active | Admin Broadcast page | Click eye icon |
| Delete message | Admin Broadcast page | Click trash icon |
| Check admin status | Supabase SQL | Run SQL query above |

## Need Help?

If you still see the error:
1. ✅ Verified you're logged in as admin
2. ✅ Logged out and back in
3. ✅ Checked browser console for specific error
4. ✅ Confirmed broadcast_messages table exists

Then check the browser console (F12) for detailed error messages and share them for debugging.

## Success Checklist

- [ ] Admin user has email ending in `@admin.com` OR role set to 'admin'
- [ ] Logged out and logged back in after setting role
- [ ] Can access `/admin/dashboard/broadcast` page
- [ ] No errors in browser console when creating message
- [ ] Message appears in list after creation
- [ ] Message shows on `/courses` page when active
- [ ] Can toggle active/inactive status
- [ ] Can delete messages

---

**Last Updated**: October 15, 2025  
**Feature Status**: ✅ Fully Functional
