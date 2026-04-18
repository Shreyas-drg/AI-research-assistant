'use client';

import React, { useEffect, useRef, useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  isLoading,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [transform, setTransform] = useState<string | null>(null);

  useEffect(() => {
    containerRef.current?.style.setProperty('--sheen-opacity', '0');
  }, []);

  const motionOk = () =>
    typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateTilt = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (disabled || isLoading || !motionOk()) return;

    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = (0.5 - y / rect.height) * 10;

    const base = dragActive
      ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
      : `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) translateZ(8px)`;

    setTransform(base);

    el.style.setProperty('--sheen-x', `${((x / rect.width) * 100).toFixed(2)}%`);
    el.style.setProperty('--sheen-y', `${((y / rect.height) * 100).toFixed(2)}%`);
    el.style.setProperty('--sheen-opacity', '1');
  };

  const resetTilt = (): void => {
    setTransform(null);
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty('--sheen-opacity', '0');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file');
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        alert('File size exceeds 50MB limit');
        return;
      }

      onFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setDragActive(false);
    resetTilt();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setDragActive(false);
    resetTilt();

    const file = event.dataTransfer.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please drop a PDF file');
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        alert('File size exceeds 50MB limit');
        return;
      }

      onFileSelect(file);
    }
  };

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      aria-label="Upload PDF"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!disabled) fileInputRef.current?.click();
        }
      }}
      className={[
        'group relative cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-10 text-center shadow-lg shadow-slate-900/5 transition-[transform,box-shadow,background-color,border-color] duration-300 [transform-style:preserve-3d]',
        "before:pointer-events-none before:absolute before:inset-[-30%] before:z-0 before:content-[''] before:opacity-[var(--sheen-opacity,0)] before:transition-opacity before:duration-200",
        'before:bg-[radial-gradient(circle_at_var(--sheen-x,50%)_var(--sheen-y,50%),rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.22)_18%,rgba(255,255,255,0)_45%)]',
        'hover:border-indigo-600 hover:bg-indigo-50 hover:shadow-xl hover:shadow-indigo-500/20',
        'motion-reduce:transform-none motion-reduce:hover:transform-none motion-reduce:before:hidden',
        disabled ? 'cursor-not-allowed opacity-60' : '',
        dragActive ? 'border-indigo-600 bg-indigo-100 shadow-2xl shadow-indigo-500/25' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={transform ? { transform } : undefined}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseMove={updateTilt}
      onMouseLeave={resetTilt}
      onClick={() => !disabled && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        disabled={disabled || isLoading}
        className="hidden"
        aria-label="PDF file input"
      />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <svg
          className="h-12 w-12 text-indigo-600 drop-shadow-[0_10px_14px_rgba(79,70,229,0.28)] motion-reduce:animate-none animate-float-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          aria-hidden
        >
          <path d="M12 2v20M2 12h20" strokeWidth="2" />
        </svg>

        <h3 className="m-0 text-xl font-semibold text-gray-800">
          {isLoading ? 'Processing...' : 'Upload your research paper'}
        </h3>

        <p className="m-0 text-sm leading-relaxed text-gray-500">
          {isLoading ? (
            'Summarizing your PDF...'
          ) : (
            <>
              Drag and drop your PDF here, or click to select
              <br />
              <span className="text-xs font-medium text-gray-400">Max 50MB</span>
            </>
          )}
        </p>

        {!isLoading && (
          <button
            type="button"
            className="mt-2 rounded-md bg-indigo-600 px-6 py-2.5 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/35 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            disabled={disabled}
            aria-label="Choose PDF file"
          >
            Choose File
          </button>
        )}

        {isLoading && (
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
        )}
      </div>
    </div>
  );
};
