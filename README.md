# Missing Semester - AIUB Course Resources Platform

> **Everything you need to excel, all in one place**

A modern, ultra-minimalistic course resources platform for AIUB students. Browse, preview, and download course materials with a beautiful, responsive interface.

**Live Site**: [https://aiubfiles.app](https://aiubfiles.app)

## 🎨 Design Philosophy

Built with an **ultra-minimalistic aesthetic**:
- Extralight fonts (100-200 weight)
- Huge typography (text-5xl to text-9xl)
- Generous whitespace and breathing room
- Glass morphism effects
- Smooth transitions (300-700ms)
- Pill-shaped buttons (rounded-full)
- Gradient accents

## ✨ Features

### 🎓 Student Interface
- **Browse Courses** - Clean grid of all available courses
- **Course Pinning** - Pin favorite courses for quick access with smooth animations
- **File Preview** - View PDFs, images, and documents inline
- **Download Resources** - One-click downloads with organized categories
- **Search & Filter** - Find courses and resources quickly
- **Responsive Design** - Perfect experience on mobile, tablet, and desktop
- **Google OAuth** - Simple one-click authentication
- **Public Contributors Page** - See who's sharing notes and solutions

### 👨‍💼 Admin Dashboard
**Complete admin panel with enterprise features:**

#### 📊 Dashboard Home
- Real-time statistics (files, courses, recent uploads)
- Quick action buttons
- Recent activity feed
- Beautiful stat cards

#### 👥 User Management (NEW!)
- View all registered users
- Search by name, email, or student ID
- Filter by role (students/admins)
- Export user data to CSV
- User stats (total users, students, admins, completed profiles)
- Mobile-responsive table and card views

#### 📁 File Management
- Upload files with drag-and-drop
- Advanced search and filtering
- Organize by course and category
- File preview and deletion
- Bulk operations support

#### 📚 Course Management
- Full CRUD operations for courses
- Department filtering
- Course details management
- Dependency checking

#### � Analytics & Insights
- Top courses by file count
- Category distribution
- Storage usage tracking
- Upload trends

#### 📢 Broadcast System
- Send announcements to all users
- Rich text editor
- Notification delivery

#### ⚙️ Settings
- Profile management
- Password changes
- System configuration

**Complete Guide**: See [ADMIN-DASHBOARD-GUIDE.md](./ADMIN-DASHBOARD-GUIDE.md)

## 🧰 Tech Stack

- **Frontend**: Next.js 14.2.33 + TypeScript + Tailwind CSS
- **UI Components**: shadcn/ui + Lucide Icons
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Authentication**: Google OAuth (Supabase Auth)
- **Deployment**: Vercel
- **Testing**: TestSprite MCP (integrated)
- **SEO**: Comprehensive metadata, sitemap, robots.txt, JSON-LD

## 📱 Pages & Routes

### Public Pages
- `/` - Homepage with hero, features, stats
- `/courses` - Browse all courses
- `/course/[id]` - Course detail with files
- `/auth/login` - Google OAuth login
- `/contributors` - Hall of fame for contributors
- `/about` - About the platform
- `/contact` - Contact information
- `/help` - Help center
- `/privacy` - Privacy policy
- `/terms` - Terms of service

### Protected Pages (After Login)
- `/onboarding` - Complete profile (new users)
- `/profile` - User profile management

### Admin Pages (Admin Only)
- `/admin` - Admin login
- `/admin/dashboard` - Dashboard home
- `/admin/dashboard/users` - User management
- `/admin/dashboard/files` - File management
- `/admin/dashboard/courses` - Course management
- `/admin/dashboard/analytics` - Analytics
- `/admin/dashboard/broadcast` - Broadcast messages
- `/admin/dashboard/settings` - System settings

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([supabase.com](https://supabase.com))

### 1. Clone or Setup Project

Navigate to the project directory:
```bash
cd course-resources-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Supabase

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully provisioned

#### Set up the Database
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` from this project
3. Paste it into the SQL Editor and click **Run**

This will:
- Create `courses` and `files` tables
- Set up Row Level Security policies
- Insert sample courses
- Create necessary indexes

#### Create Storage Bucket
1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name it `course-files`
4. Make it **Public** (so students can access files)
5. Click **Save**

#### Create Admin User
1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter an email and password for the admin account
4. Click **Create user**

### 4. Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

To find these values:
1. Go to your Supabase project dashboard
2. Click **Settings** → **API**
3. Copy the **Project URL** and **anon public** key

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

### For Students

1. **Browse Courses**: View all available courses on the homepage
2. **Select a Course**: Click on any course card to view its resources
3. **Choose Category**: Switch between Midterm, Final, and Others tabs
4. **Preview Files**: Click the "Preview" button to view files inline
5. **Download**: Click "Download" to save files to your device

### For Admins

**Access the powerful admin dashboard:**

1. **Login**: Go to `/admin` and sign in with your admin credentials
2. **Dashboard Home**: View real-time statistics and quick actions at `/admin/dashboard`
3. **Manage Files**: Go to Files section
   - Upload new files with course and category assignment
   - Search and filter existing files
   - Delete unwanted files
4. **Manage Courses**: Go to Courses section
   - Add new courses with detailed information
   - Edit existing course details
   - Delete courses (system checks for dependencies)
5. **View Analytics**: Go to Analytics section
   - See top courses by file count
   - View category distribution
   - Track storage usage and upload trends
6. **Configure Settings**: Go to Settings section
   - Update your profile and email
   - Change your password
   - View system information

**Complete Admin Dashboard Guide**: See [ADMIN-DASHBOARD-GUIDE.md](./ADMIN-DASHBOARD-GUIDE.md) for detailed documentation.

## 📁 Project Structure

```
course-resources-app/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   │   ├── files/
│   │   │   │   │   └── page.tsx        # File management
│   │   │   │   ├── courses/
│   │   │   │   │   └── page.tsx        # Course management
│   │   │   │   ├── analytics/
│   │   │   │   │   └── page.tsx        # Analytics & insights
│   │   │   │   ├── settings/
│   │   │   │   │   └── page.tsx        # Settings
│   │   │   │   ├── layout.tsx          # Dashboard layout
│   │   │   │   └── page.tsx            # Dashboard home
│   │   │   └── page.tsx                # Admin login
│   │   ├── course/
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Course detail page
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                    # Homepage (course list)
│   ├── components/
│   │   ├── ui/                         # shadcn/ui components
│   │   │   ├── alert.tsx               # Alert component
│   │   │   ├── badge.tsx               # Badge component
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx              # Modal dialogs
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx               # Data tables
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx            # Textarea component
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   └── use-toast.ts
│   │   ├── course-card.tsx
│   │   ├── file-card.tsx
│   │   └── file-preview.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts              # Client-side Supabase
│   │   │   └── server.ts              # Server-side Supabase
│   │   └── utils.ts                   # Utility functions
│   └── types/
│       └── database.ts                # TypeScript types
├── supabase-schema.sql                # Database schema
├── ADMIN-DASHBOARD-GUIDE.md           # Complete admin guide
├── package.json
└── README.md
```

## 🗄️ Database Schema

### Tables

#### `courses`
- `id` (UUID, Primary Key)
- `code` (VARCHAR) - e.g., "CSC 1101"
- `name` (VARCHAR) - e.g., "Introduction to Computer Studies"
- `department` (VARCHAR) - e.g., "COMPUTER SCIENCE"
- `description` (TEXT) - Course description
- `semester` (VARCHAR) - e.g., "Fall 2024"
- `instructor` (VARCHAR) - Instructor name
- `credits` (INTEGER) - Credit hours
- `created_at` (TIMESTAMP)

#### `files`
- `id` (UUID, Primary Key)
- `course_id` (UUID, Foreign Key → courses)
- `category` (VARCHAR) - "Midterm", "Final", or "Others"
- `title` (VARCHAR) - File display name
- `file_path` (TEXT) - Storage path in Supabase Storage
- `file_type` (VARCHAR) - MIME type
- `file_size` (BIGINT) - File size in bytes
- `uploader_id` (UUID) - Admin user ID
- `uploaded_at` (TIMESTAMP)

#### `user_profiles`
- `user_id` (UUID, Primary Key, Foreign Key → auth.users)
- `full_name` (VARCHAR) - User's full name
- `student_id` (VARCHAR) - Student ID number
- `email` (VARCHAR) - User email
- `phone` (VARCHAR) - Phone number
- `gender` (VARCHAR) - Gender
- `role` (VARCHAR) - 'student' or 'admin'
- `profile_completed` (BOOLEAN) - Profile completion status
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `pinned_courses`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → auth.users)
- `course_id` (UUID, Foreign Key → courses)
- `pinned_at` (TIMESTAMP)

### Storage Buckets

- `course-files` - Public bucket for all course resources
- `avatars` - User profile pictures (optional)

## 🔐 Security

- **Row Level Security (RLS)** enabled on all tables
- **Public routes**: Homepage, courses, contributors, about, contact, help, privacy, terms
- **Protected routes**: Profile, onboarding, pinned courses (require authentication)
- **Admin routes**: Admin dashboard and all sub-pages (require admin role)
- **Middleware protection**: Automatic redirects for unauthorized access
- **Google OAuth**: Secure authentication via Supabase Auth
- **Role-based access control**: 'student' and 'admin' roles with check constraints
- **Secure file storage**: Supabase Storage with proper access policies

## 🚀 SEO & Performance

### SEO Features
- **Comprehensive metadata**: Title templates, descriptions, OpenGraph tags
- **Sitemap.xml**: Auto-generated dynamic sitemap
- **Robots.txt**: Search engine directives
- **JSON-LD**: Structured data for rich snippets
- **Twitter Cards**: Social media preview optimization
- **Canonical URLs**: Proper URL structure
- **Mobile-first**: Responsive design for all devices

### Performance
- **Next.js 14**: App Router for optimal performance
- **Static Generation**: Pre-rendered pages where possible
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic code splitting
- **PWA Support**: Service worker with next-pwa
- **Fast Loading**: Optimized bundle sizes

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

## 📝 Adding More Courses

You can add more courses through the Supabase dashboard or SQL:

```sql
INSERT INTO courses (code, name, department) VALUES
    ('CSC 2201', 'Data Structures', 'COMPUTER SCIENCE');
```

Or use the Supabase Table Editor in the dashboard.

## 🐛 Troubleshooting

### Files won't upload
- Check that the `course-files` bucket exists and is public
- Verify your Supabase credentials in `.env.local`
- Check browser console for errors

### Can't see courses
- Ensure you ran the `supabase-schema.sql` script
- Check that sample courses were inserted
- Verify RLS policies are correctly set

### Preview not working
- Ensure the storage bucket is **public**
- Check file MIME types are correct
- Some file types (like Word docs) may not preview in browser

## 📄 License

MIT License - feel free to use this project for your own purposes!

## 🤝 Contributing

Contributions are welcome! See our [Contributors Page](https://aiubfiles.app/contributors) for the hall of fame.

To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
5. Your name will be added to the contributors page!

## � Acknowledgments

- **Contributors**: See [/contributors](https://aiubfiles.app/contributors)
- **AIUB Students**: For using and providing feedback
- **Open Source Community**: For the amazing tools and libraries

## 📞 Support

- **Email**: [contact@aiubfiles.app](mailto:contact@aiubfiles.app)
- **GitHub Issues**: Report bugs or request features
- **Help Center**: Visit [/help](https://aiubfiles.app/help) for FAQs

## 🔄 Recent Updates

### Version 2.0 (October 2025)
- ✅ Complete UI redesign with ultra-minimalistic aesthetic
- ✅ Added user management page for admins
- ✅ Comprehensive SEO optimization
- ✅ Mobile-responsive admin dashboard
- ✅ Contributors hall of fame page
- ✅ Course pinning with smooth animations
- ✅ Improved authentication flow
- ✅ Database role migration (user → student)
- ✅ TestSprite integration for automated testing

### Version 1.0 (September 2025)
- 🎉 Initial release
- Admin dashboard with file and course management
- Google OAuth authentication
- File preview and download
- Responsive design

---

**Built with ❤️ for AIUB Students**

[Website](https://aiubfiles.app) • [GitHub](https://github.com/codewithtanvir/the-missing-semester-aiub) • [Contributors](https://aiubfiles.app/contributors)
