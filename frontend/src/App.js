import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Common Components
import Navbar from './components/Navbar';
import MainLayout from './components/MainLayout';
import Home from './components/Home'; // ✅ อලුත් Modern Home Component එක

// Auth & Public Components
import Register from './components/Register';
import Login from './components/Login';

// Patient Components
import BookAppointment from './components/BookAppointment';
import MyAppointments from './components/MyAppointments';
import MedicalRecords from './components/MedicalRecords';

// Admin & Pharmacy Components
import AdminDashboard from './components/AdminDashboard'; // ✅ Real Admin Dashboard
import Pharmacy from './components/Pharmacy';

// Doctor Module Components
import DoctorLayout from './components/DoctorLayout';
import DoctorDashboard from './components/DoctorDashboard';
import DoctorAppointments from './components/DoctorAppointments';
import ClinicalConsultation from './components/ClinicalConsultation';

import './App.css';

function App() {
  return (
    <Router>
      <div className="container-fluid p-0">
        <Routes>
          {/* 🎯 Public Landing Page (Home Component එකේම Built-in Navbar එකක් තියෙන නිසා මෙතනට Navbar එක ඕන නෑ) */}
          <Route path="/" element={<Home />} />

          {/* Public Auth Routes */}
          <Route path="/register" element={<><Navbar /><Register /></>} />
          <Route path="/login" element={<><Navbar /><Login /></>} />

          {/* Admin Dashboard Route */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* Patient Protected Portal Routes (MainLayout) */}
          <Route element={<MainLayout />}>
            <Route path="/patient-dashboard" element={<MyAppointments />} />
            <Route path="/appointments" element={<MyAppointments />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
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

          {/* 🚨 Fallback Catch-All Route (Must strictly be at the VERY BOTTOM) */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;