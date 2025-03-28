import React, { useEffect } from "react";
import { Dashboard } from "../../../../components/dashboard/Hostel/Cow/Dashboard";
import { useSocket } from "../../../../hooks/useSocket";
import { SOCKET_URL } from "../../../../constants/socket";
import { toast } from "react-toastify";

const DashboardPage: React.FC = () => {
    const { cowDashboardData, error, isConnected } = useSocket(SOCKET_URL);

    useEffect(() => {
        if (error) {
            toast.error(`Error: ${error}`);
        }
    }, [error]);

    if (!isConnected) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Connecting to server...</p>
                </div>
            </div>
        );
    }

    if (!cowDashboardData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return <Dashboard cowDashboardData={cowDashboardData} />;
};

export default DashboardPage;