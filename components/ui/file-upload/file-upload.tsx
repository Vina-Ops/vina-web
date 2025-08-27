import React, { useCallback, useState } from "react";
import { Upload, X, File, Image, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "../button/button";

export type FileUploadVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error";
export type FileUploadSize = "sm" | "md" | "lg";
export type FileType = "image" | "document" | "all";

export interface FileUploadProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "onChange"
  > {
  /**
   * The visual variant of the file upload
   */
  variant?: FileUploadVariant;
  /**
   * The size of the file upload
   */
  size?: FileUploadSize;
  /**
   * The label text for the file upload
   */
  label?: string;
  /**
   * The helper text for the file upload
   */
  helperText?: string;
  /**
   * Whether the file upload is in an error state
   */
  error?: boolean;
  /**
   * The error message to display
   */
  errorMessage?: string;
  /**
   * The accepted file types
   */
  accept?: string;
  /**
   * The maximum file size in bytes
   */
  maxSize?: number;
  /**
   * Whether to allow multiple file uploads
   */
  multiple?: boolean;
  /**
   * The type of files to accept
   */
  fileType?: FileType;
  /**
   * Callback when files are selected
   */
  onChange?: (files: File[]) => void;
  /**
   * Callback when files are removed
   */
  onRemove?: (file: File) => void;
  /**
   * The maximum number of files allowed
   */
  maxFiles?: number;
  /**
   * Whether to show the file preview
   */
  showPreview?: boolean;
  /**
   * Whether to show the file size
   */
  showFileSize?: boolean;
  /**
   * Whether to show the file type
   */
  showFileType?: boolean;
}

const variantStyles: Record<FileUploadVariant, string> = {
  default: "border-gray-300 hover:border-gray-400",
  primary: "border-primary hover:border-primary-600",
  success: "border-green-500 hover:border-green-600",
  warning: "border-yellow-500 hover:border-yellow-600",
  error: "border-red-500 hover:border-red-600",
};

const sizeStyles: Record<
  FileUploadSize,
  { container: string; icon: string; text: string }
> = {
  sm: {
    container: "p-2",
    icon: "h-4 w-4",
    text: "text-sm",
  },
  md: {
    container: "p-4",
    icon: "h-5 w-5",
    text: "text-base",
  },
  lg: {
    container: "p-6",
    icon: "h-6 w-6",
    text: "text-lg",
  },
};

const labelSizeStyles: Record<FileUploadSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const getFileIcon = (file: File) => {
  if (file.type.startsWith("image/")) {
    return <Image className="h-6 w-6 text-gray-400" aria-label="Image file" />;
  }
  if (file.type.includes("pdf") || file.type.includes("document")) {
    return <FileText className="h-6 w-6 text-gray-400" />;
  }
  return <File className="h-6 w-6 text-gray-400" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      variant = "default",
      size = "md",
      label,
      helperText,
      error = false,
      errorMessage,
      accept,
      maxSize,
      multiple = false,
      fileType = "all",
      onChange,
      onRemove,
      maxFiles,
      showPreview = true,
      showFileSize = true,
      showFileType = true,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = useCallback(
      (newFiles: File[]) => {
        const validFiles = newFiles.filter((file) => {
          if (maxSize && file.size > maxSize) {
            return false;
          }
          if (accept && !file.type.match(accept.replace(/,/g, "|"))) {
            return false;
          }
          return true;
        });

        if (maxFiles && files.length + validFiles.length > maxFiles) {
          return;
        }

        const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
        setFiles(updatedFiles);
        onChange?.(updatedFiles);
      },
      [files, maxFiles, maxSize, accept, multiple, onChange]
    );

    const handleRemoveFile = useCallback(
      (file: File) => {
        const updatedFiles = files.filter((f) => f !== file);
        setFiles(updatedFiles);
        onChange?.(updatedFiles);
        onRemove?.(file);
      },
      [files, onChange, onRemove]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFileChange(droppedFiles);
      },
      [handleFileChange]
    );

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            className={cn(
              "font-medium text-gray-700",
              labelSizeStyles[size],
              disabled && "opacity-50"
            )}
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
            variantStyles[variant],
            sizeStyles[size].container,
            isDragging && "border-primary bg-primary-50",
            error && "border-red-500",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={ref}
            type="file"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={(e) => {
              const newFiles = Array.from(e.target.files || []);
              handleFileChange(newFiles);
            }}
            {...props}
          />
          <Upload className={cn("mb-2", sizeStyles[size].icon)} />
          <p className={cn("text-center text-gray-600", sizeStyles[size].text)}>
            Drag and drop files here, or click to select files
          </p>
          {helperText && !error && (
            <p className="mt-1 text-sm text-gray-500">{helperText}</p>
          )}
          {error && errorMessage && (
            <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
          )}
        </div>

        {showPreview && files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-2"
              >
                <div className="flex items-center gap-2">
                  {getFileIcon(file)}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">
                      {file.name}
                    </span>
                    {showFileSize && (
                      <span className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </span>
                    )}
                    {showFileType && (
                      <span className="text-xs text-gray-500">{file.type}</span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => handleRemoveFile(file)}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {maxFiles && (
          <p className="mt-1 text-sm text-gray-500">
            {files.length} of {maxFiles} files selected
          </p>
        )}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";
