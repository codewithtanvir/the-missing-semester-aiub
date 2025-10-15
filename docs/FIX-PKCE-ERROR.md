# 🔧 Fix PKCE Error: "Proof Key for Code Exchange is required"

## Error Message:
```
AADSTS9002325: Proof Key for Code Exchange is required for cross-origin authorization code redemption.
```

This means Azure is configured with **stricter security settings** that require PKCE flow.

---

## ✅ SOLUTION: Configure Azure for PKCE

### Step 1: Go to Azure Portal

1. Open [Azure Portal](https://portal.azure.com)
2. Go to **Azure Active Directory** → **App registrations**
3. Click on your app

### Step 2: Update Authentication Settings

1. Click **Authentication** in the left sidebar
2. Under "Platform configurations" → **Web**
3. Make sure your redirect URI is set:
   ```
   https://zkjoqhkwdvotsavwqwkt.supabase.co/auth/v1/callback
   ```

4. **CRITICAL:** Under "Advanced settings" section:
   - Find **"Allow public client flows"**
   - Set it to: **Yes** (toggle it ON)

5. Under "Implicit grant and hybrid flows":
   - ✅ **Access tokens** (for implicit flows)
   - ✅ **ID tokens** (for implicit flows)

6. Click **Save**

### Step 3: Update Manifest (Alternative Method)

If the above doesn't work, manually edit the manifest:

1. In your Azure app, click **Manifest** in the left sidebar
2. Find the line: `"oauth2AllowImplicitFlow"`
3. Change it to `true`:
   ```json
   "oauth2AllowImplicitFlow": true,
   ```
4. Find the line: `"oauth2AllowIdTokenImplicitFlow"`
5. Change it to `true`:
   ```json
   "oauth2AllowIdTokenImplicitFlow": true,
   ```
6. Click **Save**

### Step 4: Check Supabase Settings

In Supabase Dashboard → Authentication → Providers → Azure:

Make sure these are set:
- **Azure Enabled**: ✅ ON
- **Azure Client ID**: Your client ID
- **Azure Secret**: Your client secret
- **Azure Tenant**: `common`
- **PKCE Verification Method**: `S256` (or leave default)

### Step 5: Test Again

1. **Clear browser cache** or use **Incognito mode**
2. Go to: http://localhost:3000/auth/login
3. Click "Sign in with Microsoft"
4. Should now work without PKCE error!

---

## 🔍 What is PKCE?

PKCE (Proof Key for Code Exchange) is a security extension for OAuth 2.0 that prevents authorization code interception attacks. Azure requires it for cross-origin requests.

---

## ⚠️ If Still Not Working:

### Option A: Use SPA (Single Page Application) Platform

Instead of "Web" platform in Azure:

1. Azure Portal → Your app → Authentication
2. Click **"Add a platform"**
3. Choose **"Single-page application"** (SPA)
4. Add the same redirect URI:
   ```
   https://zkjoqhkwdvotsavwqwkt.supabase.co/auth/v1/callback
   ```
5. Click **Configure**
6. **Remove the old "Web" platform** if it exists

### Option B: Contact Azure Admin

If you're not an admin, you may need to ask your IT department to:
- Enable public client flows
- Enable implicit flows
- Grant admin consent (you already did this)

---

## ✅ Quick Checklist:

- [ ] Azure Portal → Your app → Authentication
- [ ] "Allow public client flows" = **Yes**
- [ ] Implicit grant: Access tokens = ✅
- [ ] Implicit grant: ID tokens = ✅
- [ ] Redirect URI matches Supabase callback URL exactly
- [ ] Saved changes in Azure
- [ ] Tested in incognito browser

---

**After enabling public client flows, the PKCE error should disappear!**
