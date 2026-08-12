import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function BookAppointment() {
  const navigate = useNavigate();

  // Dummy lists matching UI (You can dynamic fetch from backend later)
  const departments = [
    { id: 'Cardiology', name: 'Cardiology', icon: '💙' },
    { id: 'Neurology', name: 'Neurology', icon: '🧠' },
    { id: 'Pediatrics', name: 'Pediatrics', icon: '👶' },
    { id: 'Orthopedics', name: 'Orthopedics', icon: '🦴' }
  ];

  const doctors = [
    { id: 1, name: 'Dr. Robert Chen', spec: 'Cardiologist • 15 yrs exp', fee: 50.00, img: 'https://i.pravatar.cc/150?img=11' },
    { id: 2, name: 'Dr. Sarah Jenkins', spec: 'Cardiologist • 8 yrs exp', fee: 45.00, img: 'https://i.pravatar.cc/150?img=5' }
  ];

  const timeSlots = ['09:00 AM', '09:30 AM', '10:30 AM', '11:00 AM', '01:00 PM', '02:00 PM'];

  // Form selections
  const [selectedDept, setSelectedDept] = useState('Cardiology');
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
  const [appointmentDate, setAppointmentDate] = useState('2026-10-15');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [reason, setReason] = useState('Regular checkup');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleBooking = async () => {
    setMessage('');
    setError('');

    // localStorage එකෙන් patientId එක ගැනීම (Fallback එක විදියට "1" යැවීම)
    const patientId = localStorage.getItem('patientId') || "1";

    const convertTo24Hour = (timeStr) => {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') hours = '00';
      if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
      return `${String(hours).padStart(2, '0')}:${minutes}:00`;
    };

    const payload = {
      patientId: String(patientId),
      doctorId: String(selectedDoctor.id),
      appointmentDate: appointmentDate,
      appointmentTime: convertTo24Hour(selectedTime),
      notes: reason || "General Checkup"
    };

    console.log("Final Booking Payload:", payload);

    try {
      const response = await API.post('/appointments/book', payload);
      setMessage('Appointment Booked Successfully!');
      setTimeout(() => {
        navigate('/patient-dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed! Server error.');
    }
  };

  return (
    <div className="d-flex">
      {/* 1. Left Sidebar (Matching Design) */}
      <div className="sidebar p-3 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex align-items-center mb-4 px-2">
            <span className="fs-4 me-2">🏥</span>
            <div>
              <h5 className="fw-bold mb-0 text-white">OmniHealth</h5>
              <small className="text-muted">Medical Center</small>
            </div>
          </div>

          <button className="btn sidebar-btn-new w-100 mb-4 text-start">
            + New Appointment
          </button>

          <nav className="nav flex-column">
            <a className="nav-link" href="#dashboard">📊 Dashboard</a>
            <a className="nav-link" href="#patients">👤 Patients</a>
            <a className="nav-link active" href="#appointments">📅 Appointments</a>
            <a className="nav-link" href="#records">🩺 Medical Records</a>
            <a className="nav-link" href="#settings">⚙️ Settings</a>
          </nav>
        </div>

        <div>
          <a className="nav-link text-danger" href="/login">🚪 Logout</a>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="main-content flex-grow-1 p-4">
        {/* Top Header Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <input
            type="text"
            className="form-control w-25 rounded-pill bg-white border-0 shadow-sm px-3"
            placeholder="🔍 Search patients, doctors..."
          />
          <div className="d-flex align-items-center gap-3">
            <span>🔔</span>
            <span>📱</span>
            <img src="https://i.pravatar.cc/150?img=32" alt="profile" className="rounded-circle" width="35" />
          </div>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row">
          {/* Main Booking Controls */}
          <div className="col-lg-8">
            {/* Stepper Header */}
            <div className="bg-white p-3 rounded-4 shadow-sm mb-4">
              <h4 className="fw-bold text-primary mb-3">Book New Appointment</h4>
              <div className="d-flex align-items-center justify-content-between px-4">
                <div className="text-center">
                  <div className="step-circle step-active mx-auto mb-1">1</div>
                  <small className="fw-bold text-primary">Details</small>
                </div>
                <div className="flex-grow-1 border-top border-2 mx-2"></div>
                <div className="text-center">
                  <div className="step-circle step-active mx-auto mb-1">2</div>
                  <small className="fw-bold text-primary">Doctor & Time</small>
                </div>
                <div className="flex-grow-1 border-top border-2 mx-2"></div>
                <div className="text-center">
                  <div className="step-circle step-inactive mx-auto mb-1">3</div>
                  <small className="text-muted">Reason</small>
                </div>
              </div>
            </div>

            {/* Department Selection */}
            <div className="bg-white p-4 rounded-4 shadow-sm mb-4">
              <h6 className="fw-bold mb-3">Select Department</h6>
              <div className="row g-3">
                {departments.map((dept) => (
                  <div className="col-6 col-md-3" key={dept.id}>
                    <div
                      className={`selection-card p-3 text-center ${selectedDept === dept.id ? 'selected' : ''}`}
                      onClick={() => setSelectedDept(dept.id)}
                    >
                      <div className="fs-3 mb-1">{dept.icon}</div>
                      <div className="fw-bold text-dark">{dept.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor Selection */}
            <div className="bg-white p-4 rounded-4 shadow-sm mb-4">
              <h6 className="fw-bold mb-3">Select Doctor</h6>
              <div className="row g-3">
                {doctors.map((doc) => (
                  <div className="col-md-6" key={doc.id}>
                    <div
                      className={`selection-card p-3 d-flex align-items-center ${selectedDoctor.id === doc.id ? 'selected' : ''}`}
                      onClick={() => setSelectedDoctor(doc)}
                    >
                      <img src={doc.img} alt={doc.name} className="rounded-circle me-3" width="50" height="50" />
                      <div>
                        <h6 className="fw-bold mb-0 text-dark">{doc.name}</h6>
                        <small className="text-muted">{doc.spec}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date and Time Selection */}
            <div className="bg-white p-4 rounded-4 shadow-sm mb-4">
              <div className="row">
                <div className="col-md-6 mb-3 mb-md-0">
                  <h6 className="fw-bold mb-3">Select Date</h6>
                  <input
                    type="date"
                    className="form-control p-2 border-1 rounded-3"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">Available Times</h6>
                  <div className="row g-2">
                    {timeSlots.map((time) => (
                      <div className="col-6" key={time}>
                        <div
                          className={`time-slot-btn ${selectedTime === time ? 'selected' : ''}`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Card (Matching Design) */}
          <div className="col-lg-4">
            <div className="bg-white p-4 rounded-4 shadow-sm">
              <h5 className="fw-bold mb-4">Booking Summary</h5>

              <div className="mb-3 d-flex align-items-center">
                <span className="me-3">🏢</span>
                <div>
                  <small className="text-muted d-block text-uppercase fw-bold">Department</small>
                  <span className="fw-bold text-dark">{selectedDept}</span>
                </div>
              </div>

              <div className="mb-3 d-flex align-items-center">
                <span className="me-3">🩺</span>
                <div>
                  <small className="text-muted d-block text-uppercase fw-bold">Doctor</small>
                  <span className="fw-bold text-dark">{selectedDoctor.name}</span>
                </div>
              </div>

              <div className="mb-4 d-flex align-items-center">
                <span className="me-3">📅</span>
                <div>
                  <small className="text-muted d-block text-uppercase fw-bold">Date & Time</small>
                  <span className="fw-bold text-dark">{appointmentDate} - {selectedTime}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold small text-muted text-uppercase">Reason for Visit</label>
                <input
                  type="text"
                  className="form-control"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Regular Checkup"
                />
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <small className="text-muted text-uppercase fw-bold">Consultation Fee</small>
                <h4 className="fw-bold text-primary mb-0">${selectedDoctor.fee.toFixed(2)}</h4>
              </div>

              <button className="btn btn-primary w-100 fw-bold py-2 mb-2" onClick={handleBooking}>
                Confirm Booking &rarr;
              </button>
              <button className="btn btn-outline-secondary w-100 fw-bold py-2">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;