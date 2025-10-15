'use client';

import { CourseFile } from "@/types/database";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface FilePreviewProps {
  file: CourseFile;
  onClose: () => void;
}

export function FilePreview({ file, onClose }: FilePreviewProps) {
  const [fileUrl, setFileUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadFile = async () => {
      try {
        // For public buckets, use getPublicUrl
        const { data } = await supabase.storage
          .from('course-files')
          .getPublicUrl(file.file_path);

        if (data?.publicUrl) {
          setFileUrl(data.publicUrl);
        } else {
          console.error('No public URL returned');
        }
      } catch (error) {
        console.error('Error loading file:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFile();
  }, [file, supabase]);

  const renderPreview = () => {
    if (loading) {
      return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    if (!fileUrl) {
      return (
        <div className="flex items-center justify-center h-full text-red-500">
          Error: Could not load file URL
        </div>
      );
    }

    const fileType = file.file_type.toLowerCase();
    const fileName = file.file_path.toLowerCase();

    // PDF files
    if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-full"
          title={file.title}
        />
      );
    }

    // Image files
    if (fileType.startsWith('image/') || 
        fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/)) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <img
            src={fileUrl}
            alt={file.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    }

    // Text files
    if (fileType.startsWith('text/') || 
        fileName.match(/\.(txt|md|json|xml|csv|log)$/)) {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-full"
          title={file.title}
        />
      );
    }

    // Video files
    if (fileType.startsWith('video/') || 
        fileName.match(/\.(mp4|webm|ogg|mov)$/)) {
      return (
        <div className="flex items-center justify-center h-full bg-black">
          <video
            src={fileUrl}
            controls
            className="max-w-full max-h-full"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // Audio files
    if (fileType.startsWith('audio/') || 
        fileName.match(/\.(mp3|wav|ogg|m4a)$/)) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-100">
          <audio
            src={fileUrl}
            controls
            className="w-full max-w-2xl"
          >
            Your browser does not support the audio tag.
          </audio>
          <p className="mt-4 text-gray-600">{file.title}</p>
        </div>
      );
    }

    // Word documents, PowerPoint, Excel (use Google Docs Viewer or Office Online)
    if (fileType.match(/officedocument|msword|ms-excel|ms-powerpoint/) || 
        fileName.match(/\.(doc|docx|ppt|pptx|xls|xlsx)$/)) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-100 gap-4">
          <p className="text-lg font-medium">Office Document Preview</p>
          <div className="w-full h-full px-4">
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
              className="w-full h-full"
              title={file.title}
            />
          </div>
          <div className="text-sm text-gray-500 pb-4">
            If preview doesn't load, try{' '}
            <a
              href={fileUrl}
              download={file.title}
              className="text-blue-600 hover:underline"
            >
              downloading the file
            </a>
          </div>
        </div>
      );
    }

    // For other file types, show download option
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
        <p className="text-lg">Preview not available for this file type.</p>
        <p className="text-sm text-gray-400">File type: {file.file_type}</p>
        <a
          href={fileUrl}
          download={file.title}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Download File
        </a>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold truncate">{file.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-hidden">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
}
