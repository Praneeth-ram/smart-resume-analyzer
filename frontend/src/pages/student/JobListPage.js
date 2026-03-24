import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs } from '../../api';

const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Remote', 'Internship', 'Contract'];

export default function JobListPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    getJobs().then(r => setJobs(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(j => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      (j.location || '').toLowerCase().includes(search.toLowerCase()) ||
      (j.skills_required || '').toLowerCase().includes(search.toLowerCase());
    const matchType = activeType === 'All' || j.job_type === activeType;
    return matchSearch && matchType;
  });

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-inner">
          <div className="breadcrumb">
            <span>Home</span>
            <span className="breadcrumb-sep">›</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>Careers</span>
          </div>
          <h1>Find Your <span className="page-header-accent">Next Role</span></h1>
          <p>{jobs.length} active positions across all career areas</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ background: 'var(--bg-offwhite)', borderBottom: '1px solid var(--border-gray)', padding: '24px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="search-bar-wrap" style={{ maxWidth: 680, marginBottom: 16 }}>
            <div className="search-bar-icon">🔍</div>
            <input
              className="search-bar-input"
              placeholder="Search by title, company, skill or location…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="search-bar-btn">Search</button>
          </div>
          <div className="filter-chips">
            {JOB_TYPES.map(t => (
              <button key={t} className={`filter-chip ${activeType === t ? 'active' : ''}`}
                onClick={() => setActiveType(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 40px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Showing <strong style={{ color: 'var(--text-body)' }}>{filtered.length}</strong> result{filtered.length !== 1 ? 's' : ''}
            {search && <> for "<strong style={{ color: 'var(--text-body)' }}>{search}</strong>"</>}
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: 80 }}><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No jobs found</h3>
            <p>Try adjusting your search or filter criteria</p>
            <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={() => { setSearch(''); setActiveType('All'); }}>Clear Filters</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border-gray)', border: '1px solid var(--border-gray)' }}>
            {filtered.map(job => (
              <div key={job.id} className="job-card" onClick={() => navigate(`/jobs/${job.id}`)}>
                <div className="job-card-header">
                  <div style={{ flex: 1 }}>
                    <div className="job-card-title">{job.title}</div>
                    <div className="job-card-meta" style={{ marginTop: 6 }}>
                      <span>🏢 {job.company}</span>
                      {job.location && <span>📍 {job.location}</span>}
                      {job.job_type && <span>⏱ {job.job_type}</span>}
                      {job.salary_range && <span>💰 {job.salary_range}</span>}
                      {job.experience_required && <span>🎓 {job.experience_required}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
                    <span className="badge badge-purple">{job.job_type || 'Full-time'}</span>
                    {job.deadline && new Date(job.deadline) < new Date(Date.now() + 7*24*60*60*1000) && (
                      <span className="badge badge-warning">Closing Soon</span>
                    )}
                  </div>
                </div>

                {/* Skills */}
                {job.skills_required && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {job.skills_required.split(',').slice(0, 7).map(s => (
                      <span key={s} className="skill-tag" style={{ fontSize: 12, padding: '3px 10px' }}>{s.trim()}</span>
                    ))}
                    {job.skills_required.split(',').length > 7 && (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>
                        +{job.skills_required.split(',').length - 7} more
                      </span>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Posted {new Date(job.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {job.deadline && ` · Deadline: ${new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--purple)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    View & Apply
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
