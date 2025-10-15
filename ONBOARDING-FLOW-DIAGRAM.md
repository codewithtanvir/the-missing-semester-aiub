# User Authentication & Onboarding Flow

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER VISITS WEBSITE                         │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
                   ┌───────────────────────────────┐
                   │   Which page are they on?     │
                   └───────────────────────────────┘
                                   │
                ┌──────────────────┼──────────────────┐
                ▼                  ▼                  ▼
        ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
        │   Homepage   │   │  Auth Pages  │   │  Protected   │
        │      /       │   │ /auth/login  │   │   Routes     │
        └──────────────┘   │ /auth/callback│   │  /courses    │
                │          └──────────────┘   │  /course/[id]│
                │                  │          │   /admin     │
                │                  │          └──────────────┘
                ▼                  ▼                  │
           ┌─────────┐        ┌─────────┐           │
           │ ALLOWED │        │ ALLOWED │           │
           └─────────┘        └─────────┘           │
                                                     ▼
                                        ┌────────────────────────┐
                                        │  Check Authentication  │
                                        └────────────────────────┘
                                                     │
                                    ┌────────────────┴────────────────┐
                                    ▼                                 ▼
                           ┌──────────────┐                  ┌──────────────┐
                           │     NOT      │                  │ AUTHENTICATED│
                           │ AUTHENTICATED│                  │              │
                           └──────────────┘                  └──────────────┘
                                    │                                 │
                                    ▼                                 ▼
                        ┌──────────────────────┐         ┌────────────────────────┐
                        │ Redirect to Login    │         │  Check Profile Status  │
                        │  /auth/login?        │         └────────────────────────┘
                        │  redirectTo=original │                      │
                        └──────────────────────┘         ┌────────────┴────────────┐
                                    │                    ▼                         ▼
                                    ▼              ┌──────────────┐      ┌──────────────┐
                        ┌──────────────────────┐   │   PROFILE    │      │  NO PROFILE  │
                        │  Click "Sign in with │   │  COMPLETED   │      │     OR       │
                        │      Google"         │   │              │      │ NOT COMPLETED│
                        └──────────────────────┘   └──────────────┘      └──────────────┘
                                    │                       │                     │
                                    ▼                       │                     ▼
                        ┌──────────────────────┐           │         ┌──────────────────┐
                        │  Google OAuth Flow   │           │         │   Redirect to    │
                        │  (External)          │           │         │   /onboarding    │
                        └──────────────────────┘           │         └──────────────────┘
                                    │                       │                     │
                                    ▼                       │                     ▼
                        ┌──────────────────────┐           │         ┌──────────────────┐
                        │ Callback to          │           │         │  ONBOARDING FORM │
                        │ /auth/callback       │           │         ├──────────────────┤
                        └──────────────────────┘           │         │ • Full Name      │
                                    │                       │         │ • Student ID     │
                                    ▼                       │         │ • Gender         │
                        ┌──────────────────────┐           │         └──────────────────┘
                        │ Check if profile     │           │                     │
                        │     exists           │           │                     ▼
                        └──────────────────────┘           │         ┌──────────────────┐
                                    │                       │         │ Validate Input   │
                        ┌───────────┴────────────┐         │         └──────────────────┘
                        ▼                        ▼         │                     │
                ┌──────────────┐        ┌──────────────┐  │         ┌───────────┴────────┐
                │   EXISTING   │        │     NEW      │  │         ▼                    ▼
                │     USER     │        │     USER     │  │    ┌─────────┐         ┌─────────┐
                └──────────────┘        └──────────────┘  │    │  VALID  │         │ INVALID │
                        │                        │         │    └─────────┘         └─────────┘
                        │                        ▼         │         │                     │
                        │            ┌──────────────────┐  │         ▼                     ▼
                        │            │   Redirect to    │  │    ┌──────────────┐   ┌──────────┐
                        │            │   /onboarding    │  │    │ Save Profile │   │  Show    │
                        │            └──────────────────┘  │    └──────────────┘   │  Errors  │
                        │                        │         │         │             └──────────┘
                        │                        └─────────┼─────────┘
                        │                                  │         │
                        └──────────────────────────────────┴─────────┘
                                                                  │
                                                                  ▼
                                                    ┌──────────────────────┐
                                                    │ Redirect to Original │
                                                    │   Destination or     │
                                                    │     /courses         │
                                                    └──────────────────────┘
                                                                  │
                                                                  ▼
                                                        ┌──────────────┐
                                                        │ ACCESS       │
                                                        │ GRANTED      │
                                                        └──────────────┘
```

## State Diagram

```
                        ┌────────────┐
                        │  VISITOR   │
                        │ (No Auth)  │
                        └────────────┘
                              │
                    Sign in with Google
                              │
                              ▼
                   ┌────────────────────┐
                   │  AUTHENTICATED     │
                   │ (No Profile)       │
                   └────────────────────┘
                              │
                   Complete Onboarding
                              │
                              ▼
                   ┌────────────────────┐
                   │  FULL ACCESS       │
                   │ (Auth + Profile)   │
                   └────────────────────┘
```

## Middleware Logic

```
REQUEST to any page
    │
    ├─ Is route public (/, /auth/*, /onboarding)?
    │  └─ YES → Allow access
    │
    ├─ Is user authenticated?
    │  ├─ NO → Redirect to /auth/login
    │  └─ YES → Continue
    │
    ├─ Is route /onboarding?
    │  └─ YES → Allow access
    │
    ├─ Does user have completed profile?
    │  ├─ NO → Redirect to /onboarding
    │  └─ YES → Allow access
    │
    └─ GRANT ACCESS
```

## Database Query Flow

### New User Registration

```sql
-- Step 1: User signs in with Google
-- Supabase creates record in auth.users automatically

-- Step 2: Check if profile exists
SELECT profile_completed 
FROM user_profiles 
WHERE user_id = 'USER_UUID';
-- Result: No rows (new user)

-- Step 3: User fills onboarding form
INSERT INTO user_profiles (
  user_id,
  full_name,
  student_id,
  gender,
  profile_completed
) VALUES (
  'USER_UUID',
  'John Doe',
  '23-51455-1',
  'Male',
  true
);

-- Step 4: Subsequent requests
SELECT profile_completed 
FROM user_profiles 
WHERE user_id = 'USER_UUID';
-- Result: true → Access granted
```

## Page Component Flow

### `/onboarding/page.tsx`

```typescript
1. Component Mounts
   ↓
2. useEffect runs → checkExistingProfile()
   ↓
3. Get current session
   ├─ No session? → Redirect to /auth/login
   └─ Has session? → Continue
   ↓
4. Query user_profiles table
   ├─ Profile exists & completed? → Redirect to /courses
   └─ No profile? → Show form
   ↓
5. User fills form
   ↓
6. Submit → handleSubmit()
   ↓
7. Validate inputs
   ├─ Invalid? → Show errors
   └─ Valid? → Continue
   ↓
8. Check for duplicate student_id
   ├─ Exists? → Show error
   └─ Unique? → Continue
   ↓
9. Insert into user_profiles
   ├─ Error? → Show error
   └─ Success? → Redirect to /courses
```

## Security Layers

```
┌─────────────────────────────────────────┐
│ Layer 1: Middleware                     │
│ • Checks authentication                 │
│ • Checks profile completion             │
│ • Redirects appropriately               │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│ Layer 2: Page Component                 │
│ • Re-checks session                     │
│ • Re-checks profile                     │
│ • Client-side validation                │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│ Layer 3: Database RLS                   │
│ • user_id must match auth.uid()         │
│ • UNIQUE constraint on student_id       │
│ • CHECK constraint on gender            │
└─────────────────────────────────────────┘
```

## User Experience Timeline

```
New User First Visit:
0s    → Lands on homepage
5s    → Clicks "Sign in with Google"
7s    → Google OAuth screen
10s   → Grants permissions
12s   → Redirects to /auth/callback
13s   → Checks profile (none found)
14s   → Redirects to /onboarding
15s   → Sees onboarding form
45s   → Fills out form
47s   → Submits form
48s   → Profile created
49s   → Redirects to /courses
50s   → Full access granted!

Returning User:
0s    → Lands on /courses
1s    → Middleware checks auth (✓)
2s    → Middleware checks profile (✓)
3s    → Access granted immediately
```

---

**Flow Type**: Multi-Step Authentication + Onboarding  
**Total Steps (New User)**: 10 steps  
**Total Steps (Returning User)**: 3 steps  
**Average Time (New User)**: ~50 seconds  
**Average Time (Returning User)**: ~3 seconds
