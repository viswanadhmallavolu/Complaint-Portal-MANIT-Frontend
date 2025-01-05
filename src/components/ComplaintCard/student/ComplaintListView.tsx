import React from 'react';
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
  onFilterByDateRange: () => Promise<void>;
  onClearFilters: () => Promise<void>;
  onNavigateBack: () => void;
  getItemSize: (index: number) => number; // Ensure this prop is included
}

const ComplaintListView: React.FC<ComplaintListViewProps> = (props) => {
  if (props.loading && props.complaints.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const Row = ({ index, style }) => (
    <div style={{ ...style, padding: '0.5rem 1rem' }} className="complaint-row">
      <ComplaintCard
        complaint={props.complaints[index]}
        onUpdate={props.onUpdateComplaint}
        onDelete={props.onDeleteComplaint}
      />
    </div>
  );

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
            className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <Calendar size={18} className="mr-2" />
            Filter by Date
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 capitalize">
          {props.category} Complaints
        </h1>

        {props.isFilterOpen && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 transition-all">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Start Date', 'End Date'].map((label, index) => (
                <div className="space-y-2" key={index}>
                  <label className="block text-sm font-medium text-gray-700">{label}</label>
                  <input
                    type="date"
                    value={index === 0 ? props.startDate : props.endDate}
                    onChange={(e) => (index === 0 ? props.onSetStartDate(e.target.value) : props.onSetEndDate(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={props.onFilterByDateRange}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Search size={18} className="mr-2" />
                Apply Filter
              </button>
              <button
                onClick={props.onClearFilters}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <Trash2 size={18} className="mr-2" />
                Clear Filters
              </button>
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