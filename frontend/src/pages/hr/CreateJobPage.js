import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createJob } from '../../api';
import { toast } from 'react-toastify';

const INITIAL = {
  title: '', company: '', location: '', job_type: 'Full-time',
  description: '', requirements: '', skills_required: '',
  experience_required: '', salary_range: '', ats_threshold: 80, deadline: '',
};

export default function CreateJobPage() {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('basic');
  const navigate = useNavigate();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      // Validate deadline
      if (!form.deadline) {
        setError('Application deadline is required');
        setActiveSection('details');
        setLoading(false);
        return;
      }
      
      const deadlineDate = new Date(form.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        setError('Deadline must be in the future');
        setActiveSection('details');
        setLoading(false);
        return;
      }
      
      const payload = { ...form, ats_threshold: parseFloat(form.ats_threshold) };
      await createJob(payload);
      toast.success('Job posted successfully!');
      navigate('/hr/jobs');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create job. Please try again.');
      setActiveSection('basic');
    } finally { setLoading(false); }
  };

  const sections = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'details', label: 'Job Details' },
    { id: 'description', label: 'Description' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-inner">
          <div className="breadcrumb">
            <Link to="/hr/dashboard">Dashboard</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/hr/jobs">Job Posts</Link>
            <span className="breadcrumb-sep">›</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>New Posting</span>
          </div>
          <h1>Post a <span className="page-header-accent">New Job</span></h1>
          <p>Create a job listing with ATS scoring configuration</p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px 80px' }}>
        <div className="grid-2" style={{ gap: 48, alignItems: 'start' }}>
          {/* Form */}
          <div>
            {/* Section tabs */}
            <div className="tabs" style={{ marginBottom: 32 }}>
              {sections.map(s => (
                <button key={s.id} className={`tab ${activeSection === s.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(s.id)} type="button">
                  {s.label}
                </button>
              ))}
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Basic Info */}
              {activeSection === 'basic' && (
                <div className="animate-in">
                  <div className="form-group">
                    <label className="form-label">Job Title *</label>
                    <input className="form-input" placeholder="e.g. Senior React Developer" required
                      value={form.title} onChange={e => set('title', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company Name *</label>
                    <input className="form-input" placeholder="e.g. TechCorp India" required
                      value={form.company} onChange={e => set('company', e.target.value)} />
                  </div>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input className="form-input" placeholder="e.g. Bangalore / Remote"
                        value={form.location} onChange={e => set('location', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Job Type</label>
                      <select className="form-input" value={form.job_type} onChange={e => set('job_type', e.target.value)}>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Remote</option>
                        <option>Internship</option>
                        <option>Contract</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Experience Required</label>
                      <input className="form-input" placeholder="e.g. 2–4 years"
                        value={form.experience_required} onChange={e => set('experience_required', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Salary Range</label>
                      <input className="form-input" placeholder="e.g. ₹8–12 LPA"
                        value={form.salary_range} onChange={e => set('salary_range', e.target.value)} />
                    </div>
                  </div>
                  <button type="button" className="btn btn-primary" onClick={() => setActiveSection('details')}>
                    Next: Job Details →
                  </button>
                </div>
              )}

              {/* Job Details */}
              {activeSection === 'details' && (
                <div className="animate-in">
                  <div className="form-group">
                    <label className="form-label">Required Skills *</label>
                    <input className="form-input" placeholder="e.g. React, Node.js, PostgreSQL, REST API, Git" required
                      value={form.skills_required} onChange={e => set('skills_required', e.target.value)} />
                    <span className="form-hint">Separate with commas. These are used for ATS keyword matching.</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Application Deadline *</label>
                    <input className="form-input" type="date" required
                      min={new Date().toISOString().split('T')[0]}
                      value={form.deadline} onChange={e => set('deadline', e.target.value)} />
                    <span className="form-hint">Students can only apply until this date. Must be in the future.</span>
                  </div>

                  {/* ATS Threshold */}
                  <div className="form-group">
                    <label className="form-label">ATS Threshold (%)</label>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <input className="form-input" type="number" min="0" max="100" style={{ maxWidth: 120 }}
                        value={form.ats_threshold} onChange={e => set('ats_threshold', e.target.value)} />
                      <div style={{ flex: 1 }}>
                        <div className="progress-bar" style={{ marginBottom: 6 }}>
                          <div className="progress-fill progress-purple"
                            style={{ width: `${form.ats_threshold}%` }} />
                        </div>
                        <span className="form-hint">
                          Resumes below <strong>{form.ats_threshold}%</strong> will be automatically rejected
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Threshold preset buttons */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
                    {[60, 70, 75, 80, 85, 90].map(v => (
                      <button key={v} type="button"
                        className={`filter-chip ${parseInt(form.ats_threshold) === v ? 'active' : ''}`}
                        onClick={() => set('ats_threshold', v)}>
                        {v}%
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setActiveSection('basic')}>← Back</button>
                    <button type="button" className="btn btn-primary" onClick={() => setActiveSection('description')}>Next: Description →</button>
                  </div>
                </div>
              )}

              {/* Description */}
              {activeSection === 'description' && (
                <div className="animate-in">
                  <div className="form-group">
                    <label className="form-label">Job Description *</label>
                    <textarea className="form-input" rows={6} required
                      placeholder="Describe the role, key responsibilities, what success looks like in this position…"
                      value={form.description} onChange={e => set('description', e.target.value)} />
                    <span className="form-hint">Include relevant keywords — they contribute to ATS scoring.</span>
                  </div>
                  <div className="form-group" style={{ marginBottom: 32 }}>
                    <label className="form-label">Requirements & Qualifications</label>
                    <textarea className="form-input" rows={5}
                      placeholder="Educational qualifications, certifications, preferred background…"
                      value={form.requirements} onChange={e => set('requirements', e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setActiveSection('details')}>← Back</button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '14px' }} disabled={loading}>
                      {loading
                        ? <><span className="spinner spinner-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Publishing…</>
                        : '🚀 Publish Job Post'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Preview sidebar */}
          <div>
            <div style={{ position: 'sticky', top: 88 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 16 }}>
                Live Preview
              </div>
              <div className="card card-accented">
                <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 8, color: form.title ? 'var(--black)' : 'var(--light-gray)' }}>
                  {form.title || 'Job Title'}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {form.company && <span>🏢 {form.company}</span>}
                  {form.location && <span>📍 {form.location}</span>}
                  {form.job_type && <span>⏱ {form.job_type}</span>}
                </div>

                {form.salary_range && (
                  <div style={{ marginBottom: 12 }}>
                    <span className="badge badge-success">💰 {form.salary_range}</span>
                  </div>
                )}

                {form.skills_required && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                    {form.skills_required.split(',').slice(0, 6).map(s => s.trim()).filter(Boolean).map(s => (
                      <span key={s} className="skill-tag" style={{ fontSize: 12 }}>{s}</span>
                    ))}
                  </div>
                )}

                <div className="divider" />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>ATS Threshold</span>
                  <span style={{ fontWeight: 800, color: 'var(--purple)', fontSize: 16 }}>{form.ats_threshold}%</span>
                </div>
              </div>

              <div style={{ marginTop: 20, background: 'var(--off-black)', padding: '20px 24px', color: '#fff' }}>
                <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>💡 Pro Tips</div>
                {[
                  'List skills exactly as candidates would write them',
                  'Include technology names in the description',
                  'A lower threshold catches more talent; higher ensures tighter fit',
                ].map(tip => (
                  <div key={tip} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 8, lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--purple-light)', fontWeight: 700 }}>›</span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
