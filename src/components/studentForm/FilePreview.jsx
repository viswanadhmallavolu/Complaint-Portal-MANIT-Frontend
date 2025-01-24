
import React from "react";
import { Trash2, FileText } from "lucide-react";

const FilePreview = ({ file, onRemove, index }) => {
  const isImage = file.type.startsWith('image/');
  const MAX_PREVIEW_SIZE = 150; // Reduced preview size

  return (
    <div className="relative group bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:border-blue-500 transition-all duration-300">
      <div style={{ width: MAX_PREVIEW_SIZE, height: MAX_PREVIEW_SIZE }} className="relative">
        {isImage ? (
          <img
            src={file.preview}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <FileText size={32} className="text-gray-400" />
          </div>
        )}
      </div>
      <div className="p-2 bg-white">
        <p className="text-xs text-gray-700 truncate" title={file.name}>
          {file.name}
        </p>
        <p className="text-xs text-gray-500">
          {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
};

export default FilePreview;