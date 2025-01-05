import React, { ChangeEvent } from 'react';
import { Upload } from 'lucide-react';
import FilePreview from './FilePreview';

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export default function FileUpload({ files, onChange }: FileUploadProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      onChange([...files, ...newFiles]);
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    onChange(files.filter(file => file !== fileToRemove));
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="attachments"
        className="block text-sm font-medium text-gray-700"
      >
        Attachments
      </label>
      <div className="space-y-3">
        <label
          htmlFor="attachments"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer w-fit"
        >
          <Upload className="w-4 h-4" />
          Choose Files
        </label>
        <input
          type="file"
          id="attachments"
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        
        {files.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
            {files.map((file, index) => (
              <FilePreview
                key={`${file.name}-${index}`}
                file={file}
                onRemove={handleRemoveFile}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}