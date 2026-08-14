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

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/login', formData);
      console.log("Login Response Data:", response.data);

      const res = response.data;

      // 1. JWT Token Extraction
      const token = res.token || res.jwt || res.accessToken;

      // 2. Role Extraction & Normalization
      const rawRole = res.role || res.user?.role;
      const extractedRole = typeof rawRole === 'string' ? rawRole : rawRole?.name || String(rawRole || '');
      const userRole = extractedRole.toUpperCase(); // Ensures safe matching regardless of case

      // 3. Full Name Extraction
      const fullName = res.fullName || res.name || res.user?.fullName || (userRole.includes('DOCTOR') ? 'Doctor' : 'User');

      // 4. Clean ID Extractions
      const extractedPatientId = res.patientId || res.patient?.patientId || res.user?.patientId;
      const extractedDoctorId = res.doctorId || res.doctor?.doctorId || res.user?.doctorId;

      // Clear current tab's session storage
      sessionStorage.clear();

      if (token) {
        sessionStorage.setItem('token', token);
        localStorage.setItem('token', token); // Backup for page refresh persistence
      }

      sessionStorage.setItem('role', userRole);
      localStorage.setItem('role', userRole);

      sessionStorage.setItem('email', res.email || res.user?.email || formData.email);
      sessionStorage.setItem('fullName', fullName);

      // Save Patient ID if user is PATIENT
      if (userRole.includes('PATIENT') && extractedPatientId) {
        sessionStorage.setItem('patientId', String(extractedPatientId));
        localStorage.setItem('patientId', String(extractedPatientId));
        console.log("Saved Patient ID successfully:", extractedPatientId);
      }

      // Save Doctor ID if user is DOCTOR
      if (userRole.includes('DOCTOR') && extractedDoctorId) {
        sessionStorage.setItem('doctorId', String(extractedDoctorId));
        localStorage.setItem('doctorId', String(extractedDoctorId));
        console.log("Saved Doctor ID successfully:", extractedDoctorId);
      }

      // 5. User Object Storage
      const userObj = {
        id: res.id || res.userId || res.user?.id,
        email: res.email || res.user?.email || formData.email,
        fullName: fullName,
        role: userRole,
        doctorId: extractedDoctorId || null,
        patientId: extractedPatientId || null
      };

      sessionStorage.setItem('user', JSON.stringify(userObj));
      localStorage.setItem('user', JSON.stringify(userObj));

      // Navigation logic
      if (userRole.includes('DOCTOR')) {
        navigate('/doctor/dashboard');
      } else if (userRole.includes('ADMIN')) {
        navigate('/admin-dashboard');
      } else if (userRole.includes('PHARMACIST')) {
        navigate('/pharmacy'); // Direct pharmacist navigation
      } else {
        navigate('/appointments');
      }

    } catch (err) {
      console.error('Login Error:', err);
      setError(err.response?.data?.message || 'Login failed! Invalid credentials.');
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

          font-family: 'Inter', sans-serif;
          color: var(--ink);
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .oh-auth * { box-sizing: border-box; }

        .oh-auth button:focus-visible,
        .oh-auth input:focus-visible,
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
          padding: 48px;
        }
        .oh-auth-form-wrap { width: 100%; max-width: 380px; }
        .oh-auth-welcome {
          font-family: 'Newsreader', serif;
          font-weight: 600;
          font-size: 27px;
          margin: 0 0 8px 0;
        }
        .oh-auth-hint {
          color: var(--ink-soft);
          font-size: 14px;
          margin: 0 0 28px 0;
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

        .oh-field { margin-bottom: 18px; }
        .oh-field-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 7px;
        }
        .oh-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-soft);
          font-weight: 500;
        }
        .oh-forgot {
          font-size: 12.5px;
          color: var(--teal-deep);
          text-decoration: none;
        }
        .oh-forgot:hover { text-decoration: underline; }

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
        .oh-input {
          border: none;
          outline: none;
          background: transparent;
          padding: 12px 10px;
          font-size: 14.5px;
          width: 100%;
          color: var(--ink);
          font-family: 'Inter', sans-serif;
        }
        .oh-input::placeholder { color: #9AABA5; }

        .oh-remember {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 22px 0 24px;
        }
        .oh-remember input {
          width: 15px;
          height: 15px;
          accent-color: var(--teal-deep);
          cursor: pointer;
        }
        .oh-remember label {
          font-size: 13.5px;
          color: var(--ink-soft);
          cursor: pointer;
        }

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
          margin-bottom: 20px;
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
          margin-top: 44px;
          background: var(--mint);
          border: 1px solid var(--mint-line);
          padding: 7px 13px;
          border-radius: 20px;
        }

        @media (max-width: 860px) {
          .oh-auth { grid-template-columns: 1fr; }
          .oh-auth-left { display: none; }
          .oh-auth-right { padding: 32px 22px; }
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

        <div className="oh-auth-eyebrow">HMS Portal</div>
        <h1 className="oh-auth-title">Dedicated to your health.</h1>
        <p className="oh-auth-sub">
          Secure access to your medical records, test results, and direct
          communication with your dedicated care team.
        </p>

        <EcgTrace />
      </div>

      {/* Right panel / form */}
      <div className="oh-auth-right">
        <div className="oh-auth-form-wrap">
          <h2 className="oh-auth-welcome">Welcome back</h2>
          <p className="oh-auth-hint">Enter your credentials to access your account.</p>

          {error && <div className="oh-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="oh-field">
              <div className="oh-field-top">
                <span className="oh-label">Email address</span>
              </div>
              <div className="oh-input-group">
                <span className="oh-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18v12H3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                    <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  className="oh-input"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@gmail.com"
                />
              </div>
            </div>

            <div className="oh-field">
              <div className="oh-field-top">
                <span className="oh-label">Password</span>
                <Link to="/forgot-password" className="oh-forgot">Forgot password?</Link>
              </div>
              <div className="oh-input-group">
                <span className="oh-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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

            <div className="oh-remember">
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe">Remember me</label>
            </div>

            <button type="submit" className="oh-submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="oh-auth-footer-line">
              Don't have an account? <Link to="/register">Register</Link>
            </div>
          </form>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="oh-security">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l8 3.5v6c0 5-3.4 8.7-8 10.5-4.6-1.8-8-5.5-8-10.5v-6L12 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
              HMS compliant secure login
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;