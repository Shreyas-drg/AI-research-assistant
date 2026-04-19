'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FileUpload } from './components/FileUpload';
import { SummaryDisplay } from './components/SummaryDisplay';
import { ComparisonFileUpload } from './components/ComparisonFileUpload';
import { ComparisonDisplay } from './components/ComparisonDisplay';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { uploadPaper, healthCheck, getUserPapers } from './lib/api';

type Mode = 'single' | 'compare';

interface PaperSummary {
  fileName: string;
  summary: string;
}

interface SavedPaper {
  id: string;
  fileName: string;
  summary: string;
  createdAt: string;
}

export default function Home() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>('single');
  const [view, setView] = useState<'home' | 'papers'>('home');
  const [summary, setSummary] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiConnected, setApiConnected] = useState(false);
  const [comparePapers, setComparePapers] = useState<PaperSummary[]>([]);
  const [compareProgress, setCompareProgress] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [savedPapers, setSavedPapers] = useState<SavedPaper[]>([]);
  const [papersLoading, setPapersLoading] = useState(false);
  const [copiedPaperId, setCopiedPaperId] = useState<string | null>(null);

  useEffect(() => {
    const checkApi = async () => {
      const isConnected = await healthCheck();
      setApiConnected(isConnected);
    };
    checkApi();

    // Check if user is already logged in
    const savedToken = localStorage.getItem('authToken');
    const savedEmailLocal = localStorage.getItem('userEmail');
    if (savedToken && savedEmailLocal) {
      setIsAuthenticated(true);
      setUserEmail(savedEmailLocal);
    }

    // Check if viewing papers
    if (searchParams?.get('view') === 'papers') {
      setView('papers');
      if (savedToken) {
        loadUserPapers(savedToken);
      }
    }
  }, [searchParams]);

  const loadUserPapers = async (token: string) => {
    setPapersLoading(true);
    try {
      const papers = await getUserPapers(token);
      setSavedPapers(papers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load papers';
      setError(errorMessage);
    } finally {
      setPapersLoading(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      setFileName(file.name);
      const token = localStorage.getItem('authToken') || undefined;
      const result = await uploadPaper(file, token);
      setSummary(result.summary);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process file';
      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompareFilesSelect = async (files: File[]) => {
    if (files.length === 0) {
      setComparePapers([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    setComparePapers([]);
    setCompareProgress(0);

    const results: PaperSummary[] = [];
    const token = localStorage.getItem('authToken') || undefined;

    for (let i = 0; i < files.length; i++) {
      try {
        setCompareProgress(Math.round(((i) / files.length) * 100));
        const result = await uploadPaper(files[i], token);
        results.push({
          fileName: files[i].name,
          summary: result.summary,
        });
        setComparePapers([...results]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : `Failed to process ${files[i].name}`;
        setError(errorMessage);
        console.error('Upload error:', err);
      }
    }

    setCompareProgress(100);
    setIsLoading(false);
  };

  const handleReset = () => {
    setSummary(null);
    setFileName('');
    setError(null);
  };

  const handleCompareReset = () => {
    setComparePapers([]);
    setCompareProgress(0);
    setError(null);
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    handleReset();
    handleCompareReset();
  };

  return (
    <>
      <Navbar 
        onAuthClick={() => setShowAuthModal(true)}
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
      />
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(email) => {
          setIsAuthenticated(true);
          setUserEmail(email);
        }}
      />

      <main className="relative flex min-h-screen items-center justify-center overflow-hidden py-5 perspective-[1200px] pt-32">
        <div
          className="pointer-events-none absolute -left-20 -top-[70px] h-80 w-80 animate-float-blob rounded-full bg-indigo-500/35 blur-[55px] motion-reduce:hidden"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-[90px] -right-[90px] h-80 w-80 animate-float-blob rounded-full bg-sky-400/28 blur-[55px] [animation-delay:1.8s] motion-reduce:hidden"
          aria-hidden
        />

        <div className="relative z-10 w-full max-w-[900px] px-1">
        {view === 'home' && (
          <header className="mb-10 flex flex-col items-center gap-5 text-center text-white md:mb-12">
            <div className="flex-1">
              <h1 className="mb-3 text-2xl font-extrabold tracking-tight [text-shadow:0_2px_4px_rgba(0,0,0,0.1)] sm:text-3xl md:text-[42px] md:leading-tight">
                📚 AI Research Paper Summarizer
              </h1>
              <p className="mx-auto max-w-[600px] text-base font-light opacity-95 sm:text-lg">
                Transform long research papers into concise, actionable summaries in seconds
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md transition hover:shadow-lg hover:shadow-slate-900/20">
              <span
                className={`inline-block h-2 w-2 rounded-full animate-pulse ${
                  apiConnected ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              />
              <span>
                {apiConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </span>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-3 bg-white/10 rounded-full p-1 backdrop-blur-md">
              <button
                onClick={() => switchMode('single')}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  mode === 'single'
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                📄 Single Paper
              </button>
              <button
                onClick={() => switchMode('compare')}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  mode === 'compare'
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                📊 Compare Papers
              </button>
            </div>
          </header>
        )}

        <div className="flex animate-fade-in flex-col gap-8 md:gap-8">
          {/* My Papers View */}
          {view === 'papers' && (
            <div className="w-full">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">📚 My Papers</h2>
                  <p className="text-indigo-100">View all your saved research papers and summaries</p>
                </div>
                <button
                  onClick={() => {
                    setView('home');
                    window.history.pushState({}, '', '/');
                  }}
                  className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  ← Back to Home
                </button>
              </div>

              {!isAuthenticated ? (
                <div className="rounded-lg bg-white p-8 text-center shadow-lg">
                  <p className="text-gray-600 mb-4">Please log in to view your saved papers</p>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                  >
                    Log In
                  </button>
                </div>
              ) : papersLoading ? (
                <div className="rounded-lg bg-white p-8 text-center shadow-lg">
                  <p className="text-gray-600 mb-4">Loading your papers...</p>
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                </div>
              ) : savedPapers.length === 0 ? (
                <div className="rounded-lg bg-white p-8 text-center shadow-lg">
                  <p className="text-gray-600 mb-4">No papers saved yet</p>
                  <button
                    onClick={() => {
                      setView('home');
                      window.history.pushState({}, '', '/');
                    }}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                  >
                    Upload Your First Paper
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {savedPapers.map((paper) => (
                    <div key={paper.id} className="rounded-lg bg-white shadow-lg overflow-hidden border-l-4 border-indigo-600 hover:shadow-xl transition">
                      {/* Paper Header */}
                      <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-800 truncate">📄 {paper.fileName}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Created: {new Date(paper.createdAt).toLocaleDateString()} {new Date(paper.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Paper Summary */}
                      <div className="p-4 max-h-[300px] overflow-y-auto">
                        <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
                          {paper.summary.split('\n\n').map((section, idx) => (
                            <div key={idx}>
                              {section.split('\n').map((line, lineIdx) => (
                                <p key={lineIdx} className="mb-1">
                                  {line}
                                </p>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Paper Actions */}
                      <div className="bg-gray-50 p-4 flex gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(paper.summary);
                            setCopiedPaperId(paper.id);
                            setTimeout(() => setCopiedPaperId(null), 3000);
                          }}
                          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                        >
                          {copiedPaperId === paper.id ? '✓ Copied!' : '📋 Copy Summary'}
                        </button>
                        <button
                          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                        >
                          ⬇️ Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Single Paper & Compare Modes */}
          {view === 'home' && (
            <>
              {/* Single Mode */}
              {mode === 'single' && (
                <>
                  {summary ? (
                    <SummaryDisplay summary={summary} fileName={fileName} onReset={handleReset} />
                  ) : (
                    <>
                      <FileUpload
                        onFileSelect={handleFileSelect}
                        isLoading={isLoading}
                        disabled={!apiConnected}
                      />

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                          { icon: '⚡', title: 'Fast Processing', text: 'Get summaries in seconds, not hours' },
                          { icon: '🎯', title: 'Key Points', text: 'Capture the essential findings and conclusions' },
                          { icon: '📖', title: 'Easy to Read', text: 'Structured format with TL;DR and citations' },
                        ].map((card) => (
                          <div
                            key={card.title}
                            className="rounded-xl bg-white p-6 text-center shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                          >
                            <span className="mb-3 block text-3xl">{card.icon}</span>
                            <h3 className="mb-2 text-base font-bold text-gray-800">{card.title}</h3>
                            <p className="text-sm leading-relaxed text-gray-500">{card.text}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Compare Mode */}
              {mode === 'compare' && (
                <>
                  {comparePapers.length > 0 ? (
                    <ComparisonDisplay papers={comparePapers} onReset={handleCompareReset} />
                  ) : (
                    <>
                      <ComparisonFileUpload
                        onFilesSelect={handleCompareFilesSelect}
                        isLoading={isLoading}
                        disabled={!apiConnected}
                      />

                      {isLoading && compareProgress > 0 && (
                        <div className="rounded-lg bg-white p-6 shadow-lg">
                          <div className="flex items-center justify-between mb-3">
                            <p className="font-semibold text-gray-800">Processing Papers...</p>
                            <span className="text-sm text-gray-600">{compareProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${compareProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-4">
                        <p className="text-sm text-indigo-800">
                          <strong>💡 Comparison Mode:</strong> Upload multiple research papers to view their summaries side-by-side. Perfect for comparing methodologies, findings, and conclusions across different papers!
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {error && (
          <div className="animate-slide-down mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-100 p-4">
            <span className="shrink-0 text-xl" aria-hidden>
              ⚠️
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-red-800">Error Processing File</h4>
              <p className="text-[13px] leading-snug text-red-900">{error}</p>
              {(error.includes('rate') || error.includes('Rate')) && (
                <p className="mt-2 text-xs text-red-800 font-medium">
                  💡 Tip: Please wait a moment before trying again. The system spaces out requests to work within API limits.
                </p>
              )}
            </div>
            <button
              type="button"
              className="flex h-6 w-6 shrink-0 items-center justify-center text-lg text-red-800 transition hover:scale-125"
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {!apiConnected && !summary && comparePapers.length === 0 && (
          <div className="animate-slide-down mt-6 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-100 p-4">
            <span className="shrink-0 text-xl" aria-hidden>
              🔗
            </span>
            <div>
              <h4 className="text-sm font-semibold text-amber-900">Backend Not Connected</h4>
              <p className="text-[13px] leading-snug text-amber-800">
                Make sure the backend server is running on http://localhost:5000
              </p>
            </div>
          </div>
        )}

        </div>
      </main>
        <footer className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white">
          <p className="my-1">Built by Rival Ravens | AI Research Assistant</p>
          <p className="text-xs opacity-90">
            <a href="#privacy" className="transition hover:underline hover:opacity-100">
              Privacy
            </a>{' '}
            •{' '}
            <a href="#terms" className="transition hover:underline hover:opacity-100">
              Terms
            </a>{' '}
            •{' '}
            <a href="#support" className="transition hover:underline hover:opacity-100">
              Support
            </a>
          </p>
        </footer>
    </>
  );
}
