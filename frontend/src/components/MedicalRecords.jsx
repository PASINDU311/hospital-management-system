import React, { useState, useEffect } from 'react';
import API from '../api';

function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    let apiRecords = [];

    try {
      const patientId = localStorage.getItem('patientId') || 'P-18717';
      const response = await API.get(`/medical-records/patient/${patientId}`);
      if (response.data && Array.isArray(response.data)) {
        apiRecords = response.data;
      }
    } catch (err) {
      console.log('Backend API responded with 404/Error. Fallback to Local Records.');
    }

    const localSaved = JSON.parse(localStorage.getItem('shared_medical_records') || '[]');
    const combined = [...localSaved, ...apiRecords];

    setRecords(combined);
    setLoading(false);
  };

  // Enhanced parsePrescriptions function supporting multiple string formats
  const parsePrescriptions = (prescStr) => {
    if (!prescStr || typeof prescStr !== 'string' || !prescStr.trim()) return [];

    // Split string by commas or newlines
    const items = prescStr.split(/,|\n/);

    return items
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .map((item, index) => {
        // 1. Pipe Format: "Medication | Type | Dosage | Duration"
        if (item.includes('|')) {
          const parts = item.split('|');
          return {
            id: index,
            medication: parts[0]?.trim() || item,
            type: parts[1]?.trim() || 'Medication',
            dosage: parts[2]?.trim() || 'As prescribed',
            duration: parts[3]?.trim() || 'As instructed',
          };
        }

        // 2. Dash Format: "Drug Name - Dosage Info"
        if (item.includes('-')) {
          const firstDashIndex = item.indexOf('-');
          const drugName = item.substring(0, firstDashIndex).trim();
          const dosageInfo = item.substring(firstDashIndex + 1).trim();

          return {
            id: index,
            medication: drugName || item,
            type: 'Medication',
            dosage: dosageInfo || 'As prescribed',
            duration: 'As instructed',
          };
        }

        // 3. Simple String Format
        return {
          id: index,
          medication: item,
          type: 'Medication',
          dosage: 'As prescribed',
          duration: 'As instructed',
        };
      });
  };

  const handlePrint = () => {
    window.print();
  };

  if (selectedRecord) {
    const rxList = parsePrescriptions(selectedRecord.prescription);

    return (
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4 d-print-none">
          <button 
            className="btn btn-outline-secondary rounded-3 fw-bold"
            onClick={() => setSelectedRecord(null)}
          >
            ← RECORD DETAILS
          </button>
          <button className="btn btn-primary rounded-3 fw-bold" onClick={handlePrint}>
            🖨️ Print / Download
          </button>
        </div>

        <div className="mb-4">
          <h2 className="fw-bold mb-1">Consultation Report</h2>
          <p className="text-muted mb-0">
            {selectedRecord.createdAt ? new Date(selectedRecord.createdAt).toLocaleDateString() : 'Today'} • {selectedRecord.doctorName || 'Doctor'}
          </p>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold fs-4" style={{ width: 50, height: 50 }}>
                    {selectedRecord.patientName ? selectedRecord.patientName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">{selectedRecord.patientName || 'umayanga wanasingha'}</h5>
                    <small className="text-muted">ID: {selectedRecord.patientId || 'P-18717'}</small>
                  </div>
                </div>
                <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill">Completed</span>
              </div>

              <hr className="my-3 text-muted" />

              <div className="row g-3">
                <div className="col-md-12">
                  <small className="text-uppercase fw-bold text-muted d-block mb-1">Chief Complaint / Symptoms</small>
                  <p className="text-dark mb-0">{selectedRecord.symptoms}</p>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold text-primary mb-3">🩺 Clinical Diagnosis</h5>
              <div className="p-3 bg-primary bg-opacity-10 rounded-3 mb-3">
                <h6 className="fw-bold text-dark mb-0">{selectedRecord.diagnosis}</h6>
              </div>
              
              <small className="text-uppercase fw-bold text-muted d-block mb-1">Clinical Notes</small>
              <p className="text-secondary">{selectedRecord.doctorNotes || 'No notes.'}</p>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <h5 className="fw-bold mb-3">💊 Prescription</h5>
              <div className="table-responsive">
                <table className="table align-middle table-borderless">
                  <thead className="table-light small text-uppercase">
                    <tr>
                      <th>Medication</th>
                      <th>Dosage</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rxList.length > 0 ? (
                      rxList.map((rx) => (
                        <tr key={rx.id} className="border-bottom">
                          <td>
                            <div className="fw-bold">{rx.medication}</div>
                            <small className="text-muted">{rx.type}</small>
                          </td>
                          <td className="fw-bold">{rx.dosage}</td>
                          <td className="text-muted small">{rx.duration}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-muted text-center py-3">No prescriptions.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredRecords = records.filter(r => 
    r.doctorName?.toLowerCase().includes(search.toLowerCase()) ||
    r.diagnosis?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Medical Records History</h2>
          <p className="text-muted mb-0">Chronological summary of your consultations and diagnoses.</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 bg-white p-3 mb-4 d-print-none">
        <input 
          type="text" 
          className="form-control border-light-subtle rounded-3" 
          placeholder="🔍 Search by doctor or diagnosis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
        {loading ? (
          <p className="text-center py-4">Loading medical records...</p>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <h5>No medical records found</h5>
            <small>Complete a consultation with a doctor to view history here.</small>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light text-uppercase small">
                <tr>
                  <th>Date</th>
                  <th>Doctor</th>
                  <th>Diagnosis Summary</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((rec, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="fw-bold">
                        {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : 'Today'}
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold">{rec.doctorName || 'Dr. Medical Officer'}</div>
                    </td>
                    <td>
                      <span className="fw-semibold text-dark">{rec.diagnosis}</span>
                      <small className="d-block text-muted text-truncate" style={{ maxWidth: '300px' }}>
                        {rec.symptoms}
                      </small>
                    </td>
                    <td className="text-end">
                      <button 
                        className="btn btn-outline-primary btn-sm rounded-2 fw-bold px-3"
                        onClick={() => setSelectedRecord(rec)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicalRecords;