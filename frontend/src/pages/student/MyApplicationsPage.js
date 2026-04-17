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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {apps.map((app, i) => {
              const s = STATUS[app.status] || STATUS.applied;
              const job = jobsDict[app.job_post_id] || { title: `Job Posting #${app.job_post_id}`, company: 'Unknown', ats_threshold: 80 };
              const needsUpload = app.status === 'applied' && !app.resume_filename;

              return (
                <div key={app.id} className="animate-in" style={{ 
                  background: '#fff', borderRadius: '24px', padding: '24px', 
                  border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                  transition: 'all 0.3s relative', display: 'flex', flexDirection: 'column', gap: 16,
                  animationDelay: `${i * 0.05}s`
                }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                   onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)'; }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
                    
                    <div style={{ flex: '1 1 400px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <span style={{ 
                          background: s.bg, color: s.color, padding: '6px 14px', borderRadius: '12px', 
                          fontSize: 12, fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 
                        }}>
                          {s.icon} {s.label}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>
                          Applied {new Date(app.applied_at || app.created_at || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8, lineHeight: 1.3 }}>
                        {job.title}
                      </h2>
                      
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span>🏢 {job.company}</span>
                        <span style={{ color: '#cbd5e1' }}>|</span>
                        <span>App ID #{app.id}</span>
                      </div>

                      {app.resume_filename && (
                        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, background: '#f8fafc', padding: '10px 16px', borderRadius: '12px', width: 'fit-content' }}>
                          <span style={{ fontSize: 16 }}>📄</span> 
                          <span style={{ fontWeight: 600, color: '#475569' }}>{app.resume_filename}</span>
                          {app.resume_drive_link && (
                            <>
                              <span style={{ color: '#cbd5e1', margin: '0 4px' }}>•</span>
                              <a href={app.resume_drive_link} target="_blank" rel="noreferrer"
                                style={{ color: '#7c3aed', fontWeight: 700, textDecoration: 'none' }}>
                                View Drive PDF ↗
                              </a>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right Side - Score Visualizer */}
                    {app.ats_score != null && (
                      <div style={{ textAlign: 'center', flexShrink: 0 }}>
                        <div style={{
                          fontSize: 32, fontWeight: 700, 
                          color: app.ats_score >= job.ats_threshold ? '#10b981' : '#ef4444',
                          lineHeight: 1, letterSpacing: '-1px'
                        }}>{app.ats_score.toFixed(0)}%</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>Match Score</div>
                      </div>
                    )}
                  </div>

                  {app.ats_score != null && (
                    <div>
                      <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, position: 'relative' }}>
                        <div style={{ 
                          height: '100%', borderRadius: 4, transition: 'width 1s',
                          background: app.ats_score >= job.ats_threshold ? 'linear-gradient(90deg, #34d399 0%, #10b981 100%)' : 'linear-gradient(90deg, #fca5a5 0%, #ef4444 100%)',
                          width: `${app.ats_score}%`
                        }} />
                        <div style={{
                          position: 'absolute', top: -4, bottom: -4, left: `${job.ats_threshold}%`,
                          width: 3, background: '#0f172a', borderRadius: 2
                        }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#94a3b8', marginTop: 8 }}>
                         <span>Your Score: {app.ats_score.toFixed(1)}%</span>
                         <span>Requirement: {job.ats_threshold}%</span>
                      </div>
                    </div>
                  )}

                  {needsUpload && (
                    <div style={{ 
                      marginTop: 8, padding: '24px', background: '#fef2f2', border: '1px dashed #fca5a5', borderRadius: '16px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 
                    }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#991b1b', marginBottom: 4 }}>Resume Upload Pending</div>
                        <div style={{ fontSize: 14, color: '#b91c1c' }}>Your application is incomplete. Upload your resume now to instantly receive your AI Match Factor.</div>
                      </div>
                      <button style={{ 
                        borderRadius: '12px', padding: '12px 24px', fontSize: 14, fontWeight: 700,
                        background: '#dc2626', border: 'none', color: '#fff', cursor: 'pointer', transition: 'all 0.2s',
                        boxShadow: '0 8px 20px rgba(220, 38, 38, 0.2)'
                      }} onClick={() => navigate(`/upload/${app.id}`)} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        Upload Document
                      </button>
                    </div>
                  )}

                  {app.status === 'selected' && (
                    <div style={{ marginTop: 8, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', padding: '12px 16px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontSize: 24 }}>🎉</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Congratulations! You have been selected.</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 1.3 }}>The HR team has formally extended an active pipeline approval. Please check your email inbox for further communications and critical next steps.</div>
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
