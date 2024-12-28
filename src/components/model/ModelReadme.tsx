import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ModelReadmeProps {
  content: string;
}

export function ModelReadme({ content }: ModelReadmeProps) {
  return (
    <div className="bg-white rounded-lg border p-8 prose max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}