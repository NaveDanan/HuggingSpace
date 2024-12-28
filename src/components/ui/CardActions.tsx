import React, { useState, useRef } from 'react';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

interface CardActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CardActions({ onEdit, onDelete }: CardActionsProps) {
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  
  useOnClickOutside(actionsRef, () => setShowActions(false));

  return (
    <div className="absolute top-2 right-2" ref={actionsRef}>
      <button
        onClick={() => setShowActions(!showActions)}
        className="p-1.5 bg-gray-900/75 text-white rounded-md hover:bg-gray-800/75 transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      
      {showActions && (
        <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg 
                     border border-gray-200 dark:border-gray-700 py-1 z-50">
          {onEdit && (
            <button
              onClick={() => {
                onEdit();
                setShowActions(false);
              }}
              className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2
                       transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => {
                onDelete();
                setShowActions(false);
              }}
              className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400
                       hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2
                       transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}