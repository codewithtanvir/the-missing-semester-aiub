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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">File Management</h2>
          <p className="text-gray-600 mt-1">Upload, manage, and organize course files</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload Files</DialogTitle>
              <DialogDescription>
                Upload one or multiple files to course resources. Select multiple files by holding Ctrl/Cmd.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="upload-course">Course</Label>
                  <select
                    id="upload-course"
                    value={uploadCourse}
                    onChange={(e) => setUploadCourse(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                  <Label htmlFor="upload-category">Category</Label>
                  <select
                    id="upload-category"
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as Category)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="Midterm">Midterm</option>
                    <option value="Final">Final</option>
                    <option value="Solutions">Solutions</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upload-file">Files (Multiple Selection Supported)</Label>
                  <Input
                    id="upload-file"
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setUploadFiles(files);
                    }}
                    required
                  />
                  {uploadFiles.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm font-medium text-gray-700">
                        Selected {uploadFiles.length} file{uploadFiles.length > 1 ? 's' : ''}:
                      </p>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {uploadFiles.map((file, index) => (
                          <div key={index} className="text-xs text-gray-600 flex items-center justify-between bg-gray-50 px-2 py-1 rounded">
                            <span className="truncate flex-1">{file.name}</span>
                            <span className="ml-2 text-gray-500">({formatFileSize(file.size)})</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-blue-600 font-medium">
                        Total size: {formatFileSize(uploadFiles.reduce((sum, f) => sum + f.size, 0))}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900">📝 Auto-naming</p>
                  <p className="text-xs text-blue-700">
                    File titles will be automatically generated from filenames. 
                    Make sure your files have descriptive names before uploading.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={uploading || uploadFiles.length === 0}>
                  {uploading ? (
                    <>
                      Uploading {uploadProgress.current}/{uploadProgress.total}...
                    </>
                  ) : (
                    `Upload ${uploadFiles.length > 0 ? `${uploadFiles.length} File${uploadFiles.length > 1 ? 's' : ''}` : ''}`
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All Categories</option>
                <option value="Midterm">Midterm</option>
                <option value="Final">Final</option>
                <option value="Solutions">Solutions</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files Table */}
      <Card>
        <CardHeader>
          <CardTitle>Files ({filteredFiles.length})</CardTitle>
          <CardDescription>All uploaded course resources</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No files found</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 sm:-mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">Title</TableHead>
                        <TableHead className="whitespace-nowrap">Course</TableHead>
                        <TableHead className="whitespace-nowrap">Category</TableHead>
                        <TableHead className="whitespace-nowrap">Size</TableHead>
                        <TableHead className="whitespace-nowrap">Date</TableHead>
                        <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFiles.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell className="font-medium whitespace-nowrap">{file.title}</TableCell>
                          <TableCell className="whitespace-nowrap">{file.courses?.code || 'N/A'}</TableCell>
                          <TableCell className="whitespace-nowrap">{getCategoryBadge(file.category)}</TableCell>
                          <TableCell className="whitespace-nowrap">{formatFileSize(file.file_size)}</TableCell>
                          <TableCell className="whitespace-nowrap">{formatDate(file.created_at)}</TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setFileToDelete(file.id);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
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
        </CardContent>
      </Card>

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
