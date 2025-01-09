import React from 'react';
import { Download } from 'lucide-react';
import { COMPLAINT_CATEGORIES } from '../../constants/categories';

interface LogsSectionProps {
    category: string;
    setCategory: (value: string) => void;
    setStartDate: (date: Date | null) => void;
    setEndDate: (date: Date | null) => void;
    onDownload: () => void;
  }
  
  export const LogsSection: React.FC<LogsSectionProps> = ({
    category,
    setCategory,
    setStartDate,
    setEndDate,
    onDownload,
  }) => {
    return (
      <section className="bg-white rounded-lg shadow-md p-6 z-[1]">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Download Logs</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
              >
                <option value="">Select category</option>
                {COMPLAINT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                onChange={(e) => setStartDate(e.target.valueAsDate)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                onChange={(e) => setEndDate(e.target.valueAsDate)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>
          <button
            onClick={onDownload}
            className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Download Logs
          </button>
        </div>
      </section>
    );
  };