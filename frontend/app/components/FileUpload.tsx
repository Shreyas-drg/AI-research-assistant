'use client';

import React, { useRef } from 'react';
import styles from './FileUpload.module.css';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  isLoading,
  disabled = false 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadContainerRef = useRef<HTMLDivElement>(null);

  const updateTilt = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (disabled || isLoading || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const element = uploadContainerRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = (0.5 - (y / rect.height)) * 10;

    element.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
    element.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);
    element.style.setProperty('--sheen-x', `${((x / rect.width) * 100).toFixed(2)}%`);
    element.style.setProperty('--sheen-y', `${((y / rect.height) * 100).toFixed(2)}%`);
    element.style.setProperty('--sheen-opacity', '1');
  };

  const resetTilt = (): void => {
    const element = uploadContainerRef.current;
    if (!element) return;
    element.style.setProperty('--tilt-x', '0deg');
    element.style.setProperty('--tilt-y', '0deg');
    element.style.setProperty('--sheen-opacity', '0');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file');
        return;
      }

      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        alert('File size exceeds 50MB limit');
        return;
      }

      onFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.currentTarget.classList.add(styles.dragActive);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>): void => {
    event.currentTarget.classList.remove(styles.dragActive);
    resetTilt();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.currentTarget.classList.remove(styles.dragActive);
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
      ref={uploadContainerRef}
      className={`${styles.uploadContainer} ${disabled ? styles.disabled : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseMove={updateTilt}
      onMouseLeave={resetTilt}
      onClick={() => !disabled && fileInputRef.current?.click()}
      role="button"
      aria-label="Upload PDF"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        disabled={disabled || isLoading}
        className={styles.hiddenInput}
        aria-label="PDF file input"
      />

      <div className={styles.content}>
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2v20M2 12h20" strokeWidth="2" />
        </svg>

        <h3 className={styles.title}>
          {isLoading ? 'Processing...' : 'Upload your research paper'}
        </h3>

        <p className={styles.subtitle}>
          {isLoading ? (
            'Summarizing your PDF...'
          ) : (
            <>
              Drag and drop your PDF here, or click to select
              <br/>
              <span className={styles.fileSize}>Max 50MB</span>
            </>
          )}
        </p>

        {!isLoading && (
          <button
            className={styles.button}
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
          <div className={styles.spinner}></div>
        )}
      </div>
    </div>
  );
};
