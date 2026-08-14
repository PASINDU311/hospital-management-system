import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function BookAppointment() {
  const navigate = useNavigate();

  const departments = [
    { id: 'Cardiology', name: 'Cardiology', icon: '💙' },
    { id: 'Neurology', name: 'Neurology', icon: '🧠' },
    { id: 'Pediatrics', name: 'Pediatrics', icon: '👶' },
    { id: 'Orthopedics', name: 'Orthopedics', icon: '🦴' },
    { id: 'General', name: 'General', icon: '🩺' }
  ];

  const timeSlots = ['09:00 AM', '09:30 AM', '10:30 AM', '11:00 AM', '01:00 PM', '02:00 PM'];

  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const [selectedDept, setSelectedDept] = useState('Cardiology');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('2026-10-15');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [reason, setReason] = useState('Regular checkup');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // 1. Fetch Doctors from Backend Database
  useEffect(() => {
    fetchDoctors();
  }, []);

  // 2. Filter Doctors dynamically whenever Department or All Doctors list changes
  useEffect(() => {
    if (allDoctors.length > 0) {
      const filtered = allDoctors.filter(doc => {
        if (!doc.specialization) return false;
        
        const spec = doc.specialization.toLowerCase();
        const dept = selectedDept.toLowerCase();

        // Matches exact or partial words (e.g., 'Cardiologist' matches 'Cardiology')
        return spec.includes(dept) || dept.includes(spec) || selectedDept === 'General';
      });

      // If no matching doctors in selected department, show all doctors so user can still book
      const listToDisplay = filtered.length > 0 ? filtered : allDoctors;
      setFilteredDoctors(listToDisplay);

      // Automatically select the first doctor from the list
      if (listToDisplay.length > 0) {
        setSelectedDoctor(listToDisplay[0]);
      } else {
        setSelectedDoctor(null);
      }
    } else {
      setFilteredDoctors([]);
      setSelectedDoctor(null);
    }
  }, [selectedDept, allDoctors]);

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const res = await API.get('/doctors');
      const fetchedDocs = Array.isArray(res.data) ? res.data : [];
      setAllDoctors(fetchedDocs);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Failed to fetch doctors from database.");
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedDoctor) {
      setError('Please select a doctor.');
      return;
    }

    setMessage('');
    setError('');

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
      doctorId: String(selectedDoctor.doctorId || selectedDoctor.id),
      department: selectedDept,
      appointmentDate: appointmentDate,
      appointmentTime: convertTo24Hour(selectedTime),
      notes: reason || "General Checkup"
    };

    try {
      await API.post('/appointments/book', payload);
      setMessage('Appointment Booked Successfully!');
      setTimeout(() => {
        navigate('/appointments');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed! Server error.');
    }
  };

  // Helper function to extract doctor's full name safely
  const getDoctorName = (doc) => {
    if (!doc) return 'None';
    return doc.user?.fullName || doc.fullName || doc.name || `Doctor (${doc.doctorId || doc.id})`;
  };

  return (
    <>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-lg-8">
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
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="fs-3 mb-1">{dept.icon}</div>
                    <div className="fw-bold text-dark small">{dept.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Doctors List */}
          <div className="bg-white p-4 rounded-4 shadow-sm mb-4">
            <h6 className="fw-bold mb-3">
              Select Doctor {filteredDoctors.length > 0 && `(${filteredDoctors.length} Available)`}
            </h6>
            {loadingDoctors ? (
              <div className="text-center py-3">
                <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                <small className="text-muted">Loading Doctors from Database...</small>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="p-3 text-center text-muted border rounded-3">
                No doctors found for <strong>{selectedDept}</strong> department in the database.
              </div>
            ) : (
              <div className="row g-3">
                {filteredDoctors.map((doc) => {
                  const docId = doc.doctorId || doc.id;
                  const docName = getDoctorName(doc);
                  const isSelected = selectedDoctor && (selectedDoctor.doctorId || selectedDoctor.id) === docId;

                  return (
                    <div className="col-md-6" key={docId}>
                      <div
                        className={`selection-card p-3 d-flex align-items-center ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedDoctor(doc)}
                        style={{ cursor: 'pointer' }}
                      >
                        <img
                          src={doc.img || "https://i.pravatar.cc/150?img=11"}
                          alt={docName}
                          className="rounded-circle me-3"
                          width="50"
                          height="50"
                        />
                        <div>
                          <h6 className="fw-bold mb-0 text-dark">{docName}</h6>
                          <small className="text-muted">{doc.specialization || 'General Practice'}</small>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Date & Time */}
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
                        style={{ cursor: 'pointer' }}
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

        {/* Right Panel Summary */}
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
                <span className="fw-bold text-dark">{getDoctorName(selectedDoctor)}</span>
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
              />
            </div>

            <hr />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <small className="text-muted text-uppercase fw-bold">Consultation Fee</small>
              <h4 className="fw-bold text-primary mb-0">
                ${selectedDoctor?.consultationFee ? Number(selectedDoctor.consultationFee).toFixed(2) : '50.00'}
              </h4>
            </div>

            <button className="btn btn-primary w-100 fw-bold py-2 mb-2" onClick={handleBooking}>
              Confirm Booking &rarr;
            </button>
            <button className="btn btn-outline-secondary w-100 fw-bold py-2" onClick={() => navigate('/appointments')}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookAppointment;