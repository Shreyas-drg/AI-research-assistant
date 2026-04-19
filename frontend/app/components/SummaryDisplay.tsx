'use client';

import React, { useState } from 'react';
import { highlightKeywords, HIGHLIGHT_LEGEND } from '../lib/highlightKeywords';
import { highlightSearchMatches, countMatches, filterSections } from '../lib/searchUtils';
import {
  downloadAsText,
  downloadAsMarkdown,
  downloadAsJSON,
  downloadAsCSV,
  downloadAsHTML,
} from '../lib/downloadUtils';

interface SummaryDisplayProps {
  summary: string;
  fileName: string;
  onReset: () => void;
}

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary, fileName, onReset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const sections = summary.split('\n\n').filter((s: string) => s.trim());

  const matchCount = countMatches(summary, searchTerm);
  const matchingSectionIndexes = filterSections(sections, searchTerm);

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(summary);
    alert('Summary copied to clipboard!');
  };

  const handleDownloadFormat = (format: 'txt' | 'md' | 'json' | 'csv' | 'html') => {
    switch (format) {
      case 'txt':
        downloadAsText(summary, fileName);
        break;
      case 'md':
        downloadAsMarkdown(summary, fileName);
        break;
      case 'json':
        downloadAsJSON(summary, fileName);
        break;
      case 'csv':
        downloadAsCSV(summary, fileName);
        break;
      case 'html':
        downloadAsHTML(summary, fileName);
        break;
    }
    setShowFormatMenu(false);
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

      {/* Highlight Legend */}
      <div className="mb-6 rounded-lg bg-gray-50 p-4 border border-gray-200">
        <p className="text-xs font-semibold text-gray-600 mb-3">🎨 KEYWORD HIGHLIGHTS:</p>
        <div className="flex flex-wrap gap-2">
          {HIGHLIGHT_LEGEND.map((item) => (
            <div key={item.type} className="flex items-center gap-1">
              <span className={`text-xs font-semibold px-2 py-1 rounded ${item.textColor} ${item.color}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Full-Text Search */}
      <div className="mb-6 relative">
        <div className="flex gap-3 items-center mb-3">
          <input
            type="text"
            placeholder="🔍 Search in summary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-3 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Clear
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600 px-4">
            Found <span className="font-bold text-indigo-600">{matchCount}</span> match{matchCount !== 1 ? 'es' : ''} in{' '}
            <span className="font-bold text-indigo-600">{matchingSectionIndexes.length}</span> section{matchingSectionIndexes.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="mb-6 max-h-[400px] overflow-y-auto pr-2 sm:max-h-[500px]">
        {sections.map((section: string, index: number) => {
          const isVisible = !searchTerm || matchingSectionIndexes.includes(index);
          if (!isVisible) return null;

          return (
            <div
              key={index}
              className={`mb-5 rounded-md border-l-4 border-indigo-600 bg-gray-50 p-4 last:mb-0 ${
                searchTerm && matchingSectionIndexes.includes(index) ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              {section.split('\n').map((line: string, lineIndex: number) => (
                <p
                  key={lineIndex}
                  className={`m-0 text-sm leading-relaxed text-gray-700 first:mt-0 first:font-semibold first:text-gray-800 last:mb-0 ${
                    lineIndex > 0 ? 'mt-2' : ''
                  }`}
                >
                  {searchTerm ? highlightSearchMatches(line, searchTerm) : highlightKeywords(line)}
                </p>
              ))}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="min-w-[150px] flex-1 rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-200"
          onClick={copyToClipboard}
        >
          📋 Copy to Clipboard
        </button>

        {/* Download Format Dropdown */}
        <div className="relative flex-1 min-w-[150px] overflow-visible">
          <button
            type="button"
            className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-200 flex items-center justify-between"
            onClick={() => setShowFormatMenu(!showFormatMenu)}
          >
            <span>⬇️ Download</span>
            <span className="text-xs">{showFormatMenu ? '▲' : '▼'}</span>
          </button>

          {showFormatMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto">
              <button
                onClick={() => handleDownloadFormat('txt')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 first:rounded-t-md transition"
              >
                📄 Plain Text (.txt)
              </button>
              <button
                onClick={() => handleDownloadFormat('md')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                📝 Markdown (.md)
              </button>
              <button
                onClick={() => handleDownloadFormat('json')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                {} JSON (.json)
              </button>
              <button
                onClick={() => handleDownloadFormat('csv')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                📊 CSV (.csv)
              </button>
              <button
                onClick={() => handleDownloadFormat('html')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 last:rounded-b-md transition"
              >
                🌐 HTML (.html)
              </button>
            </div>
          )}
        </div>

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
