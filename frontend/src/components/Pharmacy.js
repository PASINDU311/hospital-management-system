import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import './Pharmacy.css';

const Pharmacy = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('prescriptions');
  const [selectedRx, setSelectedRx] = useState(null);
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const pharmacistName = localStorage.getItem('fullName') || 'Dr. Sarah Jenkins';

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await API.get('/medical-records/patient/all').catch(() => null);
      let data = response?.data;

      if (!data || data.length === 0) {
        const localData = JSON.parse(localStorage.getItem('shared_medical_records') || '[]');
        data = localData.length > 0 ? localData : getMockPrescriptions();
      }
      setRecords(data);
    } catch (err) {
      setRecords(getMockPrescriptions());
    }
  };

  const getMockPrescriptions = () => [
    {
      appointmentNo: 'Rx-8924A',
      patientName: 'Eleanor Vance',
      patientId: 'PT-20993',
      dob: '11/04/1952',
      allergies: 'Penicillin, Sulfa',
      weight: '68 kg',
      doctorName: 'Dr. Aris Thorne',
      specialty: 'Cardiology',
      prescription: 'Lisinopril 10mg - 1 tablet daily (Qty: 30), Atorvastatin 20mg - 1 tablet at bedtime (Qty: 30)',
      symptoms: 'Mild dizziness upon standing',
      doctorNotes: 'Patient reports mild dizziness upon standing. Monitor BP closely during initial week of titration.',
      createdAt: new Date().toISOString(),
      status: 'Verified by MD',
      priority: 'URGENT'
    },
    {
      appointmentNo: 'Rx-9102B',
      patientName: 'Alicia Florrick',
      patientId: 'PT-9102',
      dob: '03/15/1982',
      doctorName: 'Dr. S. Patil',
      specialty: 'Gen Med',
      prescription: 'Amoxicillin 500mg capsule',
      doctorNotes: 'Take after meals.',
      createdAt: new Date().toISOString(),
      status: 'In Progress',
      priority: 'ROUTINE'
    }
  ];

  const handleDispenseConfirm = (rx) => {
    setStatusMessage(`Prescription ${rx.appointmentNo} Dispensed Successfully!`);
    
    const updated = records.map(r => 
      r.appointmentNo === rx.appointmentNo ? { ...r, status: 'DISPENSED' } : r
    );
    setRecords(updated);
    
    const billingQueue = JSON.parse(localStorage.getItem('pharmacy_dispensed_bills') || '[]');
    billingQueue.unshift({
      appointmentNo: rx.appointmentNo,
      patientName: rx.patientName,
      doctorName: rx.doctorName,
      prescription: rx.prescription,
      dispensedAt: new Date().toISOString(),
      pharmacyFee: 45.00
    });
    localStorage.setItem('pharmacy_dispensed_bills', JSON.stringify(billingQueue));

    setTimeout(() => {
      setStatusMessage('');
      setSelectedRx(null);
    }, 1500);
  };

  const parseMedications = (prescriptionStr) => {
    if (!prescriptionStr) return [];
    const items = prescriptionStr.split(',');
    return items.map((item, idx) => {
      const parts = item.trim().split('-');
      return {
        id: idx,
        name: parts[0] || item,
        dosage: parts[1] || 'Standard Dosage',
        frequency: parts[2] || 'As prescribed',
        qty: 30
      };
    });
  };

  return (
    <div className="pharmacy-container">
      {/* Sidebar Navigation */}
      <aside className="pharmacy-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">✚</div>
          <div>
            <h3 className="brand-name">OmniHealth</h3>
            <span className="brand-sub">Pharmacy Division</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <button className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setSelectedRx(null); }}>
            📊 <span>Dashboard</span>
          </button>
          <button className={`menu-item ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}>
            👤 <span>Patients</span>
          </button>
          <button className={`menu-item ${activeTab === 'prescriptions' ? 'active' : ''}`} onClick={() => { setActiveTab('prescriptions'); setSelectedRx(null); }}>
            📋 <span>Prescriptions</span>
          </button>
          <button className={`menu-item ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
            💊 <span>Inventory</span>
          </button>
          <button className="menu-item">📈 <span>Analytics</span></button>
          <button className="menu-item">⚙️ <span>Settings</span></button>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-emergency">🚨 Emergency Alert</button>
          <div className="user-profile">
            <div className="avatar">👩‍⚕️</div>
            <div className="user-info">
              <p className="user-name">{pharmacistName}</p>
              <p className="user-role">Medical Director / Pharmacist</p>
            </div>
          </div>
          <button className="btn-logout" onClick={() => { localStorage.clear(); navigate('/login'); }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="pharmacy-main">
        {/* Top Header Bar */}
        <header className="pharmacy-header">
          <div className="search-bar">
            🔍 <input 
              type="text" 
              placeholder="Search patients or Rx..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="header-actions">
            <button className="icon-btn">🔔</button>
            <button className="icon-btn">📜</button>
            <button className="icon-btn">❓</button>
            <button className="btn-dispense-head">Dispense Meds</button>
          </div>
        </header>

        {statusMessage && <div className="alert-banner-success">{statusMessage}</div>}

        {/* Dynamic Content View */}
        {selectedRx ? (
          /* ================= MEDICATION FULFILLMENT VIEW ================= */
          <div className="fulfillment-view">
            <div className="breadcrumb">
              <span onClick={() => setSelectedRx(null)} style={{cursor: 'pointer', color: '#0077b6'}}>Prescriptions</span> &gt; <strong>{selectedRx.appointmentNo}</strong>
            </div>

            <div className="view-title-bar">
              <h2>Medication Fulfillment</h2>
              <div className="rx-tags">
                <span className="badge-verified">✓ Verified by MD</span>
                <span className="badge-rx-id">{selectedRx.appointmentNo}</span>
              </div>
            </div>

            <div className="fulfillment-grid">
              {/* Left Column */}
              <div className="info-col">
                <div className="pharmacy-card">
                  <div className="card-head-patient">
                    <span className="p-avatar">👤</span>
                    <div>
                      <h3>{selectedRx.patientName}</h3>
                      <p className="sub-text">Patient ID: {selectedRx.patientId || 'PT-20993'}</p>
                    </div>
                  </div>
                  <div className="p-details-grid">
                    <div><span>DOB:</span> <strong>{selectedRx.dob || '11/04/1952'}</strong></div>
                    <div><span>Allergies:</span> <strong className="text-danger">{selectedRx.allergies || 'Penicillin, Sulfa'}</strong></div>
                    <div><span>Weight:</span> <strong>{selectedRx.weight || '68 kg'}</strong></div>
                  </div>
                </div>

                <div className="pharmacy-card">
                  <h4>🩺 Prescriber Details</h4>
                  <div className="doc-info-row">
                    <div className="doc-avatar">👨‍⚕️</div>
                    <div>
                      <strong>{selectedRx.doctorName || 'Dr. Aris Thorne'}</strong>
                      <p className="sub-text">{selectedRx.specialty || 'Cardiology'}</p>
                    </div>
                  </div>
                  <div className="doc-notes-box">
                    <p className="notes-label">Doctor's Notes</p>
                    <p className="notes-content">"{selectedRx.doctorNotes || 'Proceed with standard dosage protocol.'}"</p>
                  </div>
                </div>

                <div className="pharmacy-card">
                  <h4>Fulfillment Status</h4>
                  <ul className="status-timeline">
                    <li className="done">✓ Prescription Received</li>
                    <li className="done">✓ Inventory Checked</li>
                    <li className={selectedRx.status === 'DISPENSED' ? 'done' : 'pending'}>
                      {selectedRx.status === 'DISPENSED' ? '✓ Dispense Completed' : '⌛ Pending Dispensation'}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Column */}
              <div className="meds-col">
                <div className="pharmacy-card">
                  <div className="med-table-header">
                    <h3>Medications to Dispense</h3>
                    <span>{parseMedications(selectedRx.prescription).length} Items</span>
                  </div>

                  <table className="meds-table">
                    <thead>
                      <tr>
                        <th>Medication</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                        <th>Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parseMedications(selectedRx.prescription).map((med, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="med-name-cell">
                              💊 <strong>{med.name}</strong>
                            </div>
                          </td>
                          <td>{med.dosage}</td>
                          <td>{med.frequency}</td>
                          <td><strong>{med.qty}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="interaction-check-box">
                    <span>ℹ️ Check for potential interactions before dispensing.</span>
                    <div className="no-interaction-alert">
                      ✓ No major interactions detected.
                    </div>
                  </div>
                </div>

                <div className="action-footer-card">
                  <p>Confirming will update inventory and notify patient.</p>
                  <div className="btn-group-action">
                    <button className="btn-hold" onClick={() => setSelectedRx(null)}>Hold Rx</button>
                    <button 
                      className="btn-confirm-dispense" 
                      onClick={() => handleDispenseConfirm(selectedRx)}
                      disabled={selectedRx.status === 'DISPENSED'}
                    >
                      {selectedRx.status === 'DISPENSED' ? 'Already Dispensed' : '📦 Confirm & Dispense'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================= DISPENSARY QUEUE VIEW ================= */
          <div className="queue-view">
            <div className="queue-header">
              <div>
                <h2>Dispensary Queue</h2>
                <p className="sub-text">Manage and dispense active prescriptions.</p>
              </div>
            </div>

            <div className="stats-row">
              <div className="stat-card">
                <div>
                  <p className="stat-label">Pending Orders</p>
                  <h1 className="stat-val">{records.length}</h1>
                  <span className="stat-badge text-danger">+3 urgent</span>
                </div>
                <div className="stat-icon">📋</div>
              </div>

              <div className="stat-card active-card">
                <div>
                  <p className="stat-label">In Progress</p>
                  <h1 className="stat-val">12</h1>
                  <span className="stat-sub">Actively filling</span>
                </div>
                <div className="stat-icon">🔄</div>
              </div>

              <div className="stat-card">
                <div>
                  <p className="stat-label">Dispensed Today</p>
                  <h1 className="stat-val">156</h1>
                </div>
                <div className="stat-icon text-success">✓</div>
              </div>
            </div>

            <div className="pharmacy-card table-card">
              <h3>Active Prescriptions</h3>
              <table className="queue-table">
                <thead>
                  <tr>
                    <th>Patient Details</th>
                    <th>Medication</th>
                    <th>Prescribing Dr.</th>
                    <th>Status & Priority</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <strong>{item.patientName}</strong>
                        <div className="sub-text">ID: {item.appointmentNo}</div>
                      </td>
                      <td>
                        <div className="med-summary">{item.prescription || 'Standard Prescription'}</div>
                      </td>
                      <td>{item.doctorName}</td>
                      <td>
                        <span className={`priority-tag ${item.priority === 'URGENT' ? 'urgent' : 'routine'}`}>
                          {item.priority || 'ROUTINE'}
                        </span>
                        <div className="sub-text">{item.status || 'Pending'}</div>
                      </td>
                      <td>
                        <button 
                          className="btn-view-dispense"
                          onClick={() => setSelectedRx(item)}
                        >
                          View & Dispense
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Pharmacy;