import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@/types/database";
import { BookOpen, Users, Calendar, Award, ArrowRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  course: Course;
  viewMode?: 'grid' | 'list';
}

export function CourseCard({ course, viewMode = 'grid' }: CourseCardProps) {
  if (viewMode === 'list') {
    return (
      <Link href={`/course/${course.id}`}>
        <Card className="hover:shadow-lg transition-all cursor-pointer hover:border-blue-300 group">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 group-hover:from-blue-600 group-hover:to-blue-700 transition-all">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {course.code}
                    </h3>
                    <p className="text-base text-gray-700 mt-1 line-clamp-1">
                      {course.name}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>
                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    {course.department}
                  </Badge>
                  {course.instructor && (
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {course.instructor}
                    </span>
                  )}
                  {course.credits && (
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Award className="h-3.5 w-3.5" />
                      {course.credits} Credits
                    </span>
                  )}
                  {course.semester && (
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {course.semester}
                    </span>
                  )}
                </div>
                {course.description && (
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">
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

  return (
    <Link href={`/course/${course.id}`}>
      <Card className="hover:shadow-xl transition-all cursor-pointer h-full hover:border-blue-300 group hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-3 group-hover:from-blue-600 group-hover:to-blue-700 transition-all">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-bold group-hover:text-blue-600 transition-colors">
                {course.code}
              </CardTitle>
              <CardDescription className="mt-1 text-xs">
                <Badge variant="secondary" className="mt-1">
                  {course.department}
                </Badge>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-sm font-medium text-gray-900 mb-3 line-clamp-2 min-h-[2.5rem]">
            {course.name}
          </h3>
          
          <div className="space-y-2 text-xs text-gray-600">
            {course.instructor && (
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-gray-400" />
                <span className="truncate">{course.instructor}</span>
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

          {course.description && (
            <p className="text-xs text-gray-500 mt-3 line-clamp-3">
              {course.description}
            </p>
          )}

          <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
            View Resources
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
