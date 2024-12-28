import React, { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ExpandableCardProps {
  children: React.ReactNode;
  className?: string;
}

export function ExpandableCard({ children, className }: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={cn(
        "relative transition-all duration-300 ease-in-out",
        isExpanded && "lg:col-span-2 lg:row-span-2 z-10",
        className
      )}
    >
      <div className={cn(
        "relative bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-all duration-300",
        isExpanded ? "shadow-lg scale-105" : "hover:shadow-md"
      )}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-2 right-2 p-1.5 bg-gray-100 dark:bg-gray-700 
                   rounded-lg opacity-0 group-hover:opacity-100 transition-opacity
                   hover:bg-gray-200 dark:hover:bg-gray-600 z-20"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          ) : (
            <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          )}
        </button>

        <div className={cn(
          "transition-all duration-300",
          isExpanded && "min-h-[300px]"
        )}>
          {children}
        </div>
      </div>
    </div>
  );
}