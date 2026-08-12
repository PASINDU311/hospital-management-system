import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import BookAppointment from './components/BookAppointment';
import MyAppointments from './components/MyAppointments'; // Import exact component
import MainLayout from './components/MainLayout';
import './App.css';

// Dashboards
function DoctorDashboard() { return <div className="text-center mt-5"><h1>Doctor Dashboard (Coming Soon)</h1></div> }
function AdminDashboard() { return <div className="text-center mt-5"><h1>Admin Dashboard (Coming Soon)</h1></div> }

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
          {/* Public Routes (With Top Navbar, without Sidebar) */}
          <Route path="/" element={<><Navbar /><Home /></>} />
          <Route path="/register" element={<><Navbar /><Register /></>} />
          <Route path="/login" element={<><Navbar /><Login /></>} />
          <Route path="/doctor-dashboard" element={<><Navbar /><DoctorDashboard /></>} />
          <Route path="/admin-dashboard" element={<><Navbar /><AdminDashboard /></>} />

          {/* Protected Portal Routes (With Permanent Sidebar Layout) */}
          <Route element={<MainLayout />}>
            {/* Patient Dashboard and Appointments page redirecting to MyAppointments table */}
            <Route path="/patient-dashboard" element={<MyAppointments />} />
            <Route path="/appointments" element={<MyAppointments />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
          </Route>

          {/* Fallback Catch-All Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;