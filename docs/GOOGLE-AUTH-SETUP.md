# Google Authentication Setup Guide

## Overview

The application now requires **Google authentication** for all users before accessing any course resources. Only the homepage is public.

## 🔒 Protected Routes

All routes require authentication except:
- `/` - Homepage (public)
- `/auth/login` - Login page
- `/auth/callback` - OAuth callback handler

### Requires Login:
- `/courses` - All courses listing
- `/course/[id]` - Individual course pages
- `/admin` - Admin dashboard
- All other pages

## Configuration Steps

### 1. Enable Google Provider in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication → Providers**
3. Find **Google** in the list
4. Toggle it to **Enabled**

### 2. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**

### 3. Configure OAuth Consent Screen

1. Click **Configure Consent Screen**
2. Choose **External** (for public access)
3. Fill in the required fields:
   - **App name**: Missing Semester
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Add scopes (recommended):
   - `userinfo.email`
   - `userinfo.profile`
   - `openid`
5. Save and Continue

### 4. Create OAuth 2.0 Client ID

1. **Application type**: Web application
2. **Name**: Missing Semester Production
3. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   http://localhost:3001
   https://your-production-domain.com
   ```
4. **Authorized redirect URIs**:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3001/auth/callback
   https://your-production-domain.com/auth/callback
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

### 5. Add Credentials to Supabase

1. Back in Supabase Dashboard → Authentication → Providers → Google
2. Paste your **Client ID**
3. Paste your **Client Secret**
4. **Redirect URL** (copy this from Supabase):
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
5. Click **Save**

### 6. Environment Variables

No additional environment variables needed - Supabase handles OAuth configuration.

## User Flow

### First-Time User
```
1. Visit /courses or any protected page
   ↓
2. Redirected to /auth/login
   ↓
3. Click "Sign in with Google"
   ↓
4. Google OAuth consent screen
   ↓
5. Grant permissions
   ↓
6. Redirect to /auth/callback
   ↓
7. Session created
   ↓
8. Redirect to originally requested page (or /courses)
```

### Returning User
```
1. Visit site
   ↓
2. Session cookie exists
   ↓
3. Access granted immediately
```

### Logout Flow
```
1. User clicks logout (if implemented)
   ↓
2. Session cleared
   ↓
3. Redirect to /auth/login
   ↓
4. Must sign in again to access resources
```

## Testing

### Test Authentication
1. Clear browser cookies
2. Visit `http://localhost:3001/courses`
3. Should redirect to `/auth/login`
4. Click "Sign in with Google"
5. Complete OAuth flow
6. Should redirect back to `/courses`

### Test Protected Routes
```bash
# Without login - should redirect to /auth/login
http://localhost:3001/courses
http://localhost:3001/course/abc123
http://localhost:3001/admin

# Public - should work without login
http://localhost:3001/
```

## Troubleshooting

### "Redirect URI mismatch" Error
**Problem**: Google OAuth shows redirect URI error

**Solution**: 
1. Check redirect URIs in Google Cloud Console
2. Ensure they exactly match (including http/https)
3. Add both Supabase callback AND your app callback:
   - `https://<project>.supabase.co/auth/v1/callback`
   - `http://localhost:3001/auth/callback`

### "Error 400: redirect_uri_mismatch"
**Problem**: The redirect URI in the request doesn't match

**Solution**:
- Make sure you added the Supabase callback URL to Google Console
- Format: `https://xxxxx.supabase.co/auth/v1/callback`

### "This app isn't verified"
**Problem**: Google showing warning screen

**Solution** (for development):
- Click "Advanced"
- Click "Go to Missing Semester (unsafe)"
- This is normal for development

**Solution** (for production):
- Go through Google's app verification process
- Submit for OAuth verification

### Login Loop
**Problem**: Keeps redirecting to login

**Solution**:
1. Clear cookies
2. Check Supabase Auth logs for errors
3. Verify Google credentials are correct
4. Check browser console for errors

### Session Not Persisting
**Problem**: Logged out after page refresh

**Solution**:
1. Check cookies are enabled
2. Verify Supabase URL/Key in environment
3. Check browser privacy settings

## Security Features

### 1. Route Protection
- Middleware checks authentication on every request
- Unauthorized users redirected to login
- Original destination preserved in redirect

### 2. Session Management
- Secure HTTP-only cookies
- Automatic session refresh
- Server-side validation

### 3. OAuth Security
- State parameter for CSRF protection
- Secure token exchange
- Automatic token refresh

## Code Changes Made

### Modified Files:

1. **`src/middleware.ts`**
   - Added authentication check for all routes
   - Public routes whitelist
   - Redirect to login with return URL

2. **`src/app/auth/login/page.tsx`**
   - Changed from Microsoft to Google OAuth
   - Removed "Continue as Guest" option
   - Updated UI and branding

3. **`src/app/auth/callback/page.tsx`**
   - Added redirect URL handling
   - Improved error handling

## Production Deployment

### Before Deploying:

1. ✅ Configure Google OAuth with production URL
2. ✅ Add production redirect URIs to Google Console
3. ✅ Update Supabase site URL
4. ✅ Test authentication flow
5. ✅ Verify all protected routes

### Redirect URIs for Production:
```
https://your-domain.com/auth/callback
https://<project-ref>.supabase.co/auth/v1/callback
```

## Alternative Providers

To add more OAuth providers:

### Microsoft (Azure AD)
```typescript
provider: 'azure'
```

### GitHub
```typescript
provider: 'github'
```

### Discord
```typescript
provider: 'discord'
```

Just enable the provider in Supabase and configure credentials!

## Rollback Plan

If you need to remove authentication requirement:

1. **Remove middleware protection**:
   - Remove authentication check from `src/middleware.ts`

2. **Make login optional**:
   - Add back "Continue as Guest" button
   - Remove redirect logic

3. **Keep authentication for admin only**:
   - Only protect `/admin/*` routes
   - Leave other routes public

---

**Status**: ✅ Implemented  
**Provider**: Google OAuth 2.0  
**Required**: Yes (except homepage)  
**Fallback**: None (login required)  
**Admin Access**: Also requires Google login (or use `/admin` directly)
