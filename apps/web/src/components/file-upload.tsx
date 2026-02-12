"use client";

import { useState } from "react";
import { Upload, X, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export function FileUpload({
  onUpload,
  accept = ".pdf,.doc,.docx",
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);

    if (file.size > maxSize) {
      setError(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
      return;
    }

    setUploading(true);
    try {
      await onUpload(file);
    } catch (err) {
      setError("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className={className}>
      <Card
        className={cn(
          "border-2 border-dashed transition-colors",
          isDragging && "border-primary bg-primary/5",
          error && "border-destructive"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <div className="mb-2">
            <label htmlFor="file-upload">
              <Button
                variant="secondary"
                disabled={uploading}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                {uploading ? "Uploading..." : "Choose File"}
              </Button>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept={accept}
                onChange={handleChange}
                disabled={uploading}
              />
            </label>
          </div>
          <p className="text-sm text-muted-foreground">
            or drag and drop your file here
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {accept} (max {maxSize / 1024 / 1024}MB)
          </p>
          {error && (
            <p className="text-sm text-destructive mt-2">{error}</p>
          )}
        </div>
      </Card>
    </div>
  );
}

interface FileListProps {
  files: Array<{
    id: string;
    name: string;
    size: number;
    url: string;
  }>;
  onRemove?: (id: string) => void;
}

export function FileList({ files, onRemove }: FileListProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (files.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No files uploaded yet
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <Card key={file.id} className="p-3">
          <div className="flex items-center gap-3">
            <File className="h-8 w-8 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatSize(file.size)}
              </p>
            </div>
            {onRemove && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(file.id)}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
