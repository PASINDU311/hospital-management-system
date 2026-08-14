import React, { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Signature motif carried over from the homepage: a looping ECG trace.
// ---------------------------------------------------------------------------
const EcgTrace = ({ className = '', strokeWidth = 3 }) => {
  const segment =
    'M0,40 L34,40 L46,12 L58,68 L70,18 L82,40 L120,40 L152,40 L164,24 L176,56 L188,40 L220,40';
  return (
    <div className={`ecg-viewport ${className}`}>
      <svg
        className="ecg-track"
        viewBox="0 0 440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={segment} fill="none" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        <path
          d={segment}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(220,0)"
        />
      </svg>
    </div>
  );
};

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    address: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    // Age එක 'YYYY-MM-DD' String එකකට Convert කිරීම
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - (parseInt(formData.age) || 20);
    const formattedDob = `${birthYear}-01-01`;

    // Backend PatientRegisterRequest DTO එකට Exact mapping
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      nicOrPassport: `NIC-${Date.now()}`, // Unique value to prevent DB constraint issues
      dateOfBirth: formattedDob,
      gender: formData.gender || "Male",
      address: formData.address || "No address provided",
      emergencyContact: formData.phone
    };

    try {
      const response = await API.post('/auth/register/patient', payload);
      console.log("Register Success:", response.data);
      setMessage('Registration Successful! Redirecting to login...');

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error("Registration Error Details:", err.response);
      
      const backendError = err.response?.data?.message 
        || err.response?.data 
        || 'Registration failed! Check email or backend console.';

      setError(typeof backendError === 'string' ? backendError : 'Registration failed! Server Error 500.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="oh-auth">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,500&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');

        .oh-auth {
          --ink: #10231F;
          --ink-soft: #4B615B;
          --teal: #0F6E5C;
          --teal-deep: #0B4A3E;
          --teal-bright: #14876F;
          --mint: #E7F2ED;
          --mint-line: #CFE4DC;
          --paper: #F6F8F7;
          --panel: #FFFFFF;
          --line: #E3E9E6;
          --alert: #B3261E;
          --alert-bg: #FBEAE8;
          --alert-line: #F0CAC6;
          --success: #0F6E5C;
          --success-bg: #E7F2ED;
          --success-line: #CFE4DC;

          font-family: 'Inter', sans-serif;
          color: var(--ink);
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .oh-auth * { box-sizing: border-box; }

        .oh-auth button:focus-visible,
        .oh-auth input:focus-visible,
        .oh-auth select:focus-visible,
        .oh-auth textarea:focus-visible,
        .oh-auth a:focus-visible {
          outline: 2px solid var(--teal);
          outline-offset: 2px;
          border-radius: 4px;
        }

        /* ---------- Left panel ---------- */
        .oh-auth-left {
          background: var(--teal-deep);
          background-image:
            linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px);
          background-size: 24px 24px;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px;
          position: relative;
        }
        .oh-auth-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 56px;
          cursor: pointer;
        }
        .oh-auth-logo-mark {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .oh-auth-logo-text {
          font-family: 'Newsreader', serif;
          font-weight: 600;
          font-size: 19px;
        }
        .oh-auth-eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #8FE3C9;
          margin-bottom: 16px;
        }
        .oh-auth-title {
          font-family: 'Newsreader', serif;
          font-weight: 500;
          font-size: 38px;
          line-height: 1.2;
          margin: 0 0 18px 0;
          max-width: 420px;
        }
        .oh-auth-sub {
          font-size: 15px;
          line-height: 1.65;
          color: rgba(255,255,255,0.75);
          max-width: 400px;
          margin: 0 0 40px 0;
        }
        .ecg-viewport { width: 100%; height: 64px; overflow: hidden; max-width: 420px; }
        .ecg-track {
          width: 200%;
          height: 100%;
          display: block;
          stroke: #8FE3C9;
          filter: drop-shadow(0 0 5px rgba(143, 227, 201, 0.5));
          animation: ecgScroll 3.2s linear infinite;
        }
        @keyframes ecgScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .ecg-track { animation: none; } }

        /* ---------- Right panel / form ---------- */
        .oh-auth-right {
          background: var(--paper);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 48px;
          overflow-y: auto;
        }
        .oh-auth-form-wrap { width: 100%; max-width: 460px; }
        .oh-auth-welcome {
          font-family: 'Newsreader', serif;
          font-weight: 600;
          font-size: 27px;
          margin: 0 0 8px 0;
        }
        .oh-auth-hint {
          color: var(--ink-soft);
          font-size: 14px;
          margin: 0 0 24px 0;
        }

        .oh-error {
          background: var(--alert-bg);
          border: 1px solid var(--alert-line);
          color: var(--alert);
          font-size: 13.5px;
          padding: 11px 14px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .oh-success {
          background: var(--success-bg);
          border: 1px solid var(--success-line);
          color: var(--success);
          font-size: 13.5px;
          padding: 11px 14px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .oh-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .oh-field { margin-bottom: 14px; }
        .oh-field-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 6px;
        }
        .oh-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-soft);
          font-weight: 500;
        }

        .oh-input-group {
          display: flex;
          align-items: center;
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 0 12px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .oh-input-group:focus-within {
          border-color: var(--teal);
          box-shadow: 0 0 0 3px rgba(15, 110, 92, 0.12);
        }
        .oh-input-icon { display: flex; color: var(--ink-soft); flex-shrink: 0; }
        .oh-eye-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--ink-soft);
          padding: 0;
          display: flex;
          align-items: center;
        }
        .oh-input, .oh-select, .oh-textarea {
          border: none;
          outline: none;
          background: transparent;
          padding: 11px 8px;
          font-size: 14px;
          width: 100%;
          color: var(--ink);
          font-family: 'Inter', sans-serif;
        }
        .oh-select {
          cursor: pointer;
        }
        .oh-textarea {
          resize: none;
        }
        .oh-input::placeholder, .oh-textarea::placeholder { color: #9AABA5; }

        .oh-submit {
          width: 100%;
          background: var(--teal-deep);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 13px;
          font-weight: 600;
          font-size: 14.5px;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease;
          margin-top: 10px;
          margin-bottom: 18px;
        }
        .oh-submit:hover:not(:disabled) { background: var(--teal); }
        .oh-submit:active:not(:disabled) { transform: translateY(1px); }
        .oh-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        .oh-auth-footer-line {
          text-align: center;
          font-size: 13.5px;
          color: var(--ink-soft);
        }
        .oh-auth-footer-line a {
          color: var(--teal-deep);
          font-weight: 600;
          text-decoration: none;
        }
        .oh-auth-footer-line a:hover { text-decoration: underline; }

        .oh-security {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.04em;
          color: var(--ink-soft);
          margin-top: 28px;
          background: var(--mint);
          border: 1px solid var(--mint-line);
          padding: 6px 12px;
          border-radius: 20px;
        }

        @media (max-width: 860px) {
          .oh-auth { grid-template-columns: 1fr; }
          .oh-auth-left { display: none; }
          .oh-auth-right { padding: 32px 20px; }
          .oh-grid-2 { grid-template-columns: 1fr; gap: 0; }
        }
      `}</style>

      {/* Left panel */}
      <div className="oh-auth-left">
        <div className="oh-auth-logo" onClick={() => navigate('/')}>
          <div className="oh-auth-logo-mark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M2 12h5l2-7 4 14 2-7h7" stroke="#8FE3C9" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="oh-auth-logo-text">OmniHealth</span>
        </div>

        <div className="oh-auth-eyebrow">Patient Portal</div>
        <h1 className="oh-auth-title">Begin your wellness journey with us.</h1>
        <p className="oh-auth-sub">
          Create an account to schedule appointments, manage personal health records,
          and connect with specialists instantly.
        </p>

        <EcgTrace />
      </div>

      {/* Right panel / form */}
      <div className="oh-auth-right">
        <div className="oh-auth-form-wrap">
          <h2 className="oh-auth-welcome">Create Patient Account</h2>
          <p className="oh-auth-hint">Fill in your information to get started.</p>

          {message && <div className="oh-success">{message}</div>}
          {error && <div className="oh-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="oh-field">
              <div className="oh-field-top">
                <span className="oh-label">Full Name</span>
              </div>
              <div className="oh-input-group">
                <span className="oh-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="fullName"
                  className="oh-input"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Pasindu Perera"
                />
              </div>
            </div>

            {/* Email & Password */}
            <div className="oh-grid-2">
              <div className="oh-field">
                <div className="oh-field-top">
                  <span className="oh-label">Email Address</span>
                </div>
                <div className="oh-input-group">
                  <span className="oh-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="email"
                    className="oh-input"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="pasindu@gmail.com"
                  />
                </div>
              </div>

              <div className="oh-field">
                <div className="oh-field-top">
                  <span className="oh-label">Password</span>
                </div>
                <div className="oh-input-group">
                  <span className="oh-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <rect x="4" y="10" width="16" height="10" rx="2" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="oh-input"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="oh-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      {showPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Phone & Age */}
            <div className="oh-grid-2">
              <div className="oh-field">
                <div className="oh-field-top">
                  <span className="oh-label">Phone Number</span>
                </div>
                <div className="oh-input-group">
                  <span className="oh-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="phone"
                    className="oh-input"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0771234567"
                  />
                </div>
              </div>

              <div className="oh-field">
                <div className="oh-field-top">
                  <span className="oh-label">Age</span>
                </div>
                <div className="oh-input-group">
                  <span className="oh-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </span>
                  <input
                    type="number"
                    name="age"
                    className="oh-input"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="25"
                  />
                </div>
              </div>
            </div>

            {/* Gender & Blood Group */}
            <div className="oh-grid-2">
              <div className="oh-field">
                <div className="oh-field-top">
                  <span className="oh-label">Gender</span>
                </div>
                <div className="oh-input-group">
                  <select
                    name="gender"
                    className="oh-select"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="oh-field">
                <div className="oh-field-top">
                  <span className="oh-label">Blood Group</span>
                </div>
                <div className="oh-input-group">
                  <select
                    name="bloodGroup"
                    className="oh-select"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="oh-field">
              <div className="oh-field-top">
                <span className="oh-label">Address</span>
              </div>
              <div className="oh-input-group">
                <textarea
                  name="address"
                  className="oh-textarea"
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Colombo, Sri Lanka"
                ></textarea>
              </div>
            </div>

            <button type="submit" className="oh-submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register Patient'}
            </button>

            <div className="oh-auth-footer-line">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </form>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="oh-security">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l8 3.5v6c0 5-3.4 8.7-8 10.5-4.6-1.8-8-5.5-8-10.5v-6L12 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
              HMS compliant patient registration
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;