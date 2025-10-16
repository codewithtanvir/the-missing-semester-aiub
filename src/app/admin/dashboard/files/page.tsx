'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Course, Category } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Upload, 
  Search, 
  Trash2, 
  Edit, 
  Eye,
  FileText,
  Filter,
  Download
} from "lucide-react";

interface FileData {
  id: string;
  title: string;
  category: Category;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
  courses: { code: string; name: string } | null;
}

export default function FilesManagementPage() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  
  // Upload form state
  const [uploadCourse, setUploadCourse] = useState("");
  const [uploadCategory, setUploadCategory] = useState<Category>("Midterm");
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load courses
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .order('code', { ascending: true });
      if (coursesData) setCourses(coursesData);

      // Load files
      await loadFiles();
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFiles = async () => {
    const { data: filesData } = await supabase
      .from('files')
      .select(`
        id,
        title,
        category,
        file_path,
        file_type,
        file_size,
        created_at,
        courses (code, name)
      `)
      .order('created_at', { ascending: false });

    if (filesData) {
      setFiles(filesData as FileData[]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadFiles.length === 0 || !uploadCourse) return;

    setUploading(true);
    setUploadProgress({ current: 0, total: uploadFiles.length });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let successCount = 0;
      let failedFiles: string[] = [];

      // Upload files one by one
      for (let i = 0; i < uploadFiles.length; i++) {
        const file = uploadFiles[i];
        setUploadProgress({ current: i + 1, total: uploadFiles.length });

        try {
          // Upload file to storage
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `${uploadCourse}/${uploadCategory}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('course-files')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          // Auto-generate title from filename (remove extension)
          const title = file.name.replace(/\.[^/.]+$/, '');

          // Create database record
          const { error: dbError } = await supabase
            .from('files')
            .insert({
              course_id: uploadCourse,
              category: uploadCategory,
              title: title,
              file_path: filePath,
              file_type: file.type,
              file_size: file.size,
              uploader_id: user.id,
            } as any);

          if (dbError) {
            console.error('Database insert error:', dbError);
            throw dbError;
          }

          successCount++;
        } catch (error: any) {
          console.error(`Error uploading ${file.name}:`, error);
          failedFiles.push(file.name);
        }
      }

      // Show results
      if (successCount > 0) {
        toast({
          title: "Success",
          description: `${successCount} file${successCount > 1 ? 's' : ''} uploaded successfully`,
        });
      }

      if (failedFiles.length > 0) {
        toast({
          title: "Warning",
          description: `Failed to upload: ${failedFiles.join(', ')}`,
          variant: "destructive",
        });
      }

      // Reset form
      setUploadFiles([]);
      setUploadDialogOpen(false);
      await loadFiles();
    } catch (error: any) {
      console.error('Error uploading files:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;

    try {
      const file = files.find(f => f.id === fileToDelete);
      if (!file) return;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('course-files')
        .remove([file.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', fileToDelete);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "File deleted successfully",
      });

      setDeleteDialogOpen(false);
      setFileToDelete(null);
      await loadFiles();
    } catch (error: any) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.courses?.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === "all" || file.courses?.code === selectedCourse;
    const matchesCategory = selectedCategory === "all" || file.category === selectedCategory;
    
    return matchesSearch && matchesCourse && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryBadge = (category: Category) => {
    const variants = {
      Midterm: "default",
      Final: "destructive",
      Solutions: "outline",
      Others: "secondary",
    };
    return <Badge variant={variants[category] as any}>{category}</Badge>;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-6xl font-extralight text-neutral-900 tracking-tight">Files</h2>
          <p className="text-neutral-500 mt-3 font-light">Upload, manage, and organize course files</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <button className="px-8 py-4 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-all duration-300 flex items-center gap-2 font-light shadow-lg hover:shadow-xl">
              <Upload className="h-5 w-5" />
              Upload Files
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">Upload Files</DialogTitle>
              <DialogDescription className="text-sm sm:text-base text-muted-foreground mt-2">
                Upload one or multiple files to course resources. Select multiple files by holding Ctrl/Cmd.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload}>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="upload-course" className="text-sm font-medium">Course</Label>
                  <select
                    id="upload-course"
                    value={uploadCourse}
                    onChange={(e) => setUploadCourse(e.target.value)}
                    className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition"
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upload-category" className="text-sm font-medium">Category</Label>
                  <select
                    id="upload-category"
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as Category)}
                    className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition"
                    required
                  >
                    <option value="Midterm">Midterm</option>
                    <option value="Final">Final</option>
                    <option value="Solutions">Solutions</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upload-file" className="text-sm font-medium">Files (Multiple Selection Supported)</Label>
                  <Input
                    id="upload-file"
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setUploadFiles(files);
                    }}
                    className="h-12 rounded-xl text-sm sm:text-base cursor-pointer file:mr-3 file:py-1.5 file:px-3 sm:file:py-2 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 transition"
                    required
                  />
                  {uploadFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          Selected {uploadFiles.length} file{uploadFiles.length > 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-primary font-medium">
                          {formatFileSize(uploadFiles.reduce((sum, f) => sum + f.size, 0))}
                        </p>
                      </div>
                      <div className="max-h-40 sm:max-h-48 overflow-y-auto overflow-x-hidden space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                        {uploadFiles.map((file, index) => (
                          <div key={index} className="text-xs sm:text-sm flex items-start sm:items-center justify-between gap-2 bg-muted px-3 py-2 rounded-lg">
                            <span className="truncate flex-1 min-w-0 break-all sm:break-normal">{file.name}</span>
                            <span className="shrink-0 text-muted-foreground text-xs whitespace-nowrap">
                              {formatFileSize(file.size)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 bg-primary/5 p-3 sm:p-4 rounded-xl border border-primary/10">
                  <p className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                    <span>📝</span> Auto-naming
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    File titles will be automatically generated from filenames. 
                    Make sure your files have descriptive names before uploading.
                  </p>
                </div>
              </div>
              <div className="mt-6 sm:mt-8 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setUploadDialogOpen(false)}
                  className="rounded-full border border-input bg-background text-foreground px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium hover:bg-muted transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={uploading || uploadFiles.length === 0}
                  className="rounded-full bg-primary text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold shadow hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      Uploading {uploadProgress.current}/{uploadProgress.total}...
                    </>
                  ) : (
                    `Upload${uploadFiles.length > 0 ? ` ${uploadFiles.length} File${uploadFiles.length > 1 ? 's' : ''}` : ''}`
                  )}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-neutral-100 bg-white p-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-neutral-200 focus:border-neutral-900 focus:outline-none transition-all duration-300 font-light"
            />
          </div>
          <div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-3 rounded-full border border-neutral-200 focus:border-neutral-900 focus:outline-none transition-all duration-300 font-light bg-white"
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course.code} value={course.code}>
                  {course.code}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-full border border-neutral-200 focus:border-neutral-900 focus:outline-none transition-all duration-300 font-light bg-white"
            >
              <option value="all">All Categories</option>
              <option value="Midterm">Midterm</option>
              <option value="Final">Final</option>
              <option value="Solutions">Solutions</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>
      </div>

      {/* Files Table */}
      <div className="rounded-2xl border border-neutral-100 bg-white overflow-hidden">
        <div className="p-8 border-b border-neutral-100">
          <h3 className="text-2xl font-light text-neutral-900">Files <span className="text-neutral-400">({filteredFiles.length})</span></h3>
          <p className="text-neutral-500 mt-1 font-light text-sm">All uploaded course resources</p>
        </div>
        <div className="p-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-neutral-200 border-t-neutral-900 mx-auto"></div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-neutral-50 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-10 w-10 text-neutral-400" />
              </div>
              <p className="text-neutral-500 font-light">No files found</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-8">
              <div className="inline-block min-w-full align-middle px-8">
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-neutral-100 hover:bg-transparent">
                        <TableHead className="whitespace-nowrap font-light text-neutral-500">Title</TableHead>
                        <TableHead className="whitespace-nowrap font-light text-neutral-500">Course</TableHead>
                        <TableHead className="whitespace-nowrap font-light text-neutral-500">Category</TableHead>
                        <TableHead className="whitespace-nowrap font-light text-neutral-500">Size</TableHead>
                        <TableHead className="whitespace-nowrap font-light text-neutral-500">Date</TableHead>
                        <TableHead className="text-right whitespace-nowrap font-light text-neutral-500">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFiles.map((file) => (
                        <TableRow key={file.id} className="border-neutral-100 hover:bg-neutral-50 transition-colors duration-200">
                          <TableCell className="font-medium whitespace-nowrap text-neutral-900">{file.title}</TableCell>
                          <TableCell className="whitespace-nowrap font-light text-neutral-700">{file.courses?.code || 'N/A'}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            <span className="px-3 py-1 rounded-full bg-neutral-50 text-neutral-700 text-sm font-light border border-neutral-200">
                              {file.category}
                            </span>
                          </TableCell>
                          <TableCell className="whitespace-nowrap font-light text-neutral-600">{formatFileSize(file.file_size)}</TableCell>
                          <TableCell className="whitespace-nowrap font-light text-neutral-600">{formatDate(file.created_at)}</TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setFileToDelete(file.id);
                                  setDeleteDialogOpen(true);
                                }}
                                className="p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
