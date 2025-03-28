import React from "react";
import { WardenDashboard } from "../../../../components/dashboard/Hostel/Warden/Dashboard";
import { useSocket } from "../../../../hooks/useSocket";
import { SOCKET_URL } from "../../../../constants/socket";

const WardenDashboardPage: React.FC = () => {
    const { wardenDashboardData, error, isConnected } = useSocket(SOCKET_URL);

    if (!isConnected) return <div>Connecting to server...</div>;
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Error : {error}</p>
                </div>
            </div>
        );
    }
    if (!wardenDashboardData){
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return <WardenDashboard dashboardData={wardenDashboardData} />;
};

export default WardenDashboardPage;