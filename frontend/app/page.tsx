'use client';

import { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { SummaryDisplay } from './components/SummaryDisplay';
import { uploadPaper, healthCheck } from './lib/api';
import styles from './page.module.css';

export default function Home() {
  const [summary, setSummary] = useState<string | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiConnected, setApiConnected] = useState(false);

  // Check if API is connected
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
    setUsedFallback(false);

    try {
      setFileName(file.name);
      const result = await uploadPaper(file);
      setSummary(result.summary);
      setUsedFallback(Boolean(result.usedFallback));
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
    setUsedFallback(false);
    setFileName('');
    setError(null);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>
              📚 AI Research Paper Summarizer
            </h1>
            <p className={styles.subtitle}>
              Transform long research papers into concise, actionable summaries in seconds
            </p>
          </div>

          {/* API Status */}
          <div className={styles.apiStatus}>
            <span 
              className={styles.statusDot}
              style={{backgroundColor: apiConnected ? '#10b981' : '#ef4444'}}
            />
            <span className={styles.statusText}>
              {apiConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </span>
          </div>
        </header>

        {/* Content */}
        <div className={styles.content}>
          {summary ? (
            <SummaryDisplay
              summary={summary}
              fileName={fileName}
              usedFallback={usedFallback}
              onReset={handleReset}
            />
          ) : (
            <>
              <FileUpload
                onFileSelect={handleFileSelect}
                isLoading={isLoading}
                disabled={!apiConnected}
              />

              {/* Info Cards */}
              <div className={styles.infoCards}>
                <div className={styles.infoCard}>
                  <span className={styles.infoIcon}>⚡</span>
                  <h3>Fast Processing</h3>
                  <p>Get summaries in seconds, not hours</p>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoIcon}>🎯</span>
                  <h3>Key Points</h3>
                  <p>Capture the essential findings and conclusions</p>
                </div>
                <div className={styles.infoCard}>
                  <span className={styles.infoIcon}>📖</span>
                  <h3>Easy to Read</h3>
                  <p>Structured format with TL;DR and citations</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className={styles.errorAlert}>
            <span className={styles.errorIcon}>⚠️</span>
            <div>
              <h4>Error Processing File</h4>
              <p>{error}</p>
            </div>
            <button
              className={styles.closeError}
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </div>
        )}

        {/* API Connection Warning */}
        {!apiConnected && !summary && (
          <div className={styles.warningAlert}>
            <span className={styles.warningIcon}>🔗</span>
            <div>
              <h4>Backend Not Connected</h4>
              <p>Make sure the backend server is running on http://localhost:5000</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className={styles.footer}>
          <p>Built with ❤️ | AI Research Assistant</p>
          <p className={styles.footerLinks}>
            <a href="#privacy">Privacy</a> • <a href="#terms">Terms</a> • <a href="#support">Support</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
