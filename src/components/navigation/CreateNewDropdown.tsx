import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Database, Box, FileText } from 'lucide-react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

export function CreateNewDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const items = [
    { icon: <Database className="w-4 h-4" />, label: 'Model', path: '/create-model' },
    { icon: <Box className="w-4 h-4" />, label: 'Dataset', path: '/create-dataset' },
    { icon: <FileText className="w-4 h-4" />, label: 'Space', path: '/create-space' },
  ];

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 
                 text-gray-700 rounded-lg text-sm font-medium
                 hover:bg-gray-200 focus:outline-none focus:ring-2"
      >
        <Plus className="w-4 h-4" />
        New
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          {items.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 
                       hover:bg-gray-50"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}