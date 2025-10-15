# 🚀 Production Deployment Guide

This guide will help you deploy your Course Resources app to production using Vercel.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have completed:

- ✅ Supabase project created and configured
- ✅ Database schema executed (`supabase-schema.sql`)
- ✅ Storage bucket `course-files` created and set to **Public**
- ✅ Admin user created in Supabase Authentication
- ✅ Azure AD app configured (if using Microsoft authentication)
- ✅ Courses populated in the database
- ✅ Environment variables documented

## 🌐 Deploy to Vercel

### Method 1: Deploy with Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project directory**:
   ```bash
   cd o:\valult\course-resources-app
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? **Y**
   - Which scope? (Select your account)
   - Link to existing project? **N**
   - What's your project's name? `course-resources-app`
   - In which directory is your code located? `./`
   - Want to override the settings? **N**

5. **Add environment variables**:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   # Paste your Supabase URL
   
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   # Paste your Supabase anon key
   ```

6. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Method 2: Deploy via Vercel Dashboard

1. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR-USERNAME/course-resources-app.git
   git push -u origin main
   ```

2. **Go to [Vercel Dashboard](https://vercel.com/new)**

3. **Import your repository**:
   - Click "Add New..." → "Project"
   - Import from GitHub
   - Select your repository
   - Click "Import"

4. **Configure project**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

5. **Add Environment Variables**:
   
   Click "Environment Variables" and add:
   
   | Key | Value | Environment |
   |-----|-------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` | Production, Preview, Development |

6. **Click "Deploy"**

   Vercel will build and deploy your app. This takes 2-5 minutes.

## 🔧 Post-Deployment Configuration

### 1. Update Azure AD Redirect URIs (for Microsoft Auth)

After deployment, you'll get a production URL like `https://course-resources-app.vercel.app`

1. Go to **Azure Portal** → Your App Registration
2. Click **Authentication**
3. Add new Redirect URI:
   ```
   https://course-resources-app.vercel.app/auth/callback
   ```
4. Keep the Supabase callback URL as well:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
5. Click **Save**

### 2. Test Your Deployment

Visit your production URL and test:

- ✅ Homepage loads correctly
- ✅ Courses are displayed
- ✅ Student login with Microsoft works
- ✅ Admin login works
- ✅ File preview works
- ✅ File download works
- ✅ Admin file upload works

### 3. Set Up Custom Domain (Optional)

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `resources.youruniversity.edu`)
3. Configure DNS records as shown by Vercel
4. Update Azure AD redirect URIs to include custom domain

## 🔒 Security Best Practices

### Environment Variables

Never commit these to version control:
- ✅ `.env.local` is in `.gitignore`
- ✅ Use Vercel's environment variables dashboard
- ✅ Rotate Supabase keys if accidentally exposed

### Supabase Security

1. **Row Level Security (RLS)**:
   - ✅ Already enabled in schema
   - ✅ Public can read courses/files
   - ✅ Only authenticated users can write

2. **Storage Security**:
   - Bucket `course-files` should be **Public** for file access
   - Files are organized by course/category for easy management

3. **Admin Access**:
   - Only users created in Supabase Auth can access admin panel
   - Use strong passwords for admin accounts
   - Consider enabling 2FA in Supabase dashboard

## 📊 Monitoring & Analytics

### Vercel Analytics

1. Go to Vercel Dashboard → Your Project → Analytics
2. Enable Vercel Analytics (free tier available)
3. Monitor:
   - Page views
   - Performance metrics
   - Error rates

### Supabase Monitoring

1. Go to Supabase Dashboard → Reports
2. Monitor:
   - Database usage
   - Storage usage
   - API requests
   - Authentication events

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main
# Vercel automatically deploys to production
```

### Preview Deployments

- Every pull request gets a unique preview URL
- Test changes before merging to production
- Automatically deleted after PR is closed

## 🐛 Troubleshooting Production Issues

### Issue: "Application Error"

**Check:**
1. Vercel deployment logs (Dashboard → Deployments → Click latest → View Build Logs)
2. Environment variables are set correctly
3. Build completed successfully

### Issue: Microsoft Login Not Working

**Check:**
1. Azure redirect URIs include production URL
2. Supabase Azure provider is configured
3. Browser console for specific errors
4. PKCE is enabled in Azure (see `FIX-PKCE-ERROR.md`)

### Issue: Files Not Loading

**Check:**
1. Storage bucket `course-files` is **Public**
2. Files were uploaded correctly
3. File paths in database match storage structure
4. CORS settings in Supabase Storage

### Issue: Courses Not Showing

**Check:**
1. Database connection is working
2. `supabase-schema.sql` was executed
3. Supabase RLS policies are correct
4. Environment variables match production Supabase project

## 📈 Performance Optimization

### Image Optimization

Already configured in `next.config.js`:
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.supabase.co',
    },
  ],
}
```

### Caching

- Next.js automatically caches static pages
- API routes are optimized for performance
- Supabase has built-in connection pooling

### CDN

- Vercel automatically serves from global CDN
- Static assets are cached at edge locations
- Fastest response times worldwide

## 💰 Cost Estimation

### Vercel
- **Hobby Plan**: FREE
  - Unlimited deployments
  - 100 GB bandwidth/month
  - Good for small to medium traffic

- **Pro Plan**: $20/month
  - 1 TB bandwidth/month
  - Advanced analytics
  - Password protection

### Supabase
- **Free Tier**:
  - 500 MB database
  - 1 GB file storage
  - 50,000 monthly active users
  - 2 GB bandwidth

- **Pro Plan**: $25/month
  - 8 GB database
  - 100 GB file storage
  - 100,000 monthly active users
  - 50 GB bandwidth

### Azure AD (Microsoft Auth)
- **Free** for most educational institutions
- Part of Microsoft 365 subscription

## 🔐 Backup Strategy

### Database Backups

Supabase automatically backs up your database:
- Point-in-time recovery (Pro plan)
- Manual backups via SQL dumps

To create manual backup:
```sql
-- In Supabase SQL Editor, run:
-- This exports your data
SELECT * FROM courses;
SELECT * FROM files;
```

### Storage Backups

Consider periodic backups of uploaded files:
1. Use Supabase Storage API to list all files
2. Download files programmatically
3. Store in separate backup location

## 📞 Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Azure AD Documentation**: https://learn.microsoft.com/azure/active-directory/

## ✅ Deployment Complete!

Your Course Resources app is now live! 🎉

**Next Steps:**
1. Share the URL with students and faculty
2. Upload course resources via admin panel
3. Monitor usage and performance
4. Gather feedback for improvements

**Production URL Examples:**
- `https://course-resources-app.vercel.app`
- `https://resources.youruniversity.edu` (with custom domain)

**Admin Panel:**
- `https://your-domain.com/admin`

**Student Login:**
- `https://your-domain.com/auth/login`

---

Need help? Check the troubleshooting guides:
- `TROUBLESHOOTING-AUTH.md` - Authentication issues
- `FIX-PKCE-ERROR.md` - Microsoft login PKCE errors
- `CRITICAL-FIX-AUTH.md` - General auth troubleshooting
