import React, { useState } from 'react';
import { Calendar, Edit, Trash2, MessageSquare } from 'lucide-react';
import { Complaint, ReadStatus } from '../../../types/complaint';
import { StatusBadge } from '../StatusBadge';
import { ComplaintDetails } from '../ComplaintDetails';
import { AttachmentGallery } from '../AttachmentGallery';
import { ComplaintModal as Modal } from '../ComplaintModal';

interface ComplaintCardProps {
  complaint: Complaint;
  onUpdate: (id: string, updates: Partial<Complaint>) => Promise<void>;

  style?: React.CSSProperties;
  onRemarksUpdate: (complaintId: string, remarks: string, files: File[]) => Promise<void>; // Ensure this line exists
}

const StatusIndicator: React.FC<{ status: ReadStatus }> = ({ status }) => {
  const isViewed = status === ReadStatus.Viewed;
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${isViewed ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className="capitalize text-sm">{isViewed ? 'Viewed' : 'Not Viewed'}</span>
    </div>
  );
};

const ActionButtons: React.FC<{
  onEdit: () => void;
  onDelete: () => void;
  isLoading: boolean;
}> = ({ onEdit, onDelete, isLoading }) => (
  <div className="flex gap-3">
    <button
      onClick={onEdit}
      disabled={isLoading}
      className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
    >
      <Edit size={16} className="mr-2" />
      Edit
    </button>
    <button
      onClick={onDelete}
      disabled={isLoading}
      className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
    >
      <Trash2 size={16} className="mr-2" />
      Delete
    </button>
  </div>
);

const ComplaintHeader: React.FC<{ complaint: Complaint }> = ({ complaint }) => {
  const daysAgo = Math.floor(
    (Date.now() - new Date(complaint.dateSubmitted).getTime()) / (1000 * 60 * 60 * 24)
  );
  const isAnonymous = complaint.category === 'Anonymous' || complaint.category === 'Ragging';
  const headerText = isAnonymous ? 'Anonymous Complaint' : `${complaint.scholarNumber}'s Complaint`;

  return (
    <div className="flex justify-between items-start mb-6">
      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 inline-block">
          {`${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`}
        </span>
        <h3 className="text-xl font-semibold text-gray-800">{headerText}</h3>
      </div>
      <StatusIndicator status={complaint.readStatus as ReadStatus} />
      <StatusBadge status={complaint.status} />
    </div>
  );
};

const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  onUpdate,
  style
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = async () => {
    setIsLoading(true);
    const updates: Partial<Complaint> = {};

    const prompts: { [key: string]: string } = {
      Hostel: 'Enter new room number:',
      Infrastructure: 'Enter new landmark:',
    };

    updates.description = prompt('Enter new description:', complaint.description) || complaint.description;

    if (prompts[complaint.category]) {
      const additionalField = prompt(prompts[complaint.category], (complaint as any)[complaint.category === 'Hostel' ? 'roomNumber' : 'landmark'] || '');
      if (additionalField) {
        updates[complaint.category === 'Hostel' ? 'roomNumber' : 'landmark'] = additionalField;
      }
    }

    await onUpdate(complaint.id, updates);
    setIsLoading(false);
  };



  const handleModalOpen = () => {
    // Open modal immediately
    setIsModalOpen(true);

    // Update read status if not viewed
    if (complaint.readStatus !== ReadStatus.Viewed) {
      onUpdate(complaint.id, { readStatus: ReadStatus.Viewed }).catch((error) => {
        console.error('Error updating read status:', error);
      });
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300"
      style={style}
    >
      <ComplaintHeader complaint={complaint} />

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handleModalOpen}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          View
        </button>


      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title='Complaint Details'
      >
        <div className="space-y-6">
          <ComplaintDetails complaint={complaint} />

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{complaint.description}</p>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-6 text-sm text-gray-600">
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
        </div>
      </Modal>
    </div>
  );
};

export default ComplaintCard;