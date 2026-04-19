'use client';

import React, { useRef, useState } from 'react';

interface ComparisonFileUploadProps {
  onFilesSelect: (files: File[]) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ComparisonFileUpload: React.FC<ComparisonFileUploadProps> = ({
  onFilesSelect,
  isLoading,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    validateAndSelectFiles(files);
  };

  const validateAndSelectFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      if (file.type !== 'application/pdf') {
        alert(`${file.name} is not a PDF file`);
        return false;
      }
      if (file.size > 50 * 1024 * 1024) {
        alert(`${file.name} exceeds 50MB limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      onFilesSelect([...selectedFiles, ...validFiles]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const files = Array.from(event.dataTransfer.files);
    validateAndSelectFiles(files);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelect(newFiles);
  };

  const clearAll = () => {
    setSelectedFiles([]);
    onFilesSelect([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-4">
      <div
        ref={containerRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'border-indigo-400 bg-indigo-50/50'
            : 'border-indigo-200 bg-white/50 hover:border-indigo-300'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileChange}
          disabled={disabled || isLoading}
          className="hidden"
        />

        <div className="space-y-3">
          <span className="block text-4xl">📁</span>
          <div>
            <p className="text-lg font-semibold text-gray-800">
              {dragActive ? 'Drop your PDFs here' : 'Drop multiple PDFs or click to select'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Add up to 2 papers to compare side-by-side
            </p>
          </div>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="rounded-xl bg-white p-4 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">
              Selected Papers ({selectedFiles.length})
            </h3>
            <button
              onClick={clearAll}
              className="text-xs px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-lg">📄</span>
                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="ml-2 text-red-500 hover:text-red-700 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {selectedFiles.length > 0 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isLoading || selectedFiles.length >= 5}
              className={`mt-3 w-full py-2 px-4 rounded-lg font-medium transition ${
                disabled || isLoading || selectedFiles.length >= 5
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isLoading ? '⏳ Processing...' : '➕ Add More (Max 5)'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
