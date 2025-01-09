import React, { useEffect } from 'react';
import { Search, Info } from 'lucide-react';
import { ComplaintDetails } from '../ComplaintCard/ComplaintDetails';
import { AttachmentGallery } from '../ComplaintCard/AttachmentGallery';

import { COMPLAINT_CATEGORIES } from '../../constants/categories';

interface ComplaintSectionProps {
  complaintId: string;
  setComplaintId: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  onFetch: () => void;
  complaint: any;
}

export const ComplaintSection: React.FC<ComplaintSectionProps> = ({
  complaintId,
  setComplaintId,
  category,
  setCategory,
  onFetch,
  complaint,
}) => {
  useEffect(() => {
    console.log("ComplaintSection received:", complaint);
  }, [complaint]);

  return (
    <section className="bg-white rounded-lg shadow-md p-6 overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Fetch Complaint</h2>
        <div className="group relative">
          <Info size={20} className="text-gray-400 cursor-help" />
          <div className="absolute z-[999999] left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg">
            This section is helpful to search the complaint by using the complaint ID and category from the log file
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-gray-800 rotate-45"></div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Complaint ID
            </label>
            <input
              type="text"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              placeholder="Enter complaint ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
            >
              <option value="">Select category</option>
              {COMPLAINT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onFetch}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors flex items-center gap-2"
          >
            <Search size={20} />
            Fetch Complaint
          </button>
        </div>
        
        {complaint && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg overflow-y-auto">
            <ComplaintDetails complaint={complaint} />
            
            
            {(complaint.attachments?.length || complaint.adminAttachments?.length) && (
              <AttachmentGallery
                attachments={complaint.attachments ?? []}
                adminAttachments={complaint.adminAttachments ?? []}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
};