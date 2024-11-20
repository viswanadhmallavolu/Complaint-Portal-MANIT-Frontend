import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Search, Trash2 } from 'lucide-react';
import ComplaintCard from '../../components/ComplaintCard';
import { getComplaints, updateComplaint, deleteComplaints, getComplaintsByDateRange } from '../../services/api';
import { Complaint, ComplaintCategory, UpdateComplaint } from '../../types/complaint';
import ErrorBoundary from '../../components/ErrorBoundary';

const ComplaintList = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError(null);
        if (category) {
          const data = await getComplaints(category as ComplaintCategory);
          setComplaints(data);
        }
      } catch (err) {
        setError('Failed to fetch complaints. Please try again later.');
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchComplaints();
    }
  }, [category]);

  const handleUpdateComplaint = async (id: string, updates: Partial<Complaint>) => {
    try {
      const updateData: UpdateComplaint = {
        complainId: id,
        updates
      };
      if (category) {
        await updateComplaint(category as ComplaintCategory, updateData);
      } else {
        setError('Category is not defined.');
      }
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint.id === id ? { ...complaint, ...(updates as Complaint) } : complaint
        )
      );
    } catch (error) {
      setError('Failed to update complaint. Please try again later.');
    }
  };

  const handleDeleteComplaint = async (id: string) => {
    try {
      if (category) {
        const deleteData = { complainId: id };
        await deleteComplaints(category as ComplaintCategory, deleteData);
        setComplaints((prevComplaints) =>
          prevComplaints.filter((complaint) => complaint.id !== id)
        );
      } else {
        setError('Category is not defined.');
      }
    } catch (error) {
      setError('Failed to delete complaint. Please try again later.');
    }
  };

  const handleFilterByDateRange = async () => {
    try {
      setLoading(true);
      setError(null);
      if (category) {
        const data = await getComplaintsByDateRange(category as ComplaintCategory, startDate, endDate);
        setComplaints(data);
        setIsFilterOpen(false);
      }
    } catch (err) {
      setError('Failed to fetch complaints. Please try again later.');
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = async () => {
    setStartDate('');
    setEndDate('');
    if (category) {
      const data = await getComplaints(category as ComplaintCategory);
      setComplaints(data);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4 sm:mb-0"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Categories
          </button>

          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <Calendar size={18} className="mr-2" />
            <span>Filter by Date</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 capitalize">
          {category} Complaints
        </h1>

        {isFilterOpen && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 transition-all">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={handleFilterByDateRange}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Search size={18} className="mr-2" />
                Apply Filter
              </button>
              <button
                onClick={clearFilters}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <Trash2 size={18} className="mr-2" />
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600">No complaints found in this category.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {complaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onUpdate={handleUpdateComplaint}
                onDelete={handleDeleteComplaint}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ComplaintListWithErrorBoundary = () => (
  <ErrorBoundary>
    <ComplaintList />
  </ErrorBoundary>
);

export default ComplaintListWithErrorBoundary;