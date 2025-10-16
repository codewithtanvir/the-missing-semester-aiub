'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@/types/database";
import { Pin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface CourseCardProps {
  course: Course;
  viewMode?: 'grid' | 'list';
  isPinned?: boolean;
  onPinChange?: () => void;
}

export function CourseCard({ course, viewMode = 'grid', isPinned: initialPinned = false, onPinChange }: CourseCardProps) {
  const [isPinned, setIsPinned] = useState(initialPinned);
  const [isTogglingPin, setIsTogglingPin] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    setIsPinned(initialPinned);
  }, [initialPinned]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, [supabase.auth]);

  const togglePin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    setIsTogglingPin(true);

    try {
      if (isPinned) {
        const { error } = await supabase
          .from('pinned_courses')
          .delete()
          .eq('user_id', user.id)
          .eq('course_id', course.id);

        if (error) throw error;
        setIsPinned(false);
      } else {
        const { error } = await supabase
          .from('pinned_courses')
          .insert({
            user_id: user.id,
            course_id: course.id,
          } as any);

        if (error) throw error;
        setIsPinned(true);
      }

      if (onPinChange) {
        onPinChange();
      }
    } catch (error: any) {
      console.error('Error toggling pin:', error);
    } finally {
      setIsTogglingPin(false);
    }
  };

  // List View
  if (viewMode === 'list') {
    return (
      <Link href={`/course/${course.id}`}>
        <div 
          className="group relative border-b border-neutral-100 py-5 px-4 hover:bg-neutral-50 transition-all duration-200 bg-white"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-start justify-between gap-4">
            {/* Left Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-xs border border-neutral-200 font-mono">
                  {course.code}
                </span>
                <h3 className="text-neutral-900 font-normal">
                  {course.name}
                </h3>
              </div>

              <div className="flex items-center gap-3 text-sm text-neutral-500">
                <span>{course.department}</span>
                {course.instructor && (
                  <>
                    <span className="text-neutral-300">•</span>
                    <span>{course.instructor}</span>
                  </>
                )}
              </div>

              {course.description && (
                <p className="text-sm text-neutral-400 mt-2 line-clamp-1">
                  {course.description}
                </p>
              )}

              {/* Animated underline */}
              <div className="mt-3 h-px bg-neutral-900 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>

            {/* Right Section */}
            <button
              onClick={togglePin}
              disabled={isTogglingPin}
              className="p-2 text-neutral-300 hover:text-amber-600 transition-colors"
            >
              <Pin className={`h-4 w-4 ${isPinned ? 'fill-amber-600 text-amber-600' : ''}`} />
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // Grid View
  return (
    <Link href={`/course/${course.id}`}>
      <div 
        className="group h-full border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all duration-200 bg-white p-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Pin Button */}
        <div className="flex items-start justify-between mb-4">
          <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-xs border border-neutral-200 font-mono">
            {course.code}
          </span>
          <button
            onClick={togglePin}
            disabled={isTogglingPin}
            className="p-1 text-neutral-300 hover:text-amber-600 transition-colors"
          >
            <Pin className={`h-4 w-4 ${isPinned ? 'fill-amber-600 text-amber-600' : ''}`} />
          </button>
        </div>

        {/* Course Title */}
        <h3 className="text-neutral-900 font-normal mb-3 line-clamp-2 min-h-[3rem] leading-snug">
          {course.name}
        </h3>

        {/* Department */}
        <div className="text-sm text-neutral-600 mb-2">
          {course.department}
        </div>

        {/* Instructor */}
        {course.instructor && (
          <div className="text-sm text-neutral-500 mb-3">
            {course.instructor}
          </div>
        )}

        {/* Description */}
        {course.description && (
          <p className="text-sm text-neutral-400 line-clamp-2 mb-4 min-h-[2.5rem]">
            {course.description}
          </p>
        )}

        {/* Animated underline */}
        <div className="h-px bg-neutral-900 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      </div>
    </Link>
  );
}
