-- ============================================================================
-- MIGRATION SCRIPT - Update Existing Database
-- ============================================================================
-- Run this script if you already have the old schema and want to update it
-- For new installations, use supabase-schema.sql instead
-- ============================================================================

-- ============================================================================
-- STEP 1: Add new columns to existing tables
-- ============================================================================

-- Add new columns to courses table
ALTER TABLE courses
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS semester VARCHAR(50),
    ADD COLUMN IF NOT EXISTS instructor VARCHAR(255),
    ADD COLUMN IF NOT EXISTS credits INTEGER CHECK (credits > 0 AND credits <= 12),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add unique constraint to course code if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'courses_code_key'
    ) THEN
        ALTER TABLE courses ADD CONSTRAINT courses_code_key UNIQUE (code);
    END IF;
END $$;

-- Rename uploaded_at to created_at in files table (if needed)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'files' AND column_name = 'uploaded_at'
    ) THEN
        ALTER TABLE files RENAME COLUMN uploaded_at TO created_at;
    END IF;
END $$;

-- Add new columns to files table
ALTER TABLE files
    ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0 CHECK (download_count >= 0),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add check constraint to file_size if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'files_file_size_check'
    ) THEN
        ALTER TABLE files ADD CONSTRAINT files_file_size_check CHECK (file_size > 0);
    END IF;
END $$;

-- ============================================================================
-- STEP 2: Create new tables
-- ============================================================================

-- Downloads tracking table
CREATE TABLE IF NOT EXISTS downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    user_id UUID,
    ip_address INET,
    user_agent TEXT,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin activity log table
CREATE TABLE IF NOT EXISTS admin_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- STEP 3: Create new indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_courses_department ON courses(department);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_files_uploader_id ON files(uploader_id);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_files_download_count ON files(download_count DESC);
CREATE INDEX IF NOT EXISTS idx_downloads_file_id ON downloads(file_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_downloaded_at ON downloads(downloaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_admin_id ON admin_activity(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON admin_activity(created_at DESC);

-- ============================================================================
-- STEP 4: Enable RLS on new tables
-- ============================================================================

ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 5: Update RLS policies
-- ============================================================================

-- Drop old policies
DROP POLICY IF EXISTS "Public courses are viewable by everyone" ON courses;
DROP POLICY IF EXISTS "Public files are viewable by everyone" ON files;
DROP POLICY IF EXISTS "Authenticated users can insert courses" ON courses;
DROP POLICY IF EXISTS "Authenticated users can insert files" ON files;

-- Create comprehensive policies for courses
CREATE POLICY "Anyone can view courses"
    ON courses FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert courses"
    ON courses FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update courses"
    ON courses FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete courses"
    ON courses FOR DELETE
    TO authenticated
    USING (true);

-- Create comprehensive policies for files
CREATE POLICY "Anyone can view files"
    ON files FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert files"
    ON files FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update files"
    ON files FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete files"
    ON files FOR DELETE
    TO authenticated
    USING (true);

-- Create policies for downloads
CREATE POLICY "Anyone can record downloads"
    ON downloads FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Authenticated users can view downloads"
    ON downloads FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can delete downloads"
    ON downloads FOR DELETE
    TO authenticated
    USING (true);

-- Create policies for admin_activity
CREATE POLICY "Authenticated users can insert activity"
    ON admin_activity FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = admin_id);

CREATE POLICY "Authenticated users can view activity"
    ON admin_activity FOR SELECT
    TO authenticated
    USING (true);

-- ============================================================================
-- STEP 6: Create functions and triggers
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_files_updated_at ON files;
CREATE TRIGGER update_files_updated_at
    BEFORE UPDATE ON files
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE files 
    SET download_count = download_count + 1 
    WHERE id = NEW.file_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-increment download count
DROP TRIGGER IF EXISTS auto_increment_download ON downloads;
CREATE TRIGGER auto_increment_download
    AFTER INSERT ON downloads
    FOR EACH ROW
    EXECUTE FUNCTION increment_download_count();

-- Function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO admin_activity (admin_id, action, entity_type, entity_id, details)
        VALUES (
            auth.uid(),
            'CREATE',
            TG_TABLE_NAME,
            NEW.id,
            row_to_json(NEW)
        );
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO admin_activity (admin_id, action, entity_type, entity_id, details)
        VALUES (
            auth.uid(),
            'UPDATE',
            TG_TABLE_NAME,
            NEW.id,
            jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW))
        );
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO admin_activity (admin_id, action, entity_type, entity_id, details)
        VALUES (
            auth.uid(),
            'DELETE',
            TG_TABLE_NAME,
            OLD.id,
            row_to_json(OLD)
        );
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 7: Verify migration
-- ============================================================================

-- Check courses table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'courses'
ORDER BY ordinal_position;

-- Check files table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'files'
ORDER BY ordinal_position;

-- Check all indexes
SELECT 
    tablename, 
    indexname, 
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
AND tablename IN ('courses', 'files', 'downloads', 'admin_activity')
ORDER BY tablename, indexname;

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Your database has been updated with:
-- ✅ New columns (description, semester, instructor, credits, updated_at)
-- ✅ Download tracking table
-- ✅ Admin activity logging table
-- ✅ Enhanced indexes for better performance
-- ✅ Comprehensive RLS policies (SELECT, INSERT, UPDATE, DELETE)
-- ✅ Automatic timestamp updates
-- ✅ Download count tracking
-- ✅ Admin activity logging (optional)
-- ============================================================================
