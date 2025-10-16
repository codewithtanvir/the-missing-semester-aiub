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
    <div className="border border-neutral-200 bg-white p-5 hover:border-neutral-300 hover:shadow-sm transition-all duration-200">
      {/* File Icon & Title */}
      <div className="mb-4">
        <div className="text-2xl mb-3">{getFileIcon(file.file_type)}</div>
        <h3 className="text-neutral-900 font-normal mb-2 line-clamp-2 min-h-[3rem] leading-snug">
          {file.title}
        </h3>
        <div className="text-sm text-neutral-400">
          {formatFileSize(file.file_size)} <span className="text-neutral-300">•</span> {formatDate(file.created_at)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-neutral-100">
        <button
          onClick={() => onPreview(file)}
          className="flex-1 px-4 py-2 text-sm text-neutral-700 border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 transition-colors duration-200"
        >
          <Eye className="h-4 w-4 inline mr-2" />
          Preview
        </button>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 px-4 py-2 text-sm text-white bg-neutral-900 hover:bg-neutral-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4 inline mr-2" />
          {downloading ? 'Downloading...' : 'Download'}
        </button>
      </div>
    </div>
  );
}
