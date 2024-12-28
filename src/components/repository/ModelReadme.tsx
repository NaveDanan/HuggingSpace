import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, Calendar, Tag } from 'lucide-react';
import type { Model } from '../../types/models';
import { findFileContent } from '../../utils/repository';
import { useModelFiles } from '../../hooks/useModelFiles';

const generateDefaultReadme = (model: Model) => `# ${model.title}

## Description

${model.description}

## Tags

${model.tags.map(tag => `- ${tag}`).join('\n')}

## Usage

This model can be used for various tasks in machine learning and artificial intelligence.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
`;

interface ModelReadmeProps {
  model: Model;
}

export function ModelReadme({ model }: ModelReadmeProps) {
  const { files, loading, error } = useModelFiles(model.id);
  
  // Get README content from files
  const readmeContent = findFileContent(files, 'README.md') || generateDefaultReadme(model);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
        <p className="text-red-500 dark:text-red-400">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b dark:border-gray-700">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <FileText className="w-5 h-5" />
          <span className="font-medium">README.md</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Last updated {new Date(model.updatedAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Tag className="w-4 h-4" />
            {model.tags.length} tags
          </span>
        </div>
      </div>
      
      <article className="prose dark:prose-invert max-w-none prose-headings:border-b-0
                       prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-8
                       prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4
                       prose-p:text-gray-600 dark:prose-p:text-gray-300
                       prose-a:text-blue-600 dark:prose-a:text-blue-400
                       prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                       prose-pre:bg-gray-100 dark:prose-pre:bg-gray-700 prose-pre:p-4 prose-pre:rounded-lg">
        <ReactMarkdown>{readmeContent}</ReactMarkdown>
      </article>
    </div>
  );
}