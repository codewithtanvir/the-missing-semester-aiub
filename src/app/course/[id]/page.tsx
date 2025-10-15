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

      <main className="container mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: 'Courses', href: '/courses' },
            { label: course.code }
          ]} 
        />

        {/* Course Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-4 shadow-lg">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {course.code}
              </h1>
              <p className="text-xl text-gray-700 mb-4">{course.name}</p>
              <div className="flex flex-wrap gap-3 text-sm">
                {course.department && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                    {course.department}
                  </span>
                )}
                {course.instructor && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                    👨‍🏫 {course.instructor}
                  </span>
                )}
                {course.semester && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                    📅 {course.semester}
                  </span>
                )}
                {course.credits && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                    🎓 {course.credits} Credits
                  </span>
                )}
              </div>
              {course.description && (
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {course.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Files Tabs */}
        <Tabs defaultValue="Midterm" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 mx-auto">
            <TabsTrigger value="Midterm">Midterm</TabsTrigger>
            <TabsTrigger value="Final">Final</TabsTrigger>
            <TabsTrigger value="Solutions">Solutions</TabsTrigger>
            <TabsTrigger value="Others">Others</TabsTrigger>
          </TabsList>

          {(['Midterm', 'Final', 'Solutions', 'Others'] as Category[]).map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              {files[category].length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {files[category].map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onPreview={setPreviewFile}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">No files available for {category} yet.</p>
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
