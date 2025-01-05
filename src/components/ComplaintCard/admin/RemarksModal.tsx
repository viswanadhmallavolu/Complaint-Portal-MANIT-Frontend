import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface RemarksModalProps {
  complaintId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (complaintId: string, remarks: string, files: File[]) => Promise<void>;
  existingRemarks?: string;
  existingAttachments?: string[];
}

export const RemarksModal: React.FC<RemarksModalProps> = ({
  complaintId,
  isOpen,
  onClose,
  onSubmit,
  existingRemarks = '',
  existingAttachments = [],
}) => {
  const [remarks, setRemarks] = useState<string>(existingRemarks || ''); // Ensure remarks is initialized as empty string if existingRemarks is undefined
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate remarks before submission
    if (!remarks || remarks.trim() === '') {
      alert('Please add remarks before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const filesToSubmit = files && files.length > 0 ? files : [];
      await onSubmit(complaintId, remarks.trim(), filesToSubmit); // Ensure remarks is trimmed
      setRemarks(''); // Reset form
      setFiles([]);
      onClose();
    } catch (error) {
      console.error('Failed to submit remarks:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Admin Remarks</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-2">
              Remarks
            </label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add your remarks here..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </label>
            {existingAttachments.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Existing Attachments:</h4>
                <ul className="space-y-2">
                  {existingAttachments.map((attachment, index) => (
                    <li key={index} className="text-sm text-blue-600 hover:underline">
                      <a href={attachment} target="_blank" rel="noopener noreferrer">
                        Attachment {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                className="hidden"
                onClick={(e) => {
                  (e.target as HTMLInputElement).value = '';
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowUpTrayIcon className="h-5 w-5" />
                <span>Upload Files</span>
              </button>
              {files.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <span className="truncate max-w-[80%]">{file.name}</span>
                      <button 
                        type="button" 
                        onClick={() => removeFile(index)} 
                        className="text-red-500 hover:text-red-700"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !remarks.trim()} // Disable if remarks is empty
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Remarks</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};