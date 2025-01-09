import React from 'react';
import { AnalyticsData } from '../../types/analytics';
import { FaListAlt } from 'react-icons/fa';

interface CategoryMetricsProps {
  data: AnalyticsData;
  resolutionData: any;
}

export const CategoryMetrics = ({ data, resolutionData = {} }: CategoryMetricsProps) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-md p-4 mt-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">
        <FaListAlt className="inline-block mr-2 text-gray-700" />
        Category-wise Statistics
      </h2>
      
      {/* Table view for desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
              <th className="px-4 py-3 text-left rounded-tl-lg">Category</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Viewed</th>
              <th className="px-4 py-3 text-right">Resolved</th>
              <th className="px-4 py-3 text-right">Unresolved</th>
              <th className="px-4 py-3 text-right">Resolution Rate</th>
              <th className="px-4 py-3 text-right rounded-tr-lg">Avg. Response Time</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([category, stats], index) => (
              <tr 
                key={category} 
                className={`
                  border-b border-gray-200
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  hover:bg-blue-50 transition-colors duration-150
                `}
              >
                <td className="px-4 py-3 font-medium text-gray-800">{category}</td>
                <td className="px-4 py-3 text-right text-gray-700">{stats.overall.total}</td>
                <td className="px-4 py-3 text-right text-gray-700">{stats.overall.viewed}</td>
                <td className="px-4 py-3 text-right text-green-600 font-medium">{stats.overall.resolved}</td>
                <td className="px-4 py-3 text-right text-red-600 font-medium">
                  {stats.overall.total - stats.overall.resolved}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    (stats.overall.resolved / stats.overall.total) * 100 >= 50
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {Math.round((stats.overall.resolved / stats.overall.total) * 100)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-gray-700">
                  {resolutionData[category] 
                    ? `${resolutionData[category].toFixed(2)}h`
                    : 'N/A'
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile */}
      <div className="md:hidden space-y-2">
        {Object.entries(data).map(([category, stats], index) => (
          <div key={category} className="bg-white rounded-lg shadow p-3">
            <h3 className="font-semibold text-gray-800 mb-2">
              <FaListAlt className="inline-block mr-2 text-gray-700" />
              {category}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm">
                <p className="text-gray-500">Total</p>
                <p className="font-medium">{stats.overall.total}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-500">Viewed</p>
                <p className="font-medium">{stats.overall.viewed}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-500">Resolved</p>
                <p className="font-medium text-green-600">{stats.overall.resolved}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-500">Unresolved</p>
                <p className="font-medium text-red-600">{stats.overall.total - stats.overall.resolved}</p>
              </div>
              <div className="text-sm col-span-2">
                <p className="text-gray-500">Resolution Rate</p>
                <span className={`inline-block mt-1 px-2 py-1 rounded-full text-sm ${
                  (stats.overall.resolved / stats.overall.total) * 100 >= 50
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {Math.round((stats.overall.resolved / stats.overall.total) * 100)}%
                </span>
              </div>
              <div className="text-sm col-span-2">
                <p className="text-gray-500">Avg. Response Time</p>
                <p className="font-medium">
                  {resolutionData[category] 
                    ? `${resolutionData[category].toFixed(2)}h`
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryMetrics;
