import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login'; // Import Login
import './App.css'; // Import CSS
import BookAppointment from './components/BookAppointment';

// Dashboard placeholders for now
function PatientDashboard() { return <div className="text-center mt-5"><h1>Patient Dashboard (Coming Soon)</h1></div> }
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
      <Navbar />
      <div className="container-fluid p-0"> {/* container-fluid for login page */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard routes */}
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/appointments" element={<BookAppointment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;