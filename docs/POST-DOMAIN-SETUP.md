# Post-Domain Setup Checklist

**Domain**: https://aiubfiles.app/  
**Date**: October 15, 2025  
**Status**: ✅ LIVE

---

## 🎉 Domain is Live!

Your app is now accessible at:
- ✅ https://aiubfiles.app
- ✅ https://www.aiubfiles.app (if configured)

---

## ⚠️ CRITICAL: Update Supabase Redirect URLs

### Step 1: Add Custom Domain to Supabase

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: **zkjoqhkwdvotsavwqwkt**

2. **Navigate to Authentication Settings**
   - Click "Authentication" in sidebar
   - Click "URL Configuration"

3. **Update Site URL**
   ```
   Site URL: https://aiubfiles.app
   ```

4. **Add Redirect URLs**
   
   Add these URLs to "Redirect URLs" list:
   ```
   https://aiubfiles.app/auth/callback
   https://www.aiubfiles.app/auth/callback
   https://the-missing-semester-aiub.vercel.app/auth/callback
   ```
   
   Keep the Vercel URL for backup/testing!

5. **Save Changes**

**⚠️ WARNING**: Until you do this, authentication will NOT work on your custom domain!

---

## 📱 Test PWA Installation

### On Mobile (Android/Chrome):

1. Visit: https://aiubfiles.app
2. Wait 3 seconds
3. Install prompt should slide up from bottom
4. Click "Install App"
5. App should install to home screen ✅

### On Mobile (iOS/Safari):

1. Visit: https://aiubfiles.app
2. Wait 3 seconds
3. Modal should appear with instructions:
   - Tap Share button
   - Tap "Add to Home Screen"
4. Follow instructions to install ✅

### On Desktop (Chrome/Edge):

1. Visit: https://aiubfiles.app
2. Wait 3 seconds
3. Install button should appear in address bar (or prompt)
4. Click to install ✅

---

## ✅ Verification Checklist

### Domain & SSL
- [ ] https://aiubfiles.app loads ✅
- [ ] SSL certificate shows as valid ✅
- [ ] No "Not Secure" warnings ✅
- [ ] Green padlock in browser ✅

### Authentication
- [ ] Updated Supabase Site URL
- [ ] Added redirect URLs to Supabase
- [ ] Test Microsoft login works
- [ ] Test admin login works
- [ ] Callback redirects correctly

### PWA Features
- [ ] Visit on mobile device
- [ ] Install prompt appears (3 sec delay)
- [ ] App installs successfully
- [ ] App icon appears on home screen
- [ ] App opens in standalone mode (no browser UI)
- [ ] App works offline (after first load)

### Content & Features
- [ ] Homepage loads correctly
- [ ] Course listings appear
- [ ] File downloads work
- [ ] Admin dashboard accessible
- [ ] Search functionality works
- [ ] All pages load correctly

---

## 🔧 If Authentication Doesn't Work

### Error: "Invalid Redirect URL"

**Cause**: Supabase redirect URLs not updated

**Fix**:
1. Go to Supabase → Authentication → URL Configuration
2. Add: `https://aiubfiles.app/auth/callback`
3. Save and test again

### Error: "Unable to verify PKCE"

**Cause**: Different domain used for login vs callback

**Fix**:
1. Ensure you're using same domain throughout
2. Clear cookies and try again
3. Use incognito mode to test

### Error: Microsoft Login Fails

**Cause**: Microsoft Entra redirect URI not updated

**Fix**:
1. Go to Azure Portal → Entra ID → App Registrations
2. Find your app
3. Click "Authentication"
4. Add redirect URI:
   ```
   https://zkjoqhkwdvotsavwqwkt.supabase.co/auth/v1/callback
   ```
   (Keep the Supabase URL, NOT your custom domain)
5. Save

---

## 📊 Performance Testing

### Test Load Speed

Use these tools:
- Google PageSpeed Insights: https://pagespeed.web.dev/
- GTmetrix: https://gtmetrix.com/
- WebPageTest: https://www.webpagetest.org/

Target scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+
- PWA: 100 ✅

### Test PWA Score

1. Open https://aiubfiles.app in Chrome
2. Open DevTools (F12)
3. Click "Lighthouse" tab
4. Select "Progressive Web App"
5. Click "Analyze page load"
6. Should score 100/100 ✅

---

## 🎯 SEO Optimization (Optional)

### Add Google Search Console

1. Visit: https://search.google.com/search-console
2. Add property: `https://aiubfiles.app`
3. Verify ownership (DNS TXT record)
4. Submit sitemap: `https://aiubfiles.app/sitemap.xml`

### Add Analytics (Optional)

**Google Analytics:**
1. Create GA4 property
2. Get tracking ID
3. Add to your Next.js app

**Vercel Analytics (Built-in):**
1. Vercel → Project → Analytics
2. Enable Web Analytics (free)
3. Automatically tracks page views, performance

---

## 🚀 Next Steps

### 1. Monitor Performance
- Check Vercel Analytics dashboard
- Monitor error logs in Vercel
- Check Supabase database usage

### 2. Promote Your App
- Share with students: https://aiubfiles.app
- Add to course materials
- Send announcement email
- Post on social media

### 3. Gather Feedback
- Ask students to install PWA
- Monitor file downloads
- Check which courses are most accessed
- Get feedback on user experience

### 4. Continuous Improvement
- Add more courses
- Upload new files
- Update announcements
- Fix any bugs reported

---

## 📞 Support Contacts

### If Issues Arise:

**Vercel Issues:**
- Dashboard: https://vercel.com/dashboard
- Support: https://vercel.com/support
- Status: https://www.vercel-status.com

**Supabase Issues:**
- Dashboard: https://supabase.com/dashboard
- Docs: https://supabase.com/docs
- Support: https://supabase.com/support

**Domain Issues (Name.com):**
- Dashboard: https://www.name.com
- Support: https://www.name.com/support

---

## ✨ Congratulations!

Your course resources app is now live at **https://aiubfiles.app**! 

Features:
- ✅ Custom professional domain
- ✅ HTTPS/SSL encryption
- ✅ Progressive Web App (installable)
- ✅ Global CDN (fast worldwide)
- ✅ Microsoft authentication
- ✅ Admin dashboard
- ✅ File management system
- ✅ Real-time updates

**Students can now:**
1. Visit https://aiubfiles.app
2. Install as an app on their phone
3. Access course materials anytime
4. Download files easily

🎉 **Well done!** 🚀✨

---

## 📱 Share With Students

**Email/Message Template:**

```
Subject: New Course Resources App - Install on Your Phone!

Hi Students,

I'm excited to announce our new course resources platform:
🌐 https://aiubfiles.app

Features:
✨ Access all course materials in one place
📱 Install as an app on your phone (works offline!)
📚 Download lecture notes, assignments, and resources
🔐 Secure login with your AIUB Microsoft account

How to Install on Mobile:
1. Visit https://aiubfiles.app on your phone
2. Wait for the install prompt (3 seconds)
3. Click "Install App"
4. Find the app icon on your home screen

Need help? Reply to this email.

Best regards,
[Your Name]
```

---

## 🎯 Final Checklist

Before announcing to students:

- [ ] ✅ Domain working (https://aiubfiles.app)
- [ ] ✅ SSL certificate active
- [ ] ⚠️ Supabase redirect URLs updated (DO THIS NOW!)
- [ ] ✅ PWA install prompt working
- [ ] Test authentication flow
- [ ] Upload some course materials
- [ ] Test file downloads
- [ ] Test on mobile device
- [ ] Test admin dashboard
- [ ] Create announcement for students

---

**🚨 NEXT ACTION: Update Supabase redirect URLs NOW!**

Go to:
1. https://supabase.com/dashboard
2. Your project → Authentication → URL Configuration
3. Add: `https://aiubfiles.app/auth/callback`

This is CRITICAL for authentication to work! ⚠️
