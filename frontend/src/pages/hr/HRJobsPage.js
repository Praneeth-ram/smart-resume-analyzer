import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getJobs, deleteJob } from '../../api';
import { toast } from 'react-toastify';

export default function HRJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = () => getJobs().then(r => setJobs(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleDeactivate = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Deactivate this job posting?')) return;
    await deleteJob(id);
    toast.success('Job deactivated');
    load();
  };

  if (loading) return <div style={{ padding: 80, textAlign: 'center' }}><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div className="breadcrumb" style={{ marginBottom: 10 }}>
                <Link to="/hr/dashboard">Dashboard</Link>
                <span className="breadcrumb-sep">›</span>
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>Job Posts</span>
              </div>
              <h1>My <span className="page-header-accent">Job Posts</span></h1>
              <p>{jobs.length} posting{jobs.length !== 1 ? 's' : ''}</p>
            </div>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/hr/jobs/new')}>+ Post New Job</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px 80px' }}>
        {jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No job postings yet</h3>
            <p>Create your first job to start receiving applications</p>
            <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => navigate('/hr/jobs/new')}>
              Post a Job →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border-gray)', border: '1px solid var(--border-gray)' }}>
            {jobs.map(job => (
              <div key={job.id} style={{ background: '#fff', padding: '24px 32px', transition: 'var(--transition)', cursor: 'pointer', position: 'relative' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-offwhite)'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{job.title}</div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 14, color: 'var(--text-muted)' }}>
                      <span>📍 {job.location || 'Not specified'}</span>
                      <span>⏱ {job.job_type || 'Full-time'}</span>
                      <span>🎯 ATS: <strong style={{ color: 'var(--purple)' }}>{job.ats_threshold}%</strong></span>
                      {job.deadline && <span>🗓 Deadline: {new Date(job.deadline).toLocaleDateString('en-IN')}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate(`/hr/jobs/${job.id}/applications`)}>
                      View Applications
                    </button>
                    <button className="btn btn-sm" style={{ background: 'var(--bg-offwhite)', border: '1px solid var(--border-gray)', color: 'var(--danger)' }}
                      onClick={(e) => handleDeactivate(job.id, e)}>
                      Deactivate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
