-- ============================================================================
-- FIX STORAGE RLS POLICIES FOR FILE UPLOADS
-- ============================================================================
-- ERROR: SQL Editor cannot modify storage.objects directly due to permissions.
-- Instead, use the Supabase Dashboard UI to add Storage Policies.
--
-- SOLUTION: Use Supabase Dashboard Storage Policies UI
-- ============================================================================

-- ============================================================================
-- STEP-BY-STEP INSTRUCTIONS TO FIX UPLOAD ISSUE:
-- ============================================================================

-- Option 1: Use Supabase Dashboard UI (RECOMMENDED - EASIEST)
-- -----------------------------------------------------------
-- 1. Go to: https://zkjoqhkwdvotsavwqwkt.supabase.co/project/_/storage/policies
-- 2. Click on "course-files" bucket
-- 3. Click "New Policy" button
-- 4. Select "Custom policy" or use templates
-- 5. Create the following 4 policies:

-- POLICY 1: Allow INSERT (Upload)
-- Name: "Authenticated users can upload"
-- Allowed operation: INSERT
-- Target roles: authenticated
-- Policy definition (WITH CHECK):
--   bucket_id = 'course-files'

-- POLICY 2: Allow SELECT (Download/View)
-- Name: "Anyone can view files"
-- Allowed operation: SELECT
-- Target roles: public
-- Policy definition (USING):
--   bucket_id = 'course-files'

-- POLICY 3: Allow UPDATE
-- Name: "Authenticated users can update"
-- Allowed operation: UPDATE
-- Target roles: authenticated
-- USING expression:
--   bucket_id = 'course-files'
-- WITH CHECK expression:
--   bucket_id = 'course-files'

-- POLICY 4: Allow DELETE
-- Name: "Authenticated users can delete"
-- Allowed operation: DELETE
-- Target roles: authenticated
-- Policy definition (USING):
--   bucket_id = 'course-files'

-- ============================================================================

-- Option 2: Use SQL with postgres role (IF YOU HAVE SERVICE KEY ACCESS)
-- ----------------------------------------------------------------------
-- If you have service_role key, you can run this via API with elevated permissions.
-- This is the SQL that would be executed:

/*
BEGIN;

-- Set role to bypass RLS temporarily
SET LOCAL ROLE postgres;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can upload course files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view course files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update course files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete course files" ON storage.objects;

-- Create policies
CREATE POLICY "Authenticated users can upload course files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'course-files');

CREATE POLICY "Anyone can view course files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'course-files');

CREATE POLICY "Authenticated users can update course files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'course-files')
WITH CHECK (bucket_id = 'course-files');

CREATE POLICY "Authenticated users can delete course files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'course-files');

COMMIT;
*/

-- ============================================================================
-- VERIFICATION (Run this after creating policies via UI)
-- ============================================================================

-- Check current storage policies
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
ORDER BY cmd, policyname;

-- ============================================================================
-- QUICK TEST AFTER FIXING
-- ============================================================================
-- After adding the policies, test by:
-- 1. Log into your app as an admin
-- 2. Try uploading a file
-- 3. The upload should now work without RLS errors
-- ============================================================================
