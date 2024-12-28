import React, { useRef } from 'react';
import { Upload, User } from 'lucide-react';
import { useImageUpload } from '../../hooks/useImageUpload';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading, error } = useImageUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    const url = await uploadImage(file);
    if (url) {
      onChange(url);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative group cursor-pointer">
          {value ? (
            <img
              src={value}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-700"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 
                     rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Upload className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            {uploading ? 'Uploading...' : 'Change profile picture'}
          </button>
          <p className="text-xs text-gray-400 mt-1">
            JPG, PNG or GIF (max. 2MB)
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-400 mt-2">{error}</p>
      )}
    </div>
  );
}