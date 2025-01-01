import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  Plus
} from 'lucide-react';

import { ComplaintFilters } from '../types/complaint';
import Modal from './Modal';


const complaintTypeOptions: Record<string, string[]> = {
  hostel: ['Maintenance','Hygiene','Security','Mess','Bathroom','Room','Noise','Other'],
  medical: ['Doctor','Medicine','Ambulance','Other'],
  infrastructure: ['Electricity','Water','Internet','Bus','Classroom','Library','Sports','Lab','Other'],
  administration: ['Documents','Accounts','Scholarship','Details','Other'],
  academic: ['Timetable','Course','Faculty','Other'],
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
  // categoryStats: any;
  setStatistics: any;
}

const ComplaintHeader: React.FC<ComplaintHeaderProps> = ({
  category,
  loading,
  isFilterOpen,
  statistics,
  filters,
  onBackClick,
  onFilterClick,
  onFilterUpdate,
  onApplyFilters,
  // categoryStats,
  setStatistics
}) => {
  const [showStats, setShowStats] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const toggleStats = () => setShowStats(!showStats);
  const toggleFilterModal = () => setShowFilterModal(!showFilterModal);

  useEffect(() => {
    onFilterUpdate({ complaintType: '' });
  }, [category]);

  const handleInputChange = (field: keyof ComplaintFilters) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onFilterUpdate({ [field]: e.target.value });
  };

  const handleApplyFilters = () => {
    // Validate and clean up scholar numbers before applying
    const cleanedScholarNumbers = filters.scholarNumbers.filter(num => num.trim() !== '');
    onFilterUpdate({ 
        ...filters,
        scholarNumbers: cleanedScholarNumbers.length > 0 ? cleanedScholarNumbers : ['']
    });
    setShowFilterModal(false);
    onApplyFilters();
  };

  

  return (
    <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl shadow-sm p-4 sm:p-6 mb-8 z-[1000] ">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={onBackClick}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-all duration-300 group"
        >
          <ArrowLeft
            size={20}
            className="mr-2 group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-medium">Back to Categories</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleFilterModal}
            className={`flex items-center justify-center px-5 py-2.5 rounded-lg transition-all duration-300 ${
              isFilterOpen
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Filter size={18} className="mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Filter Modal */}
      <Modal isOpen={showFilterModal} onClose={toggleFilterModal}>
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Filter Complaints</h2>
            <button
              onClick={toggleFilterModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          

          <div className="space-y-6">
            {/* Date filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {['startDate', 'endDate'].map(key => (
                <div className="space-y-2" key={key}>
                  <label className="block text-sm font-medium text-gray-700">
                    {key === 'startDate' ? 'Start Date' : 'End Date'}
                  </label>
                  <input
                    type="date"
                    value={filters[key as keyof typeof filters] as string}
                    onChange={handleInputChange(key as keyof ComplaintFilters)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              ))}
            </div>
            {/* If the category is Hostel then also include dropdown field for the HostelNumber */}
            {category === 'hostel' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hostel Number
                </label>
                <select
                  value={filters.hostelNumber}
                  onChange={handleInputChange('hostelNumber')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Hostel</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={`H${num}`}>
                      H{num}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Complaint Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complaint Type
              </label>
              <select
                value={filters.complaintType}
                onChange={handleInputChange('complaintType')}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Type</option>
                {complaintTypeOptions[category?.toLowerCase() || '']?.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Scholar Numbers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scholar Numbers
              </label>
              <div className="space-y-3">
                {filters.scholarNumbers.map((num, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      maxLength={10}
                      value={num}
                      onChange={(e) =>
                        onFilterUpdate({ scholarNumbers: filters.scholarNumbers.map((n, i) => i === index ? e.target.value : n) })
                      }
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="10-digit Scholar Number"
                    />
                    {filters.scholarNumbers.length > 1 && (
                      <button
                        onClick={() => onFilterUpdate({ scholarNumbers: filters.scholarNumbers.filter((_, i) => i !== index) })}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => onFilterUpdate({ scholarNumbers: [...filters.scholarNumbers, ''] })}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Plus size={20} className="mr-1" />
                  Add Another Scholar Number
                </button>
              </div>
            </div>

            {/* Status Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Read Status
                </label>
                <select
                  value={filters.readStatus}
                  onChange={handleInputChange('readStatus')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="Not viewed">Not Viewed</option>
                  <option value="Viewed">Viewed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={handleInputChange('status')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            {/* Apply Button */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={toggleFilterModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Statistics Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize">
            <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-lg mr-3">
              {category}
            </span>
          </h1>
          <button
            onClick={toggleStats}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-all duration-300"
          >
            <span className="mr-2 font-medium">Statistics</span>
            {showStats ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        <div
          className={`transition-all duration-300 overflow-hidden ${
            showStats
              ? 'max-h-96 opacity-100'
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4">
            {/* Statistics Cards */}
            {[
              { label: 'Total Complaints', value: statistics.totalComplaints },
              { label: 'Resolved', value: statistics.resolvedComplaints },
              { label: 'Unresolved', value: statistics.unresolvedComplaints },
              { label: 'Viewed', value: statistics.viewedComplaints },
              { label: 'Not Viewed', value: statistics.notViewedComplaints }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-xl transition hover:shadow-md"
              >
                {loading ? (
                  <div className="animate-pulse flex flex-col space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-gray-500">{stat.label}</h3>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintHeader;