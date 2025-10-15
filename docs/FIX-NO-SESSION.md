# Fix "no_session" Error - Critical Steps

## ⚠️ The Problem

You're getting `no_session` error because the OAuth flow isn't creating a session properly.

## ✅ Solution: Check Supabase Azure Configuration

### Step 1: Verify Azure Provider Settings in Supabase

1. Go to **Supabase Dashboard**
2. Click **Authentication** → **Providers**
3. Find **Azure** (scroll down)
4. Make sure:
   - ✅ **Enabled** toggle is ON
   - ✅ **Azure Client ID** is filled (from Azure Portal → App Registration → Overview)
   - ✅ **Azure Secret** is filled (from Azure Portal → App Registration → Certificates & secrets)
   - ✅ **Azure Tenant** is set to: `common` (important!)
   
5. **Copy the Redirect URL shown in Supabase** (looks like: `https://xxxxx.supabase.co/auth/v1/callback`)
6. Click **"Save"**

### Step 2: Add Redirect URI to Azure

1. Go to **Azure Portal** (portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click on your app
4. Click **Authentication** (left sidebar)
5. Under **Platform configurations** → **Web**
6. Click **"Add URI"**
7. Paste the Supabase redirect URL: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
8. Click **"Save"**

### Step 3: Verify API Permissions

Still in Azure Portal, your app registration:

1. Click **API permissions** (left sidebar)
2. You should see:
   - ✅ Microsoft Graph → email
   - ✅ Microsoft Graph → openid  
   - ✅ Microsoft Graph → profile
   - ✅ Microsoft Graph → User.Read
3. Click **"Grant admin consent for [Your Organization]"**
4. Confirm by clicking **"Yes"**

### Step 4: Check Redirect URL Configuration

**CRITICAL:** The redirect URL in Azure must match Supabase EXACTLY.

❌ Wrong:
- `https://xxxxx.supabase.co/auth/v1/callback/` (has trailing slash)
- `http://xxxxx.supabase.co/auth/v1/callback` (http instead of https)
- `https://xxxxx.supabase.co/auth/callback` (missing /v1)

✅ Correct:
- `https://xxxxx.supabase.co/auth/v1/callback` (exact match from Supabase)

## 🔄 Test Again

After making these changes:

1. **Clear browser cookies/cache** or use incognito mode
2. Go to http://localhost:3000/auth/login
3. Click "Sign in with Microsoft"
4. **Open browser console (F12)** to see detailed logs
5. Complete Microsoft login

### What to Look For:

**In Browser Console:**
- Should see: "Callback params: { hasAccessToken: true, hasRefreshToken: true, ... }"
- Should see: "Session created successfully: your-email@example.com"
- Then redirects to homepage

**If Still No Session:**

Check console logs for:
- `hasAccessToken: false` → Azure redirect URL wrong
- `hasRefreshToken: false` → Azure configuration issue
- `Session error: ...` → Read the specific error message

## 🎯 Most Common Issue

**The redirect URL mismatch is the #1 cause of "no_session"**

To verify:
1. In Supabase → Authentication → Providers → Azure
2. Look at "Callback URL (for OAuth)" 
3. Copy it EXACTLY
4. Make sure this EXACT string is in Azure Portal → Your App → Authentication → Redirect URIs

## 🔍 Debug Mode

The updated callback page now shows detailed logs. Check browser console for:

```javascript
Callback params: {
  hasAccessToken: true/false,  // Should be true
  hasRefreshToken: true/false, // Should be true
  hasCode: true/false,
  hash: "...",
  search: "..."
}
```

If `hasAccessToken` and `hasRefreshToken` are both false, the OAuth flow didn't complete.

## 📝 Quick Checklist

Run through this list:

- [ ] Azure provider **enabled** in Supabase
- [ ] Client ID and Secret **saved** in Supabase (click Save!)
- [ ] Azure Tenant set to `common`
- [ ] Redirect URI from Supabase **copied exactly** to Azure
- [ ] No trailing slash in redirect URI
- [ ] API permissions added in Azure
- [ ] Admin consent **granted** in Azure
- [ ] Tested in **incognito mode** (to avoid cookie issues)

## 🆘 Still Not Working?

Try this diagnostic:

1. Open http://localhost:3000/auth/login
2. Open browser DevTools (F12) → Console tab
3. Click "Sign in with Microsoft"
4. **Copy everything from the console**
5. Look for error messages or "Session error"

The console will now show exactly what's happening in the OAuth flow.
