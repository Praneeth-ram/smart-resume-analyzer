import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getHRDashboard } from '../../api';

export default function HRDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { getHRDashboard().then(r => setData(r.data)).finally(() => setLoading(false)); }, []);

  if (loading) return <div style={{ padding: 80, textAlign: 'center' }}><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div className="breadcrumb" style={{ marginBottom: 10 }}>
                <span>HR Portal</span>
                <span className="breadcrumb-sep">›</span>
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>Dashboard</span>
              </div>
              <h1 style={{ marginBottom: 8 }}>
                Welcome, <span className="page-header-accent">{data?.hr_name}</span>
              </h1>
              <p>🏢 {data?.company_name}</p>
            </div>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/hr/jobs/new')}>
              + Post New Job
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px 80px' }}>
        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: 48 }}>
          {[
            { v: data?.total_jobs ?? 0, l: 'Total Jobs', icon: '📋' },
            { v: data?.active_jobs ?? 0, l: 'Active Listings', icon: '🟢' },
            { v: data?.total_applications ?? 0, l: 'Applications', icon: '📥' },
            { v: data?.ats_passed ?? 0, l: 'ATS Qualified', icon: '✅' },
            { v: data?.selected ?? 0, l: 'Selected', icon: '🎉' },
          ].map(s => (
            <div key={s.l} className="stat-card">
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div className="stat-value">{s.v}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Quick Actions</h2>
          <div className="grid-3" style={{ gap: 1, background: 'var(--border-gray)', border: '1px solid var(--border-gray)' }}>
            {[
              { icon: '➕', title: 'Post a Job', desc: 'Create a new job opening with ATS configuration', action: () => navigate('/hr/jobs/new'), cta: 'Post Job' },
              { icon: '📋', title: 'Manage Listings', desc: 'View and manage all your active and past job posts', action: () => navigate('/hr/jobs'), cta: 'View Jobs' },
              { icon: '👥', title: 'Review Candidates', desc: 'See all ATS-filtered applicants across your postings', action: () => navigate('/hr/jobs'), cta: 'View Candidates' },
            ].map(item => (
              <div key={item.title} style={{ background: '#fff', padding: '28px 24px' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>{item.desc}</div>
                <button className="btn btn-outline btn-sm" onClick={item.action}>{item.cta} →</button>
              </div>
            ))}
          </div>
        </div>

        {/* First-time guide */}
        {(data?.total_jobs === 0) && (
          <div style={{ background: 'var(--bg-light)', borderLeft: '4px solid var(--purple)', padding: '20px 24px' }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>🚀 Get started</div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
              Post your first job to start receiving applications with AI-powered ATS scoring.
              Only candidates above your set threshold will appear in your review queue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
