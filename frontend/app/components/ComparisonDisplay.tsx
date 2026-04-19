'use client';

import React, { useState } from 'react';
import { highlightKeywords, HIGHLIGHT_LEGEND } from '../lib/highlightKeywords';
import { highlightSearchMatches, countMatches } from '../lib/searchUtils';
import { downloadComparisonAsText, downloadComparisonAsJSON, downloadComparisonAsHTML } from '../lib/downloadUtils';

interface PaperSummary {
  fileName: string;
  summary: string;
}

interface ComparisonDisplayProps {
  papers: PaperSummary[];
  onReset: () => void;
}

export const ComparisonDisplay: React.FC<ComparisonDisplayProps> = ({
  papers,
  onReset,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('');

  const totalMatches = papers.reduce((acc, paper) => acc + countMatches(paper.summary, searchTerm), 0);

  const copyToClipboard = (): void => {
    const allSummaries = papers
      .map((paper) => `📄 ${paper.fileName}\n\n${paper.summary}`)
      .join('\n\n' + '='.repeat(50) + '\n\n');
    navigator.clipboard.writeText(allSummaries);
    setCopyFeedback('✓ All papers copied to clipboard!');
    setTimeout(() => setCopyFeedback(''), 3000);
  };

  const handleDownloadFormat = (format: 'txt' | 'json' | 'html') => {
    switch (format) {
      case 'txt':
        downloadComparisonAsText(papers);
        break;
      case 'json':
        downloadComparisonAsJSON(papers);
        break;
      case 'html':
        downloadComparisonAsHTML(papers);
        break;
    }
    setShowFormatMenu(false);
  };

  return (
    <div className="w-full space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">📊 Papers Comparison</h2>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          ← Back
        </button>
      </div>

      {/* Highlight Legend */}
      <div className="rounded-lg bg-gray-50 p-4 border border-gray-200 mb-6">
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
            placeholder="🔍 Search in all papers..."
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
            Found <span className="font-bold text-indigo-600">{totalMatches}</span> match{totalMatches !== 1 ? 'es' : ''} across{' '}
            <span className="font-bold text-indigo-600">{papers.length}</span> papers
          </p>
        )}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(papers.length, 3)}, 1fr)` }}>
        {papers.map((paper, index) => {
          const paperMatches = countMatches(paper.summary, searchTerm);
          return (
            <div
              key={index}
              className={`rounded-xl bg-white shadow-lg overflow-hidden border-t-4 border-indigo-600 ${
                searchTerm && paperMatches > 0 ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 text-white">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">📄</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{paper.fileName}</p>
                    <p className="text-xs opacity-90">Paper {index + 1}</p>
                    {searchTerm && paperMatches > 0 && (
                      <p className="text-xs opacity-75 mt-1">
                        {paperMatches} match{paperMatches !== 1 ? 'es' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 max-h-[500px] overflow-y-auto">
                <div className="space-y-3">
                  {paper.summary.split('\n\n').map((section, sIndex) => (
                    <div key={sIndex} className="text-sm text-gray-700 leading-relaxed">
                      {section.split('\n').map((line, lIndex) => (
                        <p key={lIndex} className="mb-1">
                          {searchTerm ? highlightSearchMatches(line, searchTerm) : highlightKeywords(line)}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={copyToClipboard}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition flex items-center gap-2"
        >
          📋 Copy All
        </button>

        {/* Download Format Dropdown */}
        <div className="relative overflow-visible">
          <button
            onClick={() => setShowFormatMenu(!showFormatMenu)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <span>⬇️ Download All</span>
            <span className="text-xs">{showFormatMenu ? '▲' : '▼'}</span>
          </button>

          {showFormatMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto">
              <button
                onClick={() => handleDownloadFormat('txt')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 first:rounded-t-md transition"
              >
                📄 Plain Text (.txt)
              </button>
              <button
                onClick={() => handleDownloadFormat('json')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                {} JSON (.json)
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
          onClick={onReset}
          className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition"
        >
          ➕ Compare More Papers
        </button>
      </div>

      {/* Comparison Insights */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Tip:</strong> You can now view all {papers.length} papers side-by-side. Use the download button to save the comparison.
        </p>
      </div>

      {/* Copy Feedback */}
      {copyFeedback && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          {copyFeedback}
        </div>
      )}
    </div>
  );
};
