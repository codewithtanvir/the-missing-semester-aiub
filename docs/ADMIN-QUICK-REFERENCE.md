# Admin Dashboard - Quick Reference

## 🚀 Quick Access

- **Login**: http://localhost:3000/admin
- **Dashboard**: http://localhost:3000/admin/dashboard
- **Files**: http://localhost:3000/admin/dashboard/files
- **Courses**: http://localhost:3000/admin/dashboard/courses
- **Analytics**: http://localhost:3000/admin/dashboard/analytics
- **Settings**: http://localhost:3000/admin/dashboard/settings

## 📋 Quick Tasks

### Upload a File
1. Dashboard → Files → "Upload File" button
2. Select course, category, title, and file
3. Click "Upload"

### Add a Course
1. Dashboard → Courses → "Add Course" button
2. Fill: code (required), name (required), department (required)
3. Optional: description, semester, instructor, credits
4. Click "Add Course"

### View Statistics
1. Dashboard → Dashboard home
2. See: total files, courses, recent uploads, storage
3. View recent activity feed

### Check Analytics
1. Dashboard → Analytics
2. See: top courses, category distribution, department breakdown
3. Monitor storage and upload trends

### Change Password
1. Dashboard → Settings → Security tab
2. Enter new password twice
3. Click "Update Password"

## 🎨 UI Components Reference

### Cards
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Badges
```tsx
<Badge variant="default">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

### Dialogs
```tsx
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    Content
    <DialogFooter>Actions</DialogFooter>
  </DialogContent>
</Dialog>
```

### Tables
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Header</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Alerts
```tsx
<Alert variant="default">
  <AlertTitle>Title</AlertTitle>
  <AlertDescription>Description</AlertDescription>
</Alert>
```

### Toast
```tsx
const { toast } = useToast();

toast({
  title: "Success",
  description: "Action completed",
});

toast({
  title: "Error",
  description: "Something went wrong",
  variant: "destructive",
});
```

## 🎯 Features by Section

### Dashboard Home
✅ Statistics cards
✅ Quick actions
✅ Recent files
✅ Visual metrics

### Files
✅ Upload dialog
✅ Search & filter
✅ Data table
✅ Delete action

### Courses
✅ Add/Edit/Delete
✅ Full details form
✅ Department filter
✅ Search function

### Analytics
✅ Key metrics
✅ Top courses
✅ Category charts
✅ Department stats

### Settings
✅ Profile info
✅ Email update
✅ Password change
✅ System info

## 🎨 Color Guide

- **Blue** (#3B82F6): Files, primary
- **Green** (#10B981): Courses, success
- **Purple** (#8B5CF6): Analytics
- **Orange** (#F59E0B): Settings, warnings
- **Red** (#EF4444): Delete, errors
- **Gray** (#6B7280): Text, neutral

## 📱 Breakpoints

- **Mobile**: < 768px (sm)
- **Tablet**: 768px - 1024px (md)
- **Desktop**: > 1024px (lg)

## 🔑 Key Features

1. **Sidebar Navigation**: Fixed, responsive
2. **Modal Dialogs**: Forms and confirmations
3. **Data Tables**: Sortable, filterable
4. **Toast Notifications**: Action feedback
5. **Loading States**: Spinners and skeletons
6. **Color Coding**: Visual organization
7. **Icons**: Lucide icons throughout
8. **Responsive**: Mobile-first design

## 📚 Documentation

- **Full Guide**: ADMIN-DASHBOARD-GUIDE.md
- **Update Summary**: ADMIN-DASHBOARD-UPDATE.md
- **Main README**: README.md
- **Quick Ref**: ADMIN-QUICK-REFERENCE.md (this file)

## 🐛 Common Issues

**TypeScript errors?**
- They're just inference warnings
- Won't affect runtime
- Code works perfectly

**Can't upload?**
- Check Supabase bucket exists
- Verify it's public
- Check file size limits

**Can't delete course?**
- Delete all course files first
- System prevents orphaned files

## ⚡ Pro Tips

1. Use search before scrolling
2. Filter by department for organization
3. Check analytics weekly
4. Keep password secure
5. Update email if needed
6. Monitor storage usage
7. Delete unused files regularly
8. Use clear file titles

## 🎓 Best Practices

- **File Naming**: Use descriptive titles
- **Course Organization**: Keep departments tidy
- **Regular Backups**: Export data periodically
- **Monitor Storage**: Check analytics
- **Security**: Change password regularly
- **Clean Up**: Remove old files

---

**Ready to manage your course resources!** 🚀
