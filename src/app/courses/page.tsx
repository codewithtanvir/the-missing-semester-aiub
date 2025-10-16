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
  const [showAllDepartments, setShowAllDepartments] = useState(false);
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
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <BroadcastMessage />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb items={[{ label: 'Courses' }]} />
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light text-neutral-900 mb-2">
            All Courses
          </h1>
          <p className="text-neutral-600">
            Explore {courses.length} courses • Find materials instantly
          </p>
        </div>

        {/* Search Bar - Centered with underline */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by course code, name, or instructor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-3 text-neutral-900 placeholder:text-neutral-400 border-b border-neutral-300 focus:border-neutral-900 outline-none transition-colors duration-200 bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Department Filter */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-2 justify-center">
            {(showAllDepartments ? departments : departments.slice(0, 6)).map((dept) => {
              const count = courses.filter(c => c.department === dept).length;
              const isSelected = selectedDepartment === dept;
              
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(isSelected ? null : dept)}
                  className={`
                    px-4 py-2 text-sm border transition-all duration-200
                    ${isSelected 
                      ? 'bg-neutral-900 text-white border-neutral-900' 
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50'
                    }
                  `}
                >
                  {dept} <span className={isSelected ? 'text-neutral-300' : 'text-neutral-400'}>({count})</span>
                </button>
              );
            })}
            
            {departments.length > 6 && (
              <button
                onClick={() => setShowAllDepartments(!showAllDepartments)}
                className="px-4 py-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors underline decoration-dotted underline-offset-4"
              >
                {showAllDepartments ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>
        </div>

        {/* View Toggle & Count */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200">
          <h2 className="text-neutral-900 font-normal">
            {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'}
            {selectedDepartment && (
              <span className="text-neutral-500 ml-2">in {selectedDepartment}</span>
            )}
          </h2>
          
          <div className="flex items-center gap-1 border border-neutral-200 bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-neutral-900 text-white' 
                  : 'text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors duration-200 ${
                viewMode === 'list' 
                  ? 'bg-neutral-900 text-white' 
                  : 'text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Courses Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto mb-4"></div>
              <p className="text-neutral-600">Loading courses...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Pinned Courses Section */}
            {pinnedCourseIds.size > 0 && !searchQuery && !selectedDepartment && (
              <div className="mb-16">
                <div className="flex items-center gap-2 mb-6">
                  <Pin className="h-4 w-4 text-amber-600 fill-current" />
                  <h2 className="text-neutral-900 font-normal">Pinned Courses</h2>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs border border-amber-200">{pinnedCourseIds.size}</span>
                </div>
                <div className={viewMode === 'grid' 
                  ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "space-y-3"
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
                <div className="border-b border-neutral-100 mt-16 mb-16"></div>
              </div>
            )}

            {/* All Courses */}
            {filteredCourses.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "space-y-3"
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
              <div className="text-center py-20 bg-white border border-neutral-100">
                <Search className="h-16 w-16 text-neutral-200 mx-auto mb-4" />
                <h3 className="text-neutral-900 font-normal mb-2">No courses found</h3>
                <p className="text-neutral-500 mb-6">
                  {searchQuery 
                    ? `No courses match "${searchQuery}"`
                    : selectedDepartment
                    ? `No courses in ${selectedDepartment}`
                    : "No courses available"}
                </p>
                {(searchQuery || selectedDepartment) && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedDepartment(null);
                    }}
                    className="px-6 py-2 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Stats Footer */}
        {!loading && courses.length > 0 && (
          <div className="mt-20 pt-8 border-t border-neutral-100">
            <div className="flex justify-center gap-16 text-center">
              <div>
                <div className="text-3xl font-light text-neutral-900 mb-1">{courses.length}</div>
                <div className="text-sm text-neutral-500 uppercase tracking-wider">Total Courses</div>
              </div>
              <div className="border-l border-neutral-200"></div>
              <div>
                <div className="text-3xl font-light text-neutral-900 mb-1">{departments.length}</div>
                <div className="text-sm text-neutral-500 uppercase tracking-wider">Departments</div>
              </div>
              <div className="border-l border-neutral-200"></div>
              <div>
                <div className="text-3xl font-light text-neutral-900 mb-1">{pinnedCourseIds.size}</div>
                <div className="text-sm text-neutral-500 uppercase tracking-wider">Pinned</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-neutral-200 mt-20 bg-white">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-sm text-neutral-400">
            © {new Date().getFullYear()} Missing Semester. All rights reserved.
          </p>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}
