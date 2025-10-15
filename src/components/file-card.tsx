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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>{getFileIcon(file.file_type)}</span>
              <span className="line-clamp-1">{file.title}</span>
            </CardTitle>
            <CardDescription className="mt-1.5">
              {formatFileSize(file.file_size)} • {formatDate(file.created_at)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPreview(file)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            {downloading ? 'Downloading...' : 'Download'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
