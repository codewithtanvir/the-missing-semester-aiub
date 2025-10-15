'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Course } from "@/types/database";
import { BookOpen, Users, Calendar, Award, Pin, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface CourseCardProps {
  course: Course;
  viewMode?: 'grid' | 'list';
  isPinned?: boolean;
  onPinChange?: () => void;
}

export function CourseCard({ course, viewMode = 'grid', isPinned: initialPinned = false, onPinChange }: CourseCardProps) {
  const [isPinned, setIsPinned] = useState(initialPinned);
  const [isTogglingPin, setIsTogglingPin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setIsPinned(initialPinned);
  }, [initialPinned]);

  const togglePin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsTogglingPin(true);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to pin courses",
          variant: "destructive",
        });
        return;
      }

      if (isPinned) {
        const { error } = await supabase
          .from('pinned_courses')
          .delete()
          .eq('user_id', user.id)
          .eq('course_id', course.id);

        if (error) throw error;

        setIsPinned(false);
        toast({
          title: "Course Unpinned",
          description: `${course.code} removed from pinned`,
        });
      } else {
        const { error } = await supabase
          .from('pinned_courses')
          .insert({
            user_id: user.id,
            course_id: course.id,
          } as any);

        if (error) throw error;

        setIsPinned(true);
        toast({
          title: "Course Pinned",
          description: `${course.code} added to pinned`,
        });
      }

      if (onPinChange) {
        onPinChange();
      }
    } catch (error: any) {
      console.error('Error toggling pin:', error);
      toast({
        title: "Error",
        description: "Failed to update pinned status",
        variant: "destructive",
      });
    } finally {
      setIsTogglingPin(false);
    }
  };

  // List View - Horizontal Layout
  if (viewMode === 'list') {
    return (
      <Link href={`/course/${course.id}`}>
        <Card className="group relative overflow-hidden border hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg bg-white">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Pin Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-4 right-4 z-10 h-9 w-9 rounded-full transition-all ${
              isPinned 
                ? 'text-amber-500 hover:text-amber-600 bg-amber-50 hover:bg-amber-100' 
                : 'text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={togglePin}
            disabled={isTogglingPin}
          >
            <Pin className={`h-4 w-4 transition-transform group-hover:scale-110 ${isPinned ? 'fill-current' : ''}`} />
          </Button>

          <CardContent className="relative p-6 pr-16">
            <div className="flex items-start gap-5">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="relative h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow duration-300">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-3">
                {/* Title */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {course.code}
                    </h3>
                    {isPinned && (
                      <Badge className="h-5 bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Pinned
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 font-medium line-clamp-1">
                    {course.name}
                  </p>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-4 flex-wrap text-sm text-gray-600">
                  <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-50">
                    {course.department}
                  </Badge>
                  
                  {course.instructor && (
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-gray-400" />
                      <span>{course.instructor}</span>
                    </div>
                  )}
                  
                  {course.credits && (
                    <div className="flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-gray-400" />
                      <span>{course.credits} Credits</span>
                    </div>
                  )}
                  
                  {course.semester && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      <span>{course.semester}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {course.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Grid View - Vertical Layout
  return (
    <Link href={`/course/${course.id}`}>
      <Card className="group relative overflow-hidden h-full border hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Pin Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 z-10 h-9 w-9 rounded-full transition-all ${
            isPinned 
              ? 'text-amber-500 hover:text-amber-600 bg-amber-50 hover:bg-amber-100' 
              : 'text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100'
          }`}
          onClick={togglePin}
          disabled={isTogglingPin}
        >
          <Pin className={`h-4 w-4 transition-transform group-hover:scale-110 ${isPinned ? 'fill-current' : ''}`} />
        </Button>

        <CardHeader className="relative pb-4">
          {/* Icon */}
          <div className="mb-4">
            <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-105">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Course Code */}
          <div className="space-y-2 pr-8">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {course.code}
            </h3>
            
            {/* Course Name */}
            <p className="text-sm text-gray-600 font-medium line-clamp-2 min-h-[2.5rem] leading-relaxed">
              {course.name}
            </p>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          {/* Department Badge */}
          <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-50">
            {course.department}
          </Badge>

          {/* Course Details */}
          {(course.instructor || course.credits || course.semester) && (
            <div className="space-y-2 text-sm text-gray-600">
              {course.instructor && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{course.instructor}</span>
                </div>
              )}
              
              {course.credits && (
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span>{course.credits} Credits</span>
                </div>
              )}
              
              {course.semester && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span>{course.semester}</span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {course.description && (
            <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed pt-2 border-t">
              {course.description}
            </p>
          )}

          {/* Pinned Badge */}
          {isPinned && (
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              Pinned
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
