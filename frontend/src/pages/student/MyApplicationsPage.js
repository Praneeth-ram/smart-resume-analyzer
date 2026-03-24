import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyApplications } from '../../api';

const STATUS = {
  applied:     { label: 'Pending Resume', cls: 'badge-neutral',  icon: '📝' },
  ats_passed:  { label: 'ATS Passed',     cls: 'badge-success',  icon: '✅' },
  ats_failed:  { label: 'ATS Failed',     cls: 'badge-danger',   icon: '❌' },
  shortlisted: { label: 'Shortlisted',    cls: 'badge-warning',  icon: '⭐' },
  rejected:    { label: 'Not Selected',   cls: 'badge-danger',   icon: '🚫' },
  selected:    { label: 'Selected 🎉',    cls: 'badge-success',  icon: '🎉' },
};

export default function MyApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { getMyApplications().then(r => setApps(r.data)).finally(() => setLoading(false)); }, []);

  if (loading) return <div style={{ padding: 80, textAlign: 'center' }}><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-inner">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>My Applications</span>
          </div>
          <h1>My <span className="page-header-accent">Applications</span></h1>
          <p>{apps.length} application{apps.length !== 1 ? 's' : ''} submitted</p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px 80px' }}>
        {apps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>No applications yet</h3>
            <p>Start by browsing open positions and applying</p>
            <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => navigate('/jobs')}>
              Browse Jobs →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border-gray)', border: '1px solid var(--border-gray)' }}>
            {apps.map(app => {
              const s = STATUS[app.status] || STATUS.applied;
              const needsUpload = app.status === 'applied' && !app.resume_filename;
              return (
                <div key={app.id} style={{ background: '#fff', padding: '24px 32px', transition: 'var(--transition)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-offwhite)'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                        <span className={`badge ${s.cls}`}>{s.icon} {s.label}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          Applied {new Date(app.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                        Application #{app.id} · Job #{app.job_post_id}
                      </div>
                      {app.resume_filename && (
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
                          📄 {app.resume_filename}
                          {app.resume_drive_link && (
                            <a href={app.resume_drive_link} target="_blank" rel="noreferrer"
                              style={{ color: 'var(--purple)', marginLeft: 10, fontWeight: 600 }}>
                              View in Drive ↗
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* ATS Score */}
                    {app.ats_score != null && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          fontSize: 32, fontWeight: 800, fontFamily: 'Outfit',
                          color: app.ats_score >= 80 ? 'var(--accent-green)' : 'var(--danger)',
                          lineHeight: 1,
                        }}>{app.ats_score.toFixed(0)}%</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 4 }}>ATS Score</div>
                      </div>
                    )}
                  </div>

                  {/* Progress bar for ATS */}
                  {app.ats_score != null && (
                    <div style={{ marginTop: 14 }}>
                      <div className="progress-bar">
                        <div className={`progress-fill ${app.ats_score >= 80 ? 'progress-green' : 'progress-danger'}`}
                          style={{ width: `${app.ats_score}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Upload CTA */}
                  {needsUpload && (
                    <div style={{ marginTop: 16, padding: '14px 18px', background: 'var(--bg-light)', border: '1px solid var(--purple-xlight)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>📤 Resume upload pending — upload now to get your ATS score</span>
                      <button className="btn btn-primary btn-sm" onClick={() => navigate(`/upload/${app.id}`)}>
                        Upload Resume
                      </button>
                    </div>
                  )}

                  {app.status === 'selected' && (
                    <div className="alert alert-success" style={{ marginTop: 14, fontSize: 13 }}>
                      🎉 Congratulations! You've been selected. Check your email for further details and next steps.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
