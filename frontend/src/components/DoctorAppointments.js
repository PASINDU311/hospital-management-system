import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function DoctorAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Storage එකෙන් Doctor ID එක ලබා ගැනීම
      let docId = sessionStorage.getItem('doctorId') || localStorage.getItem('doctorId');
      const userEmail = sessionStorage.getItem('email') || localStorage.getItem('email');
      const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');

      // storage එකේ direct නැත්නම් 'user' object එක ඇතුළෙන් doctorId එක check කිරීම
      if ((!docId || docId === 'undefined' || docId === 'null') && userStr) {
        try {
          const userObj = JSON.parse(userStr);
          docId = userObj.doctorId || userObj.id;
        } catch (e) {
          console.error("Error parsing user object from storage", e);
        }
      }

      // 2. තවමත් doctorId නැත්නම් -> /doctors API එකෙන් Email එකට අදාළ doctorId හොයා ගැනීම (Ultimate Fallback)
      if ((!docId || docId === 'undefined' || docId === 'null') && userEmail) {
        try {
          console.log("Attempting to find Doctor ID dynamically by email:", userEmail);
          const docRes = await API.get('/doctors');
          const allDocs = Array.isArray(docRes.data) ? docRes.data : [];
          
          const currentDoc = allDocs.find(d => 
            d.email === userEmail || 
            d.user?.email === userEmail ||
            d.fullName?.toLowerCase() === sessionStorage.getItem('fullName')?.toLowerCase()
          );

          if (currentDoc) {
            docId = currentDoc.doctorId || currentDoc.id;
            sessionStorage.setItem('doctorId', String(docId));
            localStorage.setItem('doctorId', String(docId));
            console.log("Found Doctor ID dynamically:", docId);
          }
        } catch (e) {
          console.warn("Could not fetch doctor profile dynamically", e);
        }
      }

      console.log("Final Fetching appointments for Doctor ID:", docId);

      // 3. ID එක හම්බවුණා නම් Appointments Fetch කිරීම
      if (docId && docId !== 'undefined' && docId !== 'null') {
        const res = await API.get(`/appointments/doctor/${docId}`);
        setAppointments(Array.isArray(res.data) ? res.data : []);
      } else {
        console.warn("Doctor ID is missing in storage!");
        setError("Doctor ID not found. Please log out and log in again.");
        setAppointments([]);
      }

    } catch (err) {
      console.error('Error fetching doctor appointments:', err);
      setError('Failed to load appointments from server.');
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

      {error && <div className="alert alert-warning mb-4">{error}</div>}

      <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
        <div className="table-responsive">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary me-2" role="status"></div>
              <span>Loading appointments...</span>
            </div>
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
                  <tr key={app.appointmentNo || app.id}>
                    <td className="fw-bold">{app.appointmentTime || app.time || '10:00 AM'}</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {app.appointmentNo || app.id}
                      </span>
                    </td>
                    <td>
                      <div className="fw-bold">
                        {app.patientName || app.patient?.fullName || app.patient?.name || 'Patient'}
                      </div>
                    </td>
                    <td>{app.notes || app.specialization || app.reason || 'General Consultation'}</td>
                    <td>
                      <span className={`badge ${
                        app.status === 'CONFIRMED' ? 'bg-success-subtle text-success' :
                        app.status === 'COMPLETED' ? 'bg-secondary-subtle text-secondary' : 'bg-warning-subtle text-warning'
                      }`}>
                        {app.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-primary btn-sm fw-bold px-3 rounded-2"
                        onClick={() => handleStartVisit(app.appointmentNo || app.id, app.patientName || app.patient?.fullName)}
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