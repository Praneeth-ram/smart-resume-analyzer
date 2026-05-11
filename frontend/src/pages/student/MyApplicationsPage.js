import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyApplications, getJobs } from '../../api';

const fontFamily = "sans-serif";

const STATUS = {
  applied:     { label: 'Pending Resume', bg: '#f1f5f9', color: '#64748b', icon: '📝' },
  ats_failed:  { label: 'Failed ATS',     bg: '#fef2f2', color: '#dc2626', icon: '❌' },
  ats_passed:  { label: 'ATS Passed',     bg: '#e0e7ff', color: '#4338ca', icon: '✅' },
  shortlisted: { label: 'Shortlisted',    bg: '#fef3c7', color: '#d97706', icon: '⭐' },
  rejected:    { label: 'Not Selected',   bg: '#fef2f2', color: '#dc2626', icon: '🚫' },
  selected:    { label: 'Selected 🎉',    bg: '#ecfdf5', color: '#059669', icon: '🎉' },
};

export default function MyApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [jobsDict, setJobsDict] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { 
    Promise.all([getMyApplications(), getJobs()])
      .then(([appsRes, jobsRes]) => {
        // Sort newest first
        const sortedApps = appsRes.data.sort((a,b) => new Date(b.created_at || b.applied_at) - new Date(a.created_at || a.applied_at));
        setApps(sortedApps);
        const jDict = {};
        jobsRes.data.forEach(j => jDict[j.id] = j);
        setJobsDict(jDict);
      })
      .catch(err => console.error("Error loading applications:", err))
      .finally(() => setLoading(false)); 
  }, []);

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" style={{ borderTopColor: '#7c3aed' }} /></div>;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily, paddingBottom: 80, overflowX: 'hidden' }}>
      
      {/* Premium Header */}
      <div style={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '60px 40px 90px',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 60%)',
          borderRadius: '50%', zIndex: 0
        }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1, color: '#fff' }}>
          <div className="animate-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8 }}>
              <Link to="/student" style={{ color: '#a78bfa', textDecoration: 'none' }}>Hub</Link>
              <span>/</span>
              <span style={{ color: '#f8fafc' }}>Applications</span>
            </div>

            <h1 style={{ fontSize: window.innerWidth < 768 ? 24 : 32, fontWeight: 700, marginBottom: 12, letterSpacing: '-1px', color: '#ffffff' }}>
              My Applications
            </h1>
            <p style={{ fontSize: 16, color: '#cbd5e1', maxWidth: 640, margin: 0, lineHeight: 1.6 }}>
              Track the live status of all {apps.length} application{apps.length !== 1 ? 's' : ''} you have submitted. Watch for HR reviews, final selections, or pending resume uploads.
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '-40px auto 0', padding: '0 40px', position: 'relative', zIndex: 10 }}>
        
        {apps.length === 0 ? (
          <div className="animate-in" style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📭</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>No applications yet</h3>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>You haven't submitted any job applications to our platform so far.</p>
            <button style={{ 
              borderRadius: '16px', padding: '16px 32px', fontSize: 16, fontWeight: 700,
              background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', border: 'none', color: '#fff',
              cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 10px 25px rgba(124, 58, 237, 0.3)'
            }} onClick={() => navigate('/jobs')} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(124, 58, 237, 0.4)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(124, 58, 237, 0.3)'; }}>
              Browse Latest Jobs →
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 }}>
            {apps.map((app, i) => {
              const s = STATUS[app.status] || STATUS.applied;
              const job = jobsDict[app.job_post_id] || { title: `Job Posting #${app.job_post_id}`, company: 'Unknown', ats_threshold: 80 };
              const needsUpload = app.status === 'applied' && !app.resume_filename;

              return (
                <div key={app.id} className="animate-in" style={{ 
                  background: '#fff', borderRadius: '16px', padding: '20px', 
                  border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: 14,
                  animationDelay: `${i * 0.05}s`
                }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                   onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.02)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <span style={{ 
                          background: s.bg, color: s.color, padding: '4px 8px', borderRadius: '6px', 
                          fontSize: 11, fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 
                        }}>
                          {s.icon} {s.label}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
                          Applied {new Date(app.applied_at || app.created_at || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      
                      <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 4, lineHeight: 1.3 }}>
                        {job.title}
                      </h2>
                      
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: '#475569' }}>🏢 {job.company}</span>
                      </div>
                    </div>

                    {/* Right Side - Score Visualizer */}
                    {app.ats_score != null && (
                      <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', background: '#f8fafc', padding: '8px 12px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                          <span style={{
                            fontSize: 22, fontWeight: 800, 
                            color: app.ats_score >= job.ats_threshold ? '#10b981' : '#ef4444',
                            lineHeight: 1, letterSpacing: '-0.5px'
                          }}>{app.ats_score.toFixed(0)}%</span>
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', marginTop: 2, textTransform: 'uppercase' }}>Req {job.ats_threshold}%</div>
                      </div>
                    )}
                  </div>

                  {app.resume_filename && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, background: '#f1f5f9', padding: '8px 12px', borderRadius: '8px', width: 'fit-content' }}>
                      <span style={{ fontSize: 14 }}>📄</span> 
                      <span style={{ fontWeight: 600, color: '#475569', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.resume_filename}</span>
                      {app.resume_drive_link && (
                        <>
                          <span style={{ color: '#cbd5e1', margin: '0 2px' }}>•</span>
                          <a href={app.resume_drive_link} target="_blank" rel="noreferrer"
                            style={{ color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}>
                            View ↗
                          </a>
                        </>
                      )}
                    </div>
                  )}

                  {needsUpload && (
                    <div style={{ 
                      marginTop: 2, padding: '12px 16px', background: '#fef2f2', border: '1px dashed #fca5a5', borderRadius: '10px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 
                    }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#991b1b', marginBottom: 2 }}>Action Required</div>
                        <div style={{ fontSize: 12, color: '#b91c1c' }}>Upload resume to proceed.</div>
                      </div>
                      <button style={{ 
                        borderRadius: '6px', padding: '6px 14px', fontSize: 12, fontWeight: 700,
                        background: '#dc2626', border: 'none', color: '#fff', cursor: 'pointer', transition: 'all 0.2s',
                        boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)'
                      }} onClick={() => navigate(`/upload/${app.id}`)} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        Upload
                      </button>
                    </div>
                  )}

                  {app.status === 'selected' && (
                    <div style={{ marginTop: 2, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ fontSize: 18 }}>🎉</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>Candidate Selected!</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)' }}>Check your email for next steps.</div>
                      </div>
                    </div>
                  )}

                  {app.status === 'rejected' && (
                    <div style={{ marginTop: 2, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#fff', padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ fontSize: 18 }}>🚫</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>Not Selected</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)' }}>We wish you the best in your job search.</div>
                      </div>
                    </div>
                  )}

                  {app.status === 'ats_failed' && (
                    <div style={{ marginTop: 2, background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', color: '#fff', padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ fontSize: 18 }}>📉</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>ATS Screening Failed</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)' }}>Score was below the required threshold.</div>
                      </div>
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
