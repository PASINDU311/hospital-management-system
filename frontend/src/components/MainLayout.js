import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = localStorage.getItem('role') || 'PATIENT';
  const fullName = localStorage.getItem('fullName') || 'User';

  const isActive = (path) => location.pathname === path;

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  const handleDashboardClick = () => {
    if (userRole === 'DOCTOR') {
      navigate('/doctor-dashboard');
    } else if (userRole === 'ADMIN') {
      navigate('/admin-dashboard');
    } else {
      navigate('/patient-dashboard');
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* 1. Global Left Sidebar */}
      <div className="sidebar p-3 d-flex flex-column justify-content-between" style={{ width: '250px', flexShrink: 0 }}>
        <div>
          <div
            className="d-flex align-items-center mb-4 px-2"
            onClick={handleDashboardClick}
            style={{ cursor: 'pointer' }}
          >
            <span className="fs-4 me-2">🏥</span>
            <div>
              <h5 className="fw-bold mb-0 text-white">OmniHealth</h5>
              <small className="text-muted">Medical Center</small>
            </div>
          </div>

          <button
            type="button"
            className="btn sidebar-btn-new w-100 mb-4 text-start"
            onClick={() => navigate('/book-appointment')}
          >
            + New Appointment
          </button>

          <nav className="nav flex-column">
            <button
              type="button"
              className={`nav-link text-start border-0 bg-transparent ${isActive('/patient-dashboard') || isActive('/doctor-dashboard') ? 'active' : ''}`}
              onClick={handleDashboardClick}
            >
              📊 Dashboard
            </button>
            <button
              type="button"
              className={`nav-link text-start border-0 bg-transparent ${isActive('/patients') ? 'active' : ''}`}
              onClick={() => navigate('/patients')}
            >
              👤 Patients
            </button>
            <button
              type="button"
              className={`nav-link text-start border-0 bg-transparent ${isActive('/appointments') || isActive('/book-appointment') ? 'active' : ''}`}
              onClick={() => navigate('/appointments')}
            >
              📅 Appointments
            </button>
            <button
              type="button"
              className={`nav-link text-start border-0 bg-transparent ${isActive('/medical-records') ? 'active' : ''}`}
              onClick={() => navigate('/medical-records')}
            >
              🩺 Medical Records
            </button>
            <button
              type="button"
              className={`nav-link text-start border-0 bg-transparent ${isActive('/settings') ? 'active' : ''}`}
              onClick={() => navigate('/settings')}
            >
              ⚙️ Settings
            </button>
          </nav>
        </div>

        <div>
          <button
            type="button"
            className="nav-link text-danger border-0 bg-transparent text-start w-100"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* 2. Dynamic Content Area */}
      <div className="main-content flex-grow-1 p-4">
        {/* Top Header Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <input
            type="text"
            className="form-control w-25 rounded-pill bg-white border-0 shadow-sm px-3"
            placeholder="🔍 Search patients, doctors..."
          />
          <div className="d-flex align-items-center gap-3">
            <span className="fw-semibold text-secondary me-2">{fullName}</span>
            <span>🔔</span>
            <span>📱</span>
            <img src="https://i.pravatar.cc/150?img=32" alt="profile" className="rounded-circle" width="35" />
          </div>
        </div>

        {/* Dynamic Inner Page Load Place */}
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;