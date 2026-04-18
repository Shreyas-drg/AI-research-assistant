'use client';

import { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { SummaryDisplay } from './components/SummaryDisplay';
import { uploadPaper, healthCheck } from './lib/api';

export default function Home() {
  const [summary, setSummary] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    const checkApi = async () => {
      const isConnected = await healthCheck();
      setApiConnected(isConnected);
    };
    checkApi();
  }, []);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      setFileName(file.name);
      const result = await uploadPaper(file);
      setSummary(result.summary);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process file';
      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSummary(null);
    setFileName('');
    setError(null);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden py-5 perspective-[1200px]">
      <div
        className="pointer-events-none absolute -left-20 -top-[70px] h-80 w-80 animate-float-blob rounded-full bg-indigo-500/35 blur-[55px] motion-reduce:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-[90px] -right-[90px] h-80 w-80 animate-float-blob rounded-full bg-sky-400/28 blur-[55px] [animation-delay:1.8s] motion-reduce:hidden"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-[900px] px-1">
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
        </header>

        <div className="flex animate-fade-in flex-col gap-8 md:gap-8">
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
        </div>

        {error && (
          <div className="animate-slide-down mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-100 p-4">
            <span className="shrink-0 text-xl" aria-hidden>
              ⚠️
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-red-800">Error Processing File</h4>
              <p className="text-[13px] leading-snug text-red-900">{error}</p>
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

        {!apiConnected && !summary && (
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

        <footer className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white">
          <p className="my-1">Built with ❤️ | AI Research Assistant</p>
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
      </div>
    </main>
  );
}
