import React, { useRef } from 'react';
import {  exportComponentAsPNG } from 'react-component-export-image';
import { PieChart } from '../../components/dashboard/PieChart';
import { CriticalMetrics } from '../../components/dashboard/CriticalMetrics';
import { useSocket } from '../../hooks/useSocket';
import { WifiOff, Download } from 'lucide-react';
import { SOCKET_URL } from '../../constants/socket';

function AdminDasboard() {
  const componentRef = useRef<HTMLDivElement>(null);
  const { isConnected, analyticsData, resolution, error } = useSocket(SOCKET_URL);

  const exportAsPNG = () => {
    exportComponentAsPNG(componentRef, {
      fileName: `dashboard-metrics-${new Date().toISOString().split('T')[0]}`,
      html2CanvasOptions: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f9fafb'
      }
    });
  };

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  const complaintData = Object.entries(analyticsData).map(([category, data]) => ({
    category,
    ...data.overall
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {(!isConnected || error) && (
        <div className="fixed top-4 right-4 bg-red-100 text-red-800 px-4 py-2 rounded-md flex items-center">
          <WifiOff size={16} className="mr-2" />
          {error || 'Disconnected - Attempting to reconnect...'}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8" ref={componentRef}>
        <header className="bg-white rounded-lg shadow-sm p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Complaint Analytics Dashboard</h1>
            <p className="text-gray-500 mt-1">Real-time monitoring and analysis</p>
          </div>
          <button
            onClick={exportAsPNG}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download size={16} className="mr-2" />
            Export as PNG
          </button>
        </header>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Critical Metrics</h2>
          <CriticalMetrics data={analyticsData} resolutionData={resolution} />
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Complaint Distribution</h2>
          <PieChart data={complaintData} />
        </section>
      </div>
    </div>
  );
}

export default AdminDasboard;