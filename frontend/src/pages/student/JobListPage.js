import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs } from '../../api';

const fontFamily = "sans-serif";
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
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily, paddingBottom: 80, overflowX: 'hidden' }}>

      {/* Premium Header Container */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        padding: '80px 40px 100px',
        overflow: 'hidden'
      }}>
        {/* Ambient background glows */}
        <div style={{
          position: 'absolute', top: '-10%', right: '10%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, transparent 70%)',
          borderRadius: '50%', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', left: '5%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.06) 0%, transparent 70%)',
          borderRadius: '50%', zIndex: 0
        }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="animate-in">
            <h1 style={{ fontSize: window.innerWidth < 768 ? 24 : 32, fontWeight: 700, color: '#0f172a', letterSpacing: '-1.5px', marginBottom: 20 }}>
              Find Your <span style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #0ea5e9 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>Next Role.</span>
            </h1>
            <p style={{ fontSize: 18, color: '#64748b', margin: '0 auto 48px', maxWidth: 640 }}>
              Discover {jobs.length || 'exciting'} open positions and match your resume against intelligent ATS parsing to see your exact fitness score.
            </p>

            {/* Smart Search Bar */}
            <div style={{
              maxWidth: 720, margin: '0 auto', background: '#ffffff',
              borderRadius: '20px', padding: '12px', display: 'flex', gap: 12,
              boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.03)',
              alignItems: 'center'
            }}>
              <span style={{ paddingLeft: 16, fontSize: 20 }}>🔍</span>
              <input
                style={{
                  flex: 1, border: 'none', outline: 'none', background: 'transparent',
                  padding: '12px 8px', fontSize: 16, fontFamily, color: '#0f172a'
                }}
                placeholder="Search titles, companies, skills or locations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', border: 'none',
                color: '#fff', padding: '14px 32px', borderRadius: '14px', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 8px 20px rgba(124, 58, 237, 0.2)'
              }} onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.target.style.transform = 'translateY(0)'}>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1280, margin: '-25px auto 0', padding: '0 40px', position: 'relative', zIndex: 10 }}>

        {/* Filter Chips Layer */}
        <div className="animate-in" style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 48, animationDelay: '0.1s' }}>
          {JOB_TYPES.map(t => {
            const active = activeType === t;
            return (
              <button key={t} onClick={() => setActiveType(t)} style={{
                padding: '10px 24px', borderRadius: '30px', fontSize: 14, fontWeight: 700,
                border: active ? 'none' : '1px solid #e2e8f0', cursor: 'pointer',
                background: active ? '#0f172a' : '#ffffff',
                color: active ? '#ffffff' : '#64748b', transition: 'all 0.2s',
                boxShadow: active ? '0 10px 20px rgba(15, 23, 42, 0.2)' : '0 4px 10px rgba(0,0,0,0.03)'
              }} onMouseEnter={e => { if (!active) e.target.style.borderColor = '#94a3b8'; }}
                onMouseLeave={e => { if (!active) e.target.style.borderColor = '#e2e8f0'; }}>
                {t}
              </button>
            )
          })}
        </div>

        {/* Results Metadata */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#64748b' }}>
            Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? 'position' : 'positions'} {search && <span>for <strong style={{ color: '#0f172a' }}>"{search}"</strong></span>}
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
            <div className="spinner" style={{ width: 50, height: 50, borderTopColor: '#7c3aed' }}></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="animate-in" style={{ textAlign: 'center', padding: '100px 20px', background: '#fff', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>No matches found</h3>
            <p style={{ color: '#64748b', fontSize: 14 }}>We couldn't find any positions matching your specific criteria.</p>
            <button onClick={() => { setSearch(''); setActiveType('All'); }} style={{
              marginTop: 24, padding: '12px 24px', borderRadius: '12px', background: '#f8fafc',
              color: '#475569', fontWeight: 700, border: '1px solid #e2e8f0', cursor: 'pointer'
            }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 32 }}>
            {filtered.map((job, idx) => {
              const deadline = new Date(job.deadline);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
              const isUrgent = daysLeft > 0 && daysLeft <= 3;
              const isClosed = daysLeft <= 0;

              return (
                <div key={job.id} className="animate-in" onClick={() => navigate(`/jobs/${job.id}`)} style={{
                  background: '#ffffff', borderRadius: '20px', padding: '16px 20px', cursor: 'pointer',
                  border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                  animationDelay: `${0.1 + (idx * 0.05)}s`, transition: 'all 0.3s ease',
                  display: 'flex', flexDirection: 'column'
                }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.02)'; }}>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{
                      background: 'rgba(124, 58, 237, 0.06)', color: '#7c3aed', padding: '4px 12px',
                      borderRadius: '12px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6
                    }}>
                      {job.job_type || 'Full-time'}
                    </div>
                    {isUrgent && <div style={{ background: '#fef08a', color: '#854d0e', padding: '4px 10px', borderRadius: '12px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>Closing Soon</div>}
                    {isClosed && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '12px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>Closed</div>}
                  </div>

                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 4, lineHeight: 1.3 }}>{job.title}</h3>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 16 }}>{job.company}</div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                    {job.location && <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span>📍</span> {job.location}</div>}
                    {job.salary_range && <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ color: '#10b981' }}>💰</span> {job.salary_range}</div>}
                    {job.experience_required && <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span>🎓</span> {job.experience_required}</div>}
                  </div>

                  {job.skills_required && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto', marginBottom: 16 }}>
                      {job.skills_required.split(',').slice(0, 4).map(s => (
                        <span key={s} style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '8px', fontSize: 12, fontWeight: 600 }}>
                          {s.trim()}
                        </span>
                      ))}
                      {job.skills_required.split(',').length > 4 && (
                        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, padding: '4px' }}>
                          +{job.skills_required.split(',').length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  <div style={{ height: 1, background: '#f1f5f9', margin: '0 0 16px 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
                      Posted {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span style={{ color: '#7c3aed', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                      Apply <span style={{ fontSize: 16 }}>›</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
