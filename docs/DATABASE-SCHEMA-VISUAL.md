# Database Schema - Visual Reference

## 📊 Database Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    COURSE RESOURCES DATABASE                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│      COURSES         │
├──────────────────────┤
│ id (PK)              │───┐
│ code (UNIQUE)        │   │
│ name                 │   │
│ department           │   │
│ description          │   │ ONE-TO-MANY
│ semester             │   │
│ instructor           │   │
│ credits              │   │
│ created_at           │   │
│ updated_at           │   │
└──────────────────────┘   │
                           │
                           ├────┐
                           │    │
                           ▼    │
        ┌──────────────────────┴──────┐
        │         FILES                │
        ├─────────────────────────────┤
        │ id (PK)                      │───┐
        │ course_id (FK) ──────────────│   │
        │ category                     │   │
        │ title                        │   │ ONE-TO-MANY
        │ file_path                    │   │
        │ file_type                    │   │
        │ file_size                    │   │
        │ uploader_id                  │   │
        │ download_count               │   │
        │ created_at                   │   │
        │ updated_at                   │   │
        └──────────────────────────────┘   │
                                           │
                                           ├────┐
                                           │    │
                                           ▼    │
                ┌──────────────────────────────┴─────┐
                │          DOWNLOADS                  │
                ├────────────────────────────────────┤
                │ id (PK)                             │
                │ file_id (FK) ───────────────────────│
                │ user_id                             │
                │ ip_address                          │
                │ user_agent                          │
                │ downloaded_at                       │
                └─────────────────────────────────────┘

        ┌────────────────────────────────┐
        │       ADMIN_ACTIVITY           │
        ├────────────────────────────────┤
        │ id (PK)                         │
        │ admin_id                        │
        │ action                          │
        │ entity_type                     │
        │ entity_id                       │
        │ details (JSONB)                 │
        │ created_at                      │
        └────────────────────────────────┘
```

---

## 🔍 Table Details

### **COURSES Table**
```
┌─────────────────────────────────────────────────────────────┐
│ Purpose: Store all course information                      │
│ Access:  Public READ, Admin WRITE                          │
│ Records: ~115 courses (11 departments)                     │
└─────────────────────────────────────────────────────────────┘

Field           Type        Constraints        Description
─────────────────────────────────────────────────────────────
id              UUID        PRIMARY KEY        Unique identifier
code            VARCHAR     UNIQUE, NOT NULL   Course code (e.g., CSC1101)
name            VARCHAR     NOT NULL           Course full name
department      VARCHAR     NOT NULL           Department name
description     TEXT        NULLABLE           Course description
semester        VARCHAR     NULLABLE           Current semester
instructor      VARCHAR     NULLABLE           Instructor name
credits         INTEGER     1-12, NULLABLE     Course credit hours
created_at      TIMESTAMP   AUTO               Creation timestamp
updated_at      TIMESTAMP   AUTO-UPDATE        Last update timestamp

Indexes:
  ✓ idx_courses_code (code)
  ✓ idx_courses_department (department)
  ✓ idx_courses_created_at (created_at DESC)

RLS Policies:
  ✓ SELECT  - Public (anyone)
  ✓ INSERT  - Authenticated admins
  ✓ UPDATE  - Authenticated admins
  ✓ DELETE  - Authenticated admins
```

### **FILES Table**
```
┌─────────────────────────────────────────────────────────────┐
│ Purpose: Store file metadata and references                │
│ Access:  Public READ, Admin WRITE                          │
│ Records: Dynamic (uploaded by admins)                      │
└─────────────────────────────────────────────────────────────┘

Field           Type        Constraints        Description
─────────────────────────────────────────────────────────────
id              UUID        PRIMARY KEY        Unique identifier
course_id       UUID        FOREIGN KEY        → courses.id (CASCADE)
category        VARCHAR     CHECK              Midterm|Final|Others
title           VARCHAR     NOT NULL           File display name
file_path       TEXT        NOT NULL           Storage path
file_type       VARCHAR     NOT NULL           MIME type
file_size       BIGINT      > 0, NOT NULL      File size in bytes
uploader_id     UUID        NOT NULL           Admin user UUID
download_count  INTEGER     ≥ 0, DEFAULT 0     Download counter
created_at      TIMESTAMP   AUTO               Upload timestamp
updated_at      TIMESTAMP   AUTO-UPDATE        Last update timestamp

Indexes:
  ✓ idx_files_course_id (course_id)
  ✓ idx_files_category (category)
  ✓ idx_files_uploader_id (uploader_id)
  ✓ idx_files_created_at (created_at DESC)
  ✓ idx_files_download_count (download_count DESC)

RLS Policies:
  ✓ SELECT  - Public (anyone)
  ✓ INSERT  - Authenticated admins
  ✓ UPDATE  - Authenticated admins
  ✓ DELETE  - Authenticated admins

Triggers:
  ✓ update_files_updated_at - Auto-update timestamp
```

### **DOWNLOADS Table**
```
┌─────────────────────────────────────────────────────────────┐
│ Purpose: Track every file download for analytics           │
│ Access:  Public INSERT, Admin READ                         │
│ Records: Grows with each download                          │
└─────────────────────────────────────────────────────────────┘

Field           Type        Constraints        Description
─────────────────────────────────────────────────────────────
id              UUID        PRIMARY KEY        Unique identifier
file_id         UUID        FOREIGN KEY        → files.id (CASCADE)
user_id         UUID        NULLABLE           Optional user tracking
ip_address      INET        NULLABLE           Client IP address
user_agent      TEXT        NULLABLE           Browser/device info
downloaded_at   TIMESTAMP   AUTO               Download timestamp

Indexes:
  ✓ idx_downloads_file_id (file_id)
  ✓ idx_downloads_user_id (user_id)
  ✓ idx_downloads_downloaded_at (downloaded_at DESC)

RLS Policies:
  ✓ INSERT  - Public (anyone - for tracking)
  ✓ SELECT  - Authenticated admins
  ✓ DELETE  - Authenticated admins

Triggers:
  ✓ auto_increment_download - Increments files.download_count
```

### **ADMIN_ACTIVITY Table**
```
┌─────────────────────────────────────────────────────────────┐
│ Purpose: Audit trail of all admin actions                  │
│ Access:  Admin INSERT/READ only                            │
│ Records: Every admin action (if enabled)                   │
└─────────────────────────────────────────────────────────────┘

Field           Type        Constraints        Description
─────────────────────────────────────────────────────────────
id              UUID        PRIMARY KEY        Unique identifier
admin_id        UUID        NOT NULL           Admin user UUID
action          VARCHAR     NOT NULL           CREATE|UPDATE|DELETE
entity_type     VARCHAR     NOT NULL           Table name
entity_id       UUID        NULLABLE           Affected record ID
details         JSONB       NULLABLE           Full change details
created_at      TIMESTAMP   AUTO               Action timestamp

Indexes:
  ✓ idx_admin_activity_admin_id (admin_id)
  ✓ idx_admin_activity_created_at (created_at DESC)

RLS Policies:
  ✓ INSERT  - Authenticated admins (own ID only)
  ✓ SELECT  - Authenticated admins

Optional Triggers:
  ○ log_courses_activity - Log course changes
  ○ log_files_activity - Log file changes
```

---

## 🔐 RLS Policy Matrix

```
┌──────────────────┬────────────┬────────────┬────────────┬────────────┐
│ Table            │   SELECT   │   INSERT   │   UPDATE   │   DELETE   │
├──────────────────┼────────────┼────────────┼────────────┼────────────┤
│ courses          │  🌐 PUBLIC │  🔒 ADMIN  │  🔒 ADMIN  │  🔒 ADMIN  │
│ files            │  🌐 PUBLIC │  🔒 ADMIN  │  🔒 ADMIN  │  🔒 ADMIN  │
│ downloads        │  🔒 ADMIN  │  🌐 PUBLIC │     ❌     │  🔒 ADMIN  │
│ admin_activity   │  🔒 ADMIN  │  🔒 ADMIN  │     ❌     │     ❌     │
└──────────────────┴────────────┴────────────┴────────────┴────────────┘

Legend:
  🌐 PUBLIC - Anyone (including anonymous users)
  🔒 ADMIN  - Authenticated admin users only
  ❌       - No policy (operation not allowed)
```

---

## 🔄 Data Flow Diagram

### **Student Flow (Public Access)**
```
┌─────────────┐
│   Student   │
│  (No Auth)  │
└──────┬──────┘
       │
       ├─► SELECT courses    ✅ Allowed (RLS)
       │
       ├─► SELECT files      ✅ Allowed (RLS)
       │
       ├─► INSERT downloads  ✅ Allowed (Tracking)
       │
       ├─► INSERT/UPDATE/    ❌ Blocked (RLS)
       │   DELETE anything
       │
       └─► Browse & Download ✅ Full Access
```

### **Admin Flow (Authenticated)**
```
┌─────────────┐
│    Admin    │
│  (Auth'd)   │
└──────┬──────┘
       │
       ├─► SELECT courses         ✅ Allowed
       ├─► INSERT/UPDATE/DELETE   ✅ Allowed
       │   courses
       │
       ├─► SELECT files           ✅ Allowed
       ├─► INSERT/UPDATE/DELETE   ✅ Allowed
       │   files
       │
       ├─► SELECT downloads       ✅ Allowed
       │
       ├─► SELECT/INSERT          ✅ Allowed
       │   admin_activity
       │
       └─► Full Control           ✅ All Access
```

---

## 📈 Performance Characteristics

### **Query Patterns**

**Fast Queries (Indexed):**
```sql
✅ SELECT * FROM courses WHERE code = ?
✅ SELECT * FROM courses WHERE department = ?
✅ SELECT * FROM courses ORDER BY created_at DESC
✅ SELECT * FROM files WHERE course_id = ?
✅ SELECT * FROM files WHERE category = ?
✅ SELECT * FROM files ORDER BY download_count DESC
✅ SELECT * FROM downloads WHERE file_id = ?
✅ SELECT * FROM admin_activity WHERE admin_id = ?
```

**Efficient Joins:**
```sql
✅ courses ⟕ files (indexed on course_id)
✅ files ⟕ downloads (indexed on file_id)
✅ All ORDER BY operations (indexed)
```

---

## 🎯 Common Queries Reference

### **Get All Courses with File Count**
```sql
SELECT 
    c.code,
    c.name,
    c.department,
    c.instructor,
    COUNT(f.id) as file_count
FROM courses c
LEFT JOIN files f ON c.id = f.course_id
GROUP BY c.id
ORDER BY c.code;
```

### **Get Course Files by Category**
```sql
SELECT 
    f.title,
    f.category,
    f.file_size,
    f.download_count
FROM files f
WHERE f.course_id = '<course-uuid>'
AND f.category = 'Midterm'
ORDER BY f.created_at DESC;
```

### **Get Top Downloaded Files**
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

### **Get Recent Downloads (Last 7 Days)**
```sql
SELECT 
    f.title,
    c.code,
    d.downloaded_at
FROM downloads d
JOIN files f ON d.file_id = f.id
JOIN courses c ON f.course_id = c.id
WHERE d.downloaded_at >= NOW() - INTERVAL '7 days'
ORDER BY d.downloaded_at DESC;
```

### **Get Admin Activity Log**
```sql
SELECT 
    action,
    entity_type,
    details,
    created_at
FROM admin_activity
WHERE admin_id = '<admin-uuid>'
ORDER BY created_at DESC
LIMIT 50;
```

### **Get Department Statistics**
```sql
SELECT 
    department,
    COUNT(DISTINCT c.id) as course_count,
    COUNT(f.id) as file_count,
    SUM(f.download_count) as total_downloads
FROM courses c
LEFT JOIN files f ON c.id = f.course_id
GROUP BY department
ORDER BY course_count DESC;
```

---

## 🛡️ Security Features

### **Row Level Security (RLS)**
- ✅ Enabled on all tables
- ✅ Public can only SELECT courses and files
- ✅ Public can INSERT downloads (tracking)
- ✅ Admins have full CRUD access
- ✅ Activity logs protected to owner

### **Data Integrity**
- ✅ Foreign key constraints
- ✅ Unique constraints (course codes)
- ✅ Check constraints (valid values)
- ✅ NOT NULL enforcement
- ✅ Cascading deletes

### **Audit Trail**
- ✅ Track all admin actions (optional)
- ✅ Before/after values in JSONB
- ✅ Timestamp of every change
- ✅ Admin accountability

---

## 📊 Storage Estimates

### **Average Sizes**

| Table | Rows | Row Size | Total Size |
|-------|------|----------|------------|
| courses | 115 | ~500B | ~58 KB |
| files | 1,000 | ~300B | ~300 KB |
| downloads | 10,000 | ~200B | ~2 MB |
| admin_activity | 5,000 | ~500B | ~2.5 MB |

**Note:** Actual files stored in Supabase Storage (separate)

---

## 🎓 Best Practices

### **Indexing**
- ✅ All foreign keys indexed
- ✅ Frequently queried columns indexed
- ✅ Sort columns indexed (DESC)
- ✅ Composite indexes where needed

### **Querying**
- ✅ Use prepared statements
- ✅ Limit result sets
- ✅ Use appropriate joins
- ✅ Leverage indexes

### **Data Management**
- ✅ Regular backups
- ✅ Monitor table sizes
- ✅ Archive old downloads
- ✅ Clean up orphaned records

---

**Database structure complete and optimized!** 🚀
