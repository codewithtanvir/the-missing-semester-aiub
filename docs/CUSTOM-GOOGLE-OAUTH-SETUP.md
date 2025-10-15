# Custom Google OAuth Setup Guide

**Goal**: Change Google login from "Continue to supabase.co" to showing "AIUB Files" branding  
**Status**: Ready to implement  
**Time Required**: 15-20 minutes  
**Date**: October 15, 2025

---

## 🎯 What This Achieves

### Before (Current):
```
Choose an account
to continue to zkjoqhkwdvotsavwqwkt.supabase.co
```

### After (With Custom OAuth):
```
"AIUB Files" wants to access your Google Account

[Your App Logo]

This will allow AIUB Files to:
• View your email address
• View your basic profile info

[Continue] [Cancel]
```

**Much better branding!** ✅

---

## 📋 Prerequisites

Before starting, you need:
- [ ] Google account (your personal or AIUB Gmail)
- [ ] Access to https://console.cloud.google.com
- [ ] Logo image (120x120px PNG) for your app
- [ ] Privacy Policy page: https://aiubfiles.app/privacy ✅ (Already created!)
- [ ] Terms of Service page: https://aiubfiles.app/terms ✅ (Already created!)

---

## 🚀 Step-by-Step Setup

### Part 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   ```
   https://console.cloud.google.com
   ```

2. **Create New Project**
   - Click dropdown at top: "Select a project"
   - Click "NEW PROJECT"
   - Project name: `AIUB Files`
   - Organization: (leave as "No organization")
   - Click **"CREATE"**
   - Wait 10-20 seconds for project creation

3. **Select Your New Project**
   - Click "Select a project" dropdown again
   - Click on **"AIUB Files"**
   - Verify it's selected (shown at top)

---

### Part 2: Enable Required APIs

1. **Navigate to APIs**
   - Left sidebar → "APIs & Services" → "Library"
   - Or use this direct link: https://console.cloud.google.com/apis/library

2. **Enable Google+ API** (Required for OAuth)
   - Search: `Google+ API`
   - Click on "Google+ API"
   - Click **"ENABLE"**
   - Wait for activation

---

### Part 3: Configure OAuth Consent Screen

1. **Navigate to Consent Screen**
   - Left sidebar → "APIs & Services" → "OAuth consent screen"
   - Or: https://console.cloud.google.com/apis/credentials/consent

2. **Choose User Type**
   - Select: ○ **External** (allows any Google account to login)
   - Click **"CREATE"**

3. **Fill OAuth Consent Screen - Page 1: App Information**

   **App name:**
   ```
   AIUB Files
   ```

   **User support email:**
   ```
   [Your email address] (select from dropdown)
   ```

   **App logo:** (Optional but recommended)
   - Click "Upload logo"
   - Upload 120x120px PNG image
   - Suggested: Blue background with "AF" or book icon

   **App domain - Application home page:**
   ```
   https://aiubfiles.app
   ```

   **App domain - Application privacy policy link:**
   ```
   https://aiubfiles.app/privacy
   ```

   **App domain - Application terms of service link:**
   ```
   https://aiubfiles.app/terms
   ```

   **Authorized domains:**
   - Click "+ ADD DOMAIN"
   - Enter: `aiubfiles.app`
   - Press Enter
   - Click "+ ADD DOMAIN" again
   - Enter: `supabase.co` (Required for Supabase callback)
   - Press Enter

   **Developer contact information:**
   ```
   [Your email address]
   ```

   Click **"SAVE AND CONTINUE"**

4. **Page 2: Scopes**

   Click **"ADD OR REMOVE SCOPES"**

   In the filter, search for:
   - `userinfo.email` → Check the box
   - `userinfo.profile` → Check the box

   Or manually add:
   ```
   https://www.googleapis.com/auth/userinfo.email
   https://www.googleapis.com/auth/userinfo.profile
   ```

   Click **"UPDATE"**

   Click **"SAVE AND CONTINUE"**

5. **Page 3: Test users** (Optional for now)

   - Leave empty (or add your email for testing)
   - Click **"SAVE AND CONTINUE"**

6. **Page 4: Summary**

   - Review everything
   - Click **"BACK TO DASHBOARD"**

---

### Part 4: Create OAuth 2.0 Credentials

1. **Navigate to Credentials**
   - Left sidebar → "APIs & Services" → "Credentials"
   - Or: https://console.cloud.google.com/apis/credentials

2. **Create Credentials**
   - Click **"+ CREATE CREDENTIALS"** (at top)
   - Select **"OAuth client ID"**

3. **Configure OAuth Client**

   **Application type:**
   ```
   Web application
   ```

   **Name:**
   ```
   AIUB Files Web Client
   ```

   **Authorized JavaScript origins:**
   - Click "+ Add URI"
   - Enter: `https://aiubfiles.app`
   - Click "+ Add URI" again
   - Enter: `https://www.aiubfiles.app`

   **Authorized redirect URIs:**
   - Click "+ Add URI"
   - Enter this EXACTLY (from your Supabase):
   ```
   https://zkjoqhkwdvotsavwqwkt.supabase.co/auth/v1/callback
   ```
   ⚠️ **IMPORTANT**: This must match your Supabase project URL exactly!

   Click **"CREATE"**

4. **Save Your Credentials**

   A popup will appear with:
   ```
   Your Client ID: 
   123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com

   Your Client Secret:
   GOCSPX-abcdefghijklmnopqrstuvwxyz
   ```

   **⚠️ IMPORTANT**: Copy both of these NOW!
   - Client ID: (starts with numbers, ends with .apps.googleusercontent.com)
   - Client Secret: (starts with GOCSPX-)

   Keep them somewhere safe (you'll need them in next step)

   Click **"OK"**

---

### Part 5: Update Supabase with New Credentials

1. **Go to Supabase Dashboard**
   ```
   https://supabase.com/dashboard
   ```

2. **Select Your Project**
   - Click on: **zkjoqhkwdvotsavwqwkt**

3. **Navigate to Google Provider Settings**
   - Left sidebar → **"Authentication"**
   - Click **"Providers"** tab
   - Scroll down and click on **"Google"**

4. **Enable and Configure**

   - Toggle: **"Enable Sign in with Google"** → ON (if not already)

   **Google Client ID:**
   ```
   [Paste the Client ID you copied]
   Example: 123456789012-abc...xyz.apps.googleusercontent.com
   ```

   **Google Client Secret:**
   ```
   [Paste the Client Secret you copied]
   Example: GOCSPX-abc...xyz
   ```

   **Redirect URL (should already be there):**
   ```
   https://zkjoqhkwdvotsavwqwkt.supabase.co/auth/v1/callback
   ```
   (This is shown for reference - don't change it)

   Click **"Save"**

---

### Part 6: Test the New OAuth Flow

1. **Clear Browser Cookies**
   - Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
   - Select "Cookies and other site data"
   - Select "All time"
   - Click "Clear data"

2. **Test Login**
   - Visit: https://aiubfiles.app/auth/login
   - Or use incognito mode: `Ctrl+Shift+N`

3. **Click "Sign in with Google"**

4. **Verify New OAuth Screen**

   You should now see:
   ```
   "AIUB Files" wants to access your Google Account

   [Your logo if uploaded]

   This will allow AIUB Files to:
   • View your email address
   • View your basic profile info

   Make sure you trust AIUB Files
   Learn about how AIUB Files will handle your data by reviewing its
   privacy policy and terms of service.

   [Cancel] [Continue]
   ```

   **✅ SUCCESS!** No more "supabase.co" shown!

5. **Complete Login**
   - Click "Continue"
   - Select your Google account
   - Should redirect back to aiubfiles.app
   - You should be logged in ✅

---

## ✅ Verification Checklist

After setup, verify:

- [ ] OAuth screen shows "AIUB Files" (not supabase.co)
- [ ] Your logo appears (if uploaded)
- [ ] Privacy policy link works
- [ ] Terms of service link works
- [ ] Login completes successfully
- [ ] Redirected back to aiubfiles.app
- [ ] User info appears in dashboard
- [ ] Can access courses/files
- [ ] Logout works
- [ ] Login again works

---

## 🔧 Troubleshooting

### Error: "Redirect URI mismatch"

**Cause**: Redirect URI doesn't match Google Console

**Fix**:
1. Go to Google Console → Credentials
2. Click your OAuth client
3. Under "Authorized redirect URIs", verify:
   ```
   https://zkjoqhkwdvotsavwqwkt.supabase.co/auth/v1/callback
   ```
4. Must match EXACTLY (no trailing slash, correct project ID)

### Error: "App Not Verified"

**Cause**: OAuth consent screen not published

**Fix**:
1. Google Console → OAuth consent screen
2. Click "PUBLISH APP"
3. Confirm publishing
4. May take a few minutes to propagate

**Or**: Add yourself as test user (if app stays in testing)

### Error: "Invalid Client ID"

**Cause**: Wrong credentials in Supabase

**Fix**:
1. Check you copied correct Client ID (should end with .apps.googleusercontent.com)
2. Check for extra spaces when pasting
3. Re-copy from Google Console → Credentials

### Error: Still seeing "supabase.co"

**Cause**: Browser cache or old session

**Fix**:
1. Clear browser cookies completely
2. Use incognito mode
3. Try different browser
4. Wait 5 minutes for Google to update

---

## 📱 Mobile Testing

After setup, test on mobile:

1. **Visit on mobile browser**
   - https://aiubfiles.app/auth/login

2. **Click "Sign in with Google"**
   - Should show "AIUB Files" branding
   - Not show supabase.co

3. **Complete login**
   - Select account
   - Grant permissions
   - Redirect back to app

4. **Install PWA**
   - Wait for install prompt
   - Install app
   - Test login persists

---

## 🎓 Student Experience After Setup

### What students will see:

1. **Visit aiubfiles.app**
2. **Click "Sign in with Google"**
3. **See branded OAuth screen:**
   ```
   "AIUB Files" wants to access your Google Account
   
   This will allow AIUB Files to:
   • View your email address
   • View your basic profile info
   ```
4. **Click Continue**
5. **Select Google account**
6. **Logged in!**

**Much more professional!** ✅

---

## 📊 Monitoring

### Check OAuth Usage

**In Google Cloud Console:**
- APIs & Services → Credentials
- Click your OAuth client
- See usage stats

**In Supabase:**
- Authentication → Users
- See which users logged in via Google

---

## 🔐 Security Best Practices

1. **Keep Client Secret secure**
   - Never commit to Git
   - Only in Supabase dashboard
   - Regenerate if exposed

2. **Review authorized domains**
   - Only aiubfiles.app
   - Remove test domains before launch

3. **Monitor OAuth logs**
   - Check for suspicious login attempts
   - Review user list regularly

4. **Publish OAuth app**
   - Remove "Unverified app" warning
   - Google Console → OAuth consent screen → Publish App

---

## ✨ You're Done!

Your Google OAuth is now branded with:
- ✅ Your app name ("AIUB Files")
- ✅ Your logo (if uploaded)
- ✅ Your privacy policy
- ✅ Your terms of service
- ✅ Professional appearance
- ✅ No "supabase.co" shown to users

**Students will see your branding, not third-party domains!** 🎉

---

## 📧 Next Steps

1. **Deploy privacy/terms pages**
   - Push code to GitHub
   - Vercel auto-deploys
   - Verify: https://aiubfiles.app/privacy
   - Verify: https://aiubfiles.app/terms

2. **Complete OAuth setup**
   - Follow this guide step-by-step
   - Test in incognito mode
   - Verify branding appears

3. **Test thoroughly**
   - Test on desktop
   - Test on mobile
   - Test with different Google accounts
   - Test PWA installation after login

4. **Announce to students**
   - Share aiubfiles.app
   - Mention it works with any Gmail
   - Provide support email

---

**Ready to start? Follow Part 1 above!** 🚀
