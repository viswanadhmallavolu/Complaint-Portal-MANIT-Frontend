import React from 'react';
import { BarChart3, TrendingUp, Building2 } from 'lucide-react';

interface Complaint {
  complainType: string;
  count: number;
}

interface TrendingData {
  hostelNumber: string;
  complaints: Complaint[];
}

interface TrendingComplaintsProps {
  trending: TrendingData[];
}

export const TrendingComplaints: React.FC<TrendingComplaintsProps> = ({ trending }) => {
  if (!trending || trending.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Trending Issues</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <BarChart3 className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-lg">No trending complaints data available</p>
          <p className="text-sm text-gray-400">Check back later for updates</p>
        </div>
      </div>
    );
  }

  // Sort hostels by number
  const sortedTrending = [...trending].sort((a, b) => {
    const aNum = parseInt(a.hostelNumber.replace(/\D/g, ''));
    const bNum = parseInt(b.hostelNumber.replace(/\D/g, ''));
    return aNum - bNum;
  });

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 p-2 rounded-lg">
          <BarChart3 className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Trending Issues</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTrending.map(({ hostelNumber, complaints }) => (
          <div 
            key={hostelNumber} 
            className="group bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white p-1.5 rounded-lg shadow-sm">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-800">{hostelNumber}</h3>
              <div className="h-px flex-grow bg-gray-200" />
            </div>
            <div className="space-y-3">
              {complaints
                .sort((a, b) => b.count - a.count)
                .slice(0, 3)
                .map((complaint, index) => (
                  <div
                    key={`${hostelNumber}-${complaint.complainType}`}
                    className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${
                        index === 0 ? 'bg-red-50' :
                        index === 1 ? 'bg-orange-50' :
                        'bg-yellow-50'
                      }`}>
                        <TrendingUp
                          className={`w-4 h-4 ${
                            index === 0 ? 'text-red-500' :
                            index === 1 ? 'text-orange-500' :
                            'text-yellow-500'
                          }`}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {complaint.complainType}
                      </span>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      index === 0 ? 'bg-red-100 text-red-700' :
                      index === 1 ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {complaint.count}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};