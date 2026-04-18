import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Research Paper Summarizer',
  description: 'Upload your research papers and get AI-powered summaries instantly',
  keywords: ['research', 'paper', 'summarizer', 'AI', 'pdf'],
  authors: [{ name: 'Your Name' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
