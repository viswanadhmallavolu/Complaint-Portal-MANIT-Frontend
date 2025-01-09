import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import React, { lazy, Suspense } from 'react';
import { AnalyticsData } from '../../types/analytics';

const LazyOverallMetrics = lazy(() => import('./OverallMetrics'));
const LazyCategoryMetrics = lazy(() => import('./CategoryMetrics'));
const LazyMetricCard = lazy(() => import('./MetricCard'));

interface CriticalMetricsProps {
  data: AnalyticsData;
  resolutionData: Record<string, number>;
}

export const CriticalMetrics = ({ data = {}, resolutionData = {} }: CriticalMetricsProps) => {
  const getHotTopic = () => {
    let maxComplaints = 0;
    let hotTopic = 'No Data';
    let trend = 0;

    if (data && Object.keys(data).length > 0) {
      Object.entries(data).forEach(([category, categoryData]) => {
        if (categoryData?.overall?.total > maxComplaints) {
          maxComplaints = categoryData.overall.total;
          hotTopic = category;
          trend = 15;
        }
      });
    }

    return { category: hotTopic, total: maxComplaints, trend };
  };

  const getMostNeglected = () => {
    let maxResponseTime = -1;
    let neglectedCategory = 'No Data';
    let totalComplaints = 0;

    if (data && Object.keys(data).length > 0) {
      Object.entries(resolutionData).forEach(([category, responseTime]) => {
        if (data[category]?.overall?.total && 
            typeof responseTime === 'number' && 
            responseTime > maxResponseTime) {
          maxResponseTime = responseTime;
          neglectedCategory = category;
          totalComplaints = data[category].overall.total;
        }
      });
    }

    return { 
      category: neglectedCategory, 
      responseTime: maxResponseTime > -1 ? `${maxResponseTime.toFixed(2)}h` : 'N/A',
      total: totalComplaints
    };
  };

  const getBestMaintained = () => {
    let minComplaints = Infinity;
    let bestCategory = 'No Data';
    let resolutionTime = 'N/A';

    if (data && Object.keys(data).length > 0) {
      Object.entries(data).forEach(([category, categoryData]) => {
        if (categoryData?.overall?.total) {
          const totalComplaints = categoryData.overall.total;
          const currentResolutionTime = resolutionData[category] || Infinity;

          if (totalComplaints < minComplaints || 
              (totalComplaints === minComplaints && 
               currentResolutionTime < (resolutionData[bestCategory] || Infinity))) {
            minComplaints = totalComplaints;
            bestCategory = category;
            resolutionTime = resolutionData[category]
              ? `${resolutionData[category].toFixed(2)}h`
              : 'N/A';
          }
        }
      });
    }

    return { 
      category: bestCategory, 
      total: minComplaints === Infinity ? 0 : minComplaints,
      resolutionTime 
    };
  };

  const hotTopic = getHotTopic();
  const mostNeglected = getMostNeglected();
  const bestMaintained = getBestMaintained();

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
      <Suspense fallback={<div>Loading metrics...</div>}>
        <LazyOverallMetrics data={data} />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Suspense fallback={<div>Loading hot topic...</div>}>
          <LazyMetricCard
            title="Hot Topic"
            value={hotTopic.category}
            trend={hotTopic.trend}
            subValue={`${hotTopic.total} complaints`}
            icon={<AlertTriangle className="text-white" />}
            colorClass="from-orange-500 to-orange-600"
          />
        </Suspense>
        
        <Suspense fallback={<div>Loading most neglected...</div>}>
          <LazyMetricCard
            title="Most Neglected"
            value={mostNeglected.category}
            trend={mostNeglected.total}
            subValue={`Avg. Response: ${mostNeglected.responseTime}`}
            icon={<Clock className="text-white" />}
            colorClass="from-yellow-500 to-yellow-600"
          />
        </Suspense>
        
        <Suspense fallback={<div>Loading best maintained...</div>}>
          <LazyMetricCard
            title="Best Maintained"
            value={bestMaintained.category}
            trend={-bestMaintained.total}  // Negative trend because lower is better
            subValue={`Avg. Resolution: ${bestMaintained.resolutionTime}`}
            icon={<CheckCircle className="text-white" />}
            colorClass="from-emerald-500 to-emerald-600"
          />
        </Suspense>
      </div>
      
      <Suspense fallback={<div>Loading category metrics...</div>}>
        <LazyCategoryMetrics data={data} resolutionData={resolutionData} />
      </Suspense>
    </div>
  );
};