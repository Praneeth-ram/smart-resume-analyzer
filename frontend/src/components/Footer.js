import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">SmartResume</div>
        <div className="footer-links">
          <Link to="/jobs">Find Jobs</Link>
          <Link to="/register">For Companies</Link>
          <Link to="/login">Sign In</Link>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          © {new Date().getFullYear()} Smart Resume Analyzer
        </div>
      </div>
    </footer>
  );
}
