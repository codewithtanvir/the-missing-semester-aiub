'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Files, 
  BookOpen, 
  Users, 
  TrendingUp,
  Upload,
  Download,
  Clock,
  FileText
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  totalFiles: number;
  totalCourses: number;
  totalDownloads: number;
  recentUploads: number;
}

interface RecentFile {
  id: string;
  title: string;
  course_code: string;
  category: string;
  created_at: string;
  file_size: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalFiles: 0,
    totalCourses: 0,
    totalDownloads: 0,
    recentUploads: 0,
  });
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Get total files
        const { count: filesCount } = await supabase
          .from('files')
          .select('*', { count: 'exact', head: true });

        // Get total courses
        const { count: coursesCount } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true });

        // Get recent uploads (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const { count: recentCount } = await supabase
          .from('files')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sevenDaysAgo.toISOString());

        // Get recent files with course info
        const { data: filesData } = await supabase
          .from('files')
          .select(`
            id,
            title,
            category,
            created_at,
            file_size,
            courses (code)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          totalFiles: filesCount || 0,
          totalCourses: coursesCount || 0,
          totalDownloads: 0, // Will be implemented with download tracking
          recentUploads: recentCount || 0,
        });

        if (filesData) {
          setRecentFiles(
            filesData.map((file: any) => ({
              ...file,
              course_code: file.courses?.code || 'Unknown',
            }))
          );
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [supabase]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">Monitor your course resources and system activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <Files className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFiles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Uploaded resources
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentUploads}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Download className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total storage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/dashboard/files">
              <Button variant="outline" className="w-full h-auto flex flex-col items-center gap-2 py-4">
                <Upload className="h-6 w-6 text-blue-600" />
                <span className="font-medium">Upload File</span>
              </Button>
            </Link>
            <Link href="/admin/dashboard/courses">
              <Button variant="outline" className="w-full h-auto flex flex-col items-center gap-2 py-4">
                <BookOpen className="h-6 w-6 text-green-600" />
                <span className="font-medium">Manage Courses</span>
              </Button>
            </Link>
            <Link href="/admin/dashboard/analytics">
              <Button variant="outline" className="w-full h-auto flex flex-col items-center gap-2 py-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                <span className="font-medium">View Analytics</span>
              </Button>
            </Link>
            <Link href="/admin/dashboard/settings">
              <Button variant="outline" className="w-full h-auto flex flex-col items-center gap-2 py-4">
                <Users className="h-6 w-6 text-orange-600" />
                <span className="font-medium">Settings</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Files */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>Latest files added to the system</CardDescription>
        </CardHeader>
        <CardContent>
          {recentFiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No files uploaded yet</p>
              <Link href="/admin/dashboard/files">
                <Button variant="link" className="mt-2">Upload your first file</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {file.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {file.course_code} • {file.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="hidden sm:flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(file.created_at)}
                    </div>
                    <div className="text-right">
                      {formatFileSize(file.file_size)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
