import React from 'react';

interface SearchMatch {
  text: string;
  isMatch: boolean;
}

/**
 * Highlights search matches in text
 */
export function highlightSearchMatches(text: string, searchTerm: string): React.ReactNode[] {
  if (!searchTerm.trim()) {
    return [text];
  }

  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.match(regex)) {
      return (
        <span key={index} className="font-bold bg-yellow-300 text-gray-900">
          {part}
        </span>
      );
    }
    return part;
  });
}

/**
 * Count matches in text
 */
export function countMatches(text: string, searchTerm: string): number {
  if (!searchTerm.trim()) {
    return 0;
  }

  const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

/**
 * Filter sections based on search term
 */
export function filterSections(sections: string[], searchTerm: string): number[] {
  if (!searchTerm.trim()) {
    return sections.map((_, idx) => idx);
  }

  const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  return sections
    .map((section, idx) => (section.match(regex) ? idx : -1))
    .filter((idx) => idx !== -1);
}

/**
 * Get summary statistics for search
 */
export function getSearchStats(text: string, searchTerm: string): { total: number; percentage: number } {
  const totalWords = text.split(/\s+/).filter((w) => w.length > 0).length;
  const matches = countMatches(text, searchTerm);

  return {
    total: matches,
    percentage: totalWords > 0 ? Math.round((matches / totalWords) * 100) : 0,
  };
}
