import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const fontFamily = "'Söhne', 'Inter', sans-serif";

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data);
      toast.success('Welcome back!');
      navigate(res.data.role === 'hr' ? '/hr/dashboard' : '/jobs');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '16px 20px', borderRadius: '16px',
    border: '1px solid rgba(0,0,0,0.08)', background: '#f8fafc',
    fontSize: 15, fontFamily, color: '#0f172a', transition: 'all 0.2s',
    outline: 'none', marginBottom: 6
  };
  
  const labelStyle = {
    display: 'block', fontSize: 13, fontWeight: 700, color: '#475569',
    marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)', fontFamily, overflowX: 'hidden' }}>
      
      {/* Left Premium Panel */}
      <div style={{
        flex: '0 0 540px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '64px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Glow Effects */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 60%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 60%)', borderRadius: '50%' }} />
        
        <div style={{ maxWidth: 380, position: 'relative', zIndex: 1 }} className="animate-in">
          <div style={{ width: 64, height: 6, background: 'linear-gradient(90deg, #7c3aed 0%, #4f46e5 100%)', borderRadius: 3, marginBottom: 40 }} />
          
          <h1 style={{ fontSize: 44, fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px' }}>
            Welcome back to the Future of Hiring.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.7, marginBottom: 56 }}>
            Sign in to access your intelligent dashboard. Track pipeline analytics, monitor your ATS scores, and seamlessly manage your career journey with ease.
          </p>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 40 }}>
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 16, fontWeight: 600 }}>Don't have an account?</p>
            <Link to="/register" style={{ 
              display: 'inline-block', padding: '12px 24px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)',
              color: '#fff', textDecoration: 'none', fontWeight: 800, border: '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.2s', fontSize: 14
            }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.05)'}>
              Create Account →
            </Link>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '64px 40px', background: '#f8fafc'
      }}>
        <div style={{ 
          width: '100%', maxWidth: 460, background: '#fff', padding: '48px',
          borderRadius: '24px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 20px 60px rgba(0,0,0,0.03)'
        }} className="animate-in">
          
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, color: '#0f172a', letterSpacing: '-0.5px' }}>Sign In</h2>
            <p style={{ color: '#64748b', fontSize: 16 }}>Enter your email and password to securely log in.</p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '14px 18px', borderRadius: '12px', fontSize: 14, fontWeight: 600, marginBottom: 24 }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Email Address</label>
              <input style={inputStyle} type="email" placeholder="you@company.com" required
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} 
                onFocus={e => e.target.style.borderColor = '#7c3aed'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
            </div>
            
            <div style={{ marginBottom: 36 }}>
              <label style={labelStyle}>Password</label>
              <input style={inputStyle} type="password" placeholder="••••••••" required
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} 
                onFocus={e => e.target.style.borderColor = '#7c3aed'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
            </div>

            <button type="submit" disabled={loading} style={{ 
              width: '100%', padding: '16px', borderRadius: '16px', background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
              color: '#fff', border: 'none', fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s', boxShadow: loading ? 'none' : '0 10px 25px rgba(124, 58, 237, 0.4)'
            }} onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(124, 58, 237, 0.5)'; } }} 
               onMouseLeave={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(124, 58, 237, 0.4)'; } }}>
              {loading ? 'Authenticating...' : 'Secure Sign In →'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '32px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <div style={{ padding: '0 16px', fontSize: 12, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>New User?</div>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>

          <p style={{ textAlign: 'center', color: '#64748b', fontSize: 15, margin: 0 }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: '#7c3aed', fontWeight: 800, textDecoration: 'none' }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
