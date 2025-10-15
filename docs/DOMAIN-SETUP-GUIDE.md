# Custom Domain Setup Guide - Name.com to Vercel

**Date**: October 15, 2025  
**Domain Registrar**: Name.com  
**Platform**: Vercel

---

## 🌐 Step-by-Step Setup

### Part 1: Add Domain in Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click on your project: **the-missing-semester-aiub**

2. **Navigate to Domains**
   - Click "Settings" tab
   - Click "Domains" in the sidebar

3. **Add Your Domain**
   - Enter your domain (e.g., `yourdomain.com`)
   - Click "Add"

4. **Vercel Will Show DNS Records**
   You'll see something like this:
   ```
   Type    Name    Value
   A       @       76.76.21.21
   CNAME   www     cname.vercel-dns.com
   ```

---

### Part 2: Configure DNS in Name.com

#### **Option A: Use Vercel Nameservers (Recommended - Easiest)**

This is the simplest method - Vercel manages everything!

1. **Go to Name.com**
   - Login at: https://www.name.com
   - Click "My Domains"
   - Click on your domain

2. **Change Nameservers**
   - Click "Manage Nameservers"
   - Select "Custom Nameservers"
   - Add Vercel's nameservers:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```
   - Click "Save"

3. **Wait for Propagation**
   - Usually takes 5-60 minutes
   - Can take up to 48 hours (rare)

4. **Verify in Vercel**
   - Vercel will automatically detect the change
   - SSL certificate will be issued automatically
   - Done! ✅

---

#### **Option B: Use Name.com DNS (Manual Setup)**

If you want to keep Name.com as your DNS provider:

1. **Go to Name.com DNS Management**
   - Login at: https://www.name.com
   - Click "My Domains"
   - Click on your domain
   - Click "DNS Records"

2. **Delete Existing A Records**
   - Remove any existing A records for `@` (root domain)
   - Remove any existing CNAME records for `www`

3. **Add Vercel DNS Records**

   **For Root Domain (@):**
   ```
   Type: A
   Host: @
   Answer: 76.76.21.21
   TTL: 3600
   ```

   **For WWW Subdomain:**
   ```
   Type: CNAME
   Host: www
   Answer: cname.vercel-dns.com
   TTL: 3600
   ```

4. **Save Changes**
   - Click "Add Record" for each
   - Wait 5-60 minutes for DNS propagation

5. **Verify SSL in Vercel**
   - Vercel will automatically issue SSL certificate
   - Check Domains page for "Valid Configuration" ✅

---

### Part 3: Vercel Configuration (Both Options)

After DNS is configured:

1. **Set Primary Domain (Optional)**
   - In Vercel → Domains
   - Click "Edit" on your preferred domain
   - Set as "Primary Domain"
   - This redirects all traffic to your chosen domain

2. **Configure Redirects**
   
   **Example 1: Redirect www to non-www**
   ```
   www.yourdomain.com → yourdomain.com
   ```

   **Example 2: Redirect non-www to www**
   ```
   yourdomain.com → www.yourdomain.com
   ```

   Vercel does this automatically when you set primary domain!

---

## 🔧 Common Configurations

### Setup 1: yourdomain.com (Primary) + www redirects
```
1. Add: yourdomain.com
2. Add: www.yourdomain.com
3. Set yourdomain.com as Primary
4. Result: www automatically redirects to non-www
```

### Setup 2: www.yourdomain.com (Primary) + root redirects
```
1. Add: www.yourdomain.com
2. Add: yourdomain.com
3. Set www.yourdomain.com as Primary
4. Result: non-www automatically redirects to www
```

---

## 📋 DNS Records Reference

### Name.com DNS Records (Option B)

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | 3600 |
| CNAME | www | cname.vercel-dns.com | 3600 |

**Note**: Vercel's IP may differ. Always use the values shown in your Vercel dashboard!

---

## ✅ Verification Checklist

### In Vercel Dashboard

- [ ] Domain added in Vercel
- [ ] DNS configuration shows "Valid Configuration"
- [ ] SSL certificate shows "Active"
- [ ] Domain shows green checkmark ✓

### In Name.com

- [ ] Nameservers updated (Option A)
  OR
- [ ] A record added for @ (Option B)
- [ ] CNAME record added for www (Option B)
- [ ] Old conflicting records removed

### Testing

- [ ] Visit http://yourdomain.com → Loads your app
- [ ] Visit https://yourdomain.com → Loads with SSL ✅
- [ ] Visit http://www.yourdomain.com → Loads your app
- [ ] Visit https://www.yourdomain.com → Loads with SSL ✅
- [ ] PWA install prompt works on mobile

---

## 🕐 Timeline

| Step | Time |
|------|------|
| Add domain in Vercel | 1 minute |
| Update DNS in Name.com | 2 minutes |
| DNS propagation | 5-60 minutes |
| SSL certificate issuance | 1-5 minutes |
| **Total** | **10-70 minutes** |

---

## 🔍 Troubleshooting

### Issue: "Invalid Configuration" in Vercel

**Check:**
1. DNS records are correct
2. No conflicting records in Name.com
3. Wait 10-30 minutes for propagation

**Fix:**
```bash
# Check DNS propagation
nslookup yourdomain.com
nslookup www.yourdomain.com

# Or use online tool:
# https://dnschecker.org
```

### Issue: SSL Certificate Not Issued

**Wait:**
- Can take 1-5 minutes after DNS is valid
- Vercel auto-retries every few minutes

**Manual Trigger:**
- Vercel → Domains → Click "Refresh" icon

### Issue: Domain Shows "Pending"

**Reasons:**
1. DNS not propagated yet → Wait
2. Wrong DNS values → Check Vercel dashboard
3. Nameserver change not applied → Check Name.com

### Issue: "ERR_NAME_NOT_RESOLVED"

**Fix:**
1. DNS not propagated → Wait 30-60 min
2. Wrong A record → Use Vercel's IP
3. Nameservers not updated → Check Name.com

---

## 🚀 Quick Setup (Recommended Path)

### For Fastest Setup: Use Vercel Nameservers

```
Step 1: Vercel Dashboard
  ↓ Add domain: yourdomain.com
  ↓ Copy nameservers shown

Step 2: Name.com
  ↓ Change nameservers to Vercel's
  ↓ Save

Step 3: Wait
  ↓ 5-60 minutes

Step 4: Done! ✅
  ↓ SSL auto-issued
  ↓ Domain works
```

---

## 📱 After Domain Setup

Once your domain is live:

1. **Test PWA on Mobile**
   ```
   https://yourdomain.com
   ```
   - Install prompt should appear
   - App should be installable

2. **Update Environment Variables (if needed)**
   - Vercel → Settings → Environment Variables
   - Update any URLs to use your domain

3. **Update Supabase (if needed)**
   - Supabase Dashboard → Authentication → URL Configuration
   - Add your domain to allowed redirect URLs:
     ```
     https://yourdomain.com/auth/callback
     https://www.yourdomain.com/auth/callback
     ```

---

## 🎯 Example Configuration

### Example Domain: missing-semester.com

**Vercel Setup:**
```
Primary: missing-semester.com
Alias: www.missing-semester.com
```

**Name.com DNS (Option B):**
```
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

**Result:**
- ✅ https://missing-semester.com (primary)
- ✅ https://www.missing-semester.com (redirects to primary)
- ✅ SSL enabled on both
- ✅ PWA works on both

---

## 📞 Support Resources

### Vercel Documentation
- Domains: https://vercel.com/docs/concepts/projects/domains
- DNS: https://vercel.com/docs/concepts/projects/custom-domains

### Name.com Support
- DNS Guide: https://www.name.com/support/articles/205188538-Pointing-your-domain-to-hosting
- Nameservers: https://www.name.com/support/articles/205934547

### Check DNS Propagation
- https://dnschecker.org
- https://www.whatsmydns.net

---

## ✨ Final Checklist

Before marking as complete:

- [ ] Domain added in Vercel ✅
- [ ] DNS configured in Name.com ✅
- [ ] SSL certificate active ✅
- [ ] Both www and non-www work ✅
- [ ] HTTPS redirects working ✅
- [ ] PWA install works on mobile ✅
- [ ] Supabase redirect URLs updated ✅

---

## 🎉 You're Done!

Your custom domain is now live with:
- ✅ HTTPS/SSL encryption
- ✅ Auto-renewing certificates
- ✅ Global CDN
- ✅ PWA support
- ✅ Professional branding

**Your app is now accessible at**:
```
https://yourdomain.com
```

Congratulations! 🚀✨
