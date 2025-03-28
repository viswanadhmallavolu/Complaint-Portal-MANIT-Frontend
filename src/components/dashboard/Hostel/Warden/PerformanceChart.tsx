import React from 'react';
import { CategoryStats } from '../../../../types/dashboard';

interface PerformanceChartProps {
  best: CategoryStats;
  worst: CategoryStats;
  stats: CategoryStats[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  stats,
}) => {
  const maxTotal = Math.max(...stats.map(stat => stat.total));

  return (
    <div className="space-y-4">
      {stats.map((stat) => (
        <div key={stat._id} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{stat._id}</span>
            <span className="font-medium">{(stat.resolutionRate * 100).toFixed(1)}%</span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{
                width: `${(stat.total / maxTotal) * 100}%`,
                opacity: stat.resolutionRate,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Total: {stat.total}</span>
            <span>Resolved: {stat.resolved}</span>
          </div>
        </div>
      ))}
    </div>
  );
};