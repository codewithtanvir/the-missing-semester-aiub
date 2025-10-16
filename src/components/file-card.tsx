'use client';

import { CourseFile } from "@/types/database";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { formatFileSize, formatDate, getFileIcon } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

interface FileCardProps {
  file: CourseFile;
  onPreview: (file: CourseFile) => void;
}

export function FileCard({ file, onPreview }: FileCardProps) {
  const [downloading, setDownloading] = useState(false);
  const supabase = createClient();

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const { data, error } = await supabase.storage
        .from('course-files')
        .download(file.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="group bg-white border border-neutral-100 hover:border-neutral-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
      {/* File Icon & Title */}
      <div className="mb-6 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-neutral-50 flex items-center justify-center text-2xl group-hover:bg-neutral-100 transition-colors duration-300">
          {getFileIcon(file.file_type)}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-light text-neutral-900 line-clamp-2 min-h-[3.5rem] leading-tight">
            {file.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-light">
            <span>{formatFileSize(file.file_size)}</span>
            <span className="text-neutral-300">•</span>
            <span>{formatDate(file.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6 border-t border-neutral-100">
        <button
          onClick={() => onPreview(file)}
          className="flex-1 px-4 py-3 text-sm font-light text-neutral-700 border border-neutral-200 rounded-full hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200"
        >
          <Eye className="h-4 w-4 inline mr-2" />
          Preview
        </button>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 px-4 py-3 text-sm font-medium text-white bg-neutral-900 rounded-full hover:bg-neutral-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          <Download className="h-4 w-4 inline mr-2" />
          {downloading ? 'Downloading...' : 'Download'}
        </button>
      </div>
    </div>
  );
}
