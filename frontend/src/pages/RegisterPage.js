import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await register(form);
      loginUser(res.data);
      toast.success('Account created!');
      navigate(res.data.role === 'hr' ? '/hr/dashboard' : '/jobs');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)' }}>
      {/* Left panel */}
      <div style={{
        flex: '0 0 480px', background: 'var(--off-black)',
        padding: '64px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <div style={{ maxWidth: 360 }}>
          <div style={{ width: 48, height: 4, background: 'var(--purple)', marginBottom: 32 }} />
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 16 }}>
            Start your journey.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.7, marginBottom: 48 }}>
            Whether you're looking for your next role or hiring top talent —
            SmartResume connects the right people.
          </p>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 32 }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: 16 }}>Already have an account?</p>
            <Link to="/login" className="btn btn-ghost btn-sm">Sign In →</Link>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 40px', background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: 440 }} className="animate-in">
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Create Account</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Choose your role to get started</p>
          </div>

          {/* Role selector */}
          <div className="role-cards" style={{ marginBottom: 28 }}>
            <div className={`role-card ${form.role === 'student' ? 'active' : ''}`}
              onClick={() => setForm({ ...form, role: 'student' })}>
              <div className="role-card-icon">👤</div>
              <div className="role-card-title">Job Seeker</div>
              <div className="role-card-sub">Find & apply for jobs</div>
            </div>
            <div className={`role-card ${form.role === 'hr' ? 'active' : ''}`}
              onClick={() => setForm({ ...form, role: 'hr' })}>
              <div className="role-card-icon">🏢</div>
              <div className="role-card-title">HR / Company</div>
              <div className="role-card-sub">Post jobs & hire talent</div>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="you@company.com" required
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group" style={{ marginBottom: 8 }}>
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min. 6 characters" required minLength={6}
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>

            <div className="alert alert-info" style={{ marginBottom: 24, fontSize: 13 }}>
              {form.role === 'student'
                ? '📌 As a Job Seeker you can apply for jobs, upload resumes, and receive real-time ATS feedback.'
                : '📌 As HR you can post jobs, review ATS-filtered candidates, and send selection emails.'}
            </div>

            <button type="submit" className="btn btn-primary btn-full" style={{ padding: '14px' }} disabled={loading}>
              {loading ? (
                <><span className="spinner spinner-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Creating Account…</>
              ) : (
                <>Create {form.role === 'hr' ? 'HR' : 'Job Seeker'} Account <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
