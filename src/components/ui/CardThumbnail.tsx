import React from 'react';
import { Database, Box, FileText } from 'lucide-react';
import type { SpaceType } from '../../types/spaces';
import { getDefaultThumbnail } from '../../utils/images';

interface CardThumbnailProps {
  type: SpaceType;
  thumbnail?: string;
}

export function CardThumbnail({ type, thumbnail }: CardThumbnailProps) {
  return (
    <div className="w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 
                flex items-center justify-center overflow-hidden">
      {thumbnail ? (
        <img 
          src={thumbnail}
          alt="Thumbnail"
          className="w-full h-full object-cover transition-transform hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="p-8 rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-sm
                    transform transition-all duration-200 hover:scale-110 hover:bg-white/20 dark:hover:bg-black/20">
          <img
            src={getDefaultThumbnail(type)}
            alt={`${type} icon`}
            className="w-32 h-32"
          />
        </div>
      )}
    </div>
  );
}