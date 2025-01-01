import React, { useState, memo } from 'react';
import { Calendar, MessageSquare } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Complaint, ReadStatus } from '../../types/complaint';
import { StatusBadge } from './StatusBadge';
import { ComplaintDetails } from './ComplaintDetails';
import { AttachmentGallery } from './AttachmentGallery';
import { RemarksModal } from '../RemarksModal/RemarksModal';

// Implement the uploadFiles function
const uploadFiles = async (files: File[]): Promise<string[]> => {
  // Replace this with actual upload logic
  return files.map(file => URL.createObjectURL(file));
};

interface ComplaintCardProps {
  complaint: Complaint;
  onUpdate: (id: string, updates:any) => Promise<void>;
  expanded: boolean;
  onToggleExpand: () => void;
  onRemarksUpdate: (id: string, remarks: string, files: File[]) => Promise<void>;
}

const ComplaintCard: React.FC<ComplaintCardProps> = memo(({ complaint, onUpdate, onRemarksUpdate,expanded, onToggleExpand }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRemarksModalOpen, setIsRemarksModalOpen] = useState(false);

  const handleResolveClick = async () => {
    if (complaint.status === 'resolved') {
      return;
    }
    setIsLoading(true);
    await onUpdate(complaint.id, { status: 'resolved' });
    setIsLoading(false);
  };

  const handleRemarksSubmit = async (complaintId: string, remarks: string, files: File[]) => {
    console.log('Submitting remarks:', remarks, files);
    setIsLoading(true);
    try {
      // Only process files if there are any
      const fileUrls = files && files.length > 0 ? await uploadFiles(files) : [];
      await onRemarksUpdate(complaintId, remarks, files);
      setIsRemarksModalOpen(false);
    } catch (error) {
      console.error('Failed to submit remarks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2">
          {isLoading ? (
            <Skeleton width={80} height={24} />
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 inline-block">
              {`${Math.floor((Date.now() - new Date(complaint.dateSubmitted).getTime()) / (1000 * 60 * 60 * 24))} days ago`}
            </span>
          )}
          {isLoading ? (
            <Skeleton width={200} height={24} />
          ) : (
            <h3 className="text-xl font-semibold text-gray-800">
              {complaint.category !== 'Anonymous'
                ? `${complaint.scholarNumber}'s Complaint`
                : 'Anonymous Complaint'}
            </h3>
          )}
        </div>
        {isLoading ? (
          <Skeleton width={100} height={20} />
        ) : (
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                complaint.readStatus === ReadStatus.Viewed ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="capitalize text-sm">
              {complaint.readStatus === ReadStatus.Viewed ? 'Viewed' : 'Not Viewed'}
            </span>
          </div>
        )}
        {isLoading ? <Skeleton width={80} height={24} /> : <StatusBadge status={complaint.status} />}
      </div>

      {expanded && (
        <>
          {isLoading ? (
            <Skeleton count={3} />
          ) : (
            <>
              <ComplaintDetails complaint={complaint} />
              <p className="text-gray-700 mb-6 leading-relaxed">{complaint.description}</p>

              <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <span>{new Date(complaint.dateSubmitted).toLocaleDateString()}</span>
                </div>
                {complaint.AdminRemarks && (
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-gray-500" />
                    <span>Admin Remarks: {complaint.AdminRemarks}</span>
                  </div>
                )}
              </div>

              <AttachmentGallery 
                attachments={complaint.attachments} 
                adminAttachments={complaint.AdminAttachments}
              />

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsRemarksModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <MessageSquare size={16} className="mr-2" />
                  Add Remarks
                </button>
                <button
                  onClick={handleResolveClick}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Resolve Complaint
                </button>
              </div>
            </>
          )}
        </>
      )}

      <div className="flex justify-end mt-6">
        <button
          onClick={onToggleExpand}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          {isLoading ? <Skeleton width={60} /> : expanded ? 'Hide Details' : 'View'}
        </button>
      </div>

      <RemarksModal
        complaintId={complaint.id}
        isOpen={isRemarksModalOpen}
        onClose={() => setIsRemarksModalOpen(false)}
        onSubmit={(complaintId: string, remarks: string, files: File[]) => handleRemarksSubmit(complaintId, remarks, files)}
        existingRemarks={complaint.AdminRemarks}
        existingAttachments={complaint.AdminAttachments}
      />
    </div>
  );
});

export default ComplaintCard;
