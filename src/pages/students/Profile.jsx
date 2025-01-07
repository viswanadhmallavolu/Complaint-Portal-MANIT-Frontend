import React, { useEffect, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Building2,
  Home,
  Building,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  Stethoscope,
  ClipboardList,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import student_api from '../../api/student-api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
  const api = student_api;
  const { auth } = useAuth();
  const user = auth?.user || auth?.userData || null;  // Try both possible locations
  const [complaintData, setComplaintData] = useState(null);
  const [loading, setLoading] = useState(!user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/profile',{withCredentials: true});
        setComplaintData({
          registered: response.data.registered,
          resolved: response.data.resolved,
          unresolved: response.data.unresolved,
          hostel:response.data.hostel,
          academic:response.data.academic,
          medical:response.data.medical,
          ragging:response.data.ragging,
          infrastructure:response.data.infrastructure,
          administration:response.data.administration,
        });
      } catch (err) {
        if (err.response?.status === 401) {
          if (typeof auth?.setAuth === 'function') {
            auth.setAuth(null);
            localStorage.removeItem('auth');
            navigate('/');
          }
        } else {
          const errorMessage =
            err.response?.data?.message || err.message || 'An error occurred';
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [api, navigate, auth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2 text-blue-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 sm:px-8">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                <p className="text-blue-100 mt-1">{user?.department}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 sm:p-8">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <InfoItem icon={Mail} label="Email" value={user?.email} />
                  <InfoItem icon={Phone} label="Mobile" value={user?.mobile} />
                  <InfoItem icon={User} label="UID" value={user?.uid} />
                  <InfoItem
                    icon={Building2}
                    label="Department"
                    value={`${user?.department}, ${user?.stream}`}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Generic Details
                </h2>
                <div className="space-y-4">
                  <InfoItem icon={Home} label="Address" value={user?.postalAddress} />
                  
                  <InfoItem icon={Users} label="Role" value={user?.role} />
                </div>
              </div>
            </div>

            {/* Complaints Statistics */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Complaints Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatCard
                  icon={FileText}
                  label="Registered"
                  value={complaintData?.registered}
                  color="blue"
                  loading={!complaintData}
                />
                <StatCard
                  icon={CheckCircle}
                  label="Resolved"
                  value={complaintData?.resolved}
                  color="green"
                  loading={!complaintData}
                />
                <StatCard
                  icon={XCircle}
                  label="Unresolved"
                  value={complaintData?.unresolved}
                  color="red"
                  loading={!complaintData}
                />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Complaints by Category
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  icon={Building}
                  label="Hostel"
                  value={complaintData?.hostel}
                  color="blue"
                  loading={!complaintData}
                />
                <StatCard
                  icon={FileText}
                  label="Academic"
                  value={complaintData?.academic}
                  color="blue"
                  loading={!complaintData}
                />
                <StatCard
                  icon={Stethoscope}
                  label="Medical"
                  value={complaintData?.medical}
                  color="blue"
                  loading={!complaintData}
                />
                <StatCard
                  icon={Users}
                  label="Ragging"
                  value={complaintData?.ragging}
                  color="blue"
                  loading={!complaintData}
                />
                <StatCard
                  icon={Building2}
                  label="Infrastructure"
                  value={complaintData?.infrastructure}
                  color="blue"
                  loading={!complaintData}
                />
                <StatCard
                  icon={ClipboardList}
                  label="Administration"
                  value={complaintData?.administration}
                  color="blue"
                  loading={!complaintData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3">
    <Icon className="w-5 h-5 text-gray-400" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-gray-900">{value || '-'}</p>
    </div>
  </div>
);

const StatCard = ({ icon: Icon, label, value, color, loading }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div
      className={`p-6 rounded-xl ${colorClasses[color]} bg-opacity-50 relative overflow-hidden`}
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-6 h-6" />
        <h3 className="text-lg font-semibold">{label}</h3>
      </div>
      {loading ? (
        <div className="mt-4 animate-pulse">
          <div className="h-8 w-16 bg-current opacity-20 rounded"></div>
        </div>
      ) : (
        <p className="mt-4 text-3xl font-bold">{value || 0}</p>
      )}
    </div>
  );
};

export default Profile;