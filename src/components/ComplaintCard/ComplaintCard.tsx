import React from 'react';
import { Calendar, Edit, Trash2 } from 'lucide-react';
import { Complaint, ReadStatus } from '../../types/complaint';
import { StatusBadge } from './StatusBadge';
import { ComplaintDetails } from './ComplaintDetails';
import { AttachmentGallery } from './AttachmentGallery';

interface ComplaintCardProps {
  complaint: Complaint;
  onUpdate: (id: string, updates: Partial<Complaint>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onUpdate, onDelete }) => {
  const handleEditClick = () => {
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
    onUpdate(complaint.id, updates);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 inline-block">
            {complaint.category}
          </span>
          <h3 className="text-xl font-semibold text-gray-800">
            {complaint.category !== 'Anonymous' && complaint.category !== 'Ragging' 
              ? `${complaint.studentName}'s Complaint`
              : 'Anonymous Complaint'}
          </h3>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      <ComplaintDetails complaint={complaint} />
      
      <p className="text-gray-600 mb-6 leading-relaxed">{complaint.description}</p>
      
      <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <span>{new Date(complaint.dateSubmitted).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${
            complaint.readStatus === ReadStatus.Viewed ? 'bg-green-400' : 'bg-red-400'
          }`} />
          <span className="capitalize">{complaint.readStatus}</span>
        </div>
      </div>

      <AttachmentGallery attachments={complaint.attachments} />

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleEditClick}
          className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
        >
          <Edit size={16} className="mr-2" />
          Edit
        </button>
        <button
          onClick={() => onDelete(complaint.id)}
          className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
        >
          <Trash2 size={16} className="mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default ComplaintCard;