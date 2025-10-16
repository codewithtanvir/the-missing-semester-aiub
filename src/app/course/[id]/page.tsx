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
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="container mx-auto px-6 sm:px-8 lg:px-12 py-12 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-12">
          <Breadcrumb 
            items={[
              { label: 'Courses', href: '/courses' },
              { label: course.code }
            ]} 
          />
        </div>

        {/* Course Header - Ultra Minimal */}
        <div className="mb-20">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Course Code - Large Display */}
            <div className="space-y-4">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-extralight text-neutral-900 leading-none tracking-tight">
                {course.code}
              </h1>
              <p className="text-2xl md:text-3xl text-neutral-600 font-light">
                {course.name}
              </p>
            </div>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-500 font-light pt-4">
              {course.department && (
                <span className="px-4 py-1.5 bg-neutral-50 text-neutral-700 border border-neutral-200 rounded-full">
                  {course.department}
                </span>
              )}
              {course.instructor && <span>{course.instructor}</span>}
              {course.semester && (
                <>
                  <span className="text-neutral-300">•</span>
                  <span>{course.semester}</span>
                </>
              )}
              {course.credits && (
                <>
                  <span className="text-neutral-300">•</span>
                  <span>{course.credits} Credits</span>
                </>
              )}
            </div>
            
            {/* Description */}
            {course.description && (
              <p className="text-neutral-500 leading-relaxed max-w-2xl mx-auto pt-6 font-light">
                {course.description}
              </p>
            )}
          </div>
        </div>

        {/* Tabs Navigation - Minimal */}
        <Tabs defaultValue="Midterm" className="w-full">
          {/* Tabs Header */}
          <div className="flex justify-center mb-16">
            <TabsList className="inline-flex h-auto p-2 bg-neutral-50 rounded-full border border-neutral-200 space-x-2">
              <TabsTrigger 
                value="Midterm" 
                className="rounded-full px-6 py-3 text-sm font-light data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-md text-neutral-500 transition-all duration-300"
              >
                Midterm
              </TabsTrigger>
              <TabsTrigger 
                value="Final"
                className="rounded-full px-6 py-3 text-sm font-light data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-md text-neutral-500 transition-all duration-300"
              >
                Final
              </TabsTrigger>
              <TabsTrigger 
                value="Solutions"
                className="rounded-full px-6 py-3 text-sm font-light data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-md text-neutral-500 transition-all duration-300"
              >
                Solutions
              </TabsTrigger>
              <TabsTrigger 
                value="Others"
                className="rounded-full px-6 py-3 text-sm font-light data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-md text-neutral-500 transition-all duration-300"
              >
                Others
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tabs Content */}
          {(['Midterm', 'Final', 'Solutions', 'Others'] as Category[]).map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              {files[category].length > 0 ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {files[category].map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onPreview={setPreviewFile}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-32">
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="w-24 h-24 mx-auto rounded-full bg-neutral-50 flex items-center justify-center">
                      <FileText className="h-12 w-12 text-neutral-300" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-light text-neutral-900">No files yet</h3>
                      <p className="text-neutral-500 font-light">
                        No {category.toLowerCase()} files available for this course
                      </p>
                    </div>
                  </div>
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
