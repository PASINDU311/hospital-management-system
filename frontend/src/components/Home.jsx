import React from 'react';
import { useNavigate } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Signature motif: a looping ECG trace, reused in the hero monitor card and
// as a thin divider between sections. Built once, rendered twice.
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

const Home = () => {
  const navigate = useNavigate();

  const services = [
    {
      tag: 'ER',
      tone: 'alert',
      span: true,
      title: '24/7 Emergency Care',
      desc: 'Immediate attention for critical situations. Our trauma team is on call around the clock, every day of the year.',
      link: 'View emergency protocol',
      onClick: () => alert('Emergency Hotline: +94 11 234 5678'),
    },
    {
      tag: 'DR',
      title: 'Find a Doctor',
      desc: 'Search specialists by condition, location, or the next available slot.',
      link: 'Search directory',
      onClick: () => navigate('/login'),
    },
    {
      tag: 'LAB',
      title: 'Lab Results',
      desc: 'View diagnostic reports and test results the moment they’re ready.',
      link: 'Open your results',
      onClick: () => navigate('/login'),
    },
    {
      tag: 'RX',
      tone: 'rx',
      span: true,
      title: 'E-Pharmacy & Refills',
      desc: 'Request refills and order prescriptions for delivery to your door.',
      link: 'Start an order',
      onClick: () => navigate('/login'),
      footnote: 'Est. delivery window: 24–48h',
    },
  ];

  return (
    <div className="oh-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,500&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');

        .oh-page {
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
          background: var(--paper);
          color: var(--ink);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .oh-page * { box-sizing: border-box; }

        .oh-page a, .oh-page button, .oh-page [role="button"] {
          font-family: inherit;
        }

        .oh-page button:focus-visible,
        .oh-page .oh-link:focus-visible {
          outline: 2px solid var(--teal);
          outline-offset: 3px;
          border-radius: 4px;
        }

        /* ---------- Navbar ---------- */
        .oh-navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 8%;
          background: var(--panel);
          border-bottom: 1px solid var(--line);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .oh-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .oh-logo-mark {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: var(--teal-deep);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .oh-logo-text {
          font-family: 'Newsreader', serif;
          font-weight: 600;
          font-size: 19px;
          letter-spacing: 0.2px;
        }
        .oh-nav-buttons { display: flex; gap: 10px; }
        .oh-btn {
          padding: 9px 18px;
          border-radius: 7px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
          border: 1px solid transparent;
        }
        .oh-btn:active { transform: translateY(1px); }
        .oh-btn-ghost {
          background: var(--panel);
          border-color: var(--line);
          color: var(--ink);
        }
        .oh-btn-ghost:hover { border-color: var(--teal); color: var(--teal-deep); }
        .oh-btn-solid {
          background: var(--teal-deep);
          color: #fff;
        }
        .oh-btn-solid:hover { background: var(--teal); }

        /* ---------- Hero ---------- */
        .oh-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 56px;
          padding: 72px 8% 56px;
        }
        .oh-hero-left { flex: 1; max-width: 540px; }
        .oh-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--teal-deep);
          background: var(--mint);
          border: 1px solid var(--mint-line);
          padding: 6px 12px 6px 10px;
          border-radius: 20px;
          margin-bottom: 22px;
        }
        .oh-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--teal-bright);
          animation: pulseDot 1.8s ease-in-out infinite;
        }
        .oh-hero-title {
          font-family: 'Newsreader', serif;
          font-weight: 500;
          font-size: 50px;
          line-height: 1.12;
          letter-spacing: -0.5px;
          margin: 0 0 20px 0;
        }
        .oh-hero-title em {
          font-style: italic;
          color: var(--teal-deep);
        }
        .oh-hero-sub {
          font-size: 16px;
          line-height: 1.65;
          color: var(--ink-soft);
          margin: 0 0 32px 0;
          max-width: 460px;
        }
        .oh-hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }
        .oh-btn-primary {
          background: var(--teal-deep);
          color: #fff;
          padding: 13px 24px;
          font-size: 14.5px;
        }
        .oh-btn-primary:hover { background: var(--teal); }
        .oh-btn-secondary {
          background: var(--panel);
          border-color: var(--line);
          color: var(--ink);
          padding: 13px 24px;
          font-size: 14.5px;
        }
        .oh-btn-secondary:hover { border-color: var(--alert); color: var(--alert); }

        /* ---------- Vitals monitor card (hero right) ---------- */
        .oh-hero-right { flex: 1; display: flex; justify-content: center; }
        .oh-monitor {
          width: 100%;
          max-width: 420px;
          background: var(--teal-deep);
          border-radius: 22px;
          padding: 26px 26px 20px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 24px 48px -18px rgba(11, 74, 62, 0.45);
          background-image:
            linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .oh-monitor-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .oh-monitor-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
        }
        .oh-live {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          color: #8FE3C9;
          letter-spacing: 0.08em;
        }
        .oh-live .oh-dot { background: #8FE3C9; }

        .ecg-viewport {
          width: 100%;
          height: 76px;
          overflow: hidden;
          margin: 6px 0 14px;
        }
        .ecg-track {
          width: 200%;
          height: 100%;
          display: block;
          stroke: #8FE3C9;
          filter: drop-shadow(0 0 5px rgba(143, 227, 201, 0.55));
          animation: ecgScroll 3.2s linear infinite;
        }

        .oh-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 4px;
        }
        .oh-stat {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          padding: 12px 10px;
        }
        .oh-stat-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.07em;
          color: rgba(255,255,255,0.55);
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .oh-stat-value {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 19px;
          font-weight: 600;
          color: #fff;
          display: flex;
          align-items: baseline;
          gap: 5px;
        }
        .oh-stat-unit { font-size: 11px; color: rgba(255,255,255,0.55); font-weight: 400; }

        /* ---------- ECG section divider ---------- */
        .oh-divider {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: var(--panel);
          padding: 4px 0;
        }
        .oh-divider .ecg-viewport { height: 34px; }
        .oh-divider .ecg-track {
          stroke: var(--mint-line);
          filter: none;
          animation-duration: 4.4s;
        }

        /* ---------- Services ---------- */
        .oh-services { padding: 64px 8% 88px; }
        .oh-services-head { text-align: center; margin-bottom: 44px; }
        .oh-services-title {
          font-family: 'Newsreader', serif;
          font-weight: 500;
          font-size: 30px;
          margin: 0 0 10px 0;
        }
        .oh-services-sub { color: var(--ink-soft); font-size: 15px; margin: 0; }

        .oh-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .oh-card {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 26px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .oh-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 32px -18px rgba(16, 35, 31, 0.22);
          border-color: var(--mint-line);
        }
        .oh-card--span { grid-column: span 2; }
        .oh-card--alert { background: var(--alert-bg); border-color: var(--alert-line); }
        .oh-card--rx { background: var(--mint); border-color: var(--mint-line); }

        .oh-tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.06em;
          padding: 4px 9px;
          border-radius: 6px;
          display: inline-block;
          width: fit-content;
          background: var(--mint);
          color: var(--teal-deep);
        }
        .oh-card--alert .oh-tag { background: rgba(179,38,30,0.1); color: var(--alert); }
        .oh-card--rx .oh-tag { background: rgba(15,110,92,0.12); color: var(--teal-deep); }

        .oh-card-title {
          font-family: 'Newsreader', serif;
          font-weight: 600;
          font-size: 19px;
          margin: 14px 0 8px 0;
        }
        .oh-card-desc {
          color: var(--ink-soft);
          font-size: 13.5px;
          line-height: 1.55;
          margin: 0;
          max-width: 380px;
        }
        .oh-card--alert .oh-card-desc { color: #8B372F; }

        .oh-card-footnote {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: var(--teal-deep);
          margin: 14px 0 0 0;
          letter-spacing: 0.02em;
        }

        .oh-link {
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 500;
          font-size: 12.5px;
          letter-spacing: 0.02em;
          cursor: pointer;
          margin-top: 18px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--teal-deep);
          background: none;
          border: none;
          padding: 0;
          text-decoration: none;
          border-bottom: 1px solid transparent;
        }
        .oh-link:hover { border-bottom-color: currentColor; }
        .oh-card--alert .oh-link { color: var(--alert); }

        /* ---------- Footer ---------- */
        .oh-footer {
          margin-top: auto;
          background: var(--panel);
          border-top: 1px solid var(--line);
          padding: 36px 8% 18px;
        }
        .oh-footer-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          padding-bottom: 24px;
        }
        .oh-footer-brand { display: flex; align-items: center; gap: 10px; }
        .oh-footer-brand-text { font-family: 'Newsreader', serif; font-weight: 600; font-size: 15px; color: var(--ink); }
        .oh-footer-tag { font-size: 12.5px; color: var(--ink-soft); margin: 3px 0 0 0; }
        .oh-footer-links { display: flex; gap: 22px; flex-wrap: wrap; }
        .oh-flink {
          font-size: 12.5px;
          color: var(--ink-soft);
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        .oh-flink:hover { color: var(--teal-deep); }
        .oh-copyright {
          text-align: center;
          padding-top: 16px;
          border-top: 1px solid var(--line);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: #94A3A0;
        }

        @keyframes pulseDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        @keyframes ecgScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        @media (prefers-reduced-motion: reduce) {
          .oh-dot, .ecg-track { animation: none !important; }
        }

        @media (max-width: 860px) {
          .oh-hero { flex-direction: column; padding-top: 48px; }
          .oh-hero-left { max-width: 100%; }
          .oh-hero-title { font-size: 38px; }
          .oh-grid { grid-template-columns: 1fr; }
          .oh-card--span { grid-column: span 1; }
          .oh-footer-top { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      {/* Navbar */}
      <header className="oh-navbar">
        <div className="oh-logo" onClick={() => navigate('/')}>
          <div className="oh-logo-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M2 12h5l2-7 4 14 2-7h7" stroke="#8FE3C9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="oh-logo-text">OmniHealth</span>
        </div>
        <div className="oh-nav-buttons">
          <button className="oh-btn oh-btn-ghost" onClick={() => navigate('/login')}>Login</button>
          <button className="oh-btn oh-btn-solid" onClick={() => navigate('/register')}>Register Patient</button>
        </div>
      </header>

      {/* Hero */}
      <section className="oh-hero">
        <div className="oh-hero-left">
          <div className="oh-eyebrow">
            <span className="oh-dot" />
            Now accepting new patients
          </div>
          <h1 className="oh-hero-title">
            Healthcare that pays <em>attention.</em>
          </h1>
          <p className="oh-hero-sub">
            Board-certified physicians, real-time diagnostics, and a care team that
            actually follows up — all under one roof.
          </p>
          <div className="oh-hero-actions">
            <button className="oh-btn oh-btn-primary" onClick={() => navigate('/login')}>
              Book an appointment
            </button>
            <button
              className="oh-btn oh-btn-secondary"
              onClick={() => alert('Emergency Hotline: +94 11 234 5678')}
            >
              Call the emergency line
            </button>
          </div>
        </div>

        <div className="oh-hero-right">
          <div className="oh-monitor">
            <div className="oh-monitor-head">
              <span className="oh-monitor-label">Patient Monitor</span>
              <span className="oh-live"><span className="oh-dot" />Live</span>
            </div>
            <EcgTrace />
            <div className="oh-stats">
              <div className="oh-stat">
                <div className="oh-stat-label">Heart rate</div>
                <div className="oh-stat-value">72<span className="oh-stat-unit">bpm</span></div>
              </div>
              <div className="oh-stat">
                <div className="oh-stat-label">SpO₂</div>
                <div className="oh-stat-value">98<span className="oh-stat-unit">%</span></div>
              </div>
              <div className="oh-stat">
                <div className="oh-stat-label">Blood pressure</div>
                <div className="oh-stat-value">118/76</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="oh-divider"><EcgTrace strokeWidth={2} /></div>

      {/* Services */}
      <section className="oh-services">
        <div className="oh-services-head">
          <h2 className="oh-services-title">Your care, charted</h2>
          <p className="oh-services-sub">Everything you need, organized like your own patient record.</p>
        </div>

        <div className="oh-grid">
          {services.map((s) => (
            <div
              key={s.tag}
              className={[
                'oh-card',
                s.span ? 'oh-card--span' : '',
                s.tone === 'alert' ? 'oh-card--alert' : '',
                s.tone === 'rx' ? 'oh-card--rx' : '',
              ].join(' ').trim()}
            >
              <div>
                <span className="oh-tag">{s.tag}</span>
                <h3 className="oh-card-title">{s.title}</h3>
                <p className="oh-card-desc">{s.desc}</p>
                {s.footnote && <p className="oh-card-footnote">{s.footnote}</p>}
              </div>
              <button className="oh-link" onClick={s.onClick}>
                {s.link} →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="oh-footer">
        <div className="oh-footer-top">
          <div className="oh-footer-brand">
            <div className="oh-logo-mark" style={{ width: 28, height: 28 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M2 12h5l2-7 4 14 2-7h7" stroke="#8FE3C9" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="oh-footer-brand-text">OmniHealth Medical Group</div>
              <p className="oh-footer-tag">Coordinated care for the whole family.</p>
            </div>
          </div>
          <div className="oh-footer-links">
            <button className="oh-flink">Privacy Policy</button>
            <button className="oh-flink">Terms of Service</button>
            <button className="oh-flink">Patient Rights</button>
            <button className="oh-flink">Careers</button>
          </div>
        </div>
        <div className="oh-copyright">
          © {new Date().getFullYear()} OmniHealth Medical Group. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;