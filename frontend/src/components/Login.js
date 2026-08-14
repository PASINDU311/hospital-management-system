import React, { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await API.post('/auth/login', formData);
      console.log("Login Response Data:", response.data);

      const res = response.data;

      // 1. JWT Token Extraction
      const token = res.token || res.jwt || res.accessToken;

      // 2. Role Extraction & Normalization
      const rawRole = res.role || res.user?.role;
      const extractedRole = typeof rawRole === 'string' ? rawRole : rawRole?.name || String(rawRole || '');
      const userRole = extractedRole.toUpperCase(); // Ensures safe matching regardless of case

      // 3. Full Name Extraction
      const fullName = res.fullName || res.name || res.user?.fullName || (userRole.includes('DOCTOR') ? 'Doctor' : 'User');

      // 4. Clean ID Extractions
      const extractedPatientId = res.patientId || res.patient?.patientId || res.user?.patientId;
      const extractedDoctorId = res.doctorId || res.doctor?.doctorId || res.user?.doctorId;

      // Clear current tab's session storage
      sessionStorage.clear();

      if (token) {
        sessionStorage.setItem('token', token);
        localStorage.setItem('token', token); // Backup for page refresh persistence
      }

      sessionStorage.setItem('role', userRole);
      localStorage.setItem('role', userRole);

      sessionStorage.setItem('email', res.email || res.user?.email || formData.email);
      sessionStorage.setItem('fullName', fullName);

      // Save Patient ID if user is PATIENT
      if (userRole.includes('PATIENT') && extractedPatientId) {
        sessionStorage.setItem('patientId', String(extractedPatientId));
        localStorage.setItem('patientId', String(extractedPatientId));
        console.log("Saved Patient ID successfully:", extractedPatientId);
      }

      // Save Doctor ID if user is DOCTOR
      if (userRole.includes('DOCTOR') && extractedDoctorId) {
        sessionStorage.setItem('doctorId', String(extractedDoctorId));
        localStorage.setItem('doctorId', String(extractedDoctorId));
        console.log("Saved Doctor ID successfully:", extractedDoctorId);
      }

      // 5. User Object Storage
      const userObj = {
        id: res.id || res.userId || res.user?.id,
        email: res.email || res.user?.email || formData.email,
        fullName: fullName,
        role: userRole,
        doctorId: extractedDoctorId || null,
        patientId: extractedPatientId || null
      };

      sessionStorage.setItem('user', JSON.stringify(userObj));
      localStorage.setItem('user', JSON.stringify(userObj));

      // 🚦 Navigation Logic
      if (userRole.includes('DOCTOR')) {
        navigate('/doctor/dashboard');
      } else if (userRole.includes('ADMIN')) {
        navigate('/admin-dashboard');
      } else if (userRole.includes('PHARMACIST')) {
        navigate('/pharmacy'); // 🎯 Direct Pharmacist Navigation
      } else {
        navigate('/appointments');
      }

    } catch (err) {
      console.error('Login Error:', err);
      setError(err.response?.data?.message || 'Login failed! Invalid credentials.');
    }
  };

  return (
    <div className="container-fluid p-0 vh-100 login-page">
      <div className="row g-0 vh-100">
        
        {/* Left Side Banner */}
        <div className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center bg-primary text-white p-5 login-left-panel">
          <div className="w-75 text-center">
            <h1 className="display-4 fw-bold mb-4">🏥 HMS Portal</h1>
            <h2 className="mb-4">Dedicated to Your Health.</h2>
            <p className="lead">
              Secure access to your medical records, test results, and direct communication with your dedicated care team.
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="col-md-6 bg-white d-flex flex-column justify-content-center align-items-center p-5">
          <div className="login-form-container">
            <h2 className="fw-bold mb-3 text-dark">Welcome back</h2>
            <p className="text-muted mb-4">Please enter your credentials to access your account.</p>

            {error && <div className="alert alert-danger w-100">{error}</div>}

            <form onSubmit={handleSubmit} className="w-100">
              <div className="mb-3">
                <label className="form-label font-weight-bold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">📧</span>
                  <input
                    type="email"
                    name="email"
                    className="form-control border-start-0 bg-light"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@gmail.com"
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <label className="form-label font-weight-bold">Password</label>
                  <a href="/forgot-password" className="text-decoration-none small">Forgot Password?</a>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">🔒</span>
                  <input
                    type="password"
                    name="password"
                    className="form-control border-start-0 bg-light"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                  />
                </div>
              </div>

              <div className="mb-4 form-check">
                <input type="checkbox" className="form-check-input" id="rememberMe" />
                <label className="form-check-label text-muted" htmlFor="rememberMe">Remember me</label>
              </div>

              <button type="submit" className="btn btn-primary w-100 fw-bold py-2 mb-3">
                Login
              </button>

              <div className="text-center">
                <span className="text-muted">Don't have an account? </span>
                <Link to="/register" className="text-decoration-none fw-bold">Register</Link>
              </div>
            </form>
          </div>

          <div className="small text-muted mt-5 text-center security-label">
            🛡️ HMS Compliant Secure Login
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;