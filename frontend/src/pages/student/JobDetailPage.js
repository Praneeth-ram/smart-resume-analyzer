import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getJob } from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => { getJob(id).then(r => setJob(r.data)).finally(() => setLoading(false)); }, [id]);

  if (loading) return <div style={{ padding: 80, textAlign: 'center' }}><div className="spinner" /></div>;
  if (!job) return <div className="page"><div className="alert alert-error">Job not found.</div></div>;

  const handleApply = () => {
    if (!user) { navigate('/login'); return; }
    navigate(`/apply/${job.id}`);
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-inner">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/jobs">Careers</Link>
            <span className="breadcrumb-sep">›</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{job.title}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <h1 style={{ marginBottom: 12 }}>{job.title}</h1>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>
                <span>🏢 {job.company}</span>
                {job.location && <span>📍 {job.location}</span>}
                {job.job_type && <span>⏱ {job.job_type}</span>}
                {job.salary_range && <span>💰 {job.salary_range}</span>}
              </div>
            </div>
            <button className="btn btn-primary btn-lg" onClick={handleApply}>
              Apply Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px 80px' }}>
        <div className="grid-2" style={{ gap: 48, alignItems: 'start' }}>
          {/* Main content */}
          <div>
            {/* ATS Notice */}
            <div style={{
              background: 'var(--bg-light)', borderLeft: '4px solid var(--purple)',
              padding: '18px 20px', marginBottom: 32, display: 'flex', gap: 14, alignItems: 'center',
            }}>
              <span style={{ fontSize: 28 }}>🎯</span>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 3 }}>ATS Score Required: {job.ats_threshold}% or above</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  Your resume is automatically scored against this role. Only scores ≥ {job.ats_threshold}% proceed.
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid var(--border-gray)' }}>
                About the Role
              </h2>
              <div style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 15, whiteSpace: 'pre-wrap' }}>
                {job.description}
              </div>
            </div>

            {job.requirements && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid var(--border-gray)' }}>
                  Requirements
                </h2>
                <div style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 15, whiteSpace: 'pre-wrap' }}>
                  {job.requirements}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Job Info Card */}
            <div className="card card-accented" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Job Details</h3>
              {[
                ['Job Type', job.job_type || 'Full-time'],
                ['Location', job.location || 'Not specified'],
                ['Experience', job.experience_required || 'Not specified'],
                ['Salary', job.salary_range || 'Not disclosed'],
                ['Deadline', job.deadline ? new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Open'],
                ['ATS Threshold', `${job.ats_threshold}%`],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-gray)', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
                  <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '55%' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Skills */}
            {job.skills_required && (
              <div className="card" style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Required Skills</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {job.skills_required.split(',').map(s => (
                    <span key={s} className="skill-tag">{s.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Apply CTA */}
            <div style={{ background: 'var(--off-black)', padding: '28px 24px' }}>
              <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Ready to Apply?</h3>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>
                Submit your details and upload your resume to receive your instant ATS score.
              </p>
              <button className="btn btn-primary btn-full" style={{ padding: '14px' }} onClick={handleApply}>
                Apply Now →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
