import React from 'react';
import { Hash, Building2, School, MapPin } from 'lucide-react';
import { Complaint } from '../../types/complaint';

interface ComplaintDetailsProps {
  complaint: Complaint;
}

export const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({ complaint }) => {
  const renderDetails = () => {
    switch (complaint.category) {
      case 'Hostel':
        return (
          <>
            <DetailItem icon={<Hash />} label="Scholar No" value={complaint.scholarNumber} />
            <DetailItem
              icon={<Building2 />}
              label="Location"
              value={`Hostel ${complaint.hostelNumber}, Room ${complaint.roomNumber}`}
            />
            <DetailItem
              label="Type"
              value={complaint.complaintType.charAt(0).toUpperCase() + complaint.complaintType.slice(1)}
            />
          </>
        );

      case 'Medical':
        return (
          <>
            <DetailItem
              label="Type"
              value={complaint.complaintType.charAt(0).toUpperCase() + complaint.complaintType.slice(1)}
            />
            <DetailItem icon={<Hash />} label="Scholar No" value={complaint.scholarNumber} />
          </>
        );
      case 'Administration':
        return (
          <>
            <DetailItem
              label="Type"
              value={complaint.complaintType.charAt(0).toUpperCase() + complaint.complaintType.slice(1)}
            />
            <DetailItem icon={<Hash />} label="Scholar No" value={complaint.scholarNumber} />
            <DetailItem icon={<School />} label="Department" value={complaint.department} />
          </>
        );


      case 'Academic':
        return (
          <>
            <DetailItem
              label="Type"
              value={complaint.complaintType.charAt(0).toUpperCase() + complaint.complaintType.slice(1)}
            />
            <DetailItem icon={<Hash />} label="Scholar No" value={complaint.scholarNumber} />
            <DetailItem icon={<School />} label="Department" value={complaint.department} />
          </>
        );

      case 'Infrastructure':
        return (
          <>
            <DetailItem
              label="Type"
              value={complaint.complaintType.charAt(0).toUpperCase() + complaint.complaintType.slice(1)}
            />
            <DetailItem icon={<Hash />} label="Scholar No" value={complaint.scholarNumber} />
            <DetailItem icon={<MapPin />} label="Location" value={complaint.landmark} />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {renderDetails()}
    </div>
  );
};

const DetailItem: React.FC<{ icon?: React.ReactNode; label: string; value: string }> = ({
  icon,
  label,
  value
}) => (
  <div className="flex items-center gap-2">
    {icon && <span className="text-gray-400">{React.cloneElement(icon as React.ReactElement, { size: 16 })}</span>}
    <span className="text-sm text-gray-600">
      <span className="font-medium">{label}:</span> {value}
    </span>
  </div>
);