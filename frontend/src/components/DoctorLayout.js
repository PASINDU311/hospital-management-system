import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

function DoctorLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [doctorName, setDoctorName] = useState('Doctor');

  useEffect(() => {
    // sessionStorage එකෙන් Doctor Name එක dynamically අදිනවා
    const storedName = sessionStorage.getItem('fullName');
    const userStr = sessionStorage.getItem('user');

    if (storedName && storedName.trim() !== '') {
      setDoctorName(storedName);
    } else if (userStr) {
      try {
        const uObj = JSON.parse(userStr);
        if (uObj.fullName) setDoctorName(uObj.fullName);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Dark Sidebar */}
      <div
        className="d-flex flex-column justify-content-between p-3 text-white"
        style={{ width: '260px', backgroundColor: '#1e293b', flexShrink: 0 }}
      >
        <div>
          {/* Logo */}
          <div className="mb-4 ps-2 pt-2">
            <h4 className="fw-bold mb-0 text-white">MedPulse HMS</h4>
          </div>

          {/* Navigation Items */}
          <nav className="nav flex-column gap-1">
            <button
              className={`btn text-start text-white border-0 py-2.5 px-3 rounded-3 d-flex align-items-center gap-3 ${
                isActive('/doctor/dashboard') ? 'bg-primary fw-bold' : 'opacity-75'
              }`}
              onClick={() => navigate('/doctor/dashboard')}
            >
              <span>📊</span> Dashboard
            </button>

            <button
              className={`btn text-start text-white border-0 py-2.5 px-3 rounded-3 d-flex align-items-center gap-3 ${
                isActive('/doctor/appointments') ? 'bg-primary fw-bold' : 'opacity-75'
              }`}
              onClick={() => navigate('/doctor/appointments')}
            >
              <span>📅</span> Appointments
            </button>

            <button
              className={`btn text-start text-white border-0 py-2.5 px-3 rounded-3 d-flex align-items-center gap-3 ${
                isActive('/doctor/consultation') ? 'bg-primary fw-bold' : 'opacity-75'
              }`}
              onClick={() => navigate('/doctor/consultation')}
            >
              <span>🩺</span> Consultation
            </button>
          </nav>
        </div>

        <div>
          {/* Emergency Alert Button */}
          <button className="btn btn-danger w-100 py-2 fw-bold mb-4 rounded-3 d-flex align-items-center justify-content-center gap-2">
            <span>⚠️</span> Emergency Alert
          </button>

          {/* Doctor Profile Footer */}
          <div className="p-2 rounded-3 bg-dark bg-opacity-50 d-flex align-items-center gap-3 mb-2">
            <img
              src="https://i.pravatar.cc/150?img=60"
              alt="doctor"
              className="rounded-circle"
              width="40"
              height="40"
            />
            <div className="overflow-hidden">
              <div className="fw-bold small text-truncate">{doctorName}</div>
              <small className="text-muted d-block small">Medical Specialist</small>
            </div>
          </div>

          <button
            className="btn btn-sm btn-outline-light border-0 w-100 text-start text-danger opacity-75 mt-1"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Top Search & Action Bar */}
        <div className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
          <div className="input-group" style={{ maxWidth: '350px' }}>
            <span className="input-group-text bg-light border-end-0">🔍</span>
            <input
              type="text"
              className="form-control bg-light border-start-0 shadow-none"
              placeholder="Search patients, records..."
            />
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted small">Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Dynamic Doctor Pages */}
        <div className="p-4 flex-grow-1">
          <Outlet />
        </div>

        {/* Footer */}
        <footer className="bg-white border-top py-3 px-4 d-flex justify-content-between text-muted small">
          <span>© 2026 MedPulse Systems. All rights reserved.</span>
          <div className="d-flex gap-3">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default DoctorLayout;