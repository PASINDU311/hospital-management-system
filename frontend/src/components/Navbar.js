import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/login', label: 'Login' },
    { to: '/register', label: 'Register Patient' },
  ];

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <nav className="oh-nav">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');

        .oh-nav {
          --ink: #10231F;
          --ink-soft: #4B615B;
          --teal: #0F6E5C;
          --teal-deep: #0B4A3E;
          --teal-bright: #14876F;
          --mint: #E7F2ED;
          --mint-line: #CFE4DC;
          --panel: #FFFFFF;
          --line: #E3E9E6;

          font-family: 'Inter', sans-serif;
          background: var(--panel);
          border-bottom: 1px solid var(--line);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .oh-nav * { box-sizing: border-box; }

        .oh-nav a:focus-visible,
        .oh-nav button:focus-visible {
          outline: 2px solid var(--teal);
          outline-offset: 3px;
          border-radius: 6px;
        }

        .oh-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 14px 6%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .oh-nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--ink);
          transition: opacity 0.2s ease;
        }
        .oh-nav-brand:hover {
          opacity: 0.9;
        }
        .oh-nav-mark {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--teal-deep);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 5px rgba(11, 74, 62, 0.2);
        }
        .oh-nav-brand-text {
          font-family: 'Newsreader', serif;
          font-weight: 600;
          font-size: 19px;
          letter-spacing: -0.01em;
        }

        .oh-nav-links {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .oh-nav-link {
          position: relative;
          font-size: 14px;
          font-weight: 500;
          color: var(--ink-soft);
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 7px;
          transition: color 0.15s ease, background 0.15s ease;
        }
        .oh-nav-link:hover { color: var(--teal-deep); background: var(--mint); }
        .oh-nav-link.is-active { color: var(--teal-deep); font-weight: 600; }
        .oh-nav-link.is-active::after {
          content: '';
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 1px;
          height: 2px;
          background: var(--teal-bright);
          border-radius: 2px;
        }

        /* Call To Action Button */
        .oh-nav-cta {
          margin-left: 8px;
          background: var(--teal-deep);
          color: #ffffff !important;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(11, 74, 62, 0.15);
        }
        .oh-nav-cta:hover { background: var(--teal); color: #ffffff !important; }
        .oh-nav-cta.is-active::after { display: none; }

        /* Mobile Hamburger Toggle */
        .oh-nav-toggle {
          display: none;
          background: none;
          border: 1px solid var(--line);
          border-radius: 8px;
          width: 38px;
          height: 38px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .oh-nav-toggle span,
        .oh-nav-toggle span::before,
        .oh-nav-toggle span::after {
          content: '';
          display: block;
          width: 18px;
          height: 2px;
          background: var(--ink);
          position: relative;
          transition: transform 0.2s ease, opacity 0.2s ease, background-color 0.2s ease;
        }
        .oh-nav-toggle span::before { position: absolute; top: -6px; }
        .oh-nav-toggle span::after { position: absolute; top: 6px; }
        .oh-nav-toggle.is-open span { background: transparent; }
        .oh-nav-toggle.is-open span::before { transform: translateY(6px) rotate(45deg); }
        .oh-nav-toggle.is-open span::after { transform: translateY(-6px) rotate(-45deg); }

        @media (max-width: 780px) {
          .oh-nav-toggle { display: flex; }
          .oh-nav-links {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--line);
            flex-direction: column;
            align-items: stretch;
            gap: 4px;
            padding: 12px 6% 18px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
            display: none;
          }
          .oh-nav-links.is-open { display: flex; }
          .oh-nav-link { padding: 11px 14px; }
          .oh-nav-link.is-active::after { display: none; }
          .oh-nav-cta { margin-left: 0; text-align: center; margin-top: 4px; }
        }
      `}</style>

      <div className="oh-nav-inner">
        {/* Brand Logo */}
        <Link className="oh-nav-brand" to="/" onClick={handleLinkClick}>
          <div className="oh-nav-mark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M2 12h5l2-7 4 14 2-7h7" stroke="#8FE3C9" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="oh-nav-brand-text">HMS Portal</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className={`oh-nav-toggle ${open ? 'is-open' : ''}`}
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
        </button>

        {/* Nav Links */}
        <div className={`oh-nav-links ${open ? 'is-open' : ''}`}>
          {links.map((l) => {
            const isActive = location.pathname === l.to;
            const isCta = l.to === '/register';

            return (
              <Link
                key={l.to}
                className={`oh-nav-link ${isActive ? 'is-active' : ''} ${isCta ? 'oh-nav-cta' : ''}`}
                to={l.to}
                onClick={handleLinkClick}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;