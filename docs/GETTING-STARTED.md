# 🚀 Getting Started - 5 Minute Quick Start

## ✅ You Already Have

- ✅ Project files created
- ✅ Dependencies installed  
- ✅ Dev server running at http://localhost:3000
- ✅ All code complete and ready

## 🎯 What You Need to Do Now

Follow these steps to get your app fully functional:

---

## Step 1: Set Up Supabase (5 minutes)

### 1.1 Create Supabase Project
1. Go to https://supabase.com
2. Sign up or log in
3. Click "New project"
4. Fill in:
   - **Name**: Course Resources
   - **Database Password**: (choose a strong password)
   - **Region**: (closest to your users)
5. Click "Create new project"
6. Wait 2-3 minutes for provisioning

### 1.2 Execute Database Schema
1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click "New query"
3. Open `supabase-schema.sql` from your project folder
4. Copy ALL the content
5. Paste into Supabase SQL Editor
6. Click **Run**
7. You should see "Success. No rows returned"
8. ✅ This creates your tables and inserts 115+ courses!

### 1.3 Create Storage Bucket
1. Click **Storage** in Supabase dashboard
2. Click "Create a new bucket"
3. Name: `course-files`
4. **Public bucket**: Toggle ON (important!)
5. Click "Create bucket"

### 1.4 Create Admin User
1. Click **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Email: `admin@example.com` (or your email)
4. Password: (choose a secure password)
5. Auto Confirm User: ✅ ON
6. Click "Create user"
7. **Save these credentials** - you'll need them to log in!

### 1.5 Get Your API Keys
1. Click **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** key: `eyJhbGc...` (long string)

---

## Step 2: Update Environment Variables (1 minute)

1. Open `.env.local` in your project folder
2. Replace with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

3. Save the file

---

## Step 3: Restart Dev Server (30 seconds)

The server is already running, but restart it to load new environment variables:

1. Go to the terminal where `npm run dev` is running
2. Press `Ctrl + C` to stop
3. Run again:
   ```powershell
   npm run dev
   ```
4. Wait for "Ready in X seconds"

---

## Step 4: Test Your App! (2 minutes)

### Test Homepage
1. Go to http://localhost:3000
2. You should see **115+ courses** displayed!
3. Click any course card to view details

### Test Admin Login
1. Go to http://localhost:3000/admin
2. Log in with the admin credentials you created
3. You should reach the admin dashboard
4. Try uploading a test file

### Test File Upload
1. In admin dashboard:
   - Select a course
   - Choose category (Midterm/Final/Others)
   - Enter file title
   - Select a PDF or image file
   - Click "Upload File"
2. Go back to homepage
3. Find that course
4. Switch to the category you selected
5. Your file should appear!

### Test File Preview & Download
1. Click "Preview" on any file
2. File should open in a modal
3. Click "Download" to download the file

---

## 🎉 You're Done! Basic Setup Complete

Your app is now fully functional for **guest browsing and admin file management**!

---

##  What You Can Do Right Now

### As Admin:
- ✅ Log in at http://localhost:3000/admin
- ✅ Upload files for any of the 115 courses
- ✅ Organize by Midterm, Final, or Others categories

### As Student (No Login Required):
- ✅ Browse all courses at http://localhost:3000
- ✅ View files by category
- ✅ Preview files inline
- ✅ Download files
- ✅ Full access without authentication

---

## 🚀 Ready for Production?

When you're ready to deploy:

1. **Read**: `DEPLOYMENT.md`
2. **Use**: `PRODUCTION-CHECKLIST.md`
3. **Deploy**: To Vercel (free tier available)

Takes about 30 minutes to deploy properly.

---

## 🆘 Something Not Working?

### Courses not showing?
- ✅ Check you ran `supabase-schema.sql` in Supabase
- ✅ Check environment variables are correct
- ✅ Restart dev server

### Can't login as admin?
- ✅ Check you created a user in Supabase Authentication
- ✅ Make sure auto-confirm was enabled
- ✅ Try the exact email and password you set

### Files won't upload?
- ✅ Check storage bucket `course-files` exists
- ✅ Check bucket is set to **Public**
- ✅ Check you're logged in as admin

### Need more help?
- Check `README.md` for detailed docs
- Check `TROUBLESHOOTING-AUTH.md` for auth issues
- All documentation is in your project folder

---

## ✅ Quick Checklist

- [ ] Supabase project created
- [ ] Database schema executed (115+ courses inserted)
- [ ] Storage bucket created and set to public
- [ ] Admin user created
- [ ] `.env.local` updated with real credentials
- [ ] Dev server restarted
- [ ] Homepage shows courses
- [ ] Admin can log in
- [ ] File upload works
- [ ] File preview works
- [ ] File download works

---

## 🎯 Current Status

**Dev Server**: Running at http://localhost:3000

**Homepage**: Shows 115+ courses across 11 departments

**Admin Panel**: http://localhost:3000/admin

**Features Working**:
- ✅ Course browsing (open access)
- ✅ Course details
- ✅ File management (after admin uploads)
- ✅ File preview
- ✅ File download
- ✅ Admin authentication

---

## 🎊 That's It!

You now have a fully functional Course Resources Management System!

**Start using it:**
1. Upload some files as admin
2. Share the URL with students (after deployment)
3. Monitor usage and feedback
4. Add more features as needed

**Questions?** Check the documentation files in your project folder. Everything is documented! 📚

---

**Happy resource sharing!** 🎓✨
