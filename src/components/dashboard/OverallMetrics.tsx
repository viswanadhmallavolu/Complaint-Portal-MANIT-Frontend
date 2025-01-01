import React from 'react';
import { AlertCircle, CheckSquare, Eye, AlertTriangle } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { AnalyticsData } from '../../types/analytics';

interface OverallMetricsProps {
  data: AnalyticsData;
}

export const OverallMetrics = ({ data }: OverallMetricsProps) => {
  const calculateOverallMetrics = () => {
    let total = 0;
    let viewed = 0;
    let resolved = 0;

    Object.values(data).forEach(category => {
      total += category.overall.total;
      viewed += category.overall.viewed;
      resolved += category.overall.resolved;
    });

    return {
      total,
      viewed,
      resolved,
      unresolved: total - resolved
    };
  };

  const metrics = calculateOverallMetrics();
  const viewedPercentage = Math.round((metrics.viewed / metrics.total) * 100);
  const resolvedPercentage = Math.round((metrics.resolved / metrics.total) * 100);
  const unresolvedPercentage = Math.round((metrics.unresolved / metrics.total) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <MetricCard
        title="Total Complaints"
        value={metrics.total.toString()}
        trend={0}
        icon={<AlertCircle className="text-white" />}
        colorClass="from-blue-500 to-blue-600"
      />
      <MetricCard
        title="Viewed Complaints"
        value={metrics.viewed.toString()}
        trend={viewedPercentage}
        subValue={`${viewedPercentage}% of total`}
        icon={<Eye className="text-white" />}
        colorClass="from-purple-500 to-purple-600"
      />
      <MetricCard
        title="Resolved Complaints"
        value={metrics.resolved.toString()}
        trend={resolvedPercentage}
        subValue={`${resolvedPercentage}% of total`}
        icon={<CheckSquare className="text-white" />}
        colorClass="from-green-500 to-green-600"
      />
      <MetricCard
        title="Unresolved Complaints"
        value={metrics.unresolved.toString()}
        trend={-unresolvedPercentage}
        subValue={`${unresolvedPercentage}% of total`}
        icon={<AlertTriangle className="text-white" />}
        colorClass="from-red-500 to-red-600"
      />
    </div>
  );
};
