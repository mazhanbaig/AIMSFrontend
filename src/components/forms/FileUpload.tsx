'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Image, Video, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  onRemove?: (index: number) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
}

export function FileUpload({
  onUpload,
  onRemove,
  multiple = true,
  accept = 'image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx',
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 10,
  className,
  disabled = false,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
      setFiles(newFiles);
      onUpload(acceptedFiles);
    },
    [files, maxFiles, onUpload]
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);
      onRemove?.(index);
    },
    [files, onRemove]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: accept
      ? Object.fromEntries(accept.split(',').map((ext) => [ext.trim(), []]))
      : undefined,
    maxSize,
    maxFiles,
    disabled,
  });

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('video/')) return Video;
    if (file.type.includes('pdf')) return FileText;
    return File;
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200',
          isDragActive
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        <Upload className={cn('w-10 h-10 mx-auto mb-3 transition-colors', isDragActive ? 'text-primary' : 'text-gray-400')} />
        <p className="text-sm text-gray-600 font-medium">
          {isDragActive ? (
            'Drop files here...'
          ) : (
            <>
              Drag & drop files here, or <span className="text-primary underline">browse</span>
            </>
          )}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          {accept} · Max {maxSize / 1024 / 1024}MB per file
          {maxFiles > 1 && ` · Up to ${maxFiles} files`}
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            {files.length} file{files.length > 1 ? 's' : ''} selected
          </p>
          {files.map((file, index) => {
            const Icon = getFileIcon(file);
            const preview = getFilePreview(file);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {preview ? (
                    <img
                      src={preview}
                      alt={file.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
