import React, { useState, useCallback, memo } from 'react';
import { ArrowLeft, Calendar, Search, Trash2 } from 'lucide-react';
import { VariableSizeList as List } from 'react-window';
import { Complaint } from '../../../types/complaint';
import ComplaintCard from './ComplaintCard';

interface ComplaintListViewProps {
  category: string;
  complaints: Complaint[];
  loading: boolean;
  error: string | null;
  startDate: string;
  endDate: string;
  isFilterOpen: boolean;
  windowWidth: number;
  onSetStartDate: (date: string) => void;
  onSetEndDate: (date: string) => void;
  onSetIsFilterOpen: (isOpen: boolean) => void;
  onUpdateComplaint: (id: string, updates: Partial<Complaint>) => Promise<void>;
  onDeleteComplaint: (id: string) => Promise<void>;
  onFilterByDateRange: (
    complaintIds: string[],
    complaintType: string,
    status: string,
    readStatus: string
  ) => Promise<void>;
  onClearFilters: () => Promise<void>;
  onNavigateBack: () => void;
  getItemSize: (index: number) => number;
  complaintType: string;
  status: string;
  readStatus: string;
  complaintIds: string[];
  onSetComplaintType: (type: string) => void;
  onSetStatus: (status: string) => void;
  onSetReadStatus: (status: string) => void;
  onSetComplaintIds: (ids: string[]) => void;
}

const complaintTypeOptions: Record<string, string[]> = {
  hostel: ['Maintenance','Hygiene','Security','Mess','Bathroom','Room','Noise','Other'],
  medical: ['Doctor','Medicine','Ambulance','Other'],
  infrastructure: ['Electricity','Water','Internet','Bus','Classroom','Library','Sports','Lab','Other'],
  administration: ['Documents','Accounts','Scholarship','Details','Other'],
  academic: ['Timetable','Course','Faculty','Other'],
  ragging: [],
  '': []
};

interface TagInputProps {
  label: string;
  placeholder: string;
  tags: string[];
  onChange: (newTags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ label, placeholder, tags, onChange }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      if (!tags.includes(inputValue.trim())) {
        onChange([...tags, inputValue.trim()]);
      }
      setInputValue("");
    }
  }, [inputValue, tags]);

  const handleRemoveTag = useCallback((idx: number) => {
    const newTags = [...tags];
    newTags.splice(idx, 1);
    onChange(newTags);
  }, [tags]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
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
              ×
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
};

const ComplaintListView: React.FC<ComplaintListViewProps> = (props) => {
  if (props.loading && props.complaints.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const Row = memo(({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={{ ...style, padding: '0.5rem 1rem' }} className="complaint-row">
      <ComplaintCard
        complaint={props.complaints[index]}
        onUpdate={props.onUpdateComplaint}
        onDelete={props.onDeleteComplaint}
      />
    </div>
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <button
            onClick={props.onNavigateBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4 sm:mb-0"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Categories
          </button>

            <button
            onClick={() => props.onSetIsFilterOpen(!props.isFilterOpen)}
            className="flex items-center justify-center px-4 py-2 bg-black/30 backdrop-blur-sm text-white rounded-lg shadow-sm hover:bg-black/40 transition-colors border border-gray-600"
            >
            Filters
            </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 capitalize">
          {props.category} Complaints
        </h1>

        {props.isFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm sm:max-w-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button onClick={() => props.onSetIsFilterOpen(false)}>
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={props.startDate}
                    onChange={(e) => props.onSetStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={props.endDate}
                    onChange={(e) => props.onSetEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Complaint Type</label>
                  <select
                    value={props.complaintType}
                    onChange={(e) => props.onSetComplaintType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Type</option>
                    {complaintTypeOptions[props.category?.toLowerCase() || ''].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={props.status}
                    onChange={(e) => props.onSetStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Read Status</label>
                  <select
                    value={props.readStatus}
                    onChange={(e) => props.onSetReadStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Read Status</option>
                    <option value="Viewed">Viewed</option>
                    <option value="Not Viewed">Not Viewed</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <TagInput
                    label="Complaint IDs"
                    placeholder="Press Enter to add complaint ID"
                    tags={props.complaintIds}
                    onChange={props.onSetComplaintIds}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={props.onClearFilters}
                  className="bg-gray-100 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    props.onFilterByDateRange(props.complaintIds, props.complaintType, props.status, props.readStatus);
                    props.onSetIsFilterOpen(false);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {props.error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {props.error}
          </div>
        ) : props.complaints.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="max-w-md mx-auto">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">No complaints found in this category.</p>
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-200px)]">
            <List
              height={window.innerHeight - 200}
              itemCount={props.complaints.length}
              itemSize={props.getItemSize}
              width="100%"
              className="list-container"
              overscanCount={3}
              style={{ position: 'relative' }}
            >
              {Row}
            </List>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintListView;