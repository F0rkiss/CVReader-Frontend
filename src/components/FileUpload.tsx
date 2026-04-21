import { useState, useRef, useMemo, memo, useEffect, useCallback } from "react";
import type { DragEvent, ChangeEvent } from "react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string;
  onOpenFileDialogReady?: (openDialog: () => void) => void;
  hideChangeButton?: boolean;
  mode?: "default" | "workspace";
}

const FileUpload = memo(
  ({
    onFileSelect,
    acceptedTypes = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.avif,.av1,image/jpeg,image/png,image/webp,image/avif",
    onOpenFileDialogReady,
    hideChangeButton = false,
    mode = "default",
  }: FileUploadProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreviewFailed, setImagePreviewFailed] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const previewUrl = useMemo(() => {
      if (!selectedFile) return null;
      return URL.createObjectURL(selectedFile);
    }, [selectedFile]);

    useEffect(() => {
      return () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
      };
    }, [previewUrl]);

    const selectedFileName = selectedFile?.name.toLowerCase() || "";
    const hasExtension = (extensions: string[]) =>
      extensions.some((extension) => selectedFileName.endsWith(extension));

    const isPdf =
      selectedFile?.type === "application/pdf" || hasExtension([".pdf"]);
    const isSupportedImage =
      selectedFile?.type.startsWith("image/") ||
      hasExtension([".png", ".webp", ".jpg", ".jpeg", ".avif", ".av1"]);
    const isWorkspaceMode = mode === "workspace";

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        setImagePreviewFailed(false);
        setSelectedFile(file);
        onFileSelect(file);
      }
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        setImagePreviewFailed(false);
        setSelectedFile(file);
        onFileSelect(file);
      }
    };

    const handleClick = useCallback(() => {
      fileInputRef.current?.click();
    }, []);

    useEffect(() => {
      onOpenFileDialogReady?.(handleClick);
    }, [handleClick, onOpenFileDialogReady]);

    return (
      <div
        className="flex flex-col items-center w-full"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={handleFileSelect}
          className="hidden"
        />

        {selectedFile ? (
          <div className="flex w-full flex-col items-center gap-3">
            <div
              className={`flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-6 py-4 ${isWorkspaceMode ? "w-full justify-center" : ""}`}
            >
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <p className="font-semibold text-gray-800">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  ({(selectedFile.size / 1024).toFixed(1)} KB)
                </p>
              </div>
            </div>

            {/* PDF Preview */}
            {isPdf && previewUrl && (
              <div
                className={`mt-2 w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm ${isWorkspaceMode ? "" : "max-w-2xl"}`}
              >
                <iframe
                  src={previewUrl}
                  title="CV Preview"
                  className="w-full border-none"
                  style={{ height: "500px" }}
                />
              </div>
            )}

            {/* Image Preview */}
            {!isPdf &&
              isSupportedImage &&
              previewUrl &&
              !imagePreviewFailed && (
                <div
                  className={`mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-2 shadow-sm ${isWorkspaceMode ? "" : "max-w-2xl"}`}
                >
                  <img
                    src={previewUrl}
                    alt="CV Preview"
                    className="w-full h-auto max-h-[500px] object-contain rounded"
                    onError={() => setImagePreviewFailed(true)}
                  />
                </div>
              )}

            {/* Non-PDF file info */}
            {!isPdf && (!isSupportedImage || imagePreviewFailed) && (
              <div className="mt-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                Preview not available for this file type. The file will be sent
                to the server for processing.
              </div>
            )}

            {!hideChangeButton && (
              <button
                onClick={handleClick}
                className={`rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 ${isWorkspaceMode ? "w-full" : ""}`}
              >
                Replace File
              </button>
            )}
          </div>
        ) : (
          <>
            {isWorkspaceMode ? (
              <div
                className={`flex w-full flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}`}
                style={{ minHeight: "420px" }}
              >
                <p className="text-lg font-semibold text-gray-900">
                  Upload your CV file
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Drag and drop here, or use the button below.
                </p>
                <button
                  onClick={handleClick}
                  className={`
                    mt-6 rounded-lg px-10 py-3 text-base font-semibold text-white shadow-md transition-all duration-200
                    ${
                      isDragging
                        ? "bg-blue-700"
                        : "bg-[#e5322d] hover:bg-[#c62828] hover:shadow-lg"
                    }
                  `}
                >
                  Select CV file
                </button>
                <p
                  className={`mt-4 text-xs uppercase tracking-wide ${isDragging ? "text-blue-600" : "text-gray-400"}`}
                >
                  PDF, DOC, DOCX, JPG, PNG, WEBP
                </p>
              </div>
            ) : (
              <>
                <button
                  onClick={handleClick}
                  className={`
                    rounded-lg border-none px-16 py-5 text-xl font-semibold text-white shadow-lg transition-all duration-200
                    ${
                      isDragging
                        ? "scale-105 bg-blue-700 shadow-xl"
                        : "bg-[#e5322d] hover:bg-[#c62828] hover:shadow-xl"
                    }
                  `}
                >
                  Select CV file
                </button>
                <p
                  className={`mt-4 text-sm ${isDragging ? "font-medium text-blue-600" : "text-gray-500"}`}
                >
                  or drop CV here
                </p>
              </>
            )}
          </>
        )}
      </div>
    );
  },
);

export default FileUpload;
