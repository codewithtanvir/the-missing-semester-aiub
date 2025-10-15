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

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  student_id: string;
  gender: string;
  role: 'user' | 'admin';
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface PinnedCourse {
  id: string;
  user_id: string;
  course_id: string;
  pinned_at: string;
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

export interface BroadcastMessage {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_active: boolean;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
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
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<UserProfile, "id" | "created_at" | "updated_at">>;
      };
      pinned_courses: {
        Row: PinnedCourse;
        Insert: Omit<PinnedCourse, "id" | "created_at" | "pinned_at">;
        Update: Partial<Omit<PinnedCourse, "id" | "created_at">>;
      };
      broadcast_messages: {
        Row: BroadcastMessage;
        Insert: Omit<BroadcastMessage, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<BroadcastMessage, "id" | "created_at" | "updated_at">>;
      };
    };
  };
}
