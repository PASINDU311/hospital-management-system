import React from 'react';
import { useNavigate } from 'react-router-dom';

function DoctorDashboard() {
  const navigate = useNavigate();
  const doctorName = localStorage.getItem('fullName') || 'Dr. Richardson';

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">Good morning, {doctorName}</h2>
          <p className="text-muted mb-0">Here is your clinical overview for today.</p>
        </div>
        <button 
          className="btn btn-primary fw-bold px-4 py-2 rounded-3"
          onClick={() => navigate('/doctor/consultation')}
        >
          + New Consultation
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-circle fs-4">👥</div>
              <div>
                <small className="text-muted fw-bold d-block text-uppercase">Total Patients Today</small>
                <h3 className="fw-bold mb-0">24</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-success bg-opacity-10 text-success rounded-circle fs-4">📄</div>
              <div>
                <small className="text-muted fw-bold d-block text-uppercase">Pending Reports</small>
                <h3 className="fw-bold mb-0">7</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 bg-danger bg-opacity-10 text-danger rounded-circle fs-4">🩹</div>
              <div>
                <small className="text-muted fw-bold d-block text-uppercase">Upcoming Surgeries</small>
                <h3 className="fw-bold mb-0">2</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;