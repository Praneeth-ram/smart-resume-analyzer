import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyApplications } from '../../api';

export default function StudentDashboard() {
  const [apps, setApps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { getMyApplications().then(r => setApps(r.data)); }, []);

  const stats = {
    total: apps.length,
    passed: apps.filter(a => ['ats_passed','shortlisted','selected'].includes(a.status)).length,
    selected: apps.filter(a => a.status === 'selected').length,
    avgScore: apps.filter(a => a.ats_score != null).length > 0
      ? apps.filter(a => a.ats_score != null).reduce((s, a, _, ar) => s + a.ats_score / ar.length, 0)
      : null,
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-inner">
          <h1>My <span className="page-header-accent">Dashboard</span></h1>
          <p>Track your applications and hiring status</p>
        </div>
      </div>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px 80px' }}>
        <div className="stats-grid" style={{ marginBottom: 40 }}>
          {[
            { v: stats.total, l: 'Applications' },
            { v: stats.passed, l: 'ATS Passed' },
            { v: stats.selected, l: 'Selected' },
            { v: stats.avgScore ? `${stats.avgScore.toFixed(0)}%` : '—', l: 'Avg ATS Score' },
          ].map(s => (
            <div key={s.l} className="stat-card">
              <div className="stat-value">{s.v}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/jobs')}>Browse Jobs</button>
          <button className="btn btn-outline btn-lg" onClick={() => navigate('/my-applications')}>View Applications</button>
        </div>
      </div>
    </div>
  );
}
