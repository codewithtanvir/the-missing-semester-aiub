# Multiple File Upload Feature

## Overview

The admin dashboard now supports uploading multiple files at once, making it faster and easier to add course materials in bulk.

## Features

✅ **Multiple File Selection**: Select and upload multiple files in one operation  
✅ **Auto-naming**: File titles are automatically generated from filenames  
✅ **Progress Tracking**: Real-time upload progress (e.g., "Uploading 3/10...")  
✅ **Batch Processing**: Files are uploaded sequentially with error handling  
✅ **File Preview**: See all selected files before uploading  
✅ **Size Display**: View individual and total file sizes  
✅ **Error Resilience**: Failed uploads don't stop the batch process

## How to Use

### Step 1: Open Upload Dialog
1. Go to **Admin Dashboard → Files**
2. Click the **"Upload Files"** button

### Step 2: Select Course & Category
1. Choose the target course from the dropdown
2. Select a category:
   - **Midterm**: Midterm exams and related materials
   - **Final**: Final exams and related materials
   - **Solutions**: Answer keys and solution guides
   - **Others**: Lecture notes, assignments, etc.

### Step 3: Select Multiple Files
1. Click the file input
2. Hold **Ctrl** (Windows) or **Cmd** (Mac) to select multiple files
3. Or drag a selection box to select multiple files
4. Click **Open**

### Step 4: Review Selection
The dialog will show:
- Total number of files selected
- Individual file names and sizes
- Total combined size
- Auto-naming notice

### Step 5: Upload
1. Click **"Upload X Files"** button
2. Watch the progress counter (e.g., "Uploading 3/5...")
3. Wait for completion

### Step 6: Review Results
You'll see a toast notification with:
- ✅ Success: "X files uploaded successfully"
- ⚠️ Warning: "Failed to upload: file1.pdf, file2.docx" (if any failed)

## File Naming Best Practices

Since titles are auto-generated from filenames, use descriptive names:

### ✅ Good Filenames
```
Midterm_2024_Solutions.pdf
Lecture_Week_1_Introduction.pptx
Assignment_3_Questions.docx
Lab_Report_Template.xlsx
```

### ❌ Poor Filenames
```
untitled.pdf
doc1.docx
file.pptx
IMG_1234.jpg
```

## Technical Details

### Upload Process
1. **Authentication**: Verify admin user session
2. **Sequential Upload**: Process files one at a time
3. **Storage**: Upload to Supabase Storage bucket `course-files`
4. **Path Structure**: `{course_id}/{category}/{timestamp}-{random}.{ext}`
5. **Database Record**: Create entry in `files` table
6. **Progress Update**: Update UI counter after each file

### Error Handling
- **Individual Failures**: If one file fails, others continue
- **Storage Errors**: Network issues, file size limits
- **Database Errors**: Missing permissions, duplicate entries
- **Partial Success**: Shows count of successful uploads

### File Size Limits
- **Individual File**: 50 MB (Supabase default)
- **Total Batch**: No specific limit (sequential upload)
- **Recommended**: Keep individual files under 10 MB for faster uploads

### Supported File Types
All file types are supported, including:
- Documents: PDF, DOCX, PPTX, XLSX, TXT
- Images: JPG, PNG, GIF, WEBP
- Videos: MP4, WEBM, MOV
- Archives: ZIP, RAR
- Code: PY, JS, CPP, JAVA

## Progress Indicator

The upload button text changes during upload:
```
Before: "Upload 5 Files"
During: "Uploading 1/5..."
        "Uploading 2/5..."
        "Uploading 3/5..."
After:  "Upload 5 Files" (resets)
```

## Example Workflow

### Scenario: Upload 10 Midterm Exams

1. Select **CS101** course
2. Select **Midterm** category
3. Navigate to folder with exam files:
   ```
   CS101_Midterm_2020.pdf
   CS101_Midterm_2021.pdf
   CS101_Midterm_2022.pdf
   CS101_Midterm_2023.pdf
   CS101_Midterm_2024.pdf
   ...
   ```
4. Select all 10 files (Ctrl+A or Cmd+A)
5. Click **Upload 10 Files**
6. Watch progress: "Uploading 1/10..." → "Uploading 10/10..."
7. See success: "10 files uploaded successfully"

Result:
- All files appear in the files table
- Titles: "CS101_Midterm_2020", "CS101_Midterm_2021", etc.
- Category: Midterm
- Course: CS101

## Troubleshooting

### Problem: Files Not Uploading
**Solution**: Check RLS policies on `files` table and `course-files` bucket

### Problem: Some Files Fail
**Reasons**:
- File too large (>50 MB)
- Network timeout
- Duplicate filename in storage
- Insufficient permissions

**Solution**: Check error message, reduce file size, or rename files

### Problem: Upload Button Disabled
**Reasons**:
- No files selected
- No course selected
- Upload already in progress

**Solution**: Select files and course, wait for current upload to finish

### Problem: Slow Upload
**Reasons**:
- Large file sizes
- Slow internet connection
- Many files in batch

**Solution**: Upload in smaller batches, compress files, check network

## API Reference

### Upload Function Signature
```typescript
const handleUpload = async (e: React.FormEvent) => {
  // Validates: uploadFiles[], uploadCourse
  // Processes: Sequential upload with progress
  // Returns: Success/error toast notifications
}
```

### State Variables
```typescript
uploadFiles: File[]              // Array of selected files
uploadCourse: string             // Selected course ID
uploadCategory: Category         // "Midterm" | "Final" | "Solutions" | "Others"
uploadProgress: {                // Upload progress tracker
  current: number,
  total: number
}
uploading: boolean              // Upload in progress flag
```

### Storage Path Format
```
course-files/
  ├── {course_id}/
  │   ├── Midterm/
  │   │   ├── {timestamp}-{random}.pdf
  │   │   └── {timestamp}-{random}.docx
  │   ├── Final/
  │   │   └── {timestamp}-{random}.pdf
  │   └── Others/
  │       └── {timestamp}-{random}.pptx
```

## Performance Tips

1. **Batch Size**: Upload 10-20 files at a time for optimal performance
2. **File Compression**: Use compressed formats (PDF over DOCX, WebP over PNG)
3. **Off-Peak**: Upload large batches during off-peak hours
4. **File Names**: Use short, descriptive names (avoid special characters)
5. **Network**: Use stable, fast internet connection

## Future Enhancements

Potential improvements:
- [ ] Parallel upload (multiple files simultaneously)
- [ ] Drag-and-drop file selection
- [ ] Upload queue with pause/resume
- [ ] File validation before upload
- [ ] Progress bar (percentage) instead of counter
- [ ] Retry failed uploads automatically
- [ ] Bulk edit titles before upload
- [ ] Folder upload (preserve structure)

---

**Feature Added**: October 15, 2025  
**Status**: ✅ Active  
**Location**: Admin Dashboard → Files → Upload Files
