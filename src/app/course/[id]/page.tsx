'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, ArrowLeft, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Course, CourseFile, Category } from "@/types/database";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCard } from "@/components/file-card";
import { FilePreview } from "@/components/file-preview";
import { Navigation } from "@/components/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { BackToTop } from "@/components/back-to-top";

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [files, setFiles] = useState<Record<Category, CourseFile[]>>({
    Midterm: [],
    Final: [],
    Solutions: [],
    Others: []
  });
  const [previewFile, setPreviewFile] = useState<CourseFile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load course
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', params.id)
          .single();

        if (courseError) throw courseError;
        setCourse(courseData);

        // Load files
        const { data: filesData, error: filesError } = await supabase
          .from('files')
          .select('*')
          .eq('course_id', params.id)
          .order('created_at', { ascending: false });

        if (filesError) throw filesError;

        // Group files by category
        const grouped: Record<Category, CourseFile[]> = {
          Midterm: [],
          Final: [],
          Solutions: [],
          Others: []
        };

        (filesData as CourseFile[])?.forEach((file) => {
          if (file.category in grouped) {
            grouped[file.category].push(file);
          }
        });

        setFiles(grouped);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadData();
    }
  }, [params.id, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Course not found</p>
          <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <Breadcrumb 
          items={[
            { label: 'Courses', href: '/courses' },
            { label: course.code }
          ]} 
        />

        {/* Course Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-start gap-4 sm:gap-6">
            <div className="rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-3 sm:p-4 shadow-lg w-fit mx-auto md:mx-0">
              <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {course.code}
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 mb-3 sm:mb-4">{course.name}</p>
              <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm justify-center md:justify-start">
                {course.department && (
                  <span className="px-2.5 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                    {course.department}
                  </span>
                )}
                {course.instructor && (
                  <span className="px-2.5 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                    👨‍🏫 {course.instructor}
                  </span>
                )}
                {course.semester && (
                  <span className="px-2.5 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                    📅 {course.semester}
                  </span>
                )}
                {course.credits && (
                  <span className="px-2.5 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                    🎓 {course.credits} Credits
                  </span>
                )}
              </div>
              {course.description && (
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                  {course.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Files Tabs */}
        <Tabs defaultValue="Midterm" className="w-full">
          <TabsList className="grid w-full max-w-full sm:max-w-2xl grid-cols-4 mx-auto h-auto">
            <TabsTrigger value="Midterm" className="text-xs sm:text-sm py-2 sm:py-2.5">Midterm</TabsTrigger>
            <TabsTrigger value="Final" className="text-xs sm:text-sm py-2 sm:py-2.5">Final</TabsTrigger>
            <TabsTrigger value="Solutions" className="text-xs sm:text-sm py-2 sm:py-2.5">Solutions</TabsTrigger>
            <TabsTrigger value="Others" className="text-xs sm:text-sm py-2 sm:py-2.5">Others</TabsTrigger>
          </TabsList>

          {(['Midterm', 'Final', 'Solutions', 'Others'] as Category[]).map((category) => (
            <TabsContent key={category} value={category} className="mt-4 sm:mt-6">
              {files[category].length > 0 ? (
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {files[category].map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onPreview={setPreviewFile}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 sm:p-12 text-center">
                  <FileText className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-gray-600">No files available for {category} yet.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {previewFile && (
        <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
      )}

      <BackToTop />
    </div>
  );
}
