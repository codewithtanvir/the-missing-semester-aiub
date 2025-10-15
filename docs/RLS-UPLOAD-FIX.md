# File Upload RLS Error - Troubleshooting Guide

## Error Message
```
Error: new row violates row-level security policy
```

## Root Cause

The RLS (Row Level Security) policy on the `files` table requires **authenticated users** to insert files, but the authentication context might not be properly set.

---

## Solutions

### **Solution 1: Verify User Authentication**

Make sure you're logged in as an admin user:

1. **Check if logged in:**
   - Go to `/admin/dashboard`
   - If redirected to login, you need to sign in first

2. **Sign in as admin:**
   - Go to your login page
   - Use admin credentials
   - Return to `/admin/dashboard/files`

### **Solution 2: Check RLS Policies in Supabase**

The `files` table should have this INSERT policy:

```sql
CREATE POLICY "Authenticated users can insert files"
    ON files FOR INSERT
    TO authenticated
    WITH CHECK (true);
```

**Verify in Supabase Dashboard:**

1. Go to **Supabase Dashboard** → **Authentication** → **Policies**
2. Find the `files` table
3. Check if the INSERT policy exists
4. Policy should allow `authenticated` role

### **Solution 3: Apply the Migration SQL**

If policies are missing, run the migration:

1. Open **Supabase Dashboard** → **SQL Editor**
2. Copy content from `supabase-migration.sql`
3. Paste and click **"Run"**
4. Verify policies are created

### **Solution 4: Check Authentication Session**

The code checks authentication before upload:

```typescript
const { data: { user } } = await supabase.auth.getUser();
if (!user) throw new Error('Not authenticated');
```

**Debug steps:**

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try uploading a file
4. Check for authentication errors

### **Solution 5: Verify Storage Bucket Policies**

The `course-files` storage bucket also needs proper policies:

**In Supabase Dashboard:**

1. Go to **Storage** → **Policies** (for course-files bucket)
2. Should have policy allowing authenticated users to upload

**Create policy if missing:**

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'course-files');

-- Allow public to read files
CREATE POLICY "Public can read files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'course-files');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'course-files');
```

---

## Quick Fix: Temporarily Disable RLS (NOT RECOMMENDED FOR PRODUCTION)

**⚠️ WARNING: Only for testing! Re-enable RLS for production!**

```sql
-- TEMPORARY: Disable RLS on files table
ALTER TABLE files DISABLE ROW LEVEL SECURITY;

-- Test upload

-- IMPORTANT: Re-enable RLS after testing
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
```

---

## Proper Fix: Ensure All Policies Are Applied

### **Step 1: Run the Complete Migration**

```sql
-- Copy and run the entire supabase-migration.sql file
-- This creates all necessary policies
```

### **Step 2: Verify Policies Exist**

```sql
-- Check files table policies
SELECT 
    policyname,
    cmd as operation,
    roles
FROM pg_policies 
WHERE tablename = 'files';
```

**Expected output:**
```
policyname                              | operation | roles
----------------------------------------|-----------|----------------
Anyone can view files                   | SELECT    | {public}
Authenticated users can insert files    | INSERT    | {authenticated}
Authenticated users can update files    | UPDATE    | {authenticated}
Authenticated users can delete files    | DELETE    | {authenticated}
```

### **Step 3: Test Authentication**

```sql
-- Check current user
SELECT auth.uid();
-- Should return a UUID if authenticated
-- Should return NULL if not authenticated
```

---

## Common Issues & Fixes

### **Issue 1: Not Logged In**

**Symptoms:**
- Redirect to login page
- "Not authenticated" error

**Fix:**
- Log in as admin user
- Check session is active

### **Issue 2: Wrong User Role**

**Symptoms:**
- Logged in but still getting RLS error
- Policy requires specific role

**Fix:**
```sql
-- Check user's role
SELECT role FROM auth.users WHERE id = auth.uid();

-- If role is wrong, update it
UPDATE auth.users 
SET role = 'authenticated' 
WHERE id = auth.uid();
```

### **Issue 3: Session Expired**

**Symptoms:**
- Was logged in before
- Now getting RLS errors

**Fix:**
- Log out and log back in
- Clear browser cookies
- Check token expiration

### **Issue 4: Missing INSERT Policy**

**Symptoms:**
- Other operations work
- Only INSERT fails

**Fix:**
```sql
-- Create the INSERT policy
CREATE POLICY "Authenticated users can insert files"
    ON files FOR INSERT
    TO authenticated
    WITH CHECK (true);
```

### **Issue 5: Storage Bucket Not Created**

**Symptoms:**
- "Bucket not found" error
- File upload fails before DB insert

**Fix:**
1. Go to **Supabase Dashboard** → **Storage**
2. Create bucket named `course-files`
3. Set it to **Private** (not Public)
4. Add storage policies (see Solution 5 above)

---

## Testing After Fix

### **Test 1: Authentication Check**

```typescript
// In browser console
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);
// Should show user object with id, email, etc.
```

### **Test 2: Manual Insert Test**

```sql
-- In Supabase SQL Editor
INSERT INTO files (
    course_id, 
    category, 
    title, 
    file_path, 
    file_type, 
    file_size, 
    uploader_id
) VALUES (
    (SELECT id FROM courses LIMIT 1),
    'Midterm',
    'Test File',
    'test/path.pdf',
    'application/pdf',
    1024,
    auth.uid()
);
-- Should succeed if authenticated
```

### **Test 3: Upload from Admin Dashboard**

1. Go to `/admin/dashboard/files`
2. Click "Upload File"
3. Fill form and submit
4. Should succeed without RLS error

---

## Code Changes Made

### **Updated Insert Statement**

**Before:**
```typescript
.insert({
  course_id: uploadCourse,
  // ...
});
```

**After:**
```typescript
.insert([{
  course_id: uploadCourse,
  // ...
}]);
```

**Why?** Wrapping in array helps TypeScript inference and is more explicit.

### **Added Error Logging**

```typescript
if (dbError) {
  console.error('Database insert error:', dbError);
  throw dbError;
}
```

**Why?** Provides better debugging information.

---

## Prevention Checklist

Before deploying:

- [ ] All RLS policies applied (run `supabase-migration.sql`)
- [ ] Storage bucket `course-files` created
- [ ] Storage policies configured
- [ ] Admin users can authenticate
- [ ] Test file upload works
- [ ] Test file delete works
- [ ] Check RLS doesn't block legitimate operations

---

## Summary

**Most Common Cause:** Missing RLS INSERT policy on `files` table

**Quick Solution:**
1. Run `supabase-migration.sql` in Supabase SQL Editor
2. Ensure you're logged in as admin
3. Try uploading again

**If Still Failing:**
- Check browser console for detailed errors
- Verify authentication session is active
- Check all policies exist in Supabase Dashboard
- Verify storage bucket and its policies

---

## Need Help?

**Check these in order:**

1. ✅ Logged in as admin?
2. ✅ RLS policies exist? (run migration)
3. ✅ Storage bucket created?
4. ✅ Storage policies configured?
5. ✅ Browser console shows errors?

If all checked and still failing, check Supabase logs in Dashboard → Logs.
