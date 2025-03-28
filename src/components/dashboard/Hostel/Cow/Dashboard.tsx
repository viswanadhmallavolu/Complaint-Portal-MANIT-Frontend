import React from 'react';
import {
    Building2,
    CheckCircle,
    Clock,
    TrendingUp,
} from 'lucide-react';
import { StatCard } from '../StatCard';
import { HostelStatsTable } from './HostelStatsTable';
import { TrendingComplaints } from './TrendingComplaints';
import { PieChartComponent } from './PieChartComponent';
import { COWDashboardData } from '../../../../types/dashboard';

interface DashboardProps {
    cowDashboardData: COWDashboardData;
}

export interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ElementType;
    description?: string;
    bgColor?: string;
    iconColor?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ cowDashboardData }) => {
    const totalComplaints = cowDashboardData.hostelStats.reduce((acc, curr) => acc + curr.total, 0);
    const totalResolved = cowDashboardData.hostelStats.reduce((acc, curr) => acc + curr.resolved, 0);
    const overallResolutionRate = totalComplaints > 0
        ? ((totalResolved / totalComplaints) * 100).toFixed(1)
        : "0.0";

    const bestHostelDescription = cowDashboardData.bestMaintainedHostel
        ? `${(cowDashboardData.bestMaintainedHostel.resolutionRate * 100).toFixed(1)}% resolution rate`
        : 'No data available';

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold">COW Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                    title="Total Complaints"
                    value={totalComplaints}
                    icon={Building2}
                    bgColor="bg-red-100/80"
                    iconColor="text-red-500"
                />
                <StatCard
                    title="Resolved"
                    value={totalResolved}
                    icon={CheckCircle}
                    bgColor="bg-green-100/80"
                    iconColor="text-green-500"
                />
                <StatCard
                    title="Resolution Rate"
                    value={`${overallResolutionRate}%`}
                    icon={TrendingUp}
                    bgColor="bg-blue-100/80"
                    iconColor="text-blue-500"
                />
                <StatCard
                    title="Best Performing Hostel"
                    value={cowDashboardData.bestMaintainedHostel?._id || 'N/A'}
                    description={bestHostelDescription}
                    icon={Clock}
                    bgColor="bg-purple-100/80"
                    iconColor="text-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4">Hostel Statistics</h2>
                    <HostelStatsTable
                        stats={cowDashboardData.hostelStats}
                        trending={cowDashboardData.trendingComplaintTypes}
                    />
                </div>

                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4">Complaint Distribution</h2>
                    <PieChartComponent stats={cowDashboardData.hostelStats} />
                </div>

                <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4">Trending Complaints</h2>
                    <TrendingComplaints trending={cowDashboardData.trendingComplaintTypes} />
                </div>
            </div>
        </div>
    );
};