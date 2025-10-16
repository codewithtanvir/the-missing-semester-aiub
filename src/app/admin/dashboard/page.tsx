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
        <div className="w-16 h-16 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Welcome Section */}
      <div className="space-y-2 md:space-y-3">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extralight text-neutral-900">Dashboard</h2>
        <p className="text-lg sm:text-xl text-neutral-500 font-light">Monitor your system activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-neutral-100 rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neutral-900 flex items-center justify-center">
              <Files className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <div className="text-3xl sm:text-4xl md:text-5xl font-extralight text-neutral-900">{stats.totalFiles}</div>
            <p className="text-xs sm:text-sm text-neutral-500 uppercase tracking-wider font-medium">Total Files</p>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neutral-900 flex items-center justify-center">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <div className="text-3xl sm:text-4xl md:text-5xl font-extralight text-neutral-900">{stats.totalCourses}</div>
            <p className="text-xs sm:text-sm text-neutral-500 uppercase tracking-wider font-medium">Courses</p>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neutral-900 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <div className="text-3xl sm:text-4xl md:text-5xl font-extralight text-neutral-900">{stats.recentUploads}</div>
            <p className="text-xs sm:text-sm text-neutral-500 uppercase tracking-wider font-medium">Recent (7d)</p>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neutral-900 flex items-center justify-center">
              <Download className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <div className="text-3xl sm:text-4xl md:text-5xl font-extralight text-neutral-900">--</div>
            <p className="text-xs sm:text-sm text-neutral-500 uppercase tracking-wider font-medium">Storage</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-4 sm:p-6 md:p-8">
        <div className="mb-6 md:mb-8 space-y-1 sm:space-y-2">
          <h3 className="text-2xl sm:text-3xl font-light text-neutral-900">Quick Actions</h3>
          <p className="text-sm sm:text-base text-neutral-500 font-light">Common administrative tasks</p>
        </div>
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/dashboard/files">
            <button className="w-full bg-neutral-50 hover:bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg group">
              <div className="flex flex-col items-center gap-3 sm:gap-4 text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-neutral-900 group-hover:bg-neutral-800 flex items-center justify-center transition-colors">
                  <Upload className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <span className="text-sm sm:text-base font-light text-neutral-900">Upload File</span>
              </div>
            </button>
          </Link>
          <Link href="/admin/dashboard/courses">
            <button className="w-full bg-neutral-50 hover:bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg group">
              <div className="flex flex-col items-center gap-3 sm:gap-4 text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-neutral-900 group-hover:bg-neutral-800 flex items-center justify-center transition-colors">
                  <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <span className="text-sm sm:text-base font-light text-neutral-900">Manage Courses</span>
              </div>
            </button>
          </Link>
          <Link href="/admin/dashboard/analytics">
            <button className="w-full bg-neutral-50 hover:bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg group">
              <div className="flex flex-col items-center gap-3 sm:gap-4 text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-neutral-900 group-hover:bg-neutral-800 flex items-center justify-center transition-colors">
                  <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <span className="text-sm sm:text-base font-light text-neutral-900">View Analytics</span>
              </div>
            </button>
          </Link>
          <Link href="/admin/dashboard/settings">
            <button className="w-full bg-neutral-50 hover:bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg group">
              <div className="flex flex-col items-center gap-3 sm:gap-4 text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-neutral-900 group-hover:bg-neutral-800 flex items-center justify-center transition-colors">
                  <Users className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <span className="text-sm sm:text-base font-light text-neutral-900">Settings</span>
              </div>
            </button>
          </Link>
        </div>
      </div>

      {/* Recent Files */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-4 sm:p-6 md:p-8">
        <div className="mb-6 md:mb-8 space-y-1 sm:space-y-2">
          <h3 className="text-2xl sm:text-3xl font-light text-neutral-900">Recent Uploads</h3>
          <p className="text-sm sm:text-base text-neutral-500 font-light">Latest files added to the system</p>
        </div>
        {recentFiles.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-neutral-50 flex items-center justify-center mb-4 sm:mb-6">
              <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-neutral-300" />
            </div>
            <p className="text-sm sm:text-base text-neutral-500 font-light mb-4 sm:mb-6">No files uploaded yet</p>
            <Link href="/admin/dashboard/files">
              <button className="px-6 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-all duration-300 font-medium text-sm sm:text-base">
                Upload your first file
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {recentFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border border-neutral-100 bg-white hover:bg-neutral-50 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-neutral-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-900" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
                    <p className="text-sm sm:text-base font-light text-neutral-900 truncate">
                      {file.title}
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-500 font-light">
                      {file.course_code} • {file.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm text-neutral-500 font-light">
                  <div className="hidden md:flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {formatDate(file.created_at)}
                  </div>
                  <div className="text-right font-mono text-xs">
                    {formatFileSize(file.file_size)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
