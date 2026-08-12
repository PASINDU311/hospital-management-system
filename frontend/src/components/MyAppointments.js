import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function MyAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const patientId = localStorage.getItem('patientId') || "1";

    try {
      setLoading(true);
      const res = await API.get(`/appointments/patient/${patientId}`);
      const dataArray = Array.isArray(res.data) ? res.data : [];
      setAppointments(dataArray);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError('Failed to fetch appointments from server.');
    } finally {
      setLoading(false);
    }
  };

  // Backend එකේ AppointmentStatus Enum එක අනුව Filter කිරීම
  const filteredAppointments = appointments.filter(apt => {
    const status = (apt.status || 'PENDING').toUpperCase();
    if (activeTab === 'Upcoming') return ['PENDING', 'CONFIRMED', 'BOOKED', 'SCHEDULED'].includes(status);
    if (activeTab === 'Completed') return ['COMPLETED', 'FINISHED'].includes(status);
    if (activeTab === 'Cancelled') return ['CANCELLED', 'REJECTED'].includes(status);
    return true;
  });

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">My Appointments</h3>
          <p className="text-muted mb-0">Manage and track your schedule.</p>
        </div>
        <button 
          className="btn btn-primary px-3 py-2 fw-semibold d-flex align-items-center gap-2 rounded-3 shadow-sm"
          onClick={() => navigate('/book-appointment')}
        >
          <span>+</span> Book New Appointment
        </button>
      </div>

      {error && <div className="alert alert-danger mb-3">{error}</div>}

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          
          {/* Tabs */}
          <div className="border-bottom mb-4">
            <ul className="nav nav-tabs border-0 gap-4">
              {['Upcoming', 'Completed', 'Cancelled'].map((tab) => (
                <li className="nav-item" key={tab}>
                  <button
                    className={`nav-link border-0 pb-3 bg-transparent fw-semibold ${
                      activeTab === tab 
                        ? 'text-primary border-bottom border-primary border-3 active' 
                        : 'text-secondary'
                    }`}
                    style={{ borderRadius: 0 }}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-secondary fs-7 text-uppercase">
                  <tr>
                    <th scope="col" className="border-0 ps-3">Appointment ID</th>
                    <th scope="col" className="border-0">Doctor</th>
                    <th scope="col" className="border-0">Department</th>
                    <th scope="col" className="border-0">Date & Time</th>
                    <th scope="col" className="border-0">Fee</th>
                    <th scope="col" className="border-0">Status</th>
                    <th scope="col" className="border-0 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((apt, index) => {
                      const statusUpper = (apt.status || 'PENDING').toUpperCase();

                      return (
                        <tr key={apt.appointmentNo || index}>
                          {/* Backend appointmentNo Key */}
                          <td className="fw-semibold text-secondary ps-3">
                            #{apt.appointmentNo || `APT-${1000 + index}`}
                          </td>

                          {/* Backend doctorName Key */}
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <img 
                                src="https://i.pravatar.cc/150?img=11" 
                                alt="doctor" 
                                className="rounded-circle"
                                width="38" 
                                height="38" 
                              />
                              <span className="fw-bold text-dark">{apt.doctorName || 'Dr. Medical Officer'}</span>
                            </div>
                          </td>

                          {/* Backend doctorSpecialization Key */}
                          <td className="fw-semibold text-secondary">
                            {apt.doctorSpecialization || 'General'}
                          </td>

                          {/* Date and Time */}
                          <td>
                            <div>
                              <div className="fw-semibold text-dark">{apt.appointmentDate}</div>
                              <small className="text-muted">{apt.appointmentTime}</small>
                            </div>
                          </td>

                          {/* Fee */}
                          <td className="fw-semibold text-dark">
                            ${apt.consultationFee ? Number(apt.consultationFee).toFixed(2) : '50.00'}
                          </td>

                          {/* Status */}
                          <td>
                            <span className={`badge rounded-pill px-3 py-2 ${
                              statusUpper === 'CONFIRMED' ? 'bg-primary-subtle text-primary' :
                              statusUpper === 'PENDING' ? 'bg-warning-subtle text-warning fw-bold' :
                              statusUpper === 'COMPLETED' ? 'bg-success-subtle text-success' :
                              'bg-secondary-subtle text-secondary'
                            }`}>
                              {apt.status || 'PENDING'}
                            </span>
                          </td>

                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <button className="btn btn-sm btn-light border-0 text-muted" title="View Details">👁️</button>
                              <button className="btn btn-sm btn-light border-0 text-muted" title="Reschedule">📅</button>
                              <button className="btn btn-sm btn-light border-0 text-danger" title="Cancel">❌</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        No {activeTab.toLowerCase()} appointments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top text-muted small">
            <span>Showing {filteredAppointments.length} of {appointments.length} appointments</span>
            <div className="d-flex gap-1">
              <button className="btn btn-sm btn-outline-secondary rounded-2" disabled>&lt;</button>
              <button className="btn btn-sm btn-outline-secondary rounded-2" disabled>&gt;</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default MyAppointments;