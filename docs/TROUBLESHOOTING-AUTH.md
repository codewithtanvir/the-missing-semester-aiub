# Troubleshooting Microsoft Authentication

## Common Issues and Solutions

### Issue: "Can't signup with Microsoft"

Here are the most common causes and how to fix them:

## ✅ Checklist Before Testing:

### 1. **Supabase Azure Provider Configuration**

Go to: **Supabase Dashboard → Authentication → Providers → Azure**

Verify:
- ✅ Azure provider is **ENABLED** (toggle must be ON)
- ✅ **Azure Client ID** is filled in (from Azure AD app)
- ✅ **Azure Secret** is filled in (from Azure AD app)
- ✅ **Azure Tenant** is set:
  - Use `common` for personal Microsoft accounts
  - Use `organizations` for organizational accounts only
  - Use your tenant ID for specific organization
- ✅ Click **"Save"** after configuration

### 2. **Azure AD App Registration Redirect URIs**

Go to: **Azure Portal → Your App → Authentication**

You need **BOTH** redirect URIs:

#### A. Supabase Callback (Primary - Required!)
```
https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
```
- Platform: **Web**
- This is the MAIN redirect URI that Supabase uses

#### B. Local Development (For Testing)
```
http://localhost:3000/auth/callback
```
- Platform: **Single-page application** OR **Web**
- Only needed for local testing

**Important:** Replace `YOUR-PROJECT-REF` with your actual Supabase project reference.

To find it:
- Supabase Dashboard → Settings → API → Project URL
- Example: `https://abcdefghijk.supabase.co`

### 3. **Azure AD API Permissions**

Go to: **Azure Portal → Your App → API Permissions**

Required permissions:
- ✅ Microsoft Graph → `email`
- ✅ Microsoft Graph → `openid`
- ✅ Microsoft Graph → `profile`
- ✅ Microsoft Graph → `User.Read`

**Important:** Click **"Grant admin consent"** button!

### 4. **Azure AD Supported Account Types**

Go to: **Azure Portal → Your App → Authentication**

For student access, choose:
- **"Accounts in any organizational directory and personal Microsoft accounts"**

This allows:
- Personal Microsoft accounts (@outlook.com, @hotmail.com, etc.)
- Organizational accounts (@company.com)
- Student accounts (@university.edu)

## 🔍 Debugging Steps:

### Step 1: Check Browser Console

1. Open http://localhost:3000/auth/login
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Click "Sign in with Microsoft"
5. Look for error messages

**Common errors:**

#### Error: "Invalid client"
**Solution:** Client ID is wrong or not saved in Supabase
- Verify Client ID in Azure matches Supabase
- Make sure you clicked "Save" in Supabase

#### Error: "Redirect URI mismatch"
**Solution:** Redirect URI not configured in Azure
- Add `https://YOUR-PROJECT.supabase.co/auth/v1/callback` to Azure
- No trailing slash!
- Use exact URL from Supabase → Authentication → Providers → Azure

#### Error: "AADSTS50011"
**Solution:** Reply URL mismatch
- Check that Azure redirect URI matches Supabase callback URL exactly
- Case-sensitive!

### Step 2: Verify Supabase Configuration

Run this in browser console on your app:
```javascript
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

Should show your Supabase URL. If it shows `undefined`, your .env.local isn't loaded.

### Step 3: Test OAuth Flow

1. Go to http://localhost:3000/auth/login
2. Click "Sign in with Microsoft"
3. **Expected behavior:**
   - Browser redirects to Microsoft login page
   - You see Microsoft login form
   - After login, redirects back to your app

4. **If it doesn't redirect to Microsoft:**
   - Check browser console for errors
   - Azure provider might not be enabled in Supabase
   - Client ID might be incorrect

5. **If Microsoft login works but redirect fails:**
   - Check redirect URI in Azure
   - Check Supabase callback URL configuration

## 🔧 Quick Fix Checklist:

Run through this in order:

1. ✅ **Supabase Dashboard → Authentication → Providers → Azure**
   - Provider enabled? 
   - Client ID correct?
   - Secret correct?
   - Tenant set to `common`?
   - Clicked "Save"?

2. ✅ **Azure Portal → Your App → Authentication**
   - Has `https://YOUR-PROJECT.supabase.co/auth/v1/callback`?
   - Supported accounts set correctly?

3. ✅ **Azure Portal → Your App → API Permissions**
   - All 4 permissions added?
   - Admin consent granted?

4. ✅ **Local Environment**
   - `.env.local` has correct Supabase URL?
   - Dev server restarted after .env change?

## 🧪 Test Without Microsoft (Verify App Works):

To confirm your app works, try the guest access:
1. Go to http://localhost:3000/auth/login
2. Click "Continue as Guest"
3. Should see courses page

If this works, the issue is definitely with Azure configuration.

## 📞 Still Not Working?

### Get Detailed Error Info:

1. Open browser console (F12)
2. Go to **Network** tab
3. Try signing in with Microsoft
4. Look for failed requests (red text)
5. Click on them to see error details

### Common Solutions:

**"Provider not enabled"**
→ Enable Azure provider in Supabase

**"Invalid credentials"**
→ Re-enter Client ID and Secret in Supabase

**"Redirect URI mismatch"**
→ Copy exact callback URL from Supabase, paste in Azure

**No redirect happens**
→ Check browser popup blockers

**Redirects but shows error**
→ Check Azure API permissions and admin consent

## 📚 Resources:

- [Supabase Azure Auth Docs](https://supabase.com/docs/guides/auth/social-login/auth-azure)
- [Azure AD Quickstart](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)

## 🎯 Most Common Fix:

90% of issues are from:
1. Redirect URI not matching exactly
2. Azure provider not enabled in Supabase
3. Admin consent not granted in Azure

Check these three things first!
