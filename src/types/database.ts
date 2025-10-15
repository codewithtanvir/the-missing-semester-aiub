export type Category = "Midterm" | "Final" | "Solutions" | "Others";

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  description?: string | null;
  semester?: string | null;
  instructor?: string | null;
  credits?: number | null;
  created_at: string;
}

export interface CourseFile {
  id: string;
  course_id: string;
  category: Category;
  title: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploader_id: string;
  download_count?: number;
  created_at: string;
  updated_at?: string;
  courses?: Course;
}

export interface Database {
  public: {
    Tables: {
      courses: {
        Row: Course;
        Insert: Omit<Course, "id" | "created_at">;
        Update: Partial<Omit<Course, "id" | "created_at">>;
      };
      files: {
        Row: CourseFile;
        Insert: Omit<CourseFile, "id" | "created_at" | "updated_at" | "download_count" | "courses">;
        Update: Partial<Omit<CourseFile, "id" | "created_at" | "courses">>;
      };
    };
  };
}
