import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./pages/students/Home";
import Login from "./pages/Login";
import Profile from "./pages/students/Profile";
import Complaint from "./pages/students/Complaint";
import AdminDashboard from "./pages/admins/AdminDashboard";
import AdminManageComplaints from "./pages/admins/AdminManageComplaints";
import { useAuth } from "./context/AuthContext";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AuthenticatedRoute />} />

          {/* Student Routes */}
          <Route
            path="/student/home"
            element={
              <ProtectedRoute role="student">
                <Home/>
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
        </Route>
      </Routes>
    </Router>
  );
};

const AuthenticatedRoute = () => {
  const { auth, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-3xl bg-slate-300 font-bold text-gray-700">
        <div>Authorizing...</div>
      </div>
    );
  }

  return !auth ? <Login /> : <RedirectBasedOnRole />;
};

const RedirectBasedOnRole = () => {
  const { auth } = useAuth();

  if (auth?.role === "student") {
    return <Home />;
  } else if (auth?.role === "admin") {
    return <AdminDashboard />;
  } else {
    return <Login />;
  }
};

const ProtectedRoute = ({ role, children }) => {
  const { auth, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-3xl bg-slate-300 font-bold text-gray-700">
        <div>Loading...</div>
      </div>
    );
  }

  if (!auth || auth.role !== role) {
    return <Login />;
  }

  return children;
};

export default App;
