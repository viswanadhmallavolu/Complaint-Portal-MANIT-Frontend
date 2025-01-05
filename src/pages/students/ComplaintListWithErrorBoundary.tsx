import React, { useCallback, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComplaints, updateComplaint, deleteComplaints, getComplaintsByDateRange } from '../../services/apiService';
import { Complaint, ComplaintCategory, UpdateComplaint } from '../../types/complaint';
import { useAuth } from '../../context/AuthContext';
import ErrorBoundary from '../../components/ErrorBoundary';
import student_api from '../../api/student-api';
import ComplaintListView from '../../components/ComplaintCard/student/ComplaintListView';
import '../../styles/complaint-list.css';

const ComplaintList = () => {
  const role = JSON.stringify(localStorage.getItem('auth')?.trim());
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAuthError = useCallback(() => {
    setAuth(null);
    localStorage.removeItem('auth');
    navigate('/');
  }, [navigate, setAuth]);

  const handleError = useCallback((err: any, fallbackMessage: string) => {
    if (err.response?.status === 401) {
      handleAuthError();
    } else if (err.response?.status === 404) {
      setComplaints([]);
    } else {
      const message = err.response?.data?.message || err.message || fallbackMessage;
      setError(message);
    }
  }, [handleAuthError]);

  const fetchComplaints = useCallback(async () => {
    if (!category) return;
    console.log("fetching for student")
    setLoading(true);
    setError(null);
    try {
      const data = await getComplaints(category as ComplaintCategory, role);
      // Sort complaints by date in descending order
      const sortedData = [...data].sort((a, b) => 
        new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime()
      );
      setComplaints(sortedData);
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
      await updateComplaint(category as ComplaintCategory, updateData, csrfToken, role);
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
      await deleteComplaints(category as ComplaintCategory, { complainId: id }, csrfToken, role);
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
      const data = await getComplaintsByDateRange(category as ComplaintCategory, startDate, endDate, role);
      // Sort filtered complaints by date in descending order
      const sortedData = [...data].sort((a, b) => 
        new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime()
      );
      setComplaints(sortedData);
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

  const getItemSize = () => windowWidth >= 768 ? 220 : 240;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <ComplaintListView
      category={category || ''}
      complaints={complaints}
      loading={loading}
      error={error}
      startDate={startDate}
      endDate={endDate}
      isFilterOpen={isFilterOpen}
      windowWidth={windowWidth}
      getItemSize={getItemSize}
      onSetStartDate={setStartDate}
      onSetEndDate={setEndDate}
      onSetIsFilterOpen={setIsFilterOpen}
      onUpdateComplaint={handleUpdateComplaint}
      onDeleteComplaint={handleDeleteComplaint}
      onFilterByDateRange={handleFilterByDateRange}
      onClearFilters={clearFilters}
      onNavigateBack={() => navigate('/student/home')}
    />
  );
};

const ComplaintListWithErrorBoundary = () => (
  <ErrorBoundary>
    <ComplaintList />
  </ErrorBoundary>
);

export default ComplaintListWithErrorBoundary;