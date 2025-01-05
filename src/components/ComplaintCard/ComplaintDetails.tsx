import React from 'react';
import { Hash, Building2, School, MapPin, GraduationCap, BookOpen, MessageSquare } from 'lucide-react';
import { Complaint } from '../../types/complaint';
import { useParams } from 'react-router-dom';

interface ComplaintDetailsProps {
  complaint: Complaint;
  isLoading?: boolean;
}

const SkeletonDetailItem = () => (
  <div className="flex items-center gap-3 animate-pulse w-full">
    <div className="w-5 h-5 bg-gray-300 rounded-full shrink-0"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-300 rounded w-3/4 sm:w-1/2"></div>
    </div>
  </div>
);

export const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({ complaint, isLoading = false }) => {
  const category = useParams<{ category: string }>().category;
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
      <div className="col-span-full mt-3 w-full">
        <DetailItem 
          icon={<MessageSquare />} 
          label="Admin Remarks" 
          value={remarks}
          className="text-indigo-700 bg-indigo-100 p-4 rounded-lg shadow-md break-words"
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
      <SkeletonDetailItem />
    </>
  );

  const renderDetails = () => {
    if (isLoading) {
      return renderSkeletons();
    }

    return (
      <>
        <div className="col-span-full">
          <DetailItem 
            label="Complaint ID" 
            value={complaint.id} 
            icon={<Hash className="text-blue-500" />} 
          />
        </div>
        {complaint.resolvedAt && (
          <DetailItem 
            label="Resolved On" 
            value={new Date(complaint.resolvedAt).toLocaleString()} 
            icon={<Hash className="text-green-500" />} 
          />
        )}
        {(() => {
          switch (complaint.category) {
            case 'Hostel':
              return (
                <>
                  <DetailItem icon={<Building2 className="text-orange-500" />} label="Location" value={`Hostel ${complaint.hostelNumber}, Room ${complaint.roomNumber}`} />
                  <DetailItem
                    label="Type"
                    value={complaint.complaintType.charAt(0).toUpperCase() + complaint.complaintType.slice(1)}
                    icon={<Hash className="text-purple-500" />}
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
                    icon={<Hash className="text-red-500" />}
                  />
                  <DetailItem icon={<Hash className="text-yellow-500" />} label="Scholar No" value={complaint.scholarNumber} />
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
                    icon={<Hash className="text-teal-500" />}
                  />
                  <DetailItem icon={<Hash className="text-pink-500" />} label="Scholar No" value={complaint.scholarNumber} />
                  <DetailItem icon={<School className="text-indigo-500" />} label="Department" value={complaint.department} />
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
                    icon={<Hash className="text-gray-700" />}
                  />
                  <DetailItem icon={<Hash className="text-green-600" />} label="Scholar No" value={complaint.scholarNumber} />
                  <DetailItem icon={<School className="text-blue-600" />} label="Department" value={complaint.department} />
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
                    icon={<MapPin className="text-purple-600" />}
                  />
                  <DetailItem icon={<MapPin className="text-pink-600" />} label="Location" value={complaint.landmark} />
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
    <div className="bg-gradient-to-r from-white to-gray-100 shadow-lg rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{category}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderDetails()}
      </div>
    </div>
  );
};

interface DetailItemProps { 
  icon?: React.ReactNode; 
  label: string; 
  value: string;
  className?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({
  icon,
  label,
  value,
  className = ''
}) => (
  <div className={`flex items-start gap-4 w-full p-5 bg-white rounded-xl hover:bg-blue-50 transition-colors shadow-sm ${className}`}>
    {icon && (
      <span className="text-gray-700 mt-1 shrink-0">
        {React.cloneElement(icon as React.ReactElement, { size: 24 })}
      </span>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      <p className="mt-1 text-sm text-gray-600 break-words">{value}</p>
    </div>
  </div>
);