import React, { useEffect, useState } from 'react';
import { Search, Info } from 'lucide-react';
import { ComplaintDetails } from '../ComplaintCard/ComplaintDetails';
import { AttachmentGallery } from '../ComplaintCard/AttachmentGallery';
import { searchComplaint } from '../../services/apiService';

interface ComplaintSectionProps {
  complaintId: string;
  setComplaintId: (value: string) => void;
  complaint: any;
  setComplaint: (complaint: any) => void;
}

export const ComplaintSection: React.FC<ComplaintSectionProps> = ({
  complaintId,
  setComplaintId,
  complaint,
  setComplaint,
}) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("ComplaintSection received:", complaint);
  }, [complaint]);

  const handleFetch = async () => {
    setError('');
    setIsLoading(true);

    try {
      let extractedCategory = '';
      const firstChar = complaintId[0]?.toUpperCase() || '';
      switch (firstChar) {
        case 'A': extractedCategory = 'Academic'; break;
        case 'B': extractedCategory = 'Administration'; break;
        case 'C': extractedCategory = 'Hostel'; break;
        case 'D': extractedCategory = 'Infrastructure'; break;
        case 'E': extractedCategory = 'Medical'; break;
        case 'F': extractedCategory = 'Ragging'; break;
        default: extractedCategory = 'Hostel';
      }
      const trimmedId = complaintId.slice(1);
      const data = await searchComplaint(trimmedId, extractedCategory);
      setComplaint(data);
    } catch (err) {
      setError('Complaint not found or you do not have permission to view it.');
      setComplaint(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6 overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Fetch Complaint</h2>
        <div className="group relative">
          <Info size={20} className="text-gray-400 cursor-help" />
          <div className="absolute z-[999999] left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg">
            This section is helpful to search the complaint using the UID which embeds the category tag.
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full -mb-1 w-2 h-2 bg-gray-800 rotate-45"></div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Complaint UID
            </label>
            <input
              type="text"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              placeholder="Enter complaint UID"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleFetch}
            disabled={isLoading}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors flex items-center gap-2"
          >
            <Search size={20} />
            {isLoading ? 'Fetching...' : 'Fetch Complaint'}
          </button>
        </div>
        
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}
        
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

export default ComplaintSection;