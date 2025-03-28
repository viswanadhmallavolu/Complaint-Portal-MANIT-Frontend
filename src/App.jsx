import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./pages/students/Home";
import Login from "./pages/Login";
import Profile from "./pages/students/Profile";
import Complaint from "./pages/students/Complaint";
import AdminDashboard from "./pages/admins/AdminDashboard.tsx";
import AdminManageComplaints from "./pages/admins/AdminManageComplaints";
import ComplaintListWithErrorBoundary from './pages/students/ComplaintListWithErrorBoundary';
import ComplaintListAdmin from './pages/admins/ComplaintListAdmin.tsx'
import Feedback from "./pages/students/Feedback.tsx";
import Utils from "./pages/admins/Util.tsx";
import { useAuth } from "./context/AuthContext";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect, useMemo } from "react";
import 'react-toastify/dist/ReactToastify.css';
import './customToast.css';
import SearchPage from "./pages/students/Search.tsx";
import Contacts from "./pages/students/Contacts.tsx";
import RoleBasedPage from "./pages/RoleBasedPage.tsx";
import ComplaintSearchAdmin from "./pages/admins/ComplaintSearchAdmin.tsx";
import DashboardPage from "./pages/admins/Hostel/COW/DashboardPage.tsx";
import WardenDashboardPage from "./pages/admins/Hostel/Wardens/DashboardPage.tsx";
import Landing from "./pages/landing.tsx"; // <-- added for landing page


// Define warden roles constant
const WARDEN_ROLES = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H12'];



const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // fixed: compare location.pathname with both "/admin/dashboard" and "/admin/complaints"
    if (location.pathname === "/admin/dashboard" || location.pathname === "/admin/complaints") {
      localStorage.removeItem("complaintFilters");
      localStorage.removeItem("lastSeenId");
      localStorage.removeItem("complaints");
    }
  }, [location]);

  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        pauseOnHover={false}
        draggable={true}
        className='custom-toast'
      />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Layout />}>
          <Route index element={<AuthenticatedRoute />} />

          {/* Student Routes */}
          <Route
            path='/student/home'
            element={
              <ProtectedRoute role='student'>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path='/student/profile'
            element={
              <ProtectedRoute role='student'>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/student/complaint'
            element={
              <ProtectedRoute role='student'>
                <Complaint />
              </ProtectedRoute>
            }
          />
          <Route
            path='/student/home/:category'
            element={
              <ProtectedRoute role='student'>
                <ComplaintListWithErrorBoundary />
              </ProtectedRoute>
            }
          />
          <Route
            path='/student/feedback'
            element={
              <ProtectedRoute role='student'>
                <Feedback />
              </ProtectedRoute>
            }
          />
          <Route
            path='/student/search'
            element={
              <ProtectedRoute role='student'>
                <SearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/student/contacts'
            element={
              <ProtectedRoute role='student'>
                <Contacts />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path='/admin/dashboard'
            element={
              <ProtectedRoute role='admin'>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/complaints'
            element={
              <ProtectedRoute role='admin'>
                <AdminManageComplaints />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/complaints/:category'
            element={
              <ProtectedRoute role='admin'>
                <ComplaintListAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/utils'
            element={
              <ProtectedRoute role='admin'>
                <Utils />
              </ProtectedRoute>
            }
          />

          {/* Role-based Routes: Updated to support hostel admins */}
          <Route
            path='/:role/complaints'
            element={
              <ProtectedRoute roles={['electric_admin', 'internet_admin', 'medical_admin', 'cow', ...WARDEN_ROLES]}>
                <RoleBasedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/:role/search'
            element={
              <ProtectedRoute roles={['electric_admin', 'internet_admin', 'medical_admin', 'cow', ...WARDEN_ROLES]}>
                <ComplaintSearchAdmin />
              </ProtectedRoute>
            }
          />

          {/* COW Dashboard */}
          <Route
            path='/cow/dashboard'
            element={
              <ProtectedRoute roles={['cow']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Warden Dashboard - Updated path */}
          <Route
            path='/:role/warden/dashboard'
            element={
              <ProtectedRoute roles={WARDEN_ROLES}>
                <WardenDashboardPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path='/*' element={<CatchAllRoutes />} />
      </Routes>
    </>
  );
};

const AuthenticatedRoute = () => {
  const { auth } = useAuth();
  // changed: show the login page when not authenticated
  return !auth ? <Login /> : <RedirectBasedOnRole />;
};

const CatchAllRoutes = () => {
  return <RedirectBasedOnRole />;
};

const RedirectBasedOnRole = () => {
  const { auth, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      let targetPath = '/';

      if (auth) {
        switch (auth.role) {
          case 'student':
            targetPath = '/student/home';
            break;
          case 'admin':
            targetPath = '/admin/complaints';
            break;
          case 'electric_admin':
          case 'internet_admin':
          case 'medical_admin':
            targetPath = `/${auth.role}/complaints`;
            break;
          case 'cow':
            targetPath = '/cow/dashboard';
            break;
          default:
            // Handle warden roles
            if (WARDEN_ROLES.includes(auth.role)) {
              targetPath = `/${auth.role}/warden/dashboard`;
            }
        }
      }

      if (location.pathname !== targetPath) {
        navigate(targetPath, { replace: true });
      }
    }
  }, [auth, isLoading, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-3xl bg-transparent font-bold text-gray-700">
        <div>Loading...</div>
      </div>
    );
  }
  return null;
};

const ProtectedRoute = ({ roles: propRoles, role: propRole, children }) => {
  const roles = useMemo(() => propRoles || (propRole ? [propRole] : []), [propRoles, propRole]);
  const { auth, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!auth || !roles.includes(auth?.role))) {
      navigate("/", { replace: true });
    }
  }, [auth, roles, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!auth || !roles.includes(auth?.role)) {
    return null;
  }

  return children;
};

export default App;