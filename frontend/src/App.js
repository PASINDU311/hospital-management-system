import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import BookAppointment from './components/BookAppointment';
import MyAppointments from './components/MyAppointments';
import MainLayout from './components/MainLayout';
import Pharmacy from './components/Pharmacy';
import AdminDashboard from './components/AdminDashboard'; // ✅ Real Component Import

// MedicalRecords Component එක Import කරගැනීම
import MedicalRecords from './components/MedicalRecords';

// Doctor Module Components
import DoctorLayout from './components/DoctorLayout';
import DoctorDashboard from './components/DoctorDashboard';
import DoctorAppointments from './components/DoctorAppointments';
import ClinicalConsultation from './components/ClinicalConsultation';

import './App.css';

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
          
          {/* Admin Dashboard Route */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* Patient Protected Portal Routes (MainLayout) */}
          <Route element={<MainLayout />}>
            <Route path="/patient-dashboard" element={<MyAppointments />} />
            <Route path="/appointments" element={<MyAppointments />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            
            {/* Medical Records Route */}
            <Route path="/medical-records" element={<MedicalRecords />} />
          </Route>

          {/* Doctor Protected Portal Routes */}
          <Route path="/doctor" element={<DoctorLayout />}>
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="consultation" element={<ClinicalConsultation />} />
          </Route>

          {/* Direct Redirect for Doctor Login */}
          <Route path="/doctor-dashboard" element={<Navigate to="/doctor/dashboard" replace />} />

          {/* Pharmacy Route */}
          <Route path="/pharmacy" element={<Pharmacy />} />

          {/* Fallback Catch-All Route (Must be at the very bottom) */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;