# Customizing Google OAuth Display Name

**Issue**: Google shows "Continue to zkjoqhkwdvotsavwqwkt.supabase.co" instead of "aiubfiles.app"  
**Desired**: "Continue to aiubfiles.app"  
**Date**: October 15, 2025

---

## 🔍 Why Google Shows "supabase.co"

Google's OAuth screen displays the **OAuth redirect URI domain**, which is:
```
https://zkjoqhkwdvotsavwqwkt.supabase.co/auth/v1/callback
```

This is because:
1. Supabase handles the OAuth callback (not your domain directly)
2. Google's OAuth requires a verified redirect URI
3. The redirect URI must match your OAuth app configuration
4. This is standard for third-party auth services (Supabase, Auth0, Firebase, etc.)

---

## ❌ What You CANNOT Change

You **cannot** change what domain Google displays during OAuth because:
- It's determined by the OAuth redirect URI
- Supabase controls the callback endpoint
- Google enforces this for security
- This is not customizable through Supabase settings

---

## ✅ What You CAN Do - 3 Solutions

### Solution 1: Set Up Custom OAuth App (Recommended)

Use your own Google OAuth credentials with your domain:

**⚠️ ADVANCED - Requires custom domain email verification**

1. **Create Google Cloud Project**
   - Go to: https://console.cloud.google.com
   - Create new project: "AIUB Files"

2. **Set Up OAuth Consent Screen**
   - APIs & Services → OAuth consent screen
   - User Type: External
   - App name: **"AIUB Files"** ← This will show on login screen!
   - App logo: Upload your logo
   - Authorized domains: Add **aiubfiles.app**
   - Developer contact: Your email

3. **Create OAuth Credentials**
   - APIs & Services → Credentials
   - Create credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Name: "AIUB Files Web"
   - Authorized redirect URIs:
     ```
     https://zkjoqhkwdvotsavwqwkt.supabase.co/auth/v1/callback
     ```
   - Copy Client ID and Client Secret

4. **Update Supabase**
   - Supabase Dashboard → Authentication → Providers → Google
   - Replace Client ID with your new one
   - Replace Client Secret with your new one
   - Save

**Result**: Google will show:
```
"AIUB Files" wants to access your Google Account
```
Instead of showing domain, it shows your app name! ✅

---

### Solution 2: Use Supabase Custom SMTP (Partial Fix)

This doesn't fix Google OAuth display, but improves overall branding:

1. **Set Up Email Provider**
   - Supabase → Authentication → Email Templates
   - Configure custom SMTP with @aiubfiles.app email
   - Customize email templates with your branding

2. **Result**:
   - OAuth still shows supabase.co (can't change)
   - But email confirmations come from @aiubfiles.app
   - Better branding overall

---

### Solution 3: Accept Current Behavior (Easiest)

Most apps using third-party auth show the auth provider's domain:

**Examples**:
- Apps using Auth0 → "Continue to auth0.com"
- Apps using Firebase → "Continue to firebaseapp.com"
- Apps using Supabase → "Continue to supabase.co"

**This is normal and users are familiar with it!**

**Educate Your Students**:
Create a help guide explaining:
- "You'll see supabase.co - this is our authentication service"
- "It's safe and normal"
- "You'll be redirected back to aiubfiles.app after login"

---

## 🎯 Recommended Approach: Custom OAuth App

### Step-by-Step Implementation

#### Part 1: Google Cloud Console

1. **Go to Google Cloud Console**
   ```
   https://console.cloud.google.com
   ```

2. **Create New Project**
   - Click "Select a project" → "New Project"
   - Project name: `AIUB Files`
   - Click "Create"

3. **Enable Google+ API**
   - APIs & Services → Library
   - Search: "Google+ API"
   - Click "Enable"

4. **Configure OAuth Consent Screen**
   - APIs & Services → OAuth consent screen
   - Select: "External"
   - Click "Create"

   **App Information:**
   ```
   App name: AIUB Files
   User support email: [your email]
   App logo: [upload your logo - 120x120px PNG]
   ```

   **App domain:**
   ```
   Application home page: https://aiubfiles.app
   Application privacy policy: https://aiubfiles.app/privacy (create this page)
   Application terms of service: https://aiubfiles.app/terms (create this page)
   ```

   **Authorized domains:**
   ```
   aiubfiles.app
   ```

   **Developer contact:**
   ```
   [your email]
   ```

   Click "Save and Continue"

   **Scopes:**
   - Add: `userinfo.email`
   - Add: `userinfo.profile`
   - Click "Save and Continue"

   **Test users (optional):**
   - Add your email for testing
   - Click "Save and Continue"

5. **Create OAuth Credentials**
   - APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth client ID"
   
   **Application type:** Web application
   
   **Name:** AIUB Files Web Client
   
   **Authorized JavaScript origins:**
   ```
   https://aiubfiles.app
   https://www.aiubfiles.app
   ```
   
   **Authorized redirect URIs:**
   ```
   https://zkjoqhkwdvotsavwqwkt.supabase.co/auth/v1/callback
   ```
   
   Click "Create"

6. **Copy Credentials**
   You'll see:
   ```
   Client ID: 123456789-abc...apps.googleusercontent.com
   Client Secret: GOCSPX-abc...xyz
   ```
   **Save these!**

#### Part 2: Update Supabase

1. **Go to Supabase Dashboard**
   ```
   https://supabase.com/dashboard
   ```

2. **Navigate to Google Provider**
   - Project: zkjoqhkwdvotsavwqwkt
   - Authentication → Providers → Google

3. **Update Credentials**
   - Paste your new Client ID
   - Paste your new Client Secret
   - Keep redirect URL as shown (should be supabase.co/auth/v1/callback)
   - Click "Save"

4. **Test**
   - Visit: https://aiubfiles.app/auth/login
   - Click "Sign in with Google"
   - You should now see: **"AIUB Files wants to access your Google Account"**

---

## 📋 What Students Will See - Before vs After

### Before (Current - Using Supabase Default):
```
Choose an account
to continue to zkjoqhkwdvotsavwqwkt.supabase.co

[Google Account List]
```

### After (With Custom OAuth App):
```
"AIUB Files" wants to access your Google Account

This will allow AIUB Files to:
• View your email address  
• View your basic profile info

[Continue] [Cancel]
```

**Much better branding!** ✅

---

## 🔐 Privacy Policy & Terms (Required)

Google requires these pages. Create them:

### Create Privacy Policy Page

<function_calls>
<invoke name="create_file">
<parameter name="content"># Privacy Policy - AIUB Files

**Effective Date**: October 15, 2025  
**Last Updated**: October 15, 2025

---

## Information We Collect

When you use AIUB Files (aiubfiles.app), we collect:

### Information from Google
- Email address
- Full name
- Profile picture (if set)
- Google User ID

### Usage Information
- Pages visited
- Files downloaded
- Login times
- Device type

---

## How We Use Your Information

We use your information to:
- Authenticate your identity
- Provide access to course materials
- Track course usage (for instructors)
- Improve the platform

---

## Information Sharing

We DO NOT:
- Sell your information
- Share with third parties (except Google for authentication)
- Use for marketing purposes
- Share with other students

We DO share with:
- Google (for authentication only)
- Supabase (our database provider)

---

## Data Security

- All connections use HTTPS encryption
- Data stored in secure Supabase database
- Regular security updates
- Access controls for admin functions

---

## Your Rights

You can:
- Access your information
- Delete your account
- Opt out of usage tracking
- Request data export

---

## Contact

Questions? Email: [your-email]@aiub.edu

---

## Changes to Policy

We may update this policy. Check this page for updates.
