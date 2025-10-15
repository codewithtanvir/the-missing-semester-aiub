# Domain Addition Troubleshooting - aiubfiles.app

**Date**: October 15, 2025  
**Domain**: aiubfiles.app  
**Issue**: Vercel won't accept the domain

---

## ❌ Common Mistakes When Adding Domain

### 1. **DON'T Include Protocol (https://)**

❌ **WRONG:**
```
https://aiubfiles.app/
https://aiubfiles.app
http://aiubfiles.app
```

✅ **CORRECT:**
```
aiubfiles.app
www.aiubfiles.app
```

**Fix**: Remove `https://` and trailing slash `/`

---

### 2. **DON'T Include Trailing Slash**

❌ **WRONG:**
```
aiubfiles.app/
www.aiubfiles.app/
```

✅ **CORRECT:**
```
aiubfiles.app
www.aiubfiles.app
```

---

## ✅ Correct Way to Add Domain in Vercel

### Step-by-Step:

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Select project: **the-missing-semester-aiub**

2. **Navigate to Domains**
   - Click "Settings" tab
   - Click "Domains" in sidebar

3. **Add Domain (Correctly)**
   
   **Enter EXACTLY:**
   ```
   aiubfiles.app
   ```
   
   **NOT:**
   - ❌ https://aiubfiles.app
   - ❌ https://aiubfiles.app/
   - ❌ aiubfiles.app/
   - ❌ http://aiubfiles.app

4. **Click "Add"**

5. **Add WWW Subdomain (Optional but Recommended)**
   ```
   www.aiubfiles.app
   ```

---

## 🔍 Other Possible Issues

### Issue 1: Domain Already Used in Another Vercel Project

**Error Message:**
```
"This domain is already in use by another project"
```

**Fix:**
1. Check all your Vercel projects
2. Go to the other project → Settings → Domains
3. Remove the domain from the old project
4. Add it to your current project

**Or if it's in a team:**
1. Check if domain is in a team workspace
2. Switch to correct workspace in Vercel
3. Try adding again

---

### Issue 2: Domain Not Registered or Expired

**Error Message:**
```
"Domain does not exist" or "Cannot verify domain"
```

**Check:**
1. Go to Name.com
2. Verify domain is active (not expired)
3. Check registration status
4. Renew if needed

---

### Issue 3: Domain Has Transfer Lock

**Error Message:**
```
"Cannot add domain" (generic error)
```

**Fix:**
1. Go to Name.com
2. Check domain settings
3. Ensure domain is unlocked
4. Wait if recently transferred (60-day lock)

---

### Issue 4: Domain in Grace Period

**If domain just expired:**
1. Renew domain in Name.com
2. Wait 1-24 hours for DNS to update
3. Try adding to Vercel again

---

## 🎯 Exact Steps for aiubfiles.app

### Step 1: Verify Domain in Name.com

1. Login to Name.com
2. Go to "My Domains"
3. Verify `aiubfiles.app` shows:
   - ✅ Status: Active
   - ✅ Not expired
   - ✅ Auto-renew enabled (recommended)

### Step 2: Add to Vercel (Correct Format)

1. Vercel → the-missing-semester-aiub → Settings → Domains
2. In the input field, type:
   ```
   aiubfiles.app
   ```
   (Just the domain name, nothing else)
3. Click "Add"
4. You should see DNS configuration options

### Step 3: Add WWW Subdomain

1. Click "Add Domain" again
2. Type:
   ```
   www.aiubfiles.app
   ```
3. Click "Add"

---

## 📋 What You Should See After Adding

After adding `aiubfiles.app`:

```
┌─────────────────────────────────────────────────┐
│ Domain: aiubfiles.app                           │
│ Status: Invalid Configuration                   │
│                                                 │
│ Configure your domain:                          │
│                                                 │
│ Recommended: Vercel Nameservers                 │
│ ns1.vercel-dns.com                             │
│ ns2.vercel-dns.com                             │
│                                                 │
│ Or add these DNS records:                       │
│ Type    Name    Value                           │
│ A       @       76.76.21.21                     │
│ CNAME   www     cname.vercel-dns.com           │
└─────────────────────────────────────────────────┘
```

If you see this → SUCCESS! Domain is added ✅

---

## 🚨 If Still Getting Error

### Try These:

1. **Refresh Page**
   - Sometimes Vercel UI glitches
   - Press Ctrl+F5 to hard refresh

2. **Try Different Browser**
   - Sometimes cache issues
   - Try incognito mode

3. **Check Vercel Status**
   - Visit: https://www.vercel-status.com
   - Ensure no outages

4. **Contact Vercel Support**
   - If domain format is correct but still won't add
   - May be account-specific issue

---

## ✅ Final Checklist

Before adding domain:
- [ ] Domain is: `aiubfiles.app` (no https://, no trailing slash)
- [ ] Domain is active in Name.com
- [ ] Domain is not expired
- [ ] Domain is not used in another Vercel project
- [ ] You're in the correct Vercel workspace/team

When adding:
- [ ] Input exactly: `aiubfiles.app`
- [ ] Press "Add" button
- [ ] Wait for DNS configuration screen
- [ ] Add `www.aiubfiles.app` as well

---

## 📞 Need More Help?

**Screenshot the exact error message and share it!**

Common error messages:
- "Invalid domain format" → Remove https:// and /
- "Domain already in use" → Remove from other project
- "Cannot verify domain" → Check Name.com registration
- "Domain does not exist" → Check spelling, check registration

---

## 🎯 Quick Fix

**Right now, try this:**

1. Go to Vercel
2. In the domain input field, clear everything
3. Type ONLY: `aiubfiles.app`
4. Click "Add"

**That's it!** 

The domain name should be entered exactly as shown above - no protocol, no slashes, just the plain domain name.

---

## ✨ Expected Outcome

Once added successfully, you'll see:

```
Domains:
✓ the-missing-semester-aiub.vercel.app (Deployment URL)
⚠ aiubfiles.app (Invalid Configuration - needs DNS)
⚠ www.aiubfiles.app (Invalid Configuration - needs DNS)
```

Then follow the DNS setup from `DOMAIN-SETUP-GUIDE.md`!
