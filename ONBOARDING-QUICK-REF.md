# Onboarding Quick Reference

## New User Sign-Up Flow

After Google authentication, new users see this form:

```
┌─────────────────────────────────────┐
│   Complete Your Profile             │
│                                     │
│   Full Name *                       │
│   ┌─────────────────────────────┐   │
│   │ John Doe                    │   │
│   └─────────────────────────────┘   │
│                                     │
│   Student ID *                      │
│   ┌─────────────────────────────┐   │
│   │ 23-51455-1                  │   │
│   └─────────────────────────────┘   │
│   Format: XX-XXXXX-X                │
│                                     │
│   Gender *                          │
│   ┌─────────────────────────────┐   │
│   │ Select your gender ▼        │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │   Complete Profile          │   │
│   └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

## Student ID Format

**Pattern**: `XX-XXXXX-X`

**Examples**:
- ✅ `23-51455-1`
- ✅ `24-12345-9`
- ✅ `22-98765-4`
- ❌ `123456` (no dashes)
- ❌ `23-123` (incomplete)
- ❌ `2023-51455-1` (year too long)

## Gender Options

1. Male
2. Female
3. Other
4. Prefer not to say

## Routes

| Route | Public | Auth Required | Profile Required |
|-------|--------|---------------|------------------|
| `/` | ✅ Yes | ❌ No | ❌ No |
| `/auth/login` | ✅ Yes | ❌ No | ❌ No |
| `/auth/callback` | ✅ Yes | ❌ No | ❌ No |
| `/onboarding` | ❌ No | ✅ Yes | ❌ No |
| `/courses` | ❌ No | ✅ Yes | ✅ Yes |
| `/course/[id]` | ❌ No | ✅ Yes | ✅ Yes |
| `/admin` | ❌ No | ✅ Yes | ✅ Yes |

## Redirects

```
No Auth → /auth/login
Auth + No Profile → /onboarding
Auth + Profile → Requested page
```

## Database Table

```sql
user_profiles
├── id (UUID, primary key)
├── user_id (UUID, foreign key → auth.users)
├── full_name (VARCHAR 255, not null)
├── student_id (VARCHAR 20, unique, not null)
├── gender (VARCHAR 20, not null)
├── profile_completed (BOOLEAN, default true)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

## Testing Checklist

- [ ] Visit `/courses` without auth → Redirects to `/auth/login`
- [ ] Sign in with Google (new account) → Redirects to `/onboarding`
- [ ] Submit empty form → Shows validation errors
- [ ] Submit invalid student ID → Shows format error
- [ ] Submit valid form → Saves and redirects to `/courses`
- [ ] Sign in again → Skips onboarding, goes to `/courses`
- [ ] Try accessing `/onboarding` with profile → Redirects to `/courses`
- [ ] Try duplicate student ID → Shows "already registered" error

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Full name is required" | Empty name field | Enter your full name |
| "Invalid format" | Wrong student ID pattern | Use XX-XXXXX-X format |
| "Already registered" | Duplicate student ID | Use different ID or contact admin |
| "Please select your gender" | No gender selected | Choose from dropdown |
| Stuck on onboarding | Profile not saving | Check console, verify RLS policies |

## Files Modified

1. ✅ `src/app/onboarding/page.tsx` - Onboarding form
2. ✅ `src/middleware.ts` - Profile check middleware
3. ✅ `src/app/auth/callback/page.tsx` - Post-auth redirect logic
4. ✅ `src/types/database.ts` - UserProfile types
5. ✅ Database migration - `user_profiles` table

## Quick Test Commands

```bash
# Clear cookies (test new user flow)
# In browser: DevTools → Application → Cookies → Clear All

# Check if profile exists (SQL)
SELECT * FROM user_profiles WHERE user_id = 'YOUR_USER_ID';

# Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';

# View all profiles (admin only)
SELECT full_name, student_id, gender, created_at 
FROM user_profiles 
ORDER BY created_at DESC;
```

---

**Implementation Date**: October 15, 2025  
**Status**: ✅ Live  
**Documentation**: ONBOARDING-FEATURE.md
