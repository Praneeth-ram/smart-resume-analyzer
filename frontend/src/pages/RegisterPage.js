import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const fontFamily = "sans-serif";

export default function RegisterPage() {
  const [form, setForm] = useState({ 
    email: '', 
    password: '', 
    role: 'student',
    full_name: '',
    company_name: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await register(form);
      // Start the transition
      setIsCreatingAccount(true);
      
      // Delay navigation
      setTimeout(() => {
        loginUser(res.data);
        toast.success('Account created!');
        navigate(res.data.role === 'hr' ? '/hr/dashboard' : '/jobs');
      }, 1500);
    } catch (err) {
      const errorDetail = err.response?.data?.detail || err.message || 'Registration failed. Please try again.';
      setError(errorDetail);
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
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)', fontFamily, position: 'relative', overflowX: 'hidden' }}>
      
      {/* Transition Overlay */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1); }
          100% { opacity: 0.6; transform: scale(0.98); }
        }
        @keyframes loadRegister {
          0% { width: 0%; opacity: 0; }
          10% { opacity: 1; }
          100% { width: 100%; opacity: 1; }
        }
      `}</style>
      
      <div style={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        background: '#010409',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.8s ease-in-out',
        opacity: isCreatingAccount ? 1 : 0,
        pointerEvents: isCreatingAccount ? 'all' : 'none',
        color: '#fff',
        fontFamily
      }}>
        <div style={{ 
          textAlign: 'center',
          animation: 'pulse 2s infinite'
        }}>
          <div style={{ fontSize: 44, marginBottom: 24, filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.4))' }}>✨</div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '0.5px', marginBottom: 8 }}>
            Creating Account...
          </div>
          <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 32 }}>
            Welcome, {form.full_name}! Configuring your personalized AI workspace
          </p>

          <div style={{ 
            width: '280px', height: '2px', background: 'rgba(255,255,255,0.08)', 
            borderRadius: '1px', margin: '0 auto', overflow: 'hidden'
          }}>
            <div style={{ 
              height: '100%', 
              background: 'linear-gradient(90deg, #10b981, #34d399, #10b981)',
              backgroundSize: '200% 100%',
              animation: 'loadRegister 1.4s ease-in-out forwards'
            }} />
          </div>
        </div>
      </div>
      
      {/* Left Premium Panel */}
      <div style={{
        flex: '0 0 540px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '64px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Glow Effects */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 60%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 60%)', borderRadius: '50%' }} />
        
        <div style={{ maxWidth: 380, position: 'relative', zIndex: 1 }} className="animate-in">
          <div style={{ width: 64, height: 6, background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', borderRadius: 3, marginBottom: 40 }} />
          
          <h1 style={{ fontSize: 44, fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px' }}>
            Start your AI-powered journey.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.7, marginBottom: 56 }}>
            Whether you're looking for your next breakthrough role or hunting for top-tier talent, SmartResume securely connects you with the right opportunities.
          </p>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 40 }}>
             <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 16, fontWeight: 600 }}>Already have an account?</p>
             <Link to="/login" style={{ 
               display: 'inline-block', padding: '12px 24px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)',
               color: '#fff', textDecoration: 'none', fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)',
               transition: 'all 0.2s', fontSize: 14
             }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.05)'}>
               Sign In Instead →
             </Link>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 40px', background: '#f8fafc' }}>
        <div style={{ 
          width: '100%', maxWidth: 480, background: '#fff', padding: '48px',
          borderRadius: '24px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 20px 60px rgba(0,0,0,0.03)'
        }} className="animate-in">
          
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, color: '#0f172a', letterSpacing: '-0.5px' }}>Create Account</h2>
            <p style={{ color: '#64748b', fontSize: 16 }}>Select your primary role to customize your workspace.</p>
          </div>

          <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
            <div onClick={() => setForm({ ...form, role: 'student' })} style={{
              flex: 1, border: form.role === 'student' ? '2px solid #10b981' : '1px solid #e2e8f0',
              background: form.role === 'student' ? '#f0fdf4' : '#fff', borderRadius: '16px', padding: '20px',
              cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center'
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>👤</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Job Seeker</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Calculate ATS scores & apply instantly</div>
            </div>

             <div onClick={() => setForm({ ...form, role: 'hr' })} style={{
              flex: 1, border: form.role === 'hr' ? '2px solid #7c3aed' : '1px solid #e2e8f0',
              background: form.role === 'hr' ? '#f5f3ff' : '#fff', borderRadius: '16px', padding: '20px',
              cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center'
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🏢</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>HR Manager</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Post openings & securely filter talent</div>
            </div>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '14px 18px', borderRadius: '12px', fontSize: 14, fontWeight: 600, marginBottom: 24 }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Full Name</label>
              <input style={inputStyle} type="text" placeholder="John Doe" required
                value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} 
                onFocus={e => e.target.style.borderColor = form.role === 'hr' ? '#7c3aed' : '#10b981'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
            </div>

            {form.role === 'hr' && (
              <div style={{ marginBottom: 20 }} className="animate-in">
                <label style={labelStyle}>Company Name</label>
                <input style={inputStyle} type="text" placeholder="Acme Corp" required
                  value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} 
                  onFocus={e => e.target.style.borderColor = '#7c3aed'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Email Address</label>
              <input style={inputStyle} type="email" placeholder="you@company.com" required
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} 
                onFocus={e => e.target.style.borderColor = form.role === 'hr' ? '#7c3aed' : '#10b981'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
            </div>
            
            <div style={{ marginBottom: 32 }}>
              <label style={labelStyle}>Create Password</label>
              <input style={inputStyle} type="password" placeholder="Min. 6 characters securely encrypted" required minLength={6}
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} 
                onFocus={e => e.target.style.borderColor = form.role === 'hr' ? '#7c3aed' : '#10b981'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
            </div>

            <div style={{
              background: form.role === 'hr' ? '#f8fafc' : '#f8fafc', padding: '16px 20px',
              borderRadius: '12px', borderLeft: form.role === 'hr' ? '4px solid #7c3aed' : '4px solid #10b981',
              fontSize: 13, color: '#475569', lineHeight: 1.5, marginBottom: 32, fontWeight: 500
            }}>
              {form.role === 'student'
                ? '📌 Once registered, you will be able to search open jobs to upload your resume against proprietary parsing algorithms.'
                : '📌 Registration allows authorized access to building HR dashboards and modifying specific thresholds for job pipelines.'}
            </div>

            <button type="submit" disabled={loading} style={{ 
              width: '100%', padding: '16px', borderRadius: '16px', fontSize: 16, fontWeight: 700,
              background: form.role === 'hr' ? 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s', boxShadow: loading ? 'none' : (form.role === 'hr' ? '0 10px 25px rgba(124, 58, 237, 0.4)' : '0 10px 25px rgba(16, 185, 129, 0.4)')
            }} onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = form.role === 'hr' ? '0 15px 35px rgba(124, 58, 237, 0.5)' : '0 15px 35px rgba(16, 185, 129, 0.5)'; } }} 
               onMouseLeave={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = form.role === 'hr' ? '0 10px 25px rgba(124, 58, 237, 0.4)' : '0 10px 25px rgba(16, 185, 129, 0.4)'; } }}>
              {loading ? 'Processing System...' : `Create ${form.role === 'hr' ? 'HR' : 'Seeker'} Account →`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
