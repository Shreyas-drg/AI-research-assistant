/**
 * Utility function to highlight keywords in text
 */

// Keywords that should be highlighted
const KEYWORDS = {
  // Methodologies & Approaches
  method: ['method', 'approach', 'methodology', 'algorithm', 'framework', 'technique', 'model', 'architecture'],
  
  // Results & Findings
  findings: ['result', 'finding', 'conclusion', 'observation', 'achievement', 'outcome', 'demonstrate', 'show', 'evidence', 'indicate', 'suggest'],
  
  // Analysis & Evaluation
  analysis: ['analysis', 'evaluate', 'evaluation', 'assess', 'assessment', 'measure', 'measurement', 'compare', 'comparison', 'study'],
  
  // Data & Information
  data: ['data', 'dataset', 'experiment', 'experimental', 'research', 'investigation', 'study'],
  
  // Importance
  important: ['significant', 'important', 'key', 'critical', 'essential', 'crucial', 'novel', 'innovative', 'breakthrough'],
  
  // Technical terms
  technical: ['performance', 'accuracy', 'efficiency', 'optimization', 'improvement', 'enhancement', 'robust', 'scalable']
};

interface KeywordMatch {
  word: string;
  type: string;
  start: number;
  end: number;
}

export function highlightKeywords(text: string): React.ReactNode[] {
  const keywordMap = new Map<string, string>();
  
  // Build a case-insensitive map of keywords
  Object.entries(KEYWORDS).forEach(([type, words]) => {
    words.forEach((word) => {
      keywordMap.set(word.toLowerCase(), type);
    });
  });

  // Find all keyword matches
  const matches: KeywordMatch[] = [];
  const wordRegex = /\b[\w]+\b/g;
  let match;

  while ((match = wordRegex.exec(text)) !== null) {
    const word = match[0].toLowerCase();
    const type = keywordMap.get(word);
    
    if (type) {
      matches.push({
        word: match[0],
        type,
        start: match.index,
        end: match.index + match[0].length,
      });
    }
  }

  // Sort matches by position
  matches.sort((a, b) => a.start - b.start);

  // Build JSX with highlights
  const result: React.ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach((match, idx) => {
    // Add text before the match
    if (lastIndex < match.start) {
      result.push(text.substring(lastIndex, match.start));
    }

    // Add highlighted match
    const colorClass = getColorClass(match.type);
    result.push(
      <span key={`highlight-${idx}`} className={colorClass}>
        {match.word}
      </span>
    );

    lastIndex = match.end;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex));
  }

  return result.length > 0 ? result : [text];
}

function getColorClass(type: string): string {
  const colorMap: Record<string, string> = {
    method: 'font-semibold text-blue-700 bg-blue-100 px-1 rounded',
    findings: 'font-semibold text-emerald-700 bg-emerald-100 px-1 rounded',
    analysis: 'font-semibold text-purple-700 bg-purple-100 px-1 rounded',
    data: 'font-semibold text-orange-700 bg-orange-100 px-1 rounded',
    important: 'font-bold text-red-700 bg-red-100 px-1 rounded',
    technical: 'font-semibold text-indigo-700 bg-indigo-100 px-1 rounded',
  };

  return colorMap[type] || 'font-semibold text-gray-700 bg-gray-100 px-1 rounded';
}

/**
 * Export color legend for UI display
 */
export const HIGHLIGHT_LEGEND = [
  { type: 'method', color: 'bg-blue-100', textColor: 'text-blue-700', label: 'Methods' },
  { type: 'findings', color: 'bg-emerald-100', textColor: 'text-emerald-700', label: 'Findings' },
  { type: 'analysis', color: 'bg-purple-100', textColor: 'text-purple-700', label: 'Analysis' },
  { type: 'data', color: 'bg-orange-100', textColor: 'text-orange-700', label: 'Data' },
  { type: 'important', color: 'bg-red-100', textColor: 'text-red-700', label: 'Important' },
  { type: 'technical', color: 'bg-indigo-100', textColor: 'text-indigo-700', label: 'Technical' },
];
