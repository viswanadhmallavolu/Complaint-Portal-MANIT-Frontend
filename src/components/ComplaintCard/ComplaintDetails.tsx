import React from 'react';
import { 
  Ticket, 
  Building, 
  School, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  MessageCircle, 
  FileText,
  Calendar,
  User,
  AlertCircle,
  CheckCircle2,
  Building2,
  Landmark,
  BookMarked,
  HelpCircle,
  ClipboardList
} from 'lucide-react';
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
          <DetailItem icon={<BookMarked className="text-purple-600" />} label="Stream" value={stream} />
        )}
        {year && (
          <DetailItem icon={<GraduationCap className="text-blue-600" />} label="Year" value={year} />
        )}
      </>
    );
  };

  const renderAdminRemarks = (remarks?: string) => {
    if (!remarks) return null;
    return (
      <div className="col-span-full mt-3 w-full">
        <DetailItem 
          icon={<MessageCircle className="text-indigo-600" />} 
          label="Admin Remarks" 
          value={remarks}
          className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg shadow-md break-words border border-indigo-100"
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
            icon={<Ticket className="text-blue-600" />} 
          />
        </div>
        
        {complaint.resolvedAt && (
          <DetailItem 
            label="Resolved On" 
            value={new Date(complaint.resolvedAt).toLocaleString()} 
            icon={<CheckCircle2 className="text-green-600" />} 
          />
        )}
        
        <div className="col-span-full mb-4">
          <label className="text-sm font-semibold text-gray-700">Description</label>
          <p className="mt-1 text-md text-gray-600">{complaint.description}</p>
        </div>
        
        {(() => {
          switch (complaint.category) {
            case 'Hostel':
              return (
                <>
                  <DetailItem 
                    icon={<Building2 className="text-amber-600" />} 
                    label="Location" 
                    value={`Hostel ${complaint.hostelNumber}, Room ${complaint.roomNumber}`} 
                  />
                  <DetailItem
                    label="Type"
                    value={complaint.complaintType.charAt(0).toUpperCase() + complaint.complaintType.slice(1)}
                    icon={<ClipboardList className="text-purple-600" />}
                  />
                  
                </>
              );

            case 'Medical':
              return (
                <>
                  <DetailItem
                    label="Type"
                    value={complaint.complaintType.charAt(0).toUpperCase() + complaint.complaintType.slice(1)}
                    icon={<AlertCircle className="text-red-600" />}
                  />
                  <DetailItem 
                    icon={<User className="text-indigo-600" />} 
                    label="Scholar No" 
                    value={complaint.scholarNumber} 
                  />
                  {renderEducationDetails(complaint.stream, complaint.year)}
                  
                </>
              );

            case 'Administration':
              return (
                <>
                  <DetailItem
                    label="Type"
                    value={complaint.complaintType.charAt(0).toUpperCase() + complaint.complaintType.slice(1)}
                    icon={<Landmark className="text-teal-600" />}
                  />
                  <DetailItem 
                    icon={<User className="text-indigo-600" />} 
                    label="Scholar No" 
                    value={complaint.scholarNumber} 
                  />
                  <DetailItem 
                    icon={<Building className="text-violet-600" />} 
                    label="Department" 
                    value={complaint.department} 
                  />
                  {renderEducationDetails(complaint.stream, complaint.year)}
                  
                </>
              );

            case 'Academic':
              return (
                <>
                  <DetailItem
                    label="Type"
                    value={complaint.complaintType.charAt(0).toUpperCase() + complaint.complaintType.slice(1)}
                    icon={<BookOpen className="text-emerald-600" />}
                  />
                  <DetailItem 
                    icon={<User className="text-indigo-600" />} 
                    label="Scholar No" 
                    value={complaint.scholarNumber} 
                  />
                  <DetailItem 
                    icon={<School className="text-blue-600" />} 
                    label="Department" 
                    value={complaint.department} 
                  />
                  {renderEducationDetails(complaint.stream, complaint.year)}
                  
                </>
              );

            case 'Infrastructure':
              return (
                <>
                  <DetailItem
                    label="Type"
                    value={complaint.complaintType.charAt(0).toUpperCase() + complaint.complaintType.slice(1)}
                    icon={<Building className="text-orange-600" />}
                  />
                  <DetailItem 
                    icon={<MapPin className="text-rose-600" />} 
                    label="Location" 
                    value={complaint.landmark} 
                  />
                  
                </>
              );

            default:
              return (
                <DetailItem
                  label="Unknown Category"
                  value="Category not recognized"
                  icon={<HelpCircle className="text-gray-600" />}
                />
              );
          }
        })()}
      </>
    );
  };

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50 shadow-xl rounded-2xl p-8 overflow-y-auto max-h-screen border border-gray-100">
      {/* <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <ClipboardList className="text-blue-600" />
         Category : {category} 
      </h2> */}
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
  <div className={`flex items-start gap-4 w-full p-4 bg-white rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md ${className} text-sm group`}>
    {icon && (
      <span className="text-gray-700 mt-1 shrink-0 group-hover:scale-110 transition-transform duration-300">
        {React.cloneElement(icon as React.ReactElement, { size: 24 })}
      </span>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      <p className="mt-1 text-sm text-gray-600 break-words">{value}</p>
    </div>
  </div>
);