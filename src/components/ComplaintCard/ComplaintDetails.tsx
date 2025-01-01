import React from 'react';
import { Hash, Building2, School, MapPin, GraduationCap, BookOpen, MessageSquare } from 'lucide-react';
import { Complaint } from '../../types/complaint';

interface ComplaintDetailsProps {
  complaint: Complaint;
  isLoading?: boolean;
}

const SkeletonDetailItem = () => (
  <div className="flex items-center gap-2 animate-pulse w-full">
    <div className="w-4 h-4 bg-gray-200 rounded-full shrink-0"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-[80%] sm:w-32"></div>
    </div>
  </div>
);

export const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({ complaint, isLoading = false }) => {
  const renderEducationDetails = (stream?: string, year?: string) => {
    if (!stream && !year) return null;
    return (
      <>
        {stream && (
          <DetailItem icon={<GraduationCap />} label="Stream" value={stream} />
        )}
        {year && (
          <DetailItem icon={<BookOpen />} label="Year" value={year} />
        )}
      </>
    );
  };

  const renderAdminRemarks = (remarks?: string) => {
    if (!remarks) return null;
    return (
      <div className="col-span-full mt-2 w-full">
        <DetailItem 
          icon={<MessageSquare />} 
          label="Admin Remarks" 
          value={remarks}
          className="text-indigo-600 font-medium break-words"
        />
      </div>
    );
  };

  const renderSkeletons = () => (
    <>
      <SkeletonDetailItem />
      <SkeletonDetailItem />
      <SkeletonDetailItem />
      <SkeletonDetailItem />
    </>
  );

  const renderDetails = () => {
    if (isLoading) {
      return renderSkeletons();
    }

    return (
      <>
        {complaint.resolvedAt && (
          <DetailItem 
            label="Resolved On" 
            value={new Date(complaint.resolvedAt).toLocaleString()} 
          />
        )}
        {(() => {
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
                  {renderAdminRemarks(complaint.AdminRemarks)}
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
                  {renderEducationDetails(complaint.stream, complaint.year)}
                  {renderAdminRemarks(complaint.AdminRemarks)}
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
                  {renderEducationDetails(complaint.stream, complaint.year)}
                  {renderAdminRemarks(complaint.AdminRemarks)}
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
                  {renderEducationDetails(complaint.stream, complaint.year)}
                  {renderAdminRemarks(complaint.AdminRemarks)}
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
                  {renderAdminRemarks(complaint.AdminRemarks)}
                </>
              );

            default:
              return null;
          }
        })()}
      </>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 w-full">
      {renderDetails()}
    </div>
  );
};

const DetailItem: React.FC<{ 
  icon?: React.ReactNode; 
  label: string; 
  value: string;
  className?: string;
}> = ({
  icon,
  label,
  value,
  className = ''
}) => (
  <div className={`flex items-center gap-2 w-full min-w-0 p-2 rounded-lg hover:bg-gray-50 transition-colors ${className}`}>
    {icon && <span className="text-gray-900 shrink-0">{React.cloneElement(icon as React.ReactElement, { size: 16 })}</span>}
    <span className="text-sm text-gray-600 truncate">
      <span className="font-medium">{label}:</span> <span className="break-words">{value}</span>
    </span>
  </div>
);