'use client';

import React from 'react';
import styles from './SummaryDisplay.module.css';

interface SummaryDisplayProps {
  summary: string;
  fileName: string;
  usedFallback?: boolean;
  onReset: () => void;
}

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ 
  summary, 
  fileName,
  usedFallback = false,
  onReset 
}) => {
  const sections = summary.split('\n\n').filter((s: string) => s.trim());

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(summary);
    alert('Summary copied to clipboard!');
  };

  const downloadSummary = (): void => {
    const element = document.createElement('a');
    const file = new Blob([summary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${fileName.replace('.pdf', '')}_summary.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Summary Generated</h2>
          <p className={styles.fileName}>📄 {fileName}</p>
          <p
            className={`${styles.statusBadge} ${
              usedFallback ? styles.fallbackBadge : styles.aiBadge
            }`}
          >
            {usedFallback
              ? 'Fallback mode: AI is busy, showing local summary'
              : 'AI mode: Full summary generated'}
          </p>
        </div>
        <button className={styles.closeButton} onClick={onReset}>✕</button>
      </div>

      <div className={styles.content}>
        {sections.map((section: string, index: number) => (
          <div key={index} className={styles.section}>
            {section.split('\n').map((line: string, lineIndex: number) => (
              <p key={lineIndex} className={styles.line}>
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button className={styles.actionButton} onClick={copyToClipboard}>
          📋 Copy to Clipboard
        </button>
        <button className={styles.actionButton} onClick={downloadSummary}>
          ⬇️ Download
        </button>
        <button className={styles.actionButtonPrimary} onClick={onReset}>
          ➕ Upload Another
        </button>
      </div>
    </div>
  );
};
