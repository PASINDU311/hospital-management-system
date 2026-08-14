import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function Pharmacy() {
  const navigate = useNavigate();
  const [appointmentNo, setAppointmentNo] = useState('');
  const [hospitalFee, setHospitalFee] = useState('500.00');
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Search or Generate Invoice
  const handleSearchOrGenerate = async (e) => {
    e.preventDefault();
    if (!appointmentNo.trim()) return;
    
    setError('');
    setSuccessMsg('');
    setInvoice(null);
    setLoading(true);

    try {
      // 1. Check existing invoice
      const res = await API.get(`/billing/appointment/${appointmentNo.trim()}`);
      setInvoice(res.data);
    } catch (err) {
      // 2. Generate new if not found
      try {
        const genRes = await API.post('/billing/generate', {
          appointmentNo: appointmentNo.trim(),
          hospitalFee: parseFloat(hospitalFee) || 500.00
        });
        setInvoice(genRes.data);
        setSuccessMsg('Invoice generated successfully!');
      } catch (genErr) {
        setError(genErr.response?.data?.message || 'Appointment not found or Invalid!');
      }
    } finally {
      setLoading(false);
    }
  };

  // Mark Payment as Paid
  const handlePay = async () => {
    if (!invoice) return;
    setLoading(true);
    setError('');

    try {
      const res = await API.put(`/billing/pay/${invoice.invoiceNo}`);
      setInvoice(res.data);
      setSuccessMsg('Payment status updated to PAID!');
    } catch (err) {
      setError(err.response?.data?.message || 'Payment update failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      
      {/* 1. DARK BLUE SIDEBAR */}
      <div 
        className="d-flex flex-column flex-shrink-0 p-3 text-white" 
        style={{ width: '260px', backgroundColor: '#0b1d3a' }}
      >
        {/* Brand Header */}
        <div className="d-flex align-items-center mb-4 px-2">
          <div className="bg-primary text-white rounded p-2 me-2 d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
            🏥
          </div>
          <div>
            <h5 className="fw-bold mb-0 text-white fs-6">HMS Portal</h5>
            <small className="text-white-50" style={{ fontSize: '11px' }}>Hospital Management</small>
          </div>
        </div>

        <hr className="text-secondary my-2" />

        {/* Sidebar Nav Items */}
        <ul className="nav nav-pills flex-column mb-auto mt-3 gap-1">
          <li className="nav-item">
            <button onClick={() => navigate('/admin-dashboard')} className="nav-link text-white-50 w-100 text-start border-0 bg-transparent py-2 px-3">
              📊 Dashboard
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/medical-records')} className="nav-link text-white-50 w-100 text-start border-0 bg-transparent py-2 px-3">
              👥 Patients
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/appointments')} className="nav-link text-white-50 w-100 text-start border-0 bg-transparent py-2 px-3">
              📅 Appointments
            </button>
          </li>
          <li>
            {/* Active Link */}
            <button className="nav-link active fw-bold w-100 text-start py-2 px-3" style={{ backgroundColor: '#1d3557' }}>
              💳 Billing & Pharmacy
            </button>
          </li>
        </ul>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-grow-1 d-flex flex-column">
        
        {/* Top Header Navigation Bar */}
        <div className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
          <h4 className="fw-bold mb-0 text-dark">Invoice Details</h4>
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-light text-dark border py-2 px-3 fs-6">👤 Cashier Desk</span>
          </div>
        </div>

        {/* Inner Content Area */}
        <div className="p-4 flex-grow-1" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          
          {/* SEARCH BAR CARD */}
          <div className="card border-0 shadow-sm mb-4 rounded-3">
            <div className="card-body p-4">
              <span className="text-uppercase text-primary fw-bold mb-2 d-block" style={{ fontSize: '12px', letterSpacing: '0.5px' }}>
                APPOINTMENT SEARCH
              </span>
              <form onSubmit={handleSearchOrGenerate} className="row g-3 align-items-center">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">🔍</span>
                    <input
                      type="text"
                      className="form-control border-start-0 bg-light"
                      placeholder="e.g. APT-2039 or APP-10023"
                      value={appointmentNo}
                      onChange={(e) => setAppointmentNo(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <input
                    type="number"
                    className="form-control bg-light"
                    placeholder="Hospital Fee"
                    value={hospitalFee}
                    onChange={(e) => setHospitalFee(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <button type="submit" className="btn btn-primary w-100 fw-bold py-2" disabled={loading}>
                    {loading ? 'Searching...' : 'Search / Bill'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ALERTS */}
          {error && <div className="alert alert-danger shadow-sm border-0">{error}</div>}
          {successMsg && <div className="alert alert-success shadow-sm border-0">{successMsg}</div>}

          {/* INVOICE CARD (EXACT MATCHING YOUR UI DESIGN) */}
          {invoice && (
            <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white">
              
              {/* Patient Info Bar */}
              <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div className="bg-light rounded-circle p-3 text-primary fw-bold me-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                    👤
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1 text-dark">{invoice.patientName}</h5>
                    <small className="text-muted me-3">💳 App No: <strong>{invoice.appointmentNo}</strong></small>
                    <small className="text-muted">📅 Invoice: <strong>{invoice.invoiceNo}</strong></small>
                  </div>
                </div>
                <div>
                  <span className={`badge ${invoice.status === 'PAID' ? 'bg-success-subtle text-success border border-success' : 'bg-danger-subtle text-danger border border-danger'} px-3 py-2 rounded-pill fw-bold`} style={{ fontSize: '12px' }}>
                    ● {invoice.status}
                  </span>
                </div>
              </div>

              {/* Charge Breakdown Section */}
              <div className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold text-dark mb-0">Charge Breakdown</h6>
                  <small className="text-muted">All amounts in LKR</small>
                </div>

                <div className="table-responsive">
                  <table className="table table-borderless align-middle mb-0">
                    <thead className="border-bottom text-muted" style={{ fontSize: '13px' }}>
                      <tr>
                        <th className="fw-normal ps-0">Description</th>
                        <th className="fw-normal text-end pe-0">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-bottom">
                        <td className="ps-0 py-3">
                          <strong className="d-block text-dark">Consultation Fee</strong>
                          <small className="text-muted">Doctor Charge ({invoice.doctorName})</small>
                        </td>
                        <td className="text-end pe-0 fw-bold text-dark">
                          LKR {Number(invoice.doctorFee).toFixed(2)}
                        </td>
                      </tr>
                      <tr className="border-bottom">
                        <td className="ps-0 py-3">
                          <strong className="d-block text-dark">Hospital Service Fee</strong>
                          <small className="text-muted">Facility usage (Standard)</small>
                        </td>
                        <td className="text-end pe-0 fw-bold text-dark">
                          LKR {Number(invoice.hospitalFee).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Total Amount Banner */}
                <div className="d-flex justify-content-between align-items-center my-4 py-3 px-2 bg-light rounded">
                  <h5 className="fw-bold mb-0 text-dark">Total Amount</h5>
                  <h2 className="fw-bold mb-0 text-primary">
                    LKR {Number(invoice.totalAmount).toFixed(2)}
                  </h2>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-end gap-3 pt-2">
                  <button onClick={() => window.print()} className="btn btn-outline-secondary fw-bold px-4 py-2">
                    🖨️ Print Receipt
                  </button>

                  {invoice.status !== 'PAID' && (
                    <button onClick={handlePay} className="btn btn-primary fw-bold px-4 py-2" disabled={loading}>
                      ✓ Mark as Paid
                    </button>
                  )}
                </div>
              </div>

              {/* Footer Badge */}
              <div className="bg-light text-center py-2 border-top">
                <small className="text-muted">🔒 Secure Billing Portal - HMS System</small>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Pharmacy;