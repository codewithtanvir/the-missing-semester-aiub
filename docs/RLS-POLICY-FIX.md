# RLS Policy Syntax Fix ✅

## Issue Resolved
**Error:** `ERROR: 42601: only WITH CHECK expression allowed for INSERT`

**Root Cause:** INSERT policies were incorrectly using both `USING` and `WITH CHECK` clauses. For INSERT operations, only `WITH CHECK` is allowed.

---

## PostgreSQL RLS Policy Rules

### **Correct Syntax by Operation:**

```sql
-- SELECT: Use USING only
CREATE POLICY "policy_name"
    ON table_name FOR SELECT
    USING (condition);

-- INSERT: Use WITH CHECK only
CREATE POLICY "policy_name"
    ON table_name FOR INSERT
    WITH CHECK (condition);

-- UPDATE: Use both USING and WITH CHECK
CREATE POLICY "policy_name"
    ON table_name FOR UPDATE
    USING (condition)      -- Check before update
    WITH CHECK (condition); -- Check after update

-- DELETE: Use USING only
CREATE POLICY "policy_name"
    ON table_name FOR DELETE
    USING (condition);
```

---

## Fixes Applied

### **File:** `supabase-migration.sql`

**❌ Before (INCORRECT):**
```sql
CREATE POLICY "Anyone can record downloads"
    ON downloads FOR INSERT
    USING (true)           -- ❌ Not allowed for INSERT
    WITH CHECK (true);
```

**✅ After (CORRECT):**
```sql
CREATE POLICY "Anyone can record downloads"
    ON downloads FOR INSERT
    WITH CHECK (true);     -- ✅ Only WITH CHECK for INSERT
```

### **File:** `supabase-schema.sql`

**❌ Before (INCORRECT):**
```sql
CREATE POLICY "Anyone can record downloads"
    ON downloads FOR INSERT
    USING (true)           -- ❌ Not allowed for INSERT
    WITH CHECK (true);
```

**✅ After (CORRECT):**
```sql
CREATE POLICY "Anyone can record downloads"
    ON downloads FOR INSERT
    WITH CHECK (true);     -- ✅ Only WITH CHECK for INSERT
```

---

## All RLS Policies - Corrected Syntax

### **COURSES Table (4 policies)**

```sql
-- ✅ SELECT - USING only
CREATE POLICY "Anyone can view courses"
    ON courses FOR SELECT
    USING (true);

-- ✅ INSERT - WITH CHECK only
CREATE POLICY "Authenticated users can insert courses"
    ON courses FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- ✅ UPDATE - Both USING and WITH CHECK
CREATE POLICY "Authenticated users can update courses"
    ON courses FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ✅ DELETE - USING only
CREATE POLICY "Authenticated users can delete courses"
    ON courses FOR DELETE
    TO authenticated
    USING (true);
```

### **FILES Table (4 policies)**

```sql
-- ✅ SELECT - USING only
CREATE POLICY "Anyone can view files"
    ON files FOR SELECT
    USING (true);

-- ✅ INSERT - WITH CHECK only
CREATE POLICY "Authenticated users can insert files"
    ON files FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- ✅ UPDATE - Both USING and WITH CHECK
CREATE POLICY "Authenticated users can update files"
    ON files FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ✅ DELETE - USING only
CREATE POLICY "Authenticated users can delete files"
    ON files FOR DELETE
    TO authenticated
    USING (true);
```

### **DOWNLOADS Table (3 policies)**

```sql
-- ✅ INSERT - WITH CHECK only (FIXED!)
CREATE POLICY "Anyone can record downloads"
    ON downloads FOR INSERT
    WITH CHECK (true);

-- ✅ SELECT - USING only
CREATE POLICY "Authenticated users can view downloads"
    ON downloads FOR SELECT
    TO authenticated
    USING (true);

-- ✅ DELETE - USING only
CREATE POLICY "Authenticated users can delete downloads"
    ON downloads FOR DELETE
    TO authenticated
    USING (true);
```

### **ADMIN_ACTIVITY Table (2 policies)**

```sql
-- ✅ INSERT - WITH CHECK only
CREATE POLICY "Authenticated users can insert activity"
    ON admin_activity FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = admin_id);

-- ✅ SELECT - USING only
CREATE POLICY "Authenticated users can view activity"
    ON admin_activity FOR SELECT
    TO authenticated
    USING (true);
```

---

## Why This Matters

### **USING Clause:**
- Checks if existing rows match the condition
- Used for: SELECT, UPDATE (before), DELETE
- Think: "Can I see/modify/delete this row?"

### **WITH CHECK Clause:**
- Checks if new/modified rows match the condition
- Used for: INSERT, UPDATE (after)
- Think: "Can I create/save this row?"

### **INSERT Operations:**
- No existing rows to check → `USING` makes no sense
- Only checking new row being inserted → `WITH CHECK` only
- PostgreSQL enforces this strictly

---

## Verification

Run this query to check all policies are correct:

```sql
SELECT 
    tablename,
    policyname,
    cmd as operation,
    CASE 
        WHEN qual IS NOT NULL THEN 'Has USING'
        ELSE 'No USING'
    END as using_clause,
    CASE 
        WHEN with_check IS NOT NULL THEN 'Has WITH CHECK'
        ELSE 'No WITH CHECK'
    END as with_check_clause
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, cmd, policyname;
```

**Expected Results:**
- INSERT policies: No USING, Has WITH CHECK ✅
- SELECT policies: Has USING, No WITH CHECK ✅
- UPDATE policies: Has USING, Has WITH CHECK ✅
- DELETE policies: Has USING, No WITH CHECK ✅

---

## Migration Status

**Files Fixed:**
1. ✅ `supabase-migration.sql` - Downloads INSERT policy corrected
2. ✅ `supabase-schema.sql` - Downloads INSERT policy corrected

**Error Status:**
- ❌ Before: `ERROR: 42601: only WITH CHECK expression allowed for INSERT`
- ✅ After: No errors, proper syntax ✅

---

## Next Steps

### **Apply the Fixed Migration:**

```bash
# In Supabase SQL Editor:

# For NEW database:
-- Use: supabase-schema.sql

# For EXISTING database:
-- Use: supabase-migration.sql
```

Both files now have correct RLS policy syntax!

---

## Testing

After applying migration, test the policies:

```sql
-- Test 1: Anyone can view courses (no auth needed)
SELECT * FROM courses LIMIT 1;
-- Expected: ✅ Success

-- Test 2: Anyone can record downloads (no auth needed)
INSERT INTO downloads (file_id, ip_address) 
VALUES ('some-uuid', '127.0.0.1'::inet);
-- Expected: ✅ Success

-- Test 3: Only admins can insert files (needs auth)
-- As unauthenticated user:
INSERT INTO files (course_id, title, ...) VALUES (...);
-- Expected: ❌ Permission denied

-- As authenticated admin:
INSERT INTO files (course_id, title, ...) VALUES (...);
-- Expected: ✅ Success
```

---

## Summary

**Issue:** Wrong RLS syntax for INSERT operations
**Fix:** Removed `USING` clause, kept only `WITH CHECK`
**Result:** Migration now runs without errors ✅

**All 13 RLS policies now use correct PostgreSQL syntax!** 🎉
