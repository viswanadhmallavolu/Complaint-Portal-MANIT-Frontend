import React from 'react';
import { Calendar, User, MapPin, School, Building2, Hash, Edit, Trash2 } from 'lucide-react';
import { Complaint, HostelComplaint } from '../types/complaint';

interface ComplaintCardProps {
  complaint: Complaint;
  onUpdate: (id: string, updates: Partial<Complaint>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onUpdate, onDelete }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
  };

  const renderComplaintDetails = () => {
    switch (complaint.category) {
      case 'Hostel':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Hash className="text-gray-400" size={16} />
              <span className="text-sm text-gray-600">Scholar No: {complaint.scholarNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="text-gray-400" size={16} />
              <span className="text-sm text-gray-600">
                Hostel {complaint.hostelNumber}, Room {complaint.roomNumber}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                Type: {complaint.complaintType.charAt(0) + complaint.complaintType.slice(1)}
              </span>
            </div>
          </div>
        );

      case 'Medical':
      case 'Academic':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Hash className="text-gray-400" size={16} />
              <span className="text-sm text-gray-600">Scholar No: {complaint.scholarNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <School className="text-gray-400" size={16} />
              <span className="text-sm text-gray-600">Dept: {complaint.department}</span>
            </div>
          </div>
        );

      case 'Infrastructure':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Hash className="text-gray-400" size={16} />
              <span className="text-sm text-gray-600">Scholar No: {complaint.scholarNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="text-gray-400" size={16} />
              <span className="text-sm text-gray-600">Location: {complaint.landmark}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const openImage = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleEditClick = () => {
    const updates: Partial<Complaint> = {};
    switch (complaint.category) {
      case 'Hostel':
        updates.description = prompt('Enter new description:', complaint.description) || complaint.description;
        updates.roomNumber = prompt('Enter new room number:', (complaint as HostelComplaint).roomNumber) || (complaint as HostelComplaint).roomNumber;
        break;
      case 'Medical':
      case 'Ragging':
        updates.description = prompt('Enter new description:', complaint.description) || complaint.description;
        break;
      case 'Academic':
        updates.description = prompt('Enter new description:', complaint.description) || complaint.description;
        updates.department = prompt('Enter new department:', complaint.department) || complaint.department;
        break;
      case 'Infrastructure':
        updates.description = prompt('Enter new description:', complaint.description) || complaint.description;
        updates.landmark = prompt('Enter new landmark:', complaint.landmark) || complaint.landmark;
        break;
      default:
        break;
    }
    onUpdate(complaint.id, updates);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 mb-2 inline-block">
            {complaint.category}
          </span>
          <h3 className="text-xl font-semibold text-gray-800">
            {complaint.category !== 'Anonymous' && complaint.category !== 'Ragging' 
              ? `${complaint.studentName}'s Complaint`
              : 'Anonymous Complaint'}
          </h3>
        </div>
        <span 
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusColors[complaint.status]
          }`}
        >
          {complaint.status.charAt(0) + complaint.status.slice(1)}
        </span>
      </div>

      {renderComplaintDetails()}
      
      <p className="text-gray-600 mb-4">{complaint.description}</p>
      
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <Calendar size={16} />
          <span>{new Date(complaint.dateSubmitted).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600">Read Status: {complaint.readStatus}</span>
        </div>
      </div>

      {complaint.attachments && complaint.attachments.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {complaint.attachments.map((attachment, index) => (
              <div 
                key={index} 
                className="relative group cursor-pointer"
                onClick={() => openImage(attachment)}
              >
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={attachment}
                    alt={`Attachment ${index + 1}`}
                    className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    View
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={handleEditClick}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Edit size={16} className="mr-1" />
          Edit
        </button>
        <button
          onClick={() => onDelete(complaint.id)}
          className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <Trash2 size={16} className="mr-1" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default ComplaintCard;