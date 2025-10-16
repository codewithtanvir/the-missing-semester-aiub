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
    <div className="min-h-screen bg-neutral-50">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <Breadcrumb 
          items={[
            { label: 'Courses', href: '/courses' },
            { label: course.code }
          ]} 
        />

        {/* Course Header Card */}
        <div className="border border-neutral-200 bg-white p-8 mb-12 mt-8">
          <div className="flex items-start gap-6">
            {/* Icon */}
            <div className="w-14 h-14 bg-neutral-900 flex items-center justify-center shrink-0">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-baseline gap-4 mb-2">
                <h1 className="text-3xl font-light text-neutral-900">
                  {course.code}
                </h1>
                {course.department && (
                  <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-xs border border-neutral-200">
                    {course.department}
                  </span>
                )}
              </div>
              
              <p className="text-xl text-neutral-700 mb-3 font-light">{course.name}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                {course.instructor && (
                  <span>{course.instructor}</span>
                )}
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
              
              {course.description && (
                <p className="mt-4 text-neutral-600 leading-relaxed">
                  {course.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="Midterm" className="w-full">
          <div className="border-b border-neutral-200 mb-8 bg-white px-6">
            <TabsList className="h-auto p-0 bg-transparent space-x-8">
              <TabsTrigger 
                value="Midterm" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent bg-transparent px-0 pb-3 pt-4 text-neutral-600 data-[state=active]:text-neutral-900 data-[state=active]:shadow-none font-normal"
              >
                Midterm
              </TabsTrigger>
              <TabsTrigger 
                value="Final"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent bg-transparent px-0 pb-3 pt-4 text-neutral-600 data-[state=active]:text-neutral-900 data-[state=active]:shadow-none font-normal"
              >
                Final
              </TabsTrigger>
              <TabsTrigger 
                value="Solutions"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent bg-transparent px-0 pb-3 pt-4 text-neutral-600 data-[state=active]:text-neutral-900 data-[state=active]:shadow-none font-normal"
              >
                Solutions
              </TabsTrigger>
              <TabsTrigger 
                value="Others"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent bg-transparent px-0 pb-3 pt-4 text-neutral-600 data-[state=active]:text-neutral-900 data-[state=active]:shadow-none font-normal"
              >
                Others
              </TabsTrigger>
            </TabsList>
          </div>

          {(['Midterm', 'Final', 'Solutions', 'Others'] as Category[]).map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              {files[category].length > 0 ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {files[category].map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onPreview={setPreviewFile}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white border border-neutral-100">
                  <FileText className="mx-auto h-12 w-12 text-neutral-200 mb-4" />
                  <p className="text-neutral-500">No files available for {category}</p>
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
