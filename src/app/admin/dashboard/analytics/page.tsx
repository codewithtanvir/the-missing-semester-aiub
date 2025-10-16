'use client';

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Download, 
  FileText, 
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  PieChart
} from "lucide-react";

interface AnalyticsData {
  totalFiles: number;
  totalCourses: number;
  totalDownloads: number;
  storageUsed: number;
  filesThisMonth: number;
  filesThisWeek: number;
  topCourses: { code: string; name: string; fileCount: number }[];
  topCategories: { category: string; count: number }[];
  recentActivity: { action: string; details: string; time: string }[];
  filesByDepartment: { department: string; count: number }[];
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalFiles: 0,
    totalCourses: 0,
    totalDownloads: 0,
    storageUsed: 0,
    filesThisMonth: 0,
    filesThisWeek: 0,
    topCourses: [],
    topCategories: [],
    recentActivity: [],
    filesByDepartment: [],
  });

  const supabase = createClient();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Get total files
      const { count: filesCount } = await supabase
        .from('files')
        .select('*', { count: 'exact', head: true });

      // Get total courses
      const { count: coursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      // Get files this month
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const { count: monthCount } = await supabase
        .from('files')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString());

      // Get files this week
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      const { count: weekCount } = await supabase
        .from('files')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekStart.toISOString());

      // Get files by course
      const { data: filesData } = await supabase
        .from('files')
        .select('course_id, courses(code, name)');

      const courseMap = new Map<string, { code: string; name: string; count: number }>();
      filesData?.forEach((file: any) => {
        if (file.courses) {
          const key = file.courses.code;
          if (courseMap.has(key)) {
            courseMap.get(key)!.count++;
          } else {
            courseMap.set(key, {
              code: file.courses.code,
              name: file.courses.name,
              count: 1
            });
          }
        }
      });

      const topCourses = Array.from(courseMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(c => ({ code: c.code, name: c.name, fileCount: c.count }));

      // Get files by category
      const { data: categoriesData } = await supabase
        .from('files')
        .select('category');

      const categoryMap = new Map<string, number>();
      categoriesData?.forEach((file: any) => {
        categoryMap.set(file.category, (categoryMap.get(file.category) || 0) + 1);
      });

      const topCategories = Array.from(categoryMap.entries())
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

      // Get files by department
      const { data: coursesData } = await supabase
        .from('courses')
        .select('department');

      const deptMap = new Map<string, number>();
      coursesData?.forEach((course: any) => {
        deptMap.set(course.department, (deptMap.get(course.department) || 0) + 1);
      });

      const filesByDepartment = Array.from(deptMap.entries())
        .map(([department, count]) => ({ department, count }))
        .sort((a, b) => b.count - a.count);

      // Calculate storage used
      const { data: allFiles } = await supabase
        .from('files')
        .select('file_size');

      const storageUsed = allFiles?.reduce((sum, file: any) => sum + (file.file_size || 0), 0) || 0;

      setAnalytics({
        totalFiles: filesCount || 0,
        totalCourses: coursesCount || 0,
        totalDownloads: 0, // Placeholder for future implementation
        storageUsed,
        filesThisMonth: monthCount || 0,
        filesThisWeek: weekCount || 0,
        topCourses,
        topCategories,
        recentActivity: [],
        filesByDepartment,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Midterm': 'bg-blue-500',
      'Final': 'bg-red-500',
      'Others': 'bg-gray-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-neutral-200 border-t-neutral-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-6xl font-extralight text-neutral-900 tracking-tight">Analytics</h2>
        <p className="text-neutral-500 mt-3 font-light">Track system usage and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-neutral-100 bg-white p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-light text-neutral-500 uppercase tracking-wider">Total Files</p>
            <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-5xl font-extralight text-neutral-900 mb-2">{analytics.totalFiles}</p>
          <p className="text-sm text-neutral-500 font-light">
            {analytics.filesThisWeek} added this week
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-white p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-light text-neutral-500 uppercase tracking-wider">Storage Used</p>
            <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center">
              <Download className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-4xl font-extralight text-neutral-900 mb-2">{formatBytes(analytics.storageUsed)}</p>
          <p className="text-sm text-neutral-500 font-light">
            Across all courses
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-white p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-light text-neutral-500 uppercase tracking-wider">This Month</p>
            <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-5xl font-extralight text-neutral-900 mb-2">{analytics.filesThisMonth}</p>
          <p className="text-sm text-neutral-500 font-light">
            Files uploaded
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-white p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-light text-neutral-500 uppercase tracking-wider">Active Courses</p>
            <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-5xl font-extralight text-neutral-900 mb-2">{analytics.totalCourses}</p>
          <p className="text-sm text-neutral-500 font-light">
            Total in system
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Courses */}
        <div className="rounded-2xl border border-neutral-100 bg-white overflow-hidden">
          <div className="p-8 border-b border-neutral-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-light text-neutral-900">Top Courses</h3>
            </div>
            <p className="text-neutral-500 font-light text-sm">Most active courses with uploaded content</p>
          </div>
          <div className="p-8">
            {analytics.topCourses.length === 0 ? (
              <p className="text-center py-8 text-neutral-500 font-light">No data available</p>
            ) : (
              <div className="space-y-4">
                {analytics.topCourses.map((course, index) => (
                  <div key={course.code} className="flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-50 transition-colors duration-200">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-10 w-10 rounded-full bg-neutral-900 flex items-center justify-center text-sm font-light text-white">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-neutral-900 truncate">{course.code}</p>
                        <p className="text-xs text-neutral-500 font-light truncate">{course.name}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-neutral-50 text-neutral-700 text-sm font-light border border-neutral-200">
                      {course.fileCount} files
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="rounded-2xl border border-neutral-100 bg-white overflow-hidden">
          <div className="p-8 border-b border-neutral-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
                <PieChart className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-light text-neutral-900">Files by Category</h3>
            </div>
            <p className="text-neutral-500 font-light text-sm">Distribution across exam categories</p>
          </div>
          <div className="p-8">
            {analytics.topCategories.length === 0 ? (
              <p className="text-center py-8 text-neutral-500 font-light">No data available</p>
            ) : (
              <div className="space-y-6">
                {analytics.topCategories.map((cat) => {
                  const percentage = (cat.count / analytics.totalFiles * 100).toFixed(1);
                  return (
                    <div key={cat.category} className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-neutral-900">{cat.category}</span>
                        <span className="text-neutral-500 font-light">{cat.count} files ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-neutral-900 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Departments */}
      <div className="rounded-2xl border border-neutral-100 bg-white overflow-hidden">
        <div className="p-8 border-b border-neutral-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-2xl font-light text-neutral-900">Courses by Department</h3>
          </div>
          <p className="text-neutral-500 font-light text-sm">Department-wise course distribution</p>
        </div>
        <div className="p-8">
          {analytics.filesByDepartment.length === 0 ? (
            <p className="text-center py-8 text-neutral-500 font-light">No data available</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-100 hover:bg-transparent">
                  <TableHead className="font-light text-neutral-500">Department</TableHead>
                  <TableHead className="text-right font-light text-neutral-500">Courses</TableHead>
                  <TableHead className="text-right font-light text-neutral-500">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.filesByDepartment.map((dept) => {
                  const percentage = ((dept.count / analytics.totalCourses) * 100).toFixed(1);
                  return (
                    <TableRow key={dept.department} className="border-neutral-100 hover:bg-neutral-50 transition-colors duration-200">
                      <TableCell className="font-medium text-neutral-900">{dept.department}</TableCell>
                      <TableCell className="text-right font-light text-neutral-700">{dept.count}</TableCell>
                      <TableCell className="text-right">
                        <span className="px-3 py-1 rounded-full bg-neutral-50 text-neutral-700 text-sm font-light border border-neutral-200">
                          {percentage}%
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
