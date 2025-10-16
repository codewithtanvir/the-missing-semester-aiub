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
    
    // Optimistic UI update
    const previousPinnedState = isPinned;
    setIsPinned(!isPinned);

    try {
      if (previousPinnedState) {
        const { error } = await supabase
          .from('pinned_courses')
          .delete()
          .eq('user_id', user.id)
          .eq('course_id', course.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('pinned_courses')
          .insert({
            user_id: user.id,
            course_id: course.id,
          } as any);

        if (error) throw error;
      }

      // Delay the parent reload slightly for smooth animation
      setTimeout(() => {
        if (onPinChange) {
          onPinChange();
        }
      }, 300);
    } catch (error: any) {
      console.error('Error toggling pin:', error);
      // Revert optimistic update on error
      setIsPinned(previousPinnedState);
    } finally {
      setIsTogglingPin(false);
    }
  };

  // List View
  if (viewMode === 'list') {
    return (
      <Link href={`/course/${course.id}`}>
        <div 
          className="group relative border border-neutral-100 hover:border-neutral-200 bg-white rounded-2xl py-6 px-6 hover:shadow-lg transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-start justify-between gap-6">
            {/* Left Section */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-neutral-50 text-neutral-900 text-xs border border-neutral-200 font-mono rounded-full">
                  {course.code}
                </span>
                <h3 className="text-lg font-light text-neutral-900 truncate">
                  {course.name}
                </h3>
              </div>

              <div className="flex items-center gap-3 text-sm text-neutral-500 font-light">
                <span>{course.department}</span>
                {course.instructor && (
                  <>
                    <span className="text-neutral-300">•</span>
                    <span>{course.instructor}</span>
                  </>
                )}
              </div>

              {course.description && (
                <p className="text-sm text-neutral-400 line-clamp-1 font-light">
                  {course.description}
                </p>
              )}
            </div>

            {/* Right Section - Pin */}
            <button
              onClick={togglePin}
              disabled={isTogglingPin}
              className={`p-2 rounded-full transition-all duration-300 ${
                isTogglingPin ? 'scale-90 opacity-50' : 'scale-100 opacity-100'
              } ${
                isPinned 
                  ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' 
                  : 'text-neutral-300 hover:text-amber-600 hover:bg-amber-50'
              }`}
            >
              <Pin className={`h-5 w-5 transition-all duration-300 ${
                isPinned ? 'fill-amber-600 text-amber-600 rotate-12' : 'rotate-0'
              }`} />
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
        className="group h-full bg-white border border-neutral-100 hover:border-neutral-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header with Pin */}
        <div className="flex items-start justify-between mb-6">
          <span className="px-3 py-1 bg-neutral-50 text-neutral-900 text-xs border border-neutral-200 font-mono rounded-full">
            {course.code}
          </span>
          <button
            onClick={togglePin}
            disabled={isTogglingPin}
            className={`p-2 rounded-full transition-all duration-300 ${
              isTogglingPin ? 'scale-90 opacity-50' : 'scale-100 opacity-100'
            } ${
              isPinned 
                ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' 
                : 'text-neutral-300 hover:text-amber-600 hover:bg-amber-50'
            }`}
          >
            <Pin className={`h-4 w-4 transition-all duration-300 ${
              isPinned ? 'fill-amber-600 text-amber-600 rotate-12' : 'rotate-0'
            }`} />
          </button>
        </div>

        {/* Course Title */}
        <h3 className="text-xl font-light text-neutral-900 mb-4 line-clamp-2 min-h-[3.5rem] leading-tight">
          {course.name}
        </h3>

        {/* Department & Instructor */}
        <div className="space-y-2 mb-6">
          <div className="text-sm text-neutral-600 font-light">
            {course.department}
          </div>
          {course.instructor && (
            <div className="text-sm text-neutral-500 font-light">
              {course.instructor}
            </div>
          )}
        </div>

        {/* Description */}
        {course.description && (
          <p className="text-sm text-neutral-400 line-clamp-3 mb-6 min-h-[3.75rem] font-light leading-relaxed">
            {course.description}
          </p>
        )}

        {/* Bottom indicator */}
        <div className="pt-4 border-t border-neutral-100 group-hover:border-neutral-900 transition-colors duration-300">
          <span className="text-xs text-neutral-400 group-hover:text-neutral-900 font-light transition-colors duration-300">
            View Course
          </span>
        </div>
      </div>
    </Link>
  );
}
