# Fix Admin Upload Error - Step by Step Guide

## Problem
Admins get this error when uploading files:
```
Error: new row violates row-level security policy for table "objects"
```

## Root Cause
The `course-files` storage bucket has no RLS policies on the `storage.objects` table, blocking all uploads.

## Solution: Add Storage Policies via Dashboard UI

### Step 1: Go to Storage Policies
1. Open your Supabase Dashboard: https://zkjoqhkwdvotsavwqwkt.supabase.co
2. Navigate to **Storage** → **Policies** (left sidebar)
3. You should see your `course-files` bucket listed

### Step 2: Add INSERT Policy (Upload)
1. Click **"New Policy"** button
2. Choose **"For full customization"** or select **"Allow INSERT for authenticated users only"** template
3. Fill in:
   - **Policy name**: `Authenticated users can upload`
   - **Allowed operation**: Check **INSERT**
   - **Target roles**: Select **authenticated**
   - **WITH CHECK expression**:
     ```sql
     bucket_id = 'course-files'
     ```
4. Click **"Review"** then **"Save policy"**

### Step 3: Add SELECT Policy (Download)
1. Click **"New Policy"** again
2. Fill in:
   - **Policy name**: `Anyone can view files`
   - **Allowed operation**: Check **SELECT**
   - **Target roles**: Select **public**
   - **USING expression**:
     ```sql
     bucket_id = 'course-files'
     ```
3. Click **"Review"** then **"Save policy"**

### Step 4: Add UPDATE Policy (Optional)
1. Click **"New Policy"** again
2. Fill in:
   - **Policy name**: `Authenticated users can update`
   - **Allowed operation**: Check **UPDATE**
   - **Target roles**: Select **authenticated**
   - **USING expression**:
     ```sql
     bucket_id = 'course-files'
     ```
   - **WITH CHECK expression**:
     ```sql
     bucket_id = 'course-files'
     ```
3. Click **"Review"** then **"Save policy"**

### Step 5: Add DELETE Policy (Optional)
1. Click **"New Policy"** again
2. Fill in:
   - **Policy name**: `Authenticated users can delete`
   - **Allowed operation**: Check **DELETE**
   - **Target roles**: Select **authenticated**
   - **USING expression**:
     ```sql
     bucket_id = 'course-files'
     ```
3. Click **"Review"** then **"Save policy"**

## Alternative: Use Policy Templates (Faster)

Supabase provides quick templates:

1. Click **"New Policy"**
2. Select **"Get started quickly"**
3. Choose appropriate templates:
   - ✅ **"Allow INSERT for authenticated users only"**
   - ✅ **"Allow SELECT for all users"**
   - ✅ **"Allow UPDATE for authenticated users only"**
   - ✅ **"Allow DELETE for authenticated users only"**
4. For each template, replace `BUCKET_NAME` with `course-files`

## Verify the Fix

After adding the policies:

1. Go to **Storage** → **Policies**
2. You should see 4 policies listed for `course-files`:
   - ✅ Authenticated users can upload (INSERT)
   - ✅ Anyone can view files (SELECT)
   - ✅ Authenticated users can update (UPDATE)
   - ✅ Authenticated users can delete (DELETE)

## Test the Fix

1. Log into your app as an admin
2. Navigate to **Admin Dashboard** → **Files**
3. Try uploading a file
4. The upload should now work without errors! 🎉

## If Still Having Issues

Check the following:

1. **User is authenticated**:
   - Open browser DevTools → Console
   - Run: `await supabase.auth.getUser()`
   - Should return a user object with an `id`

2. **Session is valid**:
   - Run: `await supabase.auth.getSession()`
   - Should return a valid session

3. **Bucket name is correct**:
   - In `src/app/admin/dashboard/files/page.tsx` line 135
   - Should be: `.from('course-files')`

4. **Check browser console for errors**:
   - Press F12
   - Check Console and Network tabs for detailed errors

## Summary

- ✅ Added 4 RLS policies to `storage.objects` for `course-files` bucket
- ✅ Authenticated users can now upload files
- ✅ Public users can download files
- ✅ Authenticated users can update/delete files

**The admin upload error should now be fixed!** 🚀
