import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Clock
} from 'lucide-react';

import { ComplaintFilters } from '../types/complaint';
import Modal from './Modal';
import ComplaintFiltersModal from './ComplaintFiltersModal';

const complaintTypeOptions: Record<string, string[]> = {
  hostel: ['Maintenance', 'Hygiene', 'Security', 'Mess', 'Bathroom', 'Room', 'Noise', 'Other'],
  medical: ['Doctor', 'Medicine', 'Ambulance', 'Other'],
  infrastructure: ['Electricity', 'Water', 'Internet', 'Bus', 'Classroom', 'Library', 'Sports', 'Lab', 'Other'],
  administration: ['Documents', 'Accounts', 'Scholarship', 'Details', 'Other'],
  academic: ['Timetable', 'Course', 'Faculty', 'Other'],
  ragging: []
};

interface ComplaintHeaderProps {
  category: string;
  loading: boolean;
  isFilterOpen: boolean;
  statistics: any;
  filters: ComplaintFilters;
  onBackClick: () => void;
  onFilterClick: () => void;
  onFilterUpdate: (filters: Partial<ComplaintFilters>) => void;
  onApplyFilters: () => void;
  setStatistics: any;
  role?: string; // Added role prop
}

const ComplaintHeader: React.FC<ComplaintHeaderProps> = ({
  category,
  loading,
  statistics,
  filters,
  onBackClick,
  onFilterUpdate,
  onApplyFilters,
  setStatistics,
  role  // Destructure role
}) => {
  const [showStats, setShowStats] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const toggleStats = () => setShowStats(!showStats);
  const toggleFilterModal = () => setShowFilterModal(!showFilterModal);

  // Compute flag: if role is a warden then the hostel number is fixed (do not allow selection)
  const WARDEN_ROLES = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H12'];
  const allowHostelSelect = !(role && WARDEN_ROLES.includes(role));

  useEffect(() => {
    onFilterUpdate({ complaintType: '' });
  }, [category]);

  const handleInputChange = (field: keyof ComplaintFilters) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onFilterUpdate({ [field]: e.target.value });
  };

  const handleApplyFilters = () => {
    const cleanedScholarNumbers = filters.scholarNumbers.filter(num => num.trim() !== '');
    const cleanedComplaintIds = filters.complaintIds?.filter(id => id.trim() !== '');

    // Update filters with cleaned data
    onFilterUpdate({
      ...filters,
      scholarNumbers: cleanedScholarNumbers,
      complaintIds: cleanedComplaintIds
    });

    // Close modal and trigger filter application
    toggleFilterModal();
    onApplyFilters();
  };

  const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: number, color: string }) => (
    <div className={`bg-white/90 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-sm border-l-4 ${color} hover:shadow-md transition-all duration-300 flex-shrink-0 w-[240px] sm:w-auto transform hover:-translate-y-1`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1 font-medium">{label}</p>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{loading ? '-' : value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${color.replace('border', 'bg').replace('-600', '-100')}`}>
          <Icon className={color.replace('border-', 'text-').replace('-600', '-500')} size={20} />
        </div>
      </div>
    </div>
  );

  const complaintTypesOptions = (category.toLowerCase() === 'medical_admin')
    ? [...complaintTypeOptions.medical].sort()
    : (complaintTypeOptions[category?.toLowerCase() || ''] || []);

  return (
    <div className="bg-gradient-to-br from-blue-100 to-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8 border border-gray-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onBackClick}
            className="flex items-center text-white hover:text-white transition-all duration-300 group bg-black/40 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg shadow-sm hover:shadow"
          >
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
          <div className="text-xl sm:text-3xl font-bold text-gray-800 capitalize max-w-full overflow-hidden">
            <span className="bg-blue-100/90 backdrop-blur-sm text-blue-600 px-4 sm:px-6 py-2 rounded-full shadow-sm inline-block truncate max-w-[200px] sm:max-w-[300px] md:max-w-none">
              {category}
            </span>
          </div>
        </div>
        <button
          onClick={toggleFilterModal}
          className="flex items-center justify-center px-4 sm:px-6 py-2 rounded-lg transition-all duration-300 shadow-sm w-full sm:w-auto bg-black/40 text-white hover:bg-black/50"
        >
          <Filter size={18} className="mr-2" />
          Filters
        </button>
      </div>

      {/* Statistics Section */}
      <div className="mt-4 sm:mt-6">
        <div className="flex items-center justify-end mb-4 sm:mb-6">
          <button
            onClick={toggleStats}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-all duration-300 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm hover:shadow"
          >
            <span className="mr-2 font-medium">{showStats ? 'Hide' : 'Show'} Statistics</span>
            {showStats ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        <div
          className={`transition-all duration-500 ${showStats ? 'opacity-100 max-h-[800px]' : 'opacity-0 max-h-0 overflow-hidden'
            }`}
        >
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex flex-nowrap gap-3 sm:gap-4 min-w-full sm:grid sm:grid-cols-2 lg:grid-cols-5">
              <StatCard
                icon={AlertCircle}
                label="Total Complaints"
                value={statistics.totalComplaints}
                color="border-blue-600"
              />
              <StatCard
                icon={CheckCircle2}
                label="Resolved"
                value={statistics.resolvedComplaints}
                color="border-green-600"
              />
              <StatCard
                icon={Clock}
                label="Unresolved"
                value={statistics.unresolvedComplaints}
                color="border-yellow-600"
              />
              <StatCard
                icon={Eye}
                label="Viewed"
                value={statistics.viewedComplaints}
                color="border-purple-600"
              />
              <StatCard
                icon={EyeOff}
                label="Not Viewed"
                value={statistics.notViewedComplaints}
                color="border-red-600"
              />
            </div>
          </div>
        </div>
      </div>

      <ComplaintFiltersModal
        isOpen={showFilterModal}
        toggleModal={toggleFilterModal}
        filters={filters}
        handleInputChange={handleInputChange}
        onFilterUpdate={onFilterUpdate}
        handleApplyFilters={handleApplyFilters}
        category={category}
        complaintTypesOptions={complaintTypesOptions}
        allowHostelSelect={allowHostelSelect}  // Pass new flag
      />
    </div>
  );
};

export default ComplaintHeader;