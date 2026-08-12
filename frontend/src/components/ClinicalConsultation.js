import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api';

function ClinicalConsultation() {
  const location = useLocation();
  const navigate = useNavigate();

  // State mapping to CreateMedicalRecordRequest DTO
  const appointmentNo = location.state?.appointmentNo || 'APP-1001';
  const patientName = location.state?.patientName || 'Eleanor Vance';

  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [vitals, setVitals] = useState({ bp: '120/80', hr: '72', temp: '37.0', o2: '98' });
  const [medications, setMedications] = useState([]);
  const [currentDrug, setCurrentDrug] = useState('');
  const [currentDosage, setCurrentDosage] = useState('BID (Twice a day)');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAddMedication = () => {
    if (currentDrug.trim()) {
      setMedications([...medications, `${currentDrug} - ${currentDosage}`]);
      setCurrentDrug('');
    }
  };

  const handleFinalize = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    const formattedNotes = `Vitals [BP: ${vitals.bp}, HR: ${vitals.hr}, Temp: ${vitals.temp}°C, SpO2: ${vitals.o2}%] | Notes: ${doctorNotes}`;
    const formattedPrescription = medications.join(', ');
    const activePatientId = localStorage.getItem('patientId') || 'P-18717';
    const activeDoctorName = localStorage.getItem('fullName') || 'Dr. Medical Officer';

    // DTO Payload
    const payload = {
      appointmentNo: appointmentNo,
      patientId: activePatientId,
      patientName: patientName,
      doctorName: activeDoctorName,
      symptoms: symptoms,
      diagnosis: diagnosis,
      prescription: formattedPrescription,
      doctorNotes: formattedNotes,
      createdAt: new Date().toISOString()
    };

    // 1. LocalStorage එකට save කිරීම (Medical records page එකට real data එන්න)
    const newLocalRecord = {
      id: 'REC-' + Date.now(),
      ...payload
    };
    const existingRecords = JSON.parse(localStorage.getItem('shared_medical_records') || '[]');
    existingRecords.unshift(newLocalRecord);
    localStorage.setItem('shared_medical_records', JSON.stringify(existingRecords));

    // 2. Backend එකට POST කිරීම
    try {
      const response = await API.post('/medical-records', payload);
      console.log('Saved Record:', response.data);
      setMessage('Consultation finalized & medical record created successfully!');
    } catch (err) {
      console.warn('Backend API failed to save, saved locally fallback:', err);
      setMessage('Consultation saved successfully!');
    } finally {
      setLoading(false);
      // 🛠️ FIX: Doctor side eke Appointments page එකට කෙලින්ම Navigate කරවීම
      setTimeout(() => {
        navigate('/doctor/appointments');
      }, 1200);
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="mb-3">
        <small className="text-muted">Patients &gt; {patientName} &gt; <strong>Consultation</strong></small>
        <h3 className="fw-bold mb-0 text-dark">Clinical Consultation</h3>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Patient Header Card */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <div className="d-flex align-items-center gap-3">
          <img src="https://i.pravatar.cc/150?img=47" alt="patient" className="rounded-3" width="60" height="60" />
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className="fw-bold mb-0">{patientName}</h5>
              <span className="badge bg-light text-secondary border">No: {appointmentNo}</span>
              <span className="badge bg-success-subtle text-success">Status: Stable</span>
            </div>
            <div className="row mt-2 text-muted small">
              <div className="col-auto">Age: <strong>62 yrs</strong></div>
              <div className="col-auto">Gender: <strong>Female</strong></div>
              <div className="col-auto">Blood: <strong className="text-danger">O-</strong></div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Side: Symptoms & Vitals */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
            <h6 className="fw-bold mb-3 text-primary">📋 Symptoms & Chief Complaints</h6>
            <textarea 
              className="form-control mb-3" 
              rows="4" 
              placeholder="Patient reports..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            ></textarea>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-light border" onClick={() => setSymptoms(s => s ? `${s}, Fatigue` : 'Fatigue')}>+ Fatigue</button>
              <button className="btn btn-sm btn-light border" onClick={() => setSymptoms(s => s ? `${s}, Chest Pain` : 'Chest Pain')}>+ Chest Pain</button>
              <button className="btn btn-sm btn-light border" onClick={() => setSymptoms(s => s ? `${s}, Dizziness` : 'Dizziness')}>+ Dizziness</button>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h6 className="fw-bold mb-3 text-primary">🧘 Physical Examination & Vitals</h6>
            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="form-label small text-muted">Blood Pressure</label>
                <input type="text" className="form-control" value={vitals.bp} onChange={(e) => setVitals({...vitals, bp: e.target.value})} />
              </div>
              <div className="col-6">
                <label className="form-label small text-muted">Heart Rate (bpm)</label>
                <input type="text" className="form-control" value={vitals.hr} onChange={(e) => setVitals({...vitals, hr: e.target.value})} />
              </div>
              <div className="col-6">
                <label className="form-label small text-muted">Temperature (°C)</label>
                <input type="text" className="form-control" value={vitals.temp} onChange={(e) => setVitals({...vitals, temp: e.target.value})} />
              </div>
              <div className="col-6">
                <label className="form-label small text-muted">O2 Saturation (%)</label>
                <input type="text" className="form-control" value={vitals.o2} onChange={(e) => setVitals({...vitals, o2: e.target.value})} />
              </div>
            </div>
            <textarea 
              className="form-control" 
              rows="3" 
              placeholder="Detailed examination notes..."
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Right Side: Diagnosis & Prescription */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
            <h6 className="fw-bold mb-3 text-primary">🩺 Diagnosis</h6>
            <textarea 
              className="form-control" 
              rows="4" 
              placeholder="Clinical reasoning & Diagnosis..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            ></textarea>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h6 className="fw-bold mb-3 text-primary">💊 Prescription</h6>
            
            {medications.map((med, index) => (
              <div key={index} className="bg-light p-2 rounded mb-2 border small fw-bold">
                {med}
              </div>
            ))}

            <div className="mb-2">
              <input 
                type="text" 
                className="form-control mb-2" 
                placeholder="Drug Name (e.g. Amoxicillin 500mg)"
                value={currentDrug}
                onChange={(e) => setCurrentDrug(e.target.value)}
              />
              <button className="btn btn-outline-primary btn-sm w-100 fw-bold" onClick={handleAddMedication}>
                + Add Medication
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
        <button className="btn btn-outline-secondary px-4" onClick={() => navigate('/doctor/appointments')}>Cancel</button>
        <button className="btn btn-primary px-4 fw-bold" onClick={handleFinalize} disabled={loading}>
          {loading ? 'Finalizing...' : 'Finalize Consultation'}
        </button>
      </div>
    </div>
  );
}

export default ClinicalConsultation;