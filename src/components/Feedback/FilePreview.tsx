import React from 'react';
import { X, FileText } from 'lucide-react';

interface FilePreviewProps {
  file: File;
  onRemove: (file: File) => void;
}

export default function FilePreview({ file, onRemove }: FilePreviewProps) {
  const isImage = file.type.startsWith('image/');
  
  return (
    <div className="relative group">
      <div className="aspect-square w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
        {isImage ? (
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <button
          type="button"
          onClick={() => onRemove(file)}
          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove file"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      <div className="mt-2">
        <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
        <p className="text-xs text-gray-500">
          {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>
    </div>
  );
}