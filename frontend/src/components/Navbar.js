import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const fontFamily = "sans-serif";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Make the navbar transparent and white on the Landing Page which has a dark hero background
  const isDarkHome = location.pathname === '/';

  const bg = isDarkHome ? 'rgba(15, 23, 42, 0.4)' : 'rgba(255, 255, 255, 0.85)';
  const text = isDarkHome ? '#fff' : '#0f172a';
  const hoverText = isDarkHome ? '#e2e8f0' : '#475569';
  const border = isDarkHome ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  const isActive = (path) => location.pathname.startsWith(path) && path !== '/';

  const handleLogout = () => { logoutUser(); navigate('/'); };

  const NavLink = ({ to, children }) => {
    const active = isActive(to);
    return (
      <Link to={to} style={{
        textDecoration: 'none', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
        color: active ? (isDarkHome ? '#fff' : '#0f172a') : (isDarkHome ? 'rgba(255,255,255,0.6)' : '#64748b'),
        transition: 'all 0.2s', padding: '8px 14px', borderRadius: '12px'
      }} onMouseEnter={e => { e.currentTarget.style.color = isDarkHome ? '#fff' : '#0f172a'; e.currentTarget.style.background = isDarkHome ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)' }}
        onMouseLeave={e => { e.currentTarget.style.color = active ? (isDarkHome ? '#fff' : '#0f172a') : (isDarkHome ? 'rgba(255,255,255,0.6)' : '#64748b'); e.currentTarget.style.background = 'transparent'; }}>
        {children}
      </Link>
    );
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 1000,
      background: bg, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${border}`, fontFamily, transition: 'all 0.3s'
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.opacity = 0.8} onMouseLeave={e => e.currentTarget.style.opacity = 1}>
          <div style={{
            width: 36, height: 36, borderRadius: '12px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 20, boxShadow: '0 4px 10px rgba(124, 58, 237, 0.3)'
          }}>S</div>
          <span style={{ fontSize: 22, fontWeight: 700, color: text, letterSpacing: '-0.5px' }}>
            Smart<span style={{ color: '#7c3aed' }}>Resume</span>
          </span>
        </Link>

        {/* Center Links */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {!user ? null : user.role === 'student' ? (
            <>
              <NavLink to="/jobs">Jobs Map</NavLink>
              <NavLink to="/my-applications">My Applications</NavLink>
              <NavLink to="/dashboard">Student Hub</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/hr/dashboard">HR Analytics</NavLink>
              <NavLink to="/hr/jobs">Pipeline Manager</NavLink>
            </>
          )}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {!user ? (
            <>
              <Link to="/login" style={{
                textDecoration: 'none', fontSize: 14, fontWeight: 700, color: text,
                padding: '10px 20px', borderRadius: '12px', transition: 'background 0.2s'
              }} onMouseEnter={e => e.target.style.background = isDarkHome ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
                onMouseLeave={e => e.target.style.background = 'transparent'}>
                Sign In
              </Link>
              <Link to="/register" style={{
                textDecoration: 'none', fontSize: 14, fontWeight: 700, color: '#fff',
                padding: '10px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)', transition: 'transform 0.2s'
              }} onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.target.style.transform = 'translateY(0)'}>
                Join Now
              </Link>
            </>
          ) : user.role === 'hr' ? (
            <>
              <Link to="/hr/jobs/new" style={{
                textDecoration: 'none', fontSize: 13, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5,
                padding: '10px 20px', borderRadius: '12px', background: '#10b981',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)', transition: 'transform 0.2s'
              }} onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.target.style.transform = 'translateY(0)'}>
                + Post Job
              </Link>
              <button onClick={handleLogout} style={{
                border: 'none', background: 'transparent', cursor: 'pointer',
                fontSize: 14, fontWeight: 700, color: text, padding: '10px 20px', borderRadius: '12px', transition: 'background 0.2s'
              }} onMouseEnter={e => e.target.style.background = isDarkHome ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
                onMouseLeave={e => e.target.style.background = 'transparent'}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/jobs" style={{
                textDecoration: 'none', fontSize: 13, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5,
                padding: '10px 20px', borderRadius: '12px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)', transition: 'transform 0.2s'
              }} onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.target.style.transform = 'translateY(0)'}>
                Search Jobs
              </Link>
              <button onClick={handleLogout} style={{
                border: 'none', background: 'transparent', cursor: 'pointer',
                fontSize: 14, fontWeight: 700, color: text, padding: '10px 20px', borderRadius: '12px', transition: 'background 0.2s'
              }} onMouseEnter={e => e.target.style.background = isDarkHome ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
                onMouseLeave={e => e.target.style.background = 'transparent'}>
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
