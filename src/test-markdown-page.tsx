"use client";

import { useState, useEffect } from 'react';
import MarkdownParser from './reblog/markdown/MarkdownParser';

export default function TestMarkdownPage() {
  const [markdownContent, setMarkdownContent] = useState('');

  useEffect(() => {
    // Load the markdown file content
    fetch('/test-markdown.md')
      .then(response => response.text())
      .then(content => {
        setMarkdownContent(content);
      })
      .catch(error => {
        console.error('Error loading markdown:', error);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Markdown Test</h1>
      
      <div className="prose max-w-none">
        {markdownContent ? (
          <MarkdownParser content={markdownContent} />
        ) : (
          <p>Loading markdown content...</p>
        )}
      </div>
    </div>
  );
} 