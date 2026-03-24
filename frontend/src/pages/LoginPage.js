import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

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

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)' }}>
      {/* Left panel */}
      <div style={{
        flex: '0 0 480px', background: 'var(--off-black)',
        padding: '64px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <div style={{ maxWidth: 360 }}>
          <div style={{
            width: 48, height: 4, background: 'var(--purple)', marginBottom: 32,
          }} />
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 16 }}>
            Welcome back.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.7, marginBottom: 48 }}>
            Sign in to access your dashboard, track applications, and manage your career journey.
          </p>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 32 }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: 16 }}>Don't have an account?</p>
            <Link to="/register" className="btn btn-ghost btn-sm">
              Create Account →
            </Link>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '64px 40px', background: '#fff',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }} className="animate-in">
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Sign In</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Enter your credentials to continue</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="you@company.com" required
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group" style={{ marginBottom: 28 }}>
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" required
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>

            <button type="submit" className="btn btn-primary btn-full" style={{ padding: '14px' }} disabled={loading}>
              {loading ? (
                <><span className="spinner spinner-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Signing In…</>
              ) : (
                <>Sign In <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
              )}
            </button>
          </form>

          <div className="divider" style={{ margin: '28px 0' }} />

          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
            New to SmartResume?{' '}
            <Link to="/register" style={{ color: 'var(--purple)', fontWeight: 700 }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
