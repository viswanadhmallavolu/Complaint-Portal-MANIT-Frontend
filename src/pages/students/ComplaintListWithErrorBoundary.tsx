import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Search, Trash2 } from 'lucide-react';
import ComplaintCard from '../../components/ComplaintCard/ComplaintCard';
import { getComplaints, updateComplaint, deleteComplaints, getComplaintsByDateRange } from '../../services/api';
import { Complaint, ComplaintCategory, UpdateComplaint } from '../../types/complaint';
import { useAuth } from '../../context/AuthContext';
import ErrorBoundary from '../../components/ErrorBoundary';
import student_api from '../../api/student-api';
import admin_api from '../../api/admin-api';

const ComplaintList = () => {
  const role = useAuth().role;
  if (role === 'admin') {
    const api = admin_api;
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [csrfToken, setCsrfToken] = useState('');

    const handleAuthError = useCallback(() => {
      setAuth(null);
      localStorage.removeItem('auth');
      navigate('/');
    }, [navigate, setAuth]);

    const handleError = useCallback((err: any, fallbackMessage: string) => {
      if (err.response?.status === 401 || err.response?.status === 404) {
        handleAuthError();
      } else {
        const message = err.response?.data?.message || err.message || fallbackMessage;
        setError(message);
      }
    }, [handleAuthError]);

    const fetchComplaints = useCallback(async () => {
      if (!category) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getComplaints(category as ComplaintCategory);
        setComplaints(data);
      } catch (err) {
        handleError(err, 'Failed to fetch complaints.');
      } finally {
        setLoading(false);
      }
    }, [category, handleError]);

    useEffect(() => {
      fetchComplaints();
    }, [fetchComplaints]);

    useEffect(() => {
      api.get('/csrf-token')
        .then(response => {
          setCsrfToken(response.data.csrfToken);
        })
        .catch(error => {
          console.error('Failed to fetch CSRF token', error);
        });
    }, []);


    const handleUpdateComplaint = async (id: string, updates: Partial<Complaint>) => {
      if (!category) {
        setError('Category is not defined.');
        return;
      }
      try {
        const updateData: UpdateComplaint = { complainId: id, updates };
        await updateComplaint(category as ComplaintCategory, updateData, csrfToken);
        setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...updates } as Complaint : c));
      } catch (err) {
        handleError(err, 'Failed to update complaint.');
      }
    };

    const handleDeleteComplaint = async (id: string) => {
      if (!category) {
        setError('Category is not defined.');
        return;
      }
      try {
        await deleteComplaints(category as ComplaintCategory, { complainId: id }, csrfToken,);
        setComplaints(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        handleError(err, 'Failed to delete complaint.');
      }
    };

    const handleFilterByDateRange = async () => {
      if (!category) {
        setError('Category is not defined.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getComplaintsByDateRange(category as ComplaintCategory, startDate, endDate);
        setComplaints(data);
        setIsFilterOpen(false);
      } catch (err) {
        handleError(err, 'Failed to fetch complaints.');
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    const clearFilters = async () => {
      setStartDate('');
      setEndDate('');
      fetchComplaints();
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
              Filter by Date
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 capitalize">
            {category} Complaints
          </h1>

          {isFilterOpen && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 transition-all">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Start Date', 'End Date'].map((label, index) => (
                  <div className="space-y-2" key={index}>
                    <label className="block text-sm font-medium text-gray-700">{label}</label>
                    <input
                      type="date"
                      value={index === 0 ? startDate : endDate}
                      onChange={(e) => index === 0 ? setStartDate(e.target.value) : setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ))}
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
  }
  else {
    const api = student_api;
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [csrfToken, setCsrfToken] = useState('');

    const handleAuthError = useCallback(() => {
      setAuth(null);
      localStorage.removeItem('auth');
      navigate('/');
    }, [navigate, setAuth]);

    const handleError = useCallback((err: any, fallbackMessage: string) => {
      if (err.response?.status === 401 || err.response?.status === 404) {
        handleAuthError();
      } else {
        const message = err.response?.data?.message || err.message || fallbackMessage;
        setError(message);
      }
    }, [handleAuthError]);

    const fetchComplaints = useCallback(async () => {
      if (!category) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getComplaints(category as ComplaintCategory);
        setComplaints(data);
      } catch (err) {
        handleError(err, 'Failed to fetch complaints.');
      } finally {
        setLoading(false);
      }
    }, [category, handleError]);

    useEffect(() => {
      fetchComplaints();
    }, [fetchComplaints]);

    useEffect(() => {
      api.get('/csrf-token')
        .then(response => {
          setCsrfToken(response.data.csrfToken);
        })
        .catch(error => {
          console.error('Failed to fetch CSRF token', error);
        });
    }, []);


    const handleUpdateComplaint = async (id: string, updates: Partial<Complaint>) => {
      if (!category) {
        setError('Category is not defined.');
        return;
      }
      try {
        const updateData: UpdateComplaint = { complainId: id, updates };
        await updateComplaint(category as ComplaintCategory, updateData, csrfToken);
        setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...updates } as Complaint : c));
      } catch (err) {
        handleError(err, 'Failed to update complaint.');
      }
    };

    const handleDeleteComplaint = async (id: string) => {
      if (!category) {
        setError('Category is not defined.');
        return;
      }
      try {
        await deleteComplaints(category as ComplaintCategory, { complainId: id }, csrfToken,);
        setComplaints(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        handleError(err, 'Failed to delete complaint.');
      }
    };

    const handleFilterByDateRange = async () => {
      if (!category) {
        setError('Category is not defined.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getComplaintsByDateRange(category as ComplaintCategory, startDate, endDate);
        setComplaints(data);
        setIsFilterOpen(false);
      } catch (err) {
        handleError(err, 'Failed to fetch complaints.');
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    const clearFilters = async () => {
      setStartDate('');
      setEndDate('');
      fetchComplaints();
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
              Filter by Date
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 capitalize">
            {category} Complaints
          </h1>

          {isFilterOpen && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 transition-all">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Start Date', 'End Date'].map((label, index) => (
                  <div className="space-y-2" key={index}>
                    <label className="block text-sm font-medium text-gray-700">{label}</label>
                    <input
                      type="date"
                      value={index === 0 ? startDate : endDate}
                      onChange={(e) => index === 0 ? setStartDate(e.target.value) : setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ))}
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
  }
};

const ComplaintListWithErrorBoundary = () => (
  <ErrorBoundary>
    <ComplaintList />
  </ErrorBoundary>
);

export default ComplaintListWithErrorBoundary;
