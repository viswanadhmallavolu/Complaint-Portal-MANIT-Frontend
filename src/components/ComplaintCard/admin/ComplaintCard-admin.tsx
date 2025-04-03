import React, { useState } from 'react';
import { Calendar, MessageSquare } from 'lucide-react';
import { Complaint, ReadStatus } from '../../../types/complaint';
import { StatusBadge } from '../StatusBadge';
import { ComplaintDetails } from '../ComplaintDetails';
import { AttachmentGallery } from '../AttachmentGallery';
import { ComplaintModal as Modal } from '../ComplaintModal';
import { RemarksModal } from './RemarksModal';

interface ComplaintCardProps {
  complaint: Complaint;
  onUpdate: (id: string, updates: Partial<Complaint>) => Promise<void>;
  onRemarksUpdate: (complaintId: string, remarks: string, files: File[]) => Promise<void>;
  style?: React.CSSProperties;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  onUpdate,
  onRemarksUpdate,
  style
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemarksModalOpen, setIsRemarksModalOpen] = useState(false);

  const handleResolveClick = async () => {
    setIsLoading(true);
    try {
      await onUpdate(complaint.id, { status: 'resolved' });
    } catch (error) {
      console.error('Error resolving complaint:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemarksSubmit = async (complaintId: string, remarks: string, files: File[]) => {
    try {
      await onRemarksUpdate(complaintId, remarks, files);
      setIsRemarksModalOpen(false);
    } catch (error) {
      console.error('Error updating remarks:', error);
    }
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
    if (complaint.readStatus !== ReadStatus.Viewed) {
      setTimeout(() => {
        onUpdate(complaint.id, { readStatus: ReadStatus.Viewed }).catch((error) => {
          console.error('Error updating read status:', error);
        });
      }, 0);
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300"
      style={style}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 inline-block">
            {(() => {
              const days = Math.floor(
                (new Date().setHours(0, 0, 0, 0) - new Date(complaint.dateSubmitted).setHours(0, 0, 0, 0))
                / (1000 * 60 * 60 * 24)
              );
              return days <= 0 ? 'Today' : `${days} days ago`;
            })()}
          </span>
          <h3 className="text-xl font-semibold text-gray-800">
            {complaint.category === 'Anonymous' ? 'Anonymous Complaint' : `${complaint.scholarNumber}'s Complaint`}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${complaint.readStatus === ReadStatus.Viewed ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="capitalize text-sm">
            {complaint.readStatus === ReadStatus.Viewed ? 'Viewed' : 'Not Viewed'}
          </span>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      {/* Updated button layout with right alignment */}
      <div className="flex flex-wrap items-center justify-end gap-2 mt-6">
        <button
          onClick={handleModalOpen}
          className="flex-shrink-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
        >
          View
        </button>

        <button
          onClick={() => setIsRemarksModalOpen(true)}
          className="flex-shrink-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
        >
          <MessageSquare size={16} className="mr-2" />
          Add Remarks
        </button>

        {complaint.status !== 'resolved' && (
          <button
            onClick={handleResolveClick}
            disabled={isLoading}
            className="flex-shrink-0 flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 text-sm"
          >
            {isLoading ? 'Resolving...' : 'Resolve'}
          </button>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Details "
      >
        <div className="space-y-6">
          <ComplaintDetails complaint={complaint} />
          <AttachmentGallery
            attachments={complaint.attachments}
            adminAttachments={complaint.AdminAttachments}
          />
        </div>
      </Modal>

      <RemarksModal
        complaintId={complaint.id}
        isOpen={isRemarksModalOpen}
        onClose={() => setIsRemarksModalOpen(false)}
        onSubmit={handleRemarksSubmit}
        existingRemarks={complaint.AdminRemarks}
        existingAttachments={complaint.AdminAttachments}
      />
    </div>
  );
};

export default ComplaintCard;