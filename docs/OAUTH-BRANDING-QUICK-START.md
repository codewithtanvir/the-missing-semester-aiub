# How to Change Google OAuth Display from "supabase.co" to "AIUB Files"

**Quick Answer**: Set up custom Google OAuth credentials with branded consent screen

**Time**: 15-20 minutes  
**Difficulty**: Medium  
**Status**: Ready to implement

---

## 🎯 Problem

Currently, when students login they see:
```
Choose an account
to continue to zkjoqhkwdvotsavwqwkt.supabase.co
```

---

## ✅ Solution

Set up your own Google OAuth app to show:
```
"AIUB Files" wants to access your Google Account

This will allow AIUB Files to:
• View your email address
• View your basic profile info
```

---

## 📋 What You Need (All Ready!)

- ✅ Google account
- ✅ Privacy Policy page: https://aiubfiles.app/privacy (LIVE!)
- ✅ Terms page: https://aiubfiles.app/terms (LIVE!)
- ⏳ 15-20 minutes of your time

---

## 🚀 Quick Start

### Step 1: Verify Pages are Live

Visit these URLs to confirm they work:
- https://aiubfiles.app/privacy ✅
- https://aiubfiles.app/terms ✅

(Just deployed! Should be live in 1-2 minutes)

### Step 2: Follow the Complete Guide

Open this file and follow step-by-step:
```
docs/CUSTOM-GOOGLE-OAUTH-SETUP.md
```

It has:
- ✅ Detailed screenshots descriptions
- ✅ Copy-paste values
- ✅ Troubleshooting guide
- ✅ Testing checklist

### Step 3: Test

After setup:
1. Visit https://aiubfiles.app/auth/login
2. Click "Sign in with Google"
3. You should see "AIUB Files" branding (not supabase.co) ✅

---

## 📖 Documentation Available

I've created these guides for you:

1. **CUSTOM-GOOGLE-OAUTH-SETUP.md** ⭐ MAIN GUIDE
   - Complete setup instructions
   - Step-by-step with exact values
   - Troubleshooting

2. **GOOGLE-AUTH-GUIDE.md**
   - How Google auth works
   - Student instructions
   - FAQ

3. **DOMAIN-SETUP-GUIDE.md**
   - How to setup custom domain (already done!)
   - DNS configuration

4. **POST-DOMAIN-SETUP.md**
   - What to do after domain is live
   - Testing checklist

---

## ⚡ Super Quick Summary

1. Go to: https://console.cloud.google.com
2. Create project "AIUB Files"
3. Setup OAuth consent screen with your branding
4. Create OAuth credentials
5. Copy Client ID and Secret
6. Paste into Supabase → Authentication → Providers → Google
7. Test login - now shows "AIUB Files"! ✅

---

## 🎓 Impact on Students

**Before:**
- See weird "supabase.co" domain
- Confused about what site they're logging into
- Less trust

**After:**
- See "AIUB Files" branding
- Professional appearance
- Clear what app they're using
- More trust ✅

---

## ⏱️ Timeline

| Step | Time |
|------|------|
| Create Google Cloud project | 2 min |
| Configure OAuth consent | 5 min |
| Create credentials | 3 min |
| Update Supabase | 2 min |
| Test | 3 min |
| **Total** | **15 min** |

---

## 🚨 Important Notes

1. **Privacy/Terms pages REQUIRED by Google**
   - ✅ Already created and deployed!
   - https://aiubfiles.app/privacy
   - https://aiubfiles.app/terms

2. **Redirect URI must match EXACTLY**
   - Use: `https://zkjoqhkwdvotsavwqwkt.supabase.co/auth/v1/callback`
   - (Shown in Supabase dashboard)

3. **Test in incognito after setup**
   - Clear cache/cookies
   - Verify new branding shows

---

## ✅ Next Action

**Open and follow:**
```
docs/CUSTOM-GOOGLE-OAUTH-SETUP.md
```

Start with Part 1: "Create Google Cloud Project"

Takes 15 minutes total! 🚀

---

**Questions?** All answers are in the detailed guide!
