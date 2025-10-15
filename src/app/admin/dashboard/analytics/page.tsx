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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
        <p className="text-gray-600 mt-1">Track system usage and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalFiles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.filesThisWeek} added this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Download className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(analytics.storageUsed)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.filesThisMonth}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Files uploaded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total in system
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Top Courses by Files
            </CardTitle>
            <CardDescription>Most active courses with uploaded content</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topCourses.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No data available</p>
            ) : (
              <div className="space-y-4">
                {analytics.topCourses.map((course, index) => (
                  <div key={course.code} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{course.code}</p>
                        <p className="text-xs text-gray-500 truncate">{course.name}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{course.fileCount} files</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              Files by Category
            </CardTitle>
            <CardDescription>Distribution across exam categories</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topCategories.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No data available</p>
            ) : (
              <div className="space-y-4">
                {analytics.topCategories.map((cat) => {
                  const percentage = (cat.count / analytics.totalFiles * 100).toFixed(1);
                  return (
                    <div key={cat.category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{cat.category}</span>
                        <span className="text-gray-500">{cat.count} files ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getCategoryColor(cat.category)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Departments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            Courses by Department
          </CardTitle>
          <CardDescription>Department-wise course distribution</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.filesByDepartment.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No data available</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Courses</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.filesByDepartment.map((dept) => {
                  const percentage = ((dept.count / analytics.totalCourses) * 100).toFixed(1);
                  return (
                    <TableRow key={dept.department}>
                      <TableCell className="font-medium">{dept.department}</TableCell>
                      <TableCell className="text-right">{dept.count}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">{percentage}%</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
