import React from 'react';
import { Link } from 'react-router-dom';

const fontFamily = "sans-serif";

export default function Footer() {
  return (
    <footer style={{ background: '#0f172a', padding: '80px 40px 40px', fontFamily, color: '#fff', overflowX: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 64, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 64 }}>
          
          <div style={{ gridColumn: '1 / -1', maxWidth: 400 }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ 
                width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 
              }}>S</div>
              <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px' }}>
                Smart<span style={{ color: '#a78bfa' }}>Resume</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.6 }}>
              The premium ATS-intelligent hiring platform. Designed to connect world-class talent with pioneering companies automatically using machine pipelines.
            </p>
          </div>

          <div>
             <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#fff', marginBottom: 20 }}>Candidates</h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
               <Link to="/jobs" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 15, fontWeight: 600, transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>Discover Open Roles</Link>
               <Link to="/register" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 15, fontWeight: 600, transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>Create Student Hub</Link>
               <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 15, fontWeight: 600, transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>Secure Sign In</Link>
             </div>
          </div>

          <div>
             <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#fff', marginBottom: 20 }}>Companies</h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
               <Link to="/register" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 15, fontWeight: 600, transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>Create HR Dashboard</Link>
               <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 15, fontWeight: 600, transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>Post Active Jobs</Link>
               <Link to="/hr/dashboard" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 15, fontWeight: 600, transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#94a3b8'}>Pipeline Analytics</Link>
             </div>
          </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 32, flexWrap: 'wrap', gap: 20 }}>
          <div style={{ color: '#64748b', fontSize: 14, fontWeight: 600 }}>
             © {new Date().getFullYear()} SmartResume Systems Inc. All rights heavily reserved.
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
             <span style={{ color: '#64748b', fontSize: 14, fontWeight: 600, cursor: 'pointer' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#64748b'}>Privacy Protocol</span>
             <span style={{ color: '#64748b', fontSize: 14, fontWeight: 600, cursor: 'pointer' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#64748b'}>Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
