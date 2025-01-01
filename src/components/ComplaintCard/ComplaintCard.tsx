import React, { useRef, useState } from 'react';
import { Calendar, Edit, Trash2, MessageSquare } from 'lucide-react';
import { Complaint, ReadStatus } from '../../types/complaint';
import { StatusBadge } from './StatusBadge';
import { ComplaintDetails } from './ComplaintDetails';
import { AttachmentGallery } from './AttachmentGallery';
import { useEffect } from 'react';

interface ComplaintCardProps {
  complaint: Complaint;
  onUpdate: (id: string, updates: Partial<Complaint>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isExpanded?: boolean;
  onExpandToggle?: () => void;
  style?: React.CSSProperties;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  onUpdate,
  onDelete,
  isExpanded = false,
  onExpandToggle,
  style
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (cardRef.current) {
      const newHeight = cardRef.current.scrollHeight;
      setHeight(newHeight);
    }
  }, [isExpanded, complaint]);

  const handleEditClick = async () => {
    setIsLoading(true);
    const updates: Partial<Complaint> = {};
    switch (complaint.category) {
      case 'Hostel':
        updates.description = prompt('Enter new description:', complaint.description) || complaint.description;
        updates.roomNumber = prompt('Enter new room number:', complaint.roomNumber) || complaint.roomNumber;
        break;
      case 'Medical':
      case 'Ragging':
        updates.description = prompt('Enter new description:', complaint.description) || complaint.description;
        break;
      case 'Academic':
        updates.description = prompt('Enter new description:', complaint.description) || complaint.description;
        break;
      case 'Infrastructure':
        updates.description = prompt('Enter new description:', complaint.description) || complaint.description;
        updates.landmark = prompt('Enter new landmark:', complaint.landmark) || complaint.landmark;
        break;
      case 'Administration':
        updates.description = prompt('Enter new description:', complaint.description) || complaint.description;
        break;
    }
    await onUpdate(complaint.id, updates);
    setIsLoading(false);
  };

  return (
    <div 
      ref={cardRef}
      className={`bg-white rounded-xl shadow-sm transition-all duration-300 p-6 border border-gray-200
        ${isExpanded ? 'z-10 relative shadow-lg scale-[1.01]' : 'z-1'}`}
      style={{
        ...style,
        height: isExpanded ? 'auto' : undefined,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 inline-block">
            {`${Math.floor((Date.now() - new Date(complaint.dateSubmitted).getTime()) / (1000 * 60 * 60 * 24))} days ago`}
          </span>
          <h3 className="text-xl font-semibold text-gray-800">
            {complaint.category !== 'Anonymous' && complaint.category !== 'Ragging'
              ? `${complaint.scholarNumber}'s Complaint`
              : 'Anonymous Complaint'}
          </h3>
        </div>
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
        <StatusBadge status={complaint.status} />
      </div>

      <div 
        className={`overflow-hidden transition-all duration-300`}
        style={{
          maxHeight: isExpanded ? '2000px' : '0',
          opacity: isExpanded ? 1 : 0,
          marginBottom: isExpanded ? '1rem' : '0'
        }}
      >
        <ComplaintDetails complaint={complaint} />
        <p className="text-gray-700 leading-relaxed">{complaint.description}</p>

        <div className="flex items-center gap-6 text-sm text-gray-600">
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

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={onExpandToggle}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          {isExpanded ? 'Hide Details' : 'View'}
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleEditClick}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <Edit size={16} className="mr-2" />
            Edit
          </button>
          <button
            onClick={() => onDelete(complaint.id)}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;