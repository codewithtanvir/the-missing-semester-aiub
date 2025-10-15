# Course Resources Management System

A full-stack web application for students to browse, preview, and download course resources (PDFs, DOCs, images) organized by Course → Category → File.

## 🧰 Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)

## ✨ Features

### Student Interface
- 📚 Browse all available courses
- 📂 View resources organized by categories (Midterm, Final, Others)
- 👁️ Preview files inline (PDFs, images, text files)
- ⬇️ Download resources with one click
- 🔍 Clean, responsive UI with Tailwind CSS
- 🌐 Open access - no login required

### Admin Dashboard ⭐ NEW!
**Complete, powerful admin panel with enterprise features:**

#### 🏠 Dashboard Home
- Real-time statistics (files, courses, storage, downloads)
- Quick action buttons for common tasks
- Recent activity feed with timestamps
- Beautiful stat cards with trend indicators

#### 📁 File Management
- Upload files with drag-and-drop support
- Advanced search and filtering by course/category
- Data table with sortable columns
- Delete files with confirmation dialogs
- File details: title, size, date, course, category
- Badge indicators for categories

#### 📚 Course Management
- Add/Edit/Delete courses with full CRUD operations
- Course details: code, name, department, description, semester, instructor, credits
- Department filtering (11 departments supported)
- Search by course code or name
- Dependency checks before deletion
- Beautiful table layout with action buttons

#### 📊 Analytics & Insights
- Comprehensive system analytics
- Top courses by file count
- Category distribution with charts
- Department-wise course breakdown
- Storage usage tracking
- Upload trends (daily/weekly/monthly)
- Visual progress bars and badges

#### ⚙️ Settings
- Profile management (email, user ID, account info)
- Change password with validation
- Update email with verification
- Security status overview
- System information and statistics
- Tabbed interface for easy navigation

#### 🎨 UI/UX Features
- Clean, modern design with gradient backgrounds
- Responsive sidebar navigation
- Mobile-friendly with hamburger menu
- Color-coded sections (blue/green/purple/orange)
- Beautiful cards, tables, and dialogs
- Toast notifications for actions
- Loading states and animations
- Icon system with Lucide icons

See [ADMIN-DASHBOARD-GUIDE.md](./ADMIN-DASHBOARD-GUIDE.md) for complete documentation.

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

### Courses Table
- `id` (UUID, Primary Key)
- `code` (VARCHAR) - e.g., "CSC 1101"
- `name` (VARCHAR) - e.g., "Introduction to Computer Studies"
- `department` (VARCHAR) - e.g., "COMPUTER SCIENCE"
- `created_at` (TIMESTAMP)

### Files Table
- `id` (UUID, Primary Key)
- `course_id` (UUID, Foreign Key)
- `category` (VARCHAR) - "Midterm", "Final", or "Others"
- `title` (VARCHAR) - File display name
- `file_path` (TEXT) - Storage path
- `file_type` (VARCHAR) - MIME type
- `file_size` (BIGINT) - File size in bytes
- `uploader_id` (UUID) - Admin user ID
- `uploaded_at` (TIMESTAMP)

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Public read access for students (no login required)
- Write access restricted to authenticated admin users
- Secure file storage with Supabase Storage

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

Contributions are welcome! Feel free to open issues or submit pull requests.

## 👏 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
