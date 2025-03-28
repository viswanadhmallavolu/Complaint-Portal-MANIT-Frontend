import React, { useState, useEffect } from 'react';
import { get_Complaint_byId, get_logs } from '../../services/apiService';
import { LogsSection } from '../../components/Utility/LogsSection';
import { ComplaintSection } from '../../components/Utility/ComplaintSection';

const Utils = () => {
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [complaintId, setComplaintId] = useState('');
  const [complaint, setComplaint] = useState<any>(null);

  useEffect(() => {
    console.log("Updated complaint state:", complaint);
  }, [complaint]);

  const handleDownloadLogs = async () => {
    try {
      const blob = await get_logs(category, startDate!, endDate!);
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'logs.txt');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading logs:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <LogsSection
          category={category}
          setCategory={setCategory}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          onDownload={handleDownloadLogs}
        />
        <ComplaintSection
          complaintId={complaintId}
          setComplaintId={setComplaintId}
          complaint={complaint}
          setComplaint={setComplaint}
        />
      </div>
    </div>
  );
};

export default Utils;