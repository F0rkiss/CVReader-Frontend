import { useState, useRef, useMemo } from 'react';
import type { DragEvent, ChangeEvent } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string;
}

const FileUpload = ({ onFileSelect, acceptedTypes = ".pdf,.doc,.docx" }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewUrl = useMemo(() => {
    if (!selectedFile) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  const isPdf = selectedFile?.type === 'application/pdf';

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
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

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
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-6 py-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-semibold text-gray-800">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">({(selectedFile.size / 1024).toFixed(1)} KB)</p>
            </div>
          </div>

          {/* PDF Preview */}
          {isPdf && previewUrl && (
            <div className="w-full max-w-2xl mt-2 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <iframe
                src={previewUrl}
                title="CV Preview"
                className="w-full border-none"
                style={{ height: '500px' }}
              />
            </div>
          )}

          {/* Non-PDF file info */}
          {!isPdf && (
            <div className="mt-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
              Preview not available for this file type. The file will be sent to the server for processing.
            </div>
          )}

          <button
            onClick={handleClick}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer bg-transparent border-none"
          >
            Change file
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={handleClick}
            className={`
              px-16 py-5 text-xl font-semibold text-white rounded-lg cursor-pointer
              border-none shadow-lg transition-all duration-200
              ${isDragging
                ? 'bg-blue-700 scale-105 shadow-xl'
                : 'bg-[#e5322d] hover:bg-[#c62828] hover:shadow-xl'
              }
            `}
          >
            Select CV file
          </button>
          <p className={`mt-4 text-sm ${isDragging ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
            or drop CV here
          </p>
        </>
      )}
    </div>
  );
};

export default FileUpload;
