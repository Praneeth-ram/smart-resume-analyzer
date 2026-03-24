import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getJob, applyForJob } from '../../api';
import { toast } from 'react-toastify';

export default function ApplyPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ student_name: '', student_email: '', date_of_birth: '', phone: '' });
  const [error, setError] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { getJob(jobId).then(r => setJob(r.data)); }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await applyForJob({ ...form, job_post_id: parseInt(jobId) });
      toast.success('Application submitted! Upload your resume next.');
      navigate(`/upload/${res.data.id}`);
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(msg === 'Already applied for this job'
        ? 'You have already applied for this position.'
        : msg || 'Failed to apply. Please try again.');
    } finally { setLoading(false); }
  };

  if (!job) return <div style={{ padding: 80, textAlign: 'center' }}><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-inner">
          <div className="breadcrumb">
            <Link to="/jobs">Careers</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to={`/jobs/${jobId}`}>{job.title}</Link>
            <span className="breadcrumb-sep">›</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>Apply</span>
          </div>
          <h1>Your Details</h1>
          <p>Step 1 of 2 — Tell us about yourself before uploading your resume</p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px 80px' }}>
        <div className="grid-2" style={{ gap: 48, alignItems: 'start' }}>
          {/* Form */}
          <div>
            <div style={{ marginBottom: 28, padding: '16px 20px', background: 'var(--bg-offwhite)', borderLeft: '4px solid var(--purple)', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              After submitting, you'll be directed to upload your resume for ATS analysis.
              Resumes scoring <strong style={{ color: 'var(--purple)' }}>{job.ats_threshold}%+</strong> will be forwarded to HR.
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" placeholder="As per official documents" required
                  value={form.student_name} onChange={e => set('student_name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className="form-input" type="email" placeholder="you@email.com" required
                  value={form.student_email} onChange={e => set('student_email', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth *</label>
                <input className="form-input" type="date" required
                  value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 28 }}>
                <label className="form-label">Phone Number</label>
                <input className="form-input" placeholder="+91 98765 43210"
                  value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary btn-full" style={{ padding: '14px' }} disabled={loading}>
                {loading
                  ? <><span className="spinner spinner-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Submitting…</>
                  : <>Continue to Resume Upload →</>}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div>
            <div className="card card-accented">
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Applying For</h3>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{job.title}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>
                🏢 {job.company} {job.location && `· 📍 ${job.location}`}
              </div>
              <div className="divider" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Job Type</span>
                  <span className="badge badge-purple badge-pill">{job.job_type || 'Full-time'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>ATS Threshold</span>
                  <span style={{ fontWeight: 700, color: 'var(--purple)' }}>{job.ats_threshold}%</span>
                </div>
                {job.deadline && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Deadline</span>
                    <span style={{ fontWeight: 600 }}>{new Date(job.deadline).toLocaleDateString('en-IN')}</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ background: 'var(--bg-offwhite)', padding: '20px 24px', marginTop: 20, border: '1px solid var(--border-gray)' }}>
              <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 14 }}>📋 What happens next</div>
              {['Submit your details', 'Upload your resume (PDF/DOCX)', 'Get your instant ATS score', 'If ≥ threshold → HR is notified'].map((s, i) => (
                <div key={s} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                  <span style={{ color: 'var(--purple)', fontWeight: 800, minWidth: 16 }}>{i + 1}.</span>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
