# Database Schema Update - Complete Guide

## 🎯 Overview

The database schema has been **completely updated** with enhanced features, comprehensive RLS policies, and new tracking capabilities for the admin dashboard.

## ✨ What's New

### 1. Enhanced Tables

#### **Courses Table**
**New columns added:**
- `description` (TEXT) - Course description
- `semester` (VARCHAR) - Current semester (e.g., "Fall 2024")
- `instructor` (VARCHAR) - Instructor name
- `credits` (INTEGER) - Course credits (1-12)
- `updated_at` (TIMESTAMP) - Auto-updated timestamp
- `code` now has UNIQUE constraint

**Example:**
```sql
code: "CSC 1101"
name: "Introduction to Computer Studies"
department: "COMPUTER SCIENCE"
description: "Fundamental concepts of computing..."
semester: "Fall 2024"
instructor: "Dr. John Smith"
credits: 3
```

#### **Files Table**
**New columns added:**
- `download_count` (INTEGER) - Tracks number of downloads
- `updated_at` (TIMESTAMP) - Auto-updated timestamp
- Renamed `uploaded_at` to `created_at` for consistency
- Added CHECK constraint on `file_size` (must be > 0)

### 2. New Tables

#### **Downloads Table** (Download Tracking)
```sql
CREATE TABLE downloads (
    id UUID PRIMARY KEY,
    file_id UUID REFERENCES files(id),
    user_id UUID,              -- Optional user tracking
    ip_address INET,           -- IP address of downloader
    user_agent TEXT,           -- Browser/device info
    downloaded_at TIMESTAMP
);
```

**Features:**
- Track every download
- Analyze download patterns
- User behavior insights
- Auto-increments file download_count

#### **Admin Activity Table** (Audit Trail)
```sql
CREATE TABLE admin_activity (
    id UUID PRIMARY KEY,
    admin_id UUID NOT NULL,
    action VARCHAR(50),        -- CREATE, UPDATE, DELETE
    entity_type VARCHAR(50),   -- courses, files
    entity_id UUID,            -- ID of affected record
    details JSONB,             -- Full change details
    created_at TIMESTAMP
);
```

**Features:**
- Complete audit trail
- Track all admin actions
- See before/after values
- Security and compliance

### 3. Enhanced Indexes

**Performance optimizations:**
```sql
-- Courses
idx_courses_code           -- Fast lookup by code
idx_courses_department     -- Filter by department
idx_courses_created_at     -- Sort by creation date

-- Files
idx_files_course_id        -- Join with courses
idx_files_category         -- Filter by category
idx_files_uploader_id      -- Admin tracking
idx_files_created_at       -- Sort by date
idx_files_download_count   -- Popular files

-- Downloads
idx_downloads_file_id      -- File analytics
idx_downloads_user_id      -- User analytics
idx_downloads_downloaded_at -- Time-based queries

-- Admin Activity
idx_admin_activity_admin_id     -- Per-admin logs
idx_admin_activity_created_at   -- Timeline
```

### 4. Comprehensive RLS Policies

#### **Courses Table Policies:**
```sql
✅ SELECT  - Anyone (public access)
✅ INSERT  - Authenticated admins only
✅ UPDATE  - Authenticated admins only
✅ DELETE  - Authenticated admins only
```

#### **Files Table Policies:**
```sql
✅ SELECT  - Anyone (public access)
✅ INSERT  - Authenticated admins only
✅ UPDATE  - Authenticated admins only
✅ DELETE  - Authenticated admins only
```

#### **Downloads Table Policies:**
```sql
✅ INSERT  - Anyone (tracking)
✅ SELECT  - Authenticated admins only
✅ DELETE  - Authenticated admins only
```

#### **Admin Activity Policies:**
```sql
✅ INSERT  - Authenticated admins (own ID only)
✅ SELECT  - Authenticated admins only
```

### 5. Automatic Triggers

#### **Auto-Update Timestamp**
```sql
-- Automatically updates 'updated_at' on every modification
TRIGGER: update_courses_updated_at
TRIGGER: update_files_updated_at
```

#### **Auto-Increment Downloads**
```sql
-- Automatically increments download_count when download logged
TRIGGER: auto_increment_download
```

#### **Auto-Log Admin Activity** (Optional)
```sql
-- Automatically logs all admin actions
TRIGGER: log_courses_activity (commented out by default)
TRIGGER: log_files_activity (commented out by default)
```

## 📋 Migration Options

### **Option 1: New Installation**
If you're setting up Supabase for the first time:

1. Go to Supabase SQL Editor
2. Copy entire content from `supabase-schema.sql`
3. Paste and run
4. All tables, indexes, policies, and triggers will be created

### **Option 2: Existing Database**
If you already have the old schema:

1. Go to Supabase SQL Editor
2. Copy entire content from `supabase-migration.sql`
3. Paste and run
4. Your database will be updated without losing data

## 🔧 What Gets Created

### Tables Created
- ✅ courses (enhanced)
- ✅ files (enhanced)
- ✅ downloads (new)
- ✅ admin_activity (new)

### Indexes Created
- ✅ 15+ performance indexes

### RLS Policies Created
- ✅ 4 policies for courses (SELECT, INSERT, UPDATE, DELETE)
- ✅ 4 policies for files (SELECT, INSERT, UPDATE, DELETE)
- ✅ 3 policies for downloads (INSERT, SELECT, DELETE)
- ✅ 2 policies for admin_activity (INSERT, SELECT)

### Functions Created
- ✅ `update_updated_at_column()` - Auto-update timestamps
- ✅ `increment_download_count()` - Track downloads
- ✅ `log_admin_activity()` - Audit trail

### Triggers Created
- ✅ Auto-update timestamps on courses/files
- ✅ Auto-increment download count
- ✅ Optional activity logging triggers

## 🎯 Benefits

### Security
- ✅ **Comprehensive RLS** - All operations protected
- ✅ **Public Read** - Students can browse without login
- ✅ **Admin Write** - Only authenticated admins can modify
- ✅ **Audit Trail** - All admin actions logged (optional)

### Performance
- ✅ **Optimized Indexes** - Fast queries and sorting
- ✅ **Efficient Joins** - Course-file relationships
- ✅ **Quick Filters** - Department, category, date filters

### Features
- ✅ **Download Tracking** - Know what's popular
- ✅ **Course Details** - Rich course information
- ✅ **Admin Analytics** - Track admin activity
- ✅ **Automatic Updates** - Timestamps auto-maintained

### Data Integrity
- ✅ **Unique Constraints** - No duplicate course codes
- ✅ **Check Constraints** - Valid data only
- ✅ **Foreign Keys** - Referential integrity
- ✅ **Cascading Deletes** - Clean data removal

## 📊 Example Queries

### Get Top Downloaded Files
```sql
SELECT 
    f.title,
    c.code,
    f.download_count,
    f.created_at
FROM files f
JOIN courses c ON f.course_id = c.id
ORDER BY f.download_count DESC
LIMIT 10;
```

### Get Courses with File Count
```sql
SELECT 
    c.code,
    c.name,
    c.department,
    c.instructor,
    c.credits,
    COUNT(f.id) as file_count
FROM courses c
LEFT JOIN files f ON c.id = f.course_id
GROUP BY c.id
ORDER BY file_count DESC;
```

### Get Download Analytics
```sql
SELECT 
    DATE(downloaded_at) as date,
    COUNT(*) as downloads
FROM downloads
WHERE downloaded_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(downloaded_at)
ORDER BY date DESC;
```

### Get Admin Activity Log
```sql
SELECT 
    action,
    entity_type,
    details,
    created_at
FROM admin_activity
WHERE admin_id = 'your-admin-uuid'
ORDER BY created_at DESC
LIMIT 50;
```

## 🚀 How to Apply

### Step 1: Choose Your Method

**For New Installation:**
```bash
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy content from: supabase-schema.sql
4. Paste and click "Run"
5. Wait for completion
6. Verify tables created
```

**For Existing Database:**
```bash
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy content from: supabase-migration.sql
4. Paste and click "Run"
5. Wait for completion
6. Run verification queries at end of script
```

### Step 2: Verify Installation

Run these queries to verify:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies exist
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

### Step 3: Test Functionality

1. **Test Public Access:**
   - Browse homepage as student
   - Verify courses load
   - Verify files display

2. **Test Admin Access:**
   - Login to admin dashboard
   - Try uploading a file
   - Try adding a course
   - Try updating course details
   - Try deleting a file

3. **Test Tracking:**
   - Download a file
   - Check download_count incremented
   - Check downloads table has record

## 📝 Optional Features

### Enable Activity Logging
Uncomment these lines at the end of schema file:
```sql
CREATE TRIGGER log_courses_activity
    AFTER INSERT OR UPDATE OR DELETE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION log_admin_activity();

CREATE TRIGGER log_files_activity
    AFTER INSERT OR UPDATE OR DELETE ON files
    FOR EACH ROW
    EXECUTE FUNCTION log_admin_activity();
```

### Implement Download Tracking
In your Next.js code, when a file is downloaded:
```typescript
await supabase
  .from('downloads')
  .insert({
    file_id: fileId,
    user_id: userId || null,
    ip_address: req.headers['x-forwarded-for'],
    user_agent: req.headers['user-agent']
  });
```

## 🔍 Troubleshooting

### Migration Failed?
- Check for syntax errors in SQL Editor
- Ensure you have admin access to Supabase
- Run each section separately if needed

### Policies Not Working?
- Verify RLS is enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- Check policy syntax in pg_policies
- Test with authenticated user

### Triggers Not Firing?
- Check function exists: `\df` in SQL editor
- Verify trigger is created: `SELECT * FROM pg_trigger;`
- Test with manual insert/update

## 📚 Files Reference

| File | Purpose | Use When |
|------|---------|----------|
| `supabase-schema.sql` | Complete schema | New installation |
| `supabase-migration.sql` | Update script | Existing database |
| `DATABASE-UPDATE-GUIDE.md` | This guide | Understanding changes |

## ✅ Migration Checklist

- [ ] Backup existing database (if applicable)
- [ ] Choose migration method (new vs. existing)
- [ ] Run appropriate SQL script
- [ ] Verify tables created
- [ ] Verify RLS enabled
- [ ] Verify policies created
- [ ] Verify indexes created
- [ ] Verify triggers created
- [ ] Test public access (student browsing)
- [ ] Test admin access (CRUD operations)
- [ ] Test download tracking (optional)
- [ ] Test activity logging (optional)
- [ ] Update application code if needed
- [ ] Test full application flow

## 🎉 Conclusion

Your database is now **production-ready** with:
- ✅ Enhanced data model
- ✅ Comprehensive security (RLS)
- ✅ Performance optimizations
- ✅ Download tracking
- ✅ Admin audit trail
- ✅ Automatic maintenance

**Your course resources platform is now enterprise-grade!** 🚀
