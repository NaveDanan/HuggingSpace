import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, GitFork, ThumbsUp } from 'lucide-react';
import { CardMenu } from '../ui/CardMenu';
import { cn } from '../../lib/utils';
import type { Model } from '../../types/models';

interface ModelCardProps {
  model: Model;
  className?: string;
  onEdit?: () => void; // Optional prop for edit action
  onDelete?: () => void; // Optional prop for delete action
}

export function ModelCard({ model, className, onEdit, onDelete }: ModelCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/models/${model.author}/${model.id}`);
  };

  // Default placeholders for onEdit and onDelete if not provided
  const handleEdit = onEdit || (() => console.log('Edit action triggered.'));
  const handleDelete = onDelete || (() => console.log('Delete action triggered.'));

  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow", className)}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3
              onClick={handleClick}
              className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 
                       dark:hover:text-blue-400 cursor-pointer"
            >
              {model.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">by {model.author}</p>
          </div>
          {model.is_owner && (
            <CardMenu onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>

        <p className="text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">{model.description}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          {model.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 text-gray-600 dark:text-gray-400 text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              {model.downloads}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              {model.likes}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="w-4 h-4" />
              {model.forks}
            </span>
          </div>
          <span className="text-gray-500 dark:text-gray-500">
            Updated {new Date(model.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
