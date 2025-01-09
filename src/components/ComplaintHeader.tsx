import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Clock
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
  setStatistics
}) => {
  const [showStats, setShowStats] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAdvancedInputs, setShowAdvancedInputs] = useState(false);

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
    const cleanedScholarNumbers = filters.scholarNumbers.filter(num => num.trim() !== '');
    const cleanedComplaintIds = filters.complaintIds?.filter(id => id.trim() !== '');
    onFilterUpdate({
      ...filters,
      scholarNumbers: cleanedScholarNumbers.length > 0 ? cleanedScholarNumbers : [''],
      complaintIds: cleanedComplaintIds?.length > 0 ? cleanedComplaintIds : ['']
    });
    setShowFilterModal(false);
    onApplyFilters();
  };

  const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: number, color: string }) => (
    <div className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${color} hover:shadow-md transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-gray-900">{loading ? '-' : value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${color.replace('border', 'bg').replace('-600', '-100')}`}>
          <Icon className={color.replace('border-', 'text-').replace('-600', '-500')} size={24} />
        </div>
      </div>
    </div>
  );

  function TagInput({
    label,
    placeholder,
    tags,
    onChange,
  }: {
    label: string;
    placeholder: string;
    tags: string[];
    onChange: (newTags: string[]) => void;
  }) {
    const [inputValue, setInputValue] = useState("");

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputValue.trim() !== "") {
        if (!tags.includes(inputValue.trim())) {
          onChange([...tags, inputValue.trim()]);
        }
        setInputValue("");
      }
    };

    const handleRemoveTag = (idx: number) => {
      const newTags = [...tags];
      newTags.splice(idx, 1);
      onChange(newTags);
    };

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, i) => (
            <div
              key={i}
              className="flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(i)}
                className="ml-2 text-red-500 text-sm"
              >
                X
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAddTag}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackClick}
            className="flex items-center text-gray-700 hover:text-blue-600 transition-all duration-300 group bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize">
            <span className="bg-blue-100 text-blue-600 px-6 py-2 rounded-full">
              {category}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleFilterModal}
            className={`flex items-center justify-center px-6 py-2.5 rounded-lg transition-all duration-300 shadow-sm ${
              isFilterOpen
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Statistics Overview</h2>
          <button
            onClick={toggleStats}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-all duration-300 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow"
          >
            <span className="mr-2 font-medium">{showStats ? 'Hide' : 'Show'} Details</span>
            {showStats ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 transition-all duration-500 ${
            showStats ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden'
          }`}
        >
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

      {/* Filter Modal */}
      <Modal isOpen={showFilterModal} onClose={toggleFilterModal}>
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800">Filter Complaints</h2>
            <button
              onClick={toggleFilterModal}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Date Range */}
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
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              ))}
            </div>

            {/* Hostel Number (conditional) */}
            {category === 'hostel' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hostel Number
                </label>
                <select
                  value={filters.hostelNumber}
                  onChange={handleInputChange('hostelNumber')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Hostel</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={`H${num}`}>H{num}</option>
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
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Type</option>
                {complaintTypeOptions[category?.toLowerCase() || '']?.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowAdvancedInputs(!showAdvancedInputs)}
              className="mb-4 flex items-center text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {showAdvancedInputs ? 'Hide Advanced Options' : 'Show Advanced Options'}
            </button>

            {showAdvancedInputs && (
              <>
                <TagInput
                  label="Scholar Numbers"
                  placeholder="Press Enter to add"
                  tags={filters.scholarNumbers}
                  onChange={(newTags) => onFilterUpdate({ scholarNumbers: newTags })}
                />
                <TagInput
                  label="Complaint IDs"
                  placeholder="Press Enter to add"
                  tags={filters.complaintIds ?? []}
                  onChange={(newTags) => onFilterUpdate({ complaintIds: newTags })}
                />
              </>
            )}

            {/* Status Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Read Status
                </label>
                <select
                  value={filters.readStatus}
                  onChange={handleInputChange('readStatus')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="Not viewed">Not Viewed</option>
                  <option value="Viewed">Viewed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution Status
                </label>
                <select
                  value={filters.status}
                  onChange={handleInputChange('status')}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
              <button
                onClick={toggleFilterModal}
                className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ComplaintHeader;