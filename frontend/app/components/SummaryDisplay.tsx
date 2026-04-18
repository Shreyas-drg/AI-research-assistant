'use client';

import React from 'react';

interface SummaryDisplayProps {
  summary: string;
  fileName: string;
  onReset: () => void;
}

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary, fileName, onReset }) => {
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
    <div className="animate-slide-in rounded-xl bg-white p-6 shadow-[0_10px_25px_rgba(0,0,0,0.1)] sm:p-8 max-sm:mx-[-16px] max-sm:rounded-none">
      <div className="mb-6 flex flex-col items-start justify-between gap-3 border-b-2 border-gray-100 pb-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="m-0 text-2xl font-bold text-gray-800">Summary Generated</h2>
          <p className="mt-2 text-sm text-gray-500">📄 {fileName}</p>
        </div>
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-2xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-800"
          onClick={onReset}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="mb-6 max-h-[400px] overflow-y-auto pr-2 sm:max-h-[500px]">
        {sections.map((section: string, index: number) => (
          <div
            key={index}
            className="mb-5 rounded-md border-l-4 border-indigo-600 bg-gray-50 p-4 last:mb-0"
          >
            {section.split('\n').map((line: string, lineIndex: number) => (
              <p
                key={lineIndex}
                className={`m-0 text-sm leading-relaxed text-gray-700 first:mt-0 first:font-semibold first:text-gray-800 last:mb-0 ${
                  lineIndex > 0 ? 'mt-2' : ''
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="min-w-[150px] flex-1 rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-200"
          onClick={copyToClipboard}
        >
          📋 Copy to Clipboard
        </button>
        <button
          type="button"
          className="min-w-[150px] flex-1 rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-200"
          onClick={downloadSummary}
        >
          ⬇️ Download
        </button>
        <button
          type="button"
          className="min-w-[150px] flex-1 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30"
          onClick={onReset}
        >
          ➕ Upload Another
        </button>
      </div>
    </div>
  );
};
