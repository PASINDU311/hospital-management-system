import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import BookAppointment from './components/BookAppointment';
import MyAppointments from './components/MyAppointments';
import MainLayout from './components/MainLayout';

// Doctor Module Components
import DoctorLayout from './components/DoctorLayout';
import DoctorDashboard from './components/DoctorDashboard';
import DoctorAppointments from './components/DoctorAppointments';
import ClinicalConsultation from './components/ClinicalConsultation';

import './App.css';

// Admin Dashboard Placeholder
function AdminDashboard() { 
  return <div className="text-center mt-5"><h1>Admin Dashboard (Coming Soon)</h1></div> 
}

function Home() {
  return (
    <div className="text-center my-5">
      <h1 className="fw-bold text-primary">Welcome to Hospital Management System</h1>
      <p className="lead text-secondary">
        Please login or register to book appointments and access medical services.
      </p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="container-fluid p-0">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Navbar /><Home /></>} />
          <Route path="/register" element={<><Navbar /><Register /></>} />
          <Route path="/login" element={<><Navbar /><Login /></>} />
          <Route path="/admin-dashboard" element={<><Navbar /><AdminDashboard /></>} />

          {/* Patient Protected Portal Routes (MainLayout with Light Sidebar) */}
          <Route element={<MainLayout />}>
            <Route path="/patient-dashboard" element={<MyAppointments />} />
            <Route path="/appointments" element={<MyAppointments />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
          </Route>

          {/* Doctor Protected Portal Routes (DoctorLayout with Dark Sidebar) */}
          <Route path="/doctor" element={<DoctorLayout />}>
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="consultation" element={<ClinicalConsultation />} />
          </Route>

          {/* Direct Redirect for Doctor Login (/doctor-dashboard -> /doctor/dashboard) */}
          <Route path="/doctor-dashboard" element={<Navigate to="/doctor/dashboard" replace />} />

          {/* Fallback Catch-All Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;