import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./pages/students/Home";
import Login from "./pages/Login";
import Profile from "./pages/students/Profile";
import Complaint from "./pages/students/Complaint";
import AdminDashboard from "./pages/admins/AdminDashboard.tsx";
import AdminManageComplaints from "./pages/admins/AdminManageComplaints";
import ComplaintListWithErrorBoundary from './pages/students/ComplaintListWithErrorBoundary';
import { useAuth } from "./context/AuthContext";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<AuthenticatedRoute />} />

        {/* Student Routes */}
        <Route
          path="/student/home"
          element={
            <ProtectedRoute role="student">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute role="student">
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/complaint"
          element={
            <ProtectedRoute role="student">
              <Complaint />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/home/:category"
          element={
            <ProtectedRoute role="student">
              <ComplaintListWithErrorBoundary />
            </ProtectedRoute>
          }
        />
        {/* Create the error page  */}
        
        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute role="admin">
              <AdminManageComplaints />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/complaints/:category"
          element={
            <ProtectedRoute role="admin">
              <ComplaintListWithErrorBoundary />
            </ProtectedRoute>
          }
        />
      </Route>
      
      <Route path="/*" element={<CatchAllRoutes />} />
    </Routes>
  );
};

const AuthenticatedRoute = () => {
  const { auth } = useAuth();
  return !auth ? <Login /> : <RedirectBasedOnRole />;
};

const CatchAllRoutes = () => {
  return <RedirectBasedOnRole />;
};

const RedirectBasedOnRole = () => {
  const { auth, logout, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-3xl bg-transparent font-bold text-gray-700">
        <div>Loading...</div>
      </div>
    );
  }
  if (!auth) return <Login />;
  if (auth?.role === "student") {
    return <Navigate to="/student/home" replace />;
  } else if (auth?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    logout();
    return <Login />;
  }
};

const ProtectedRoute = ({ role, children }) => {
  const { auth, logout, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>

    );
  }

  if (!auth || auth?.role !== role) {
    logout();
    return <Login />;
  }

  return children;
};

export default App;