import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => { logoutUser(); navigate('/'); };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" fill="#7B2D8B"/>
            <path d="M6 21L14 7L22 21H17.5L14 14.5L10.5 21H6Z" fill="white"/>
          </svg>
          Smart<span className="brand-accent">Resume</span>
        </Link>

        {/* Center Links */}
        {!user ? (
          <div className="navbar-links">
            <Link to="/jobs" className={`navbar-link ${isActive('/jobs') ? 'active' : ''}`}>Find Jobs</Link>
            <Link to="/register" className={`navbar-link ${isActive('/register') ? 'active' : ''}`}>For Companies</Link>
          </div>
        ) : user.role === 'student' ? (
          <div className="navbar-links">
            <Link to="/jobs" className={`navbar-link ${isActive('/jobs') ? 'active' : ''}`}>Find Jobs</Link>
            <Link to="/my-applications" className={`navbar-link ${isActive('/my-applications') ? 'active' : ''}`}>My Applications</Link>
            <Link to="/dashboard" className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
          </div>
        ) : (
          <div className="navbar-links">
            <Link to="/hr/dashboard" className={`navbar-link ${isActive('/hr/dashboard') ? 'active' : ''}`}>Dashboard</Link>
            <Link to="/hr/jobs" className={`navbar-link ${isActive('/hr/jobs') ? 'active' : ''}`}>Job Posts</Link>
          </div>
        )}

        {/* Right Actions */}
        <div className="navbar-actions">
          {!user ? (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join Now</Link>
            </>
          ) : user.role === 'hr' ? (
            <>
              <Link to="/hr/jobs/new" className="btn btn-primary btn-sm">+ Post Job</Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/jobs" className="btn btn-primary btn-sm">Search Jobs</Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">Sign Out</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
