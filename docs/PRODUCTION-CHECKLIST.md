# ✅ Production Deployment Checklist

Use this checklist before and after deploying to ensure everything is configured correctly.

## 📋 Pre-Deployment Checklist

### Supabase Configuration

- [ ] **Supabase project created**
  - Project is fully provisioned
  - Project name and URL noted

- [ ] **Database setup complete**
  - [ ] `supabase-schema.sql` executed successfully
  - [ ] `courses` table exists with 115+ courses
  - [ ] `files` table exists
  - [ ] Row Level Security (RLS) enabled on both tables
  - [ ] RLS policies created correctly

- [ ] **Storage configured**
  - [ ] Bucket `course-files` created
  - [ ] Bucket set to **Public**
  - [ ] Test file upload works
  - [ ] Test file download works

- [ ] **Authentication configured**
  - [ ] Admin user created (email + password)
  - [ ] Admin can log in successfully
  - [ ] Azure provider enabled (if using Microsoft auth)
  - [ ] Azure Client ID and Secret added
  - [ ] Azure Tenant set to `common`

- [ ] **Environment variables documented**
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` copied
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` copied
  - [ ] Keys stored securely (password manager, etc.)

### Azure AD Configuration (for Microsoft Auth)

- [ ] **Azure app registration created**
  - [ ] Application (Client) ID obtained
  - [ ] Client Secret created and saved
  - [ ] Secret expiration date noted (renew before expiry)

- [ ] **Redirect URIs configured**
  - [ ] Supabase callback URL added: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
  - [ ] Platform: Web
  - [ ] No trailing slash

- [ ] **Authentication settings**
  - [ ] Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
  - [ ] "Allow public client flows" = **Yes**
  - [ ] Implicit grant: ID tokens ✅
  - [ ] Implicit grant: Access tokens ✅

- [ ] **API permissions**
  - [ ] Microsoft Graph → email ✅
  - [ ] Microsoft Graph → openid ✅
  - [ ] Microsoft Graph → profile ✅
  - [ ] Microsoft Graph → User.Read ✅
  - [ ] Admin consent **granted** (green checkmarks)

### Code Repository

- [ ] **Git repository initialized**
  - [ ] `.gitignore` includes `.env.local`
  - [ ] `.gitignore` includes `node_modules`
  - [ ] `.gitignore` includes `.next`

- [ ] **Code committed**
  - [ ] All files committed to repository
  - [ ] No sensitive data in commits
  - [ ] Repository pushed to GitHub/GitLab

### Local Testing

- [ ] **Development environment works**
  - [ ] `npm install` completes successfully
  - [ ] `npm run dev` starts without errors
  - [ ] Homepage loads at http://localhost:3000
  - [ ] Courses are displayed
  - [ ] Admin login works
  - [ ] File upload works
  - [ ] File download works
  - [ ] File preview works
  - [ ] Microsoft login works (if configured)

- [ ] **No console errors**
  - [ ] Browser console shows no red errors
  - [ ] Network tab shows no failed requests
  - [ ] Authentication flow completes

## 🚀 Deployment Steps

### Vercel Setup

- [ ] **Vercel account created**
  - [ ] Logged in to vercel.com
  - [ ] Team/organization selected (if applicable)

- [ ] **Project imported**
  - [ ] Repository connected to Vercel
  - [ ] Framework preset: Next.js
  - [ ] Root directory: `./`

- [ ] **Environment variables added**
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` = Production Supabase URL
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Production Supabase anon key
  - [ ] Variables set for: Production, Preview, Development

- [ ] **Build settings configured**
  - [ ] Build command: `npm run build` (default)
  - [ ] Output directory: `.next` (default)
  - [ ] Install command: `npm install` (default)

- [ ] **Deploy initiated**
  - [ ] Initial deployment started
  - [ ] Build logs reviewed
  - [ ] Build completed successfully
  - [ ] Production URL generated

## 🔧 Post-Deployment Configuration

### Azure AD Updates

- [ ] **Production redirect URI added**
  - [ ] Vercel production URL copied (e.g., `https://course-resources-app.vercel.app`)
  - [ ] Added to Azure → Authentication → Redirect URIs:
    ```
    https://course-resources-app.vercel.app/auth/callback
    ```
  - [ ] Platform: Web OR Single-page application
  - [ ] Saved in Azure Portal

### Custom Domain (Optional)

- [ ] **Domain configured in Vercel**
  - [ ] Domain added to project
  - [ ] DNS records configured
  - [ ] SSL certificate issued

- [ ] **Azure redirect URI updated for custom domain**
  - [ ] Custom domain callback added to Azure
  - [ ] Example: `https://resources.university.edu/auth/callback`

### Testing Production

- [ ] **Homepage accessible**
  - [ ] Production URL loads
  - [ ] Courses are displayed
  - [ ] Layout looks correct
  - [ ] No console errors

- [ ] **Student features work**
  - [ ] Guest browsing works
  - [ ] Microsoft login works
  - [ ] Course detail pages load
  - [ ] Files are visible
  - [ ] File preview works
  - [ ] File download works

- [ ] **Admin features work**
  - [ ] Admin login page accessible (`/admin`)
  - [ ] Admin can log in with credentials
  - [ ] Admin dashboard loads (`/admin/dashboard`)
  - [ ] File upload works
  - [ ] Uploaded files appear in course pages

- [ ] **Cross-browser testing**
  - [ ] Chrome ✅
  - [ ] Firefox ✅
  - [ ] Safari ✅
  - [ ] Edge ✅
  - [ ] Mobile browsers ✅

- [ ] **Mobile responsiveness**
  - [ ] Layout adapts to mobile screens
  - [ ] Buttons are clickable on mobile
  - [ ] Forms are usable on mobile

## 📊 Monitoring Setup

### Vercel

- [ ] **Analytics enabled** (optional)
  - [ ] Vercel Analytics installed
  - [ ] Web Vitals tracking active

- [ ] **Deployment notifications**
  - [ ] Email notifications enabled
  - [ ] Slack/Discord integration (optional)

### Supabase

- [ ] **Monitoring dashboard reviewed**
  - [ ] Database usage checked
  - [ ] Storage usage checked
  - [ ] API request rate checked

- [ ] **Alerts configured** (optional)
  - [ ] Database size alerts
  - [ ] API rate limit alerts

## 🔐 Security Review

- [ ] **Environment variables secure**
  - [ ] No secrets in code repository
  - [ ] Vercel environment variables are encrypted
  - [ ] Access to Vercel project is restricted

- [ ] **Supabase security**
  - [ ] RLS policies are active
  - [ ] API keys are not exposed in client code
  - [ ] Admin users have strong passwords

- [ ] **Azure security**
  - [ ] Client secret is stored securely
  - [ ] Client secret expiration is noted
  - [ ] Only necessary redirect URIs are added

- [ ] **HTTPS enabled**
  - [ ] Production site uses HTTPS
  - [ ] SSL certificate is valid
  - [ ] Mixed content warnings resolved

## 📝 Documentation

- [ ] **User documentation created**
  - [ ] Student guide (how to browse/download)
  - [ ] Admin guide (how to upload files)
  - [ ] FAQ section

- [ ] **Internal documentation**
  - [ ] Deployment process documented
  - [ ] Environment variables listed
  - [ ] Access credentials stored securely

- [ ] **Troubleshooting guides available**
  - [ ] `TROUBLESHOOTING-AUTH.md` reviewed
  - [ ] `FIX-PKCE-ERROR.md` reviewed
  - [ ] Support contact information added

## 🎉 Launch Preparation

### Communication

- [ ] **Stakeholders notified**
  - [ ] IT department informed
  - [ ] Faculty notified
  - [ ] Students notified

- [ ] **Launch announcement prepared**
  - [ ] Email template ready
  - [ ] Website announcement drafted
  - [ ] Social media posts prepared (if applicable)

### Training

- [ ] **Admin training completed**
  - [ ] File upload process demonstrated
  - [ ] Course management explained
  - [ ] Troubleshooting basics covered

- [ ] **Support plan in place**
  - [ ] Support email/contact created
  - [ ] Response time expectations set
  - [ ] Escalation process defined

## 📈 Post-Launch Monitoring

### Week 1

- [ ] **Daily monitoring**
  - [ ] Check error logs
  - [ ] Monitor user feedback
  - [ ] Track usage metrics
  - [ ] Address urgent issues

### Week 2-4

- [ ] **Weekly reviews**
  - [ ] Review analytics data
  - [ ] Identify common issues
  - [ ] Plan improvements
  - [ ] Update documentation

### Ongoing

- [ ] **Monthly maintenance**
  - [ ] Review security updates
  - [ ] Update dependencies
  - [ ] Backup database
  - [ ] Review storage usage

- [ ] **Quarterly reviews**
  - [ ] Evaluate performance
  - [ ] Plan new features
  - [ ] Assess scaling needs
  - [ ] Review costs

## 🆘 Emergency Contacts

Document these before launch:

- **Vercel Support**: _____________________
- **Supabase Support**: _____________________
- **Azure Support**: _____________________
- **Internal IT Contact**: _____________________
- **Project Owner**: _____________________
- **Developer Contact**: _____________________

## ✅ Final Sign-Off

- [ ] **All checklist items completed**
- [ ] **Production site tested end-to-end**
- [ ] **Backup plan in place**
- [ ] **Rollback procedure documented**
- [ ] **Support team ready**
- [ ] **Launch approved by stakeholders**

---

**Deployment Date**: _______________

**Deployed By**: _______________

**Production URL**: _______________

**Notes**: 
_______________________________________
_______________________________________
_______________________________________

---

## 🎊 Congratulations!

Your Course Resources app is now live in production! 🚀

Remember to:
- Monitor the first few days closely
- Respond quickly to user feedback
- Keep documentation updated
- Plan regular maintenance windows

**Happy deploying!** 🎉
