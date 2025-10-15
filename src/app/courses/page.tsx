'use client';

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { BookOpen, Search, Filter, Grid, List, X, TrendingUp, ArrowLeft, Pin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CourseCard } from "@/components/course-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { BackToTop } from "@/components/back-to-top";
import { BroadcastMessage } from "@/components/broadcast-message";
import type { Course } from "@/types/database";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [pinnedCourseIds, setPinnedCourseIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const supabase = createClient();

  const loadPinnedCourses = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return;

    const { data, error } = await supabase
      .from('pinned_courses')
      .select('course_id')
      .eq('user_id', user.id) as any;

    if (!error && data) {
      setPinnedCourseIds(new Set(data.map((p: any) => p.course_id)));
    }
  };

  useEffect(() => {
    const loadData = async () => {
      // Load courses
      const { data: coursesData, error } = await supabase
        .from("courses")
        .select("*")
        .order("code", { ascending: true });

      if (!error && coursesData) {
        setCourses(coursesData);
      }

      // Load pinned courses
      await loadPinnedCourses();
      
      setLoading(false);
    };

    loadData();
  }, [supabase]);

  // Get unique departments
  const departments = useMemo(() => {
    const depts = [...new Set(courses.map(c => c.department))].sort();
    return depts;
  }, [courses]);

  // Filter courses based on search and department
  const filteredCourses = useMemo(() => {
    let filtered = courses;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course => 
        course.code.toLowerCase().includes(query) ||
        course.name.toLowerCase().includes(query) ||
        course.department.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query) ||
        course.instructor?.toLowerCase().includes(query)
      );
    }

    // Filter by department
    if (selectedDepartment) {
      filtered = filtered.filter(course => course.department === selectedDepartment);
    }

    return filtered;
  }, [courses, searchQuery, selectedDepartment]);

  // Get popular departments (top 6 by course count)
  const popularDepartments = useMemo(() => {
    const deptCounts = courses.reduce((acc, course) => {
      acc[course.department] = (acc[course.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(deptCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([dept]) => dept);
  }, [courses]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <Navigation />
      <BroadcastMessage />

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <Breadcrumb items={[{ label: 'Courses' }]} />

        {/* Hero Section */}
        <div className="mb-6 sm:mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 px-4">
            Browse All Courses
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Search through {courses.length} courses and find learning materials instantly
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2 sm:gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 pr-9 sm:pr-10 h-10 sm:h-11 text-sm sm:text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="h-10 sm:h-11 px-3 sm:px-4 text-sm sm:text-base"
            >
              <Filter className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white rounded-lg border p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Department</h3>
                {selectedDepartment && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDepartment(null)}
                    className="text-xs sm:text-sm h-8"
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {departments.map((dept) => (
                  <Badge
                    key={dept}
                    variant={selectedDepartment === dept ? "default" : "outline"}
                    className="cursor-pointer px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm"
                    onClick={() => setSelectedDepartment(selectedDepartment === dept ? null : dept)}
                  >
                    {dept}
                    <span className="ml-1 sm:ml-1.5 text-xs opacity-60">
                      ({courses.filter(c => c.department === dept).length})
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Popular Departments Quick Access */}
          {!showFilters && !selectedDepartment && (
            <div className="flex items-center gap-2 justify-center flex-wrap px-2">
              <span className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Popular:</span>
              </span>
              {popularDepartments.map((dept) => (
                <Badge
                  key={dept}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50 text-xs sm:text-sm px-2 sm:px-2.5 py-0.5 sm:py-1"
                  onClick={() => setSelectedDepartment(dept)}
                >
                  {dept}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'}
              {selectedDepartment && (
                <>
                  {' '}in{' '}
                  <Badge variant="default" className="ml-1 text-xs sm:text-sm">
                    {selectedDepartment}
                    <button
                      onClick={() => setSelectedDepartment(null)}
                      className="ml-1.5 sm:ml-2 hover:bg-blue-700 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                </>
              )}
            </h3>
            {searchQuery && (
              <span className="text-xs sm:text-sm text-gray-500">
                for "{searchQuery}"
              </span>
            )}
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 w-fit">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-7 sm:h-8 px-2 sm:px-3"
            >
              <Grid className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-7 sm:h-8 px-2 sm:px-3"
            >
              <List className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        {/* Courses Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading courses...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Pinned Courses Section */}
            {pinnedCourseIds.size > 0 && !searchQuery && !selectedDepartment && (
              <div className="mb-8 sm:mb-12">
                <div className="flex items-center gap-2 mb-4 sm:mb-6 px-1">
                  <Pin className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-current" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Pinned Courses</h2>
                  <Badge variant="secondary" className="ml-2 text-xs sm:text-sm">
                    {pinnedCourseIds.size}
                  </Badge>
                </div>
                <div className={viewMode === 'grid' 
                  ? "grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "space-y-3 sm:space-y-4"
                }>
                  {courses
                    .filter(course => pinnedCourseIds.has(course.id))
                    .map((course) => (
                      <CourseCard 
                        key={course.id} 
                        course={course} 
                        viewMode={viewMode}
                        isPinned={true}
                        onPinChange={loadPinnedCourses}
                      />
                    ))}
                </div>
                <div className="border-t mt-6 sm:mt-8 mb-6 sm:mb-8"></div>
              </div>
            )}

            {/* All Courses Section */}
            {filteredCourses.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "space-y-3 sm:space-y-4"
              }>
                {filteredCourses.map((course) => (
                  <CourseCard 
                    key={course.id} 
                    course={course} 
                    viewMode={viewMode}
                    isPinned={pinnedCourseIds.has(course.id)}
                    onPinChange={loadPinnedCourses}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 sm:p-12 text-center">
                <Search className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 px-4">
                  {searchQuery || selectedDepartment
                    ? "Try adjusting your search or filters"
                    : "No courses available yet"}
                </p>
                {(searchQuery || selectedDepartment) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedDepartment(null);
                    }}
                    className="text-sm sm:text-base"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t bg-white mt-12 sm:mt-16">
        <div className="container mx-auto px-4 py-4 sm:py-6 text-center text-xs sm:text-sm text-gray-600">
          © {new Date().getFullYear()} Missing Semester. All rights reserved.
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}
