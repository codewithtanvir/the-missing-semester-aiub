# View Profile Feature

## Overview

Users can now view their complete profile information in a dedicated profile page. This includes personal information from onboarding and Google account details.

## Access

**Route**: `/profile`

**Navigation**:
- Desktop: "Profile" button in top navigation (shows user icon + text)
- Mobile: "Profile" link in hamburger menu
- Only visible when user is authenticated

## Profile Page Sections

### 1. Personal Information Card
Displays data from the onboarding form:
- ✅ **Full Name** - User's complete name
- ✅ **Student ID** - Unique identifier (format: XX-XXXXX-X)
- ✅ **Gender** - Selected gender option
- ✅ **Profile Created** - Date and time profile was created

### 2. Account Information Card
Displays Google authentication data:
- ✅ **Email Address** - Google account email (with Google badge)
- ✅ **Account Created** - When Google account was first used
- ✅ **Last Sign In** - Most recent login timestamp

### 3. Account Actions Card
User account management:
- ✅ **Sign Out Button** - Ends current session and redirects to homepage
- ℹ️ **Information Notice** - Explains that profile data cannot be edited

### 4. Quick Stats Card
Activity overview:
- ✅ **Account Status** - Active/Inactive
- ✅ **Authentication** - Google OAuth
- ✅ **Profile Status** - Complete/Incomplete

## Features

### Visual Design
- Clean card-based layout
- Color-coded sections:
  - Blue: Personal & Statistics
  - Lime/Green: Account Info
  - Orange: Actions & Warnings
- Icons for each section
- Responsive grid layout

### Data Display
- Large, readable fonts for important information
- Monospace font for Student ID
- Formatted dates with full month names
- Visual badges for verification status

### Navigation
- "Back to Courses" button in header
- Profile link in main navigation
- Breadcrumb-style navigation

## User Flow

```
1. User clicks "Profile" in navigation
   ↓
2. Page loads profile data
   ├─ Check authentication
   ├─ Load user_profiles data
   └─ Load auth.users data
   ↓
3. Display all information in cards
   ↓
4. User can:
   ├─ View their information
   ├─ Sign out
   └─ Return to courses
```

## Security & Validation

### Authentication Check
- Middleware ensures user is authenticated
- Page redirects to login if no session
- Redirects to onboarding if no profile

### Data Privacy
- Users can only view their own profile
- RLS policies prevent accessing others' data
- Session-based access control

### Read-Only Data
- Profile information cannot be edited by users
- Prevents accidental data changes
- Contact admin notice for corrections

## Technical Implementation

### Files Created/Modified

1. **`src/app/profile/page.tsx`** (NEW)
   - Profile viewing page
   - Data loading logic
   - Sign out functionality

2. **`src/components/navigation.tsx`** (MODIFIED)
   - Added Profile button to desktop nav
   - Added Profile link to mobile menu
   - Authentication state detection
   - Only shows when logged in

### Component Structure

```tsx
ProfilePage
├── Header (Title + Back Button)
├── Personal Information Card
│   ├── Full Name
│   ├── Student ID (with Verified badge)
│   ├── Gender
│   └── Profile Created Date
├── Account Information Card
│   ├── Email (with Google badge)
│   ├── Account Created Date
│   └── Last Sign In Date
├── Account Actions Card
│   ├── Sign Out Button
│   └── Information Notice
└── Quick Stats Card
    ├── Account Status
    ├── Authentication Type
    └── Profile Status
```

### Data Loading

```typescript
// Load profile from user_profiles table
const { data: profileData } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', session.user.id)
  .single();

// Auth data from session
const authData = {
  email: session.user.email,
  created_at: session.user.created_at,
  last_sign_in_at: session.user.last_sign_in_at
};
```

## UI Components Used

- **Card**: Container for sections
- **CardHeader**: Title and description
- **CardContent**: Main content area
- **Button**: Actions (Back, Sign Out)
- **Badge**: Status indicators (Verified, Google)

## Styling & Colors

### Card Color Schemes

**Personal Info** (Blue):
- Border: `border-blue-200`
- Background: `bg-blue-50`
- Text: `text-blue-700`, `text-blue-900`

**Account Info** (Lime/Green):
- Badge: `bg-lime-500`
- Icon: `text-lime-500`

**Actions** (Orange):
- Border: `border-orange-200`
- Background: `bg-orange-50`
- Button: `bg-orange-500 hover:bg-orange-600`

**Stats** (Mixed):
- Blue, Lime, Orange for different metrics

## Icons Used

```tsx
// User Profile
<path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />

// Email/Account
<path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />

// Sign Out
<path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />

// Stats/Chart
<path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
```

## Responsive Design

### Desktop (≥768px)
- Side-by-side layout for stats (3 columns)
- Wider cards with more spacing
- Profile button in main nav

### Mobile (<768px)
- Stacked card layout
- Single column stats
- Profile link in hamburger menu
- Touch-friendly buttons

## Sign Out Flow

```
1. User clicks "Sign Out" button
   ↓
2. Confirmation (handled by button click)
   ↓
3. Call supabase.auth.signOut()
   ↓
4. Session destroyed
   ↓
5. Redirect to homepage (/)
   ↓
6. User is logged out
```

## Loading States

### Initial Load
```
┌────────────────────────────┐
│                            │
│    ⚪ Loading spinner      │
│    Loading profile...      │
│                            │
└────────────────────────────┘
```

### Loaded State
- All cards visible
- Data populated
- Actions enabled

## Error Handling

### No Profile Found
- Error code: `PGRST116`
- Action: Redirect to `/onboarding`
- Ensures profile completion

### No Session
- Action: Redirect to `/auth/login`
- Middleware handles authentication

### Data Loading Error
- Logs error to console
- Shows loading state
- Graceful degradation

## Future Enhancements

### Potential Features

1. **Profile Editing**
   - Edit full name
   - Update gender
   - Keep student ID immutable
   - Add admin approval for sensitive changes

2. **Profile Picture**
   - Display Google profile picture
   - Upload custom avatar
   - Crop and resize functionality
   - Supabase Storage integration

3. **Activity History**
   - Files downloaded
   - Courses accessed
   - Login history
   - Activity timeline

4. **Additional Info**
   - Department/Major
   - Batch/Year
   - Phone number
   - Bio/Description

5. **Preferences**
   - Email notifications
   - Dark mode toggle
   - Language selection
   - Privacy settings

6. **Security**
   - Two-factor authentication
   - Active sessions list
   - Login devices
   - Security alerts

## Testing Checklist

- [ ] Access `/profile` without auth → Redirects to `/auth/login`
- [ ] Access `/profile` with auth but no profile → Redirects to `/onboarding`
- [ ] Access `/profile` with complete profile → Shows all data
- [ ] Profile button visible in nav when authenticated
- [ ] Profile button hidden when not authenticated
- [ ] All data fields display correctly
- [ ] Student ID shows in monospace font
- [ ] Dates formatted properly (Month Day, Year, Time)
- [ ] Sign Out button works correctly
- [ ] "Back to Courses" button navigates properly
- [ ] Mobile view displays correctly
- [ ] All badges show proper colors
- [ ] Cards are responsive
- [ ] Loading state displays before data loads

## Routes Summary

| Route | Public | Auth Required | Profile Required | Purpose |
|-------|--------|---------------|------------------|---------|
| `/` | ✅ | ❌ | ❌ | Homepage |
| `/auth/login` | ✅ | ❌ | ❌ | Login |
| `/auth/callback` | ✅ | ❌ | ❌ | OAuth callback |
| `/onboarding` | ❌ | ✅ | ❌ | Complete profile |
| `/profile` | ❌ | ✅ | ✅ | View profile |
| `/courses` | ❌ | ✅ | ✅ | All courses |
| `/course/[id]` | ❌ | ✅ | ✅ | Course detail |
| `/admin` | ❌ | ✅ | ✅ | Admin dashboard |

## Middleware Updates

No middleware changes needed - `/profile` is automatically protected because it's not in the public routes list. Users must:
1. Be authenticated
2. Have completed profile

Both checks are already handled by existing middleware.

---

**Status**: ✅ Implemented  
**Route**: `/profile`  
**Access**: Authenticated users only  
**Data Source**: `user_profiles` + `auth.users`  
**Editable**: No (read-only)  
**Navigation**: Top nav + Mobile menu
