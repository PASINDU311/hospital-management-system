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
      setLoading(true);

      // 1. Session / LocalStorage Details
      const userEmail = localStorage.getItem('email');
      const loggedInUserStr = localStorage.getItem('user');
      const loggedInUser = loggedInUserStr ? JSON.parse(loggedInUserStr) : null;

      let doctorIdentifier = 
        localStorage.getItem('doctorId') || 
        loggedInUser?.doctorId || 
        loggedInUser?.id || 
        localStorage.getItem('userId');

      // 2. Doctor Identifier එක LocalStorage එකේ නැත්නම් Dynamic Auto-Fallback Logic
      if (!doctorIdentifier || doctorIdentifier === 'null' || doctorIdentifier === 'undefined') {
        try {
          const docRes = await API.get('/doctors');
          const allDocs = docRes.data || [];

          // Logged-in Doctor ගේ Email/User ID එකෙන් Doctor Match කිරීම
          const matchedDoc = allDocs.find(d => 
            (d.user && d.user.email === userEmail) || 
            d.email === userEmail ||
            (d.user && String(d.user.id) === String(loggedInUser?.id))
          );

          if (matchedDoc) {
            doctorIdentifier = matchedDoc.doctorId || matchedDoc.id;
            localStorage.setItem('doctorId', String(doctorIdentifier)); // Save for next time
          }
        } catch (e) {
          console.error("Auto-detect doctor failed:", e);
        }
      }

      // 3. Match වුණු Doctor ගේ Appointments Fetch කිරීම
      if (doctorIdentifier) {
        const response = await API.get(`/appointments/doctor/${doctorIdentifier}`);
        setAppointments(response.data || []);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.error('Error fetching doctor appointments:', err);
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

      <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
        <div className="table-responsive">
          {loading ? (
            <p className="text-center py-3">Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <div className="fs-1 mb-2">📅</div>
              <h5 className="fw-bold">No appointments found for you yet!</h5>
              <small>When patients book appointments with you, they will appear here.</small>
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