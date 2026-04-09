import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

import LandingPage          from './pages/LandingPage';
import LoginPage            from './pages/LoginPage';
import RegisterPage         from './pages/RegisterPage';

import StudentDashboard     from './pages/student/StudentDashboard';
import JobListPage          from './pages/student/JobListPage';
import JobDetailPage        from './pages/student/JobDetailPage';
import ApplyPage            from './pages/student/ApplyPage';
import ResumeUploadPage     from './pages/student/ResumeUploadPage';
import MyApplicationsPage   from './pages/student/MyApplicationsPage';

import HRDashboard          from './pages/hr/HRDashboard';
import HRJobsPage           from './pages/hr/HRJobsPage';
import CreateJobPage        from './pages/hr/CreateJobPage';
import ApplicationsPage     from './pages/hr/ApplicationsPage';


const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 68px)' }}>
      <div className="spinner" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
};

import RAGAnalysisPage from './pages/hr/RAGAnalysisPage';
// Inside <Routes>:
<Route path="/hr/rag/:applicationId"
  element={<ProtectedRoute role="hr"><RAGAnalysisPage /></ProtectedRoute>} />

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"  element={<LandingPage />} />
        <Route path="/login"    element={user ? <Navigate to={user.role === 'hr' ? '/hr/dashboard' : '/jobs'} /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />

        {/* Student */}
        <Route path="/jobs"              element={<JobListPage />} />
        <Route path="/jobs/:id"          element={<JobDetailPage />} />
        <Route path="/apply/:jobId"      element={<ProtectedRoute><ApplyPage /></ProtectedRoute>} />
        <Route path="/upload/:applicationId" element={<ProtectedRoute><ResumeUploadPage /></ProtectedRoute>} />
        <Route path="/my-applications"   element={<ProtectedRoute role="student"><MyApplicationsPage /></ProtectedRoute>} />
        <Route path="/dashboard"         element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />

        {/* HR */}
        <Route path="/hr/dashboard"                    element={<ProtectedRoute role="hr"><HRDashboard /></ProtectedRoute>} />
        <Route path="/hr/jobs"                         element={<ProtectedRoute role="hr"><HRJobsPage /></ProtectedRoute>} />
        <Route path="/hr/jobs/new"                     element={<ProtectedRoute role="hr"><CreateJobPage /></ProtectedRoute>} />
        <Route path="/hr/jobs/:jobId/applications"     element={<ProtectedRoute role="hr"><ApplicationsPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <ToastContainer
        position="bottom-right"
        theme="light"
        autoClose={3500}
        toastStyle={{ borderRadius: 0, fontFamily: 'Outfit', fontSize: 14, borderLeft: '4px solid var(--purple)' }}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
