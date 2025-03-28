import React from 'react';
import { ClipboardList, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { StatCard } from '../StatCard';
import { CategoryStatsTable } from './CategoryStatsTable';
import { PerformanceChart } from './PerformanceChart';
import { WardenDashboardData } from '../../../../types/dashboard';

interface WardenDashboardProps {
  dashboardData: WardenDashboardData | null;
}

export const WardenDashboard: React.FC<WardenDashboardProps> = ({ dashboardData }) => {
  if (!dashboardData) return <div>Loading...</div>;

  const { overall, categoryStats, bestMaintainedCategory, worstMaintainedCategory } = dashboardData;
  const resolutionRate = ((overall.resolved / overall.total) * 100).toFixed(1);
  const avgResponseHours = Math.round(overall.avgResponseTime / (1000 * 60 * 60));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Hostel Warden Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Complaints"
          value={overall.total}
          icon={ClipboardList}
        />
        <StatCard
          title="Resolution Rate"
          value={`${resolutionRate}%`}
          icon={TrendingUp}
          className="bg-blue-50"
        />
        <StatCard
          title="Avg. Response Time"
          value={`${avgResponseHours}h`}
          icon={Clock}
          className="bg-yellow-50"
        />
        <StatCard
          title="Pending"
          value={overall.pending}
          icon={AlertCircle}
          className="bg-red-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Category Performance</h2>
          <CategoryStatsTable stats={categoryStats} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
          <PerformanceChart
            best={bestMaintainedCategory}
            worst={worstMaintainedCategory}
            stats={categoryStats}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Best Performing Category
          </h3>
          <p className="text-2xl font-bold text-green-900">
            {bestMaintainedCategory._id}
          </p>
          <p className="text-sm text-green-700 mt-1">
            {(bestMaintainedCategory.resolutionRate * 100).toFixed(1)}% resolution rate
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Needs Improvement
          </h3>
          <p className="text-2xl font-bold text-red-900">
            {worstMaintainedCategory._id}
          </p>
          <p className="text-sm text-red-700 mt-1">
            {(worstMaintainedCategory.resolutionRate * 100).toFixed(1)}% resolution rate
          </p>
        </div>
      </div>
    </div>
  );
};