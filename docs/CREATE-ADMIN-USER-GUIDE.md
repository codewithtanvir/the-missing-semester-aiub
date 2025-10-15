# How to Create Admin Users - Quick Guide

## ✅ EASIEST METHOD: Supabase Dashboard

### Step-by-Step Instructions:

1. **Open Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Navigate to Authentication**
   ```
   Left Sidebar → Authentication → Users
   ```

3. **Click "Add user"**
   - Top right corner → **"Add user"** button
   - Select **"Create new user"**

4. **Fill in User Details**
   ```
   Email: newadmin@admin.com
   Password: YourSecurePassword123!
   
   ✅ Check "Auto confirm user"
   ```
   
   **Important**: Use **@admin.com** email domain for automatic admin role!

5. **Click "Create user"**
   - User is created
   - **Automatically gets `role = 'admin'`** ✨
   - No SQL needed!

6. **Verify Admin Access**
   - User can now login at `/admin`
   - Access admin dashboard immediately

---

## 🔧 ALTERNATIVE: SQL Method (For Existing Users)

If you want to promote an **existing user** to admin:

### Via SQL Editor:

```sql
-- Promote existing user to admin
UPDATE public.user_profiles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'user@example.com'
);
```

Then the user must **log out and log back in**.

---

## 📋 Verification Checklist

After creating admin user, verify:

- [ ] User can login at `/admin`
- [ ] User sees admin dashboard at `/admin/dashboard`
- [ ] User can access Broadcast page
- [ ] User can create broadcast messages
- [ ] User shows as admin in database:

```sql
SELECT u.email, up.role 
FROM auth.users u
JOIN public.user_profiles up ON u.id = up.user_id
WHERE u.email = 'newadmin@admin.com';
```

Expected result: `role = 'admin'`

---

## 🎯 Quick Reference

| Task | Method | Time |
|------|--------|------|
| **Create new admin** | Supabase Dashboard with @admin.com | 30 seconds ⚡ |
| **Promote existing user** | SQL update command | 1 minute |
| **Verify admin status** | SQL query | 10 seconds |

---

## 🔒 Security Tips

✅ **DO**:
- Use `@admin.com` email domain for admins
- Use strong passwords (12+ characters)
- Auto-confirm users in Supabase Dashboard
- Verify admin access after creation

❌ **DON'T**:
- Share admin credentials
- Use weak passwords
- Leave test admin accounts active
- Grant admin to untrusted users

---

## 🎬 Example Admin Creation

**Scenario**: Create admin user for "John Smith"

1. **Go to Supabase** → Authentication → Users → Add user
2. **Enter**:
   ```
   Email: john@admin.com
   Password: SecurePass2024!
   ✅ Auto confirm user
   ```
3. **Click Create**
4. **Done!** John can now:
   - Login at `/admin`
   - Access `/admin/dashboard`
   - Manage broadcasts, files, courses

**Time taken**: ~30 seconds ⚡

---

## 🐛 Troubleshooting

### "Access Denied" when accessing /admin/dashboard

**Check role:**
```sql
SELECT u.email, up.role 
FROM auth.users u
JOIN public.user_profiles up ON u.id = up.user_id  
WHERE u.email = 'YOUR_EMAIL';
```

**If role is not 'admin', fix it:**
```sql
UPDATE public.user_profiles
SET role = 'admin'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL');
```

Then **log out and log back in**.

### User created but no profile exists

**Create profile manually:**
```sql
INSERT INTO public.user_profiles (user_id, full_name, student_id, gender, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@admin.com'),
  'Admin User',
  'ADMIN-001',
  'Prefer not to say',
  'admin'
);
```

---

## 📊 Current Admin Users

**Check who has admin access:**

```sql
SELECT 
  u.email,
  up.full_name,
  up.created_at as admin_since
FROM auth.users u
JOIN public.user_profiles up ON u.id = up.user_id
WHERE up.role = 'admin'
ORDER BY up.created_at DESC;
```

**Current admins** (as of Oct 15, 2025):
- ✅ tanvir@admin.com

---

## 🎓 Summary

**To create admin user:**

1. Supabase Dashboard → Authentication → Users → Add user
2. Email: `something@admin.com`
3. Password: `YourPassword`
4. Check "Auto confirm"
5. Create
6. **Done!** ✅

**Magic**: The `@admin.com` email automatically triggers admin role assignment via database trigger!

---

**Need help?** See full documentation:
- `docs/ROLE-BASED-ACCESS-CONTROL.md` - Complete RBAC guide
- `docs/admin-role-setup.sql` - All SQL commands
