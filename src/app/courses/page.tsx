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
    <div className="min-h-screen bg-white">
      <Navigation />
      <BroadcastMessage />

      <main className="container mx-auto px-6 sm:px-8 lg:px-12 py-12 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-12">
          <Breadcrumb items={[{ label: 'Courses' }]} />
        </div>

        {/* Header - Ultra Minimal */}
        <div className="mb-16 text-center max-w-4xl mx-auto">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-extralight text-neutral-900 mb-6 leading-none tracking-tight">
            Courses
          </h1>
          <p className="text-xl text-neutral-500 font-light">
            {courses.length} courses across {departments.length} departments
          </p>
        </div>

        {/* Search Bar - Ultra Minimal */}
        <div className="mb-16 max-w-3xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 group-focus-within:text-neutral-900 transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-10 py-4 text-lg text-neutral-900 placeholder:text-neutral-400 border-b-2 border-neutral-200 focus:border-neutral-900 outline-none transition-all duration-300 bg-transparent font-light"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-900 transition-colors duration-200"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Department Filter - Elegant Pills */}
        <div className="mb-16">
          <div className="flex flex-wrap gap-3 justify-center max-w-5xl mx-auto">
            {(showAllDepartments ? departments : departments.slice(0, 8)).map((dept) => {
              const count = courses.filter(c => c.department === dept).length;
              const isSelected = selectedDepartment === dept;
              
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(isSelected ? null : dept)}
                  className={`
                    group px-6 py-3 text-sm font-light rounded-full border-2 transition-all duration-300
                    ${isSelected 
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-lg' 
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:shadow-md'
                    }
                  `}
                >
                  {dept}
                  <span className={`ml-2 text-xs ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
            
            {departments.length > 8 && (
              <button
                onClick={() => setShowAllDepartments(!showAllDepartments)}
                className="px-6 py-3 text-sm font-light text-neutral-500 hover:text-neutral-900 transition-colors duration-200 underline underline-offset-4 decoration-dotted"
              >
                {showAllDepartments ? 'Show Less' : `+${departments.length - 8} More`}
              </button>
            )}
          </div>
        </div>

        {/* View Toggle & Count */}
        <div className="flex items-center justify-between mb-12 pb-6 border-b border-neutral-100">
          <div>
            <h2 className="text-2xl font-light text-neutral-900">
              {filteredCourses.length} 
              <span className="text-neutral-400 ml-2">
                {filteredCourses.length === 1 ? 'result' : 'results'}
              </span>
            </h2>
            {selectedDepartment && (
              <p className="text-sm text-neutral-500 mt-1 font-light">
                Filtered by {selectedDepartment}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2 bg-neutral-50 p-1 rounded-full border border-neutral-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-full transition-all duration-300 ${
                viewMode === 'grid' 
                  ? 'bg-white text-neutral-900 shadow-md' 
                  : 'text-neutral-400 hover:text-neutral-900'
              }`}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-full transition-all duration-300 ${
                viewMode === 'list' 
                  ? 'bg-white text-neutral-900 shadow-md' 
                  : 'text-neutral-400 hover:text-neutral-900'
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Courses Content */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto"></div>
              <p className="text-neutral-500 font-light">Loading courses...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Pinned Courses Section */}
            {pinnedCourseIds.size > 0 && !searchQuery && !selectedDepartment && (
              <div className="mb-20 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-3 mb-8">
                  <Pin className="h-5 w-5 text-amber-600 fill-current animate-in zoom-in duration-300" />
                  <h2 className="text-2xl font-light text-neutral-900">Pinned</h2>
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200 animate-in zoom-in duration-300 delay-100">
                    {pinnedCourseIds.size}
                  </span>
                </div>
                <div className={viewMode === 'grid' 
                  ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "space-y-4"
                }>
                  {courses
                    .filter(course => pinnedCourseIds.has(course.id))
                    .map((course, index) => (
                      <div 
                        key={course.id}
                        className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <CourseCard 
                          course={course} 
                          viewMode={viewMode}
                          isPinned={true}
                          onPinChange={loadPinnedCourses}
                        />
                      </div>
                    ))}
                </div>
                <div className="border-b border-neutral-100 mt-20 mb-20"></div>
              </div>
            )}

            {/* All Courses */}
            {filteredCourses.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "space-y-4"
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
              <div className="text-center py-32">
                <div className="max-w-md mx-auto space-y-6">
                  <div className="w-24 h-24 mx-auto rounded-full bg-neutral-50 flex items-center justify-center">
                    <Search className="h-12 w-12 text-neutral-300" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-light text-neutral-900">No results found</h3>
                    <p className="text-neutral-500 font-light">
                      {searchQuery 
                        ? `Try adjusting your search`
                        : selectedDepartment
                        ? `No courses available in ${selectedDepartment}`
                        : "No courses available"}
                    </p>
                  </div>
                  {(searchQuery || selectedDepartment) && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedDepartment(null);
                      }}
                      className="px-8 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Stats Footer - Elegant */}
        {!loading && courses.length > 0 && (
          <div className="mt-32 pt-12 border-t border-neutral-100">
            <div className="grid grid-cols-3 gap-12 max-w-3xl mx-auto text-center">
              <div className="space-y-2">
                <div className="text-6xl font-extralight text-neutral-900">{courses.length}</div>
                <div className="text-xs text-neutral-500 uppercase tracking-widest font-medium">Courses</div>
              </div>
              <div className="space-y-2">
                <div className="text-6xl font-extralight text-neutral-900">{departments.length}</div>
                <div className="text-xs text-neutral-500 uppercase tracking-widest font-medium">Departments</div>
              </div>
              <div className="space-y-2">
                <div className="text-6xl font-extralight text-neutral-900">{pinnedCourseIds.size}</div>
                <div className="text-xs text-neutral-500 uppercase tracking-widest font-medium">Pinned</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-neutral-100 mt-24 bg-white">
        <div className="container mx-auto px-6 py-12 text-center">
          <p className="text-sm text-neutral-400 font-light">
            © {new Date().getFullYear()} Missing Semester
          </p>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}
