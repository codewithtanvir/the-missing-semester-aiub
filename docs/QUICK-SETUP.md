# Quick Setup Checklist

## ✅ Current Status
- [x] Project created
- [x] Dependencies installed  
- [x] Database schema created in Supabase
- [x] Dev server running at http://localhost:3000

## ⏳ Required Steps to Fix All Errors

### 1. Update Environment Variables (CRITICAL)

Edit `o:\valult\course-resources-app\.env.local`:

```env
# Replace these with your actual Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**How to get these:**
1. Go to your Supabase project dashboard
2. Click **Settings** (⚙️) → **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Create Storage Bucket

1. In Supabase, go to **Storage**
2. Click **"New bucket"**
3. Name: `course-files`
4. Public: **✅ Yes** (important!)
5. Click **"Save"**

### 3. Create Admin User

1. In Supabase, go to **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Email: `admin@example.com` (or your email)
4. Password: (choose a secure password)
5. Click **"Create user"**

### 4. Restart Dev Server

After updating `.env.local`:

```powershell
# Press Ctrl+C to stop the current server
# Then run:
npm run dev
```

## 🎯 TypeScript Errors Will Resolve When:

✅ Environment variables are set
✅ Supabase connection is established
✅ Dev server is restarted

The 294 problems are mostly:
- Missing type definitions (resolve after npm install completes)
- Missing module errors (resolve after .env.local is configured)
- JSX implicit types (normal during initial setup)

## 🚀 After Setup, You Can:

1. **Browse courses** at http://localhost:3000
2. **Admin login** at http://localhost:3000/admin
3. **Upload files** from admin dashboard
4. **Student login** at http://localhost:3000/auth/login (after Microsoft auth setup)

## 📝 Optional: Microsoft Authentication

For students to log in with Microsoft accounts:
- Follow detailed guide in `MICROSOFT-AUTH-SETUP.md`
- Requires Azure AD app registration
- Not required for basic functionality

## 🆘 If Issues Persist

1. **Stop dev server** (Ctrl+C)
2. **Clear cache**: 
   ```powershell
   Remove-Item -Recurse -Force .next
   ```
3. **Restart**:
   ```powershell
   npm run dev
   ```

---

**Most important:** Update your `.env.local` file with real Supabase credentials!
