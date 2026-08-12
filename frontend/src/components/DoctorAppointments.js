import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function DoctorAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      // LocalStorage එකේ තියෙන Doctor ID එක හෝ User Details ලබා ගැනීම
      const doctorId = localStorage.getItem('doctorId') || 'DOC-002'; // Default to DOC-002 if not set

      // Real Appointments Fetch කිරීම
      const response = await API.get(`/appointments/doctor/${doctorId}`);
      setAppointments(response.data || []);
    } catch (err) {
      console.error('Error fetching real appointments:', err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartVisit = (appointmentNo, patientName) => {
    navigate('/doctor/consultation', {
      state: { appointmentNo, patientName }
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">Appointments</h2>
          <p className="text-muted mb-0">Manage today's schedule and upcoming patient visits.</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
        <div className="table-responsive">
          {loading ? (
            <p className="text-center py-3">Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <h5>No real appointments found for this doctor yet!</h5>
              <small>Book an appointment as a Patient to test this flow.</small>
            </div>
          ) : (
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th>TIME</th>
                  <th>APPOINTMENT NO</th>
                  <th>PATIENT</th>
                  <th>SPECIALIZATION / REASON</th>
                  <th>STATUS</th>
                  <th className="text-end">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((app) => (
                  <tr key={app.appointmentNo}>
                    <td className="fw-bold">{app.appointmentTime || '10:00 AM'}</td>
                    <td>
                      <span className="badge bg-light text-dark border">{app.appointmentNo}</span>
                    </td>
                    <td>
                      <div className="fw-bold">{app.patientName}</div>
                    </td>
                    <td>{app.notes || app.specialization || 'General Consultation'}</td>
                    <td>
                      <span className={`badge ${
                        app.status === 'CONFIRMED' ? 'bg-success-subtle text-success' :
                        app.status === 'COMPLETED' ? 'bg-secondary-subtle text-secondary' : 'bg-warning-subtle text-warning'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-primary btn-sm fw-bold px-3 rounded-2"
                        onClick={() => handleStartVisit(app.appointmentNo, app.patientName)}
                      >
                        Start Visit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorAppointments;