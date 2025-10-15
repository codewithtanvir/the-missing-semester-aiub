# User Onboarding Feature

## Overview

After signing up with Google, new users are required to complete an onboarding process where they provide additional profile information before accessing the application.

## Required Information

Users must provide the following information during onboarding:

1. **Full Name** (pre-filled from Google account)
   - Required field
   - Text input

2. **Student ID**
   - Required field
   - Format: `XX-XXXXX-X` (e.g., `23-51455-1`)
   - Must be unique across all users
   - Validation enforced

3. **Gender**
   - Required field
   - Options:
     - Male
     - Female
     - Other
     - Prefer not to say

## User Flow

### New User Sign-Up Flow

```
1. Visit protected page (e.g., /courses)
   ↓
2. Redirect to /auth/login
   ↓
3. Click "Sign in with Google"
   ↓
4. Complete Google OAuth
   ↓
5. Redirect to /auth/callback
   ↓
6. Check if profile exists
   ↓
7. No profile → Redirect to /onboarding
   ↓
8. Fill onboarding form
   ↓
9. Submit profile
   ↓
10. Redirect to /courses (or original destination)
```

### Existing User Sign-In Flow

```
1. Visit protected page
   ↓
2. Check authentication
   ↓
3. Check if profile completed
   ↓
4. Profile exists → Access granted
```

## Database Schema

### `user_profiles` Table

```sql
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  student_id VARCHAR(20) NOT NULL UNIQUE,
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
  profile_completed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Indexes

- `idx_user_profiles_user_id` - Fast lookup by user ID
- `idx_user_profiles_student_id` - Fast lookup by student ID

### RLS Policies

1. **Read Own Profile**: Users can only read their own profile
2. **Insert Own Profile**: Users can only create their own profile
3. **Update Own Profile**: Users can only update their own profile

## Validation Rules

### Full Name
- Cannot be empty
- Trimmed of whitespace
- Maximum 255 characters

### Student ID
- **Format**: Must match pattern `XX-XXXXX-X`
  - First 2 digits: Year (e.g., 23 for 2023)
  - Next 5 digits: Unique ID
  - Last 1 digit: Check digit
- **Example**: `23-51455-1`
- **Uniqueness**: Must be unique across all users
- **Length**: Exactly 11 characters (including dashes)

### Gender
- Must be one of: `Male`, `Female`, `Other`, `Prefer not to say`
- No custom values allowed

## Error Handling

### Duplicate Student ID
```
Error: "This student ID is already registered"
```
- Occurs when student ID already exists in database
- User must use a different student ID

### Invalid Format
```
Error: "Invalid format. Use: XX-XXXXX-X (e.g., 23-51455-1)"
```
- Occurs when student ID doesn't match required format
- Shows example format to user

### Missing Fields
```
Error: "Full name is required"
Error: "Student ID is required"
Error: "Please select your gender"
```
- Field-specific validation errors
- Shown next to respective fields

## Middleware Protection

The middleware ensures:

1. **Unauthenticated users** → Redirect to `/auth/login`
2. **Authenticated users without profile** → Redirect to `/onboarding`
3. **Authenticated users with completed profile** → Access granted

### Protected Routes

All routes require completed profile except:
- `/` - Homepage
- `/auth/login` - Login page
- `/auth/callback` - OAuth callback
- `/onboarding` - Onboarding form

## Implementation Files

### Frontend Components

1. **`/src/app/onboarding/page.tsx`**
   - Onboarding form UI
   - Client-side validation
   - Profile submission
   - Pre-fills name from Google

### Middleware

2. **`/src/middleware.ts`**
   - Checks authentication
   - Checks profile completion
   - Redirects to onboarding if needed

### Authentication Flow

3. **`/src/app/auth/callback/page.tsx`**
   - Handles OAuth callback
   - Checks if profile exists
   - Redirects new users to onboarding

### Database Types

4. **`/src/types/database.ts`**
   - Added `UserProfile` interface
   - Added `user_profiles` table types

## Testing

### Test New User Flow

1. **Create New Google Account** (or use incognito)
2. Visit `http://localhost:3001/courses`
3. Should redirect to `/auth/login`
4. Click "Sign in with Google"
5. Complete OAuth
6. Should redirect to `/onboarding`
7. Fill form:
   - Full Name: `John Doe`
   - Student ID: `23-51455-1`
   - Gender: `Male`
8. Submit
9. Should redirect to `/courses`

### Test Existing User Flow

1. **Use Previously Registered Account**
2. Visit `http://localhost:3001/courses`
3. Sign in with Google
4. Should skip onboarding
5. Go directly to `/courses`

### Test Validation

1. **Empty Fields**: Try submitting with empty fields
2. **Invalid Student ID Format**: Try `123456` or `23-123`
3. **Duplicate Student ID**: Try using same ID twice
4. **Missing Gender**: Submit without selecting gender

### Test Direct Access

1. **Try accessing `/courses` without profile**
   - Should redirect to `/onboarding`

2. **Try accessing `/onboarding` with completed profile**
   - Should redirect to `/courses`

## Security Features

### 1. Profile Ownership
- Users can only create/update their own profile
- Enforced by RLS policies
- user_id matches authenticated session

### 2. Unique Student IDs
- Database constraint ensures uniqueness
- Prevents duplicate registrations
- Error handled gracefully

### 3. Data Validation
- Client-side validation for UX
- Server-side validation via database constraints
- Format validation on student ID

### 4. Automatic Profile Check
- Middleware checks on every request
- Prevents bypassing onboarding
- Ensures all users have complete profiles

## Future Enhancements

### Potential Additions

1. **Profile Editing**
   - Allow users to update their profile
   - Add `/profile` or `/settings` page
   - Keep student ID immutable after creation

2. **Profile Picture**
   - Use Google profile picture
   - Upload custom avatar
   - Store in Supabase Storage

3. **Additional Fields**
   - Department/Major
   - Batch/Year
   - Phone number
   - Emergency contact

4. **Email Verification**
   - Require email verification
   - Send welcome email
   - Verify student email domain

5. **Admin Profile Management**
   - View all user profiles
   - Search by student ID
   - Export user data
   - Bulk operations

## Troubleshooting

### Profile Not Saving
**Problem**: Form submits but profile doesn't save

**Solutions**:
1. Check browser console for errors
2. Verify Supabase RLS policies are enabled
3. Check database connection
4. Verify user is authenticated

### Stuck in Onboarding Loop
**Problem**: Redirects to onboarding after completing

**Solutions**:
1. Check if profile was actually saved
2. Clear browser cookies
3. Check database for profile record
4. Verify `profile_completed` is set to `true`

### Student ID Already Exists
**Problem**: Getting duplicate error for unique ID

**Solutions**:
1. Use a different student ID
2. Check if ID was typo
3. Contact admin if ID is genuinely yours
4. Verify ID format is correct

### Google Name Not Pre-Filled
**Problem**: Name field is empty after OAuth

**Solutions**:
- This is normal if Google account lacks full name
- Simply type your name manually
- Update Google account profile

## Migration Applied

```sql
-- Migration: add_user_profiles_table
-- Created: 2025-10-15
-- Status: ✅ Applied

CREATE TABLE public.user_profiles (...)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ...
CREATE POLICY "Users can insert own profile" ...
CREATE POLICY "Users can update own profile" ...
CREATE INDEX idx_user_profiles_user_id ...
CREATE INDEX idx_user_profiles_student_id ...
```

---

**Status**: ✅ Implemented  
**Required**: Yes (for all new users)  
**Validation**: Format + Uniqueness  
**Pre-fill**: Name from Google  
**Redirect**: To original destination after completion
