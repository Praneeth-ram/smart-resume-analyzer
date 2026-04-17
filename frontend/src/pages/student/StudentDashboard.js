import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyApplications, getJobs } from '../../api';

const fontFamily = "sans-serif";

export default function StudentDashboard() {
  const [apps, setApps] = useState([]);
  const [jobsDict, setJobsDict] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { 
    Promise.all([getMyApplications(), getJobs()])
      .then(([appsRes, jobsRes]) => {
        setApps(appsRes.data);
        const jDict = {};
        jobsRes.data.forEach(j => jDict[j.id] = j);
        setJobsDict(jDict);
      })
      .catch(err => console.error("Error loading dashboard data:", err))
      .finally(() => setLoading(false)); 
  }, []);

  const stats = {
    total: apps.length,
    passed: apps.filter(a => ['ats_passed','shortlisted','selected'].includes(a.status)).length,
    selected: apps.filter(a => a.status === 'selected').length,
    avgScore: apps.filter(a => a.ats_score != null).length > 0
      ? apps.filter(a => a.ats_score != null).reduce((s, a, _, ar) => s + a.ats_score / ar.length, 0)
      : null,
  };

  const recentApps = [...apps].sort((a, b) => new Date(b.created_at || b.applied_at) - new Date(a.created_at || a.applied_at)).slice(0, 3);

  const StatusBadge = ({ status }) => {
    switch (status) {
      case 'rejected': return <span style={{ background: '#fef2f2', color: '#dc2626', padding: '4px 10px', borderRadius: '8px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Failed ATS</span>;
      case 'ats_passed': return <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 10px', borderRadius: '8px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>In Review</span>;
      case 'shortlisted': return <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '8px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Shortlisted</span>;
      case 'selected': return <span style={{ background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '8px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Hired 🎉</span>;
      case 'ats_failed': return <span style={{ background: '#fef2f2', color: '#dc2626', padding: '4px 10px', borderRadius: '8px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Failed ATS</span>;
      default: return <span style={{ background: '#f1f5f9', color: '#64748b', padding: '4px 10px', borderRadius: '8px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Pending</span>;
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily, paddingBottom: 80, overflowX: 'hidden' }}>
      
      {/* Premium Dashboard Header */}
      <div style={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '60px 40px 100px',
        overflow: 'hidden'
      }}>
        {/* Glow Effects */}
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 60%)',
          borderRadius: '50%', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', left: '10%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
          borderRadius: '50%', zIndex: 0
        }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1, color: '#fff' }}>
          <div className="animate-in">
            <h1 style={{ fontSize: window.innerWidth < 768 ? 24 : 32, fontWeight: 700, marginBottom: 12, letterSpacing: '-1px', color: '#ffffff' }}>
              Welcome to your Hub.
            </h1>
            <p style={{ fontSize: 16, color: '#cbd5e1', maxWidth: 600, margin: 0, lineHeight: 1.6 }}>
              This is your central command point. Track applications, discover new roles matching your resume, and monitor your overall ATS performance in real time.
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '-50px auto 0', padding: '0 40px', position: 'relative', zIndex: 10 }}>
        
        {loading ? (
             <div style={{ padding: 100, textAlign: 'center' }}><div className="spinner" style={{ borderTopColor: '#10b981' }} /></div>
        ) : (
          <div className="animate-in" style={{ animationDelay: '0.1s' }}>
            
            {/* Real-time Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 40 }}>
              {[
                { label: 'Total Submitted', value: stats.total, icon: '📄', color: '#3b82f6' },
                { label: 'ATS Cleared', value: stats.passed, icon: '✅', color: '#10b981' },
                { label: 'Final Selections', value: stats.selected, icon: '🎉', color: '#f59e0b' },
                { label: 'Avg AI Match Score', value: stats.avgScore ? `${stats.avgScore.toFixed(0)}%` : '—', icon: '🎯', color: '#8b5cf6' },
              ].map((s, i) => (
                <div key={s.label} className="animate-in" style={{
                  background: '#fff', borderRadius: '24px', padding: '32px 24px',
                  border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
                  display: 'flex', flexDirection: 'column', animationDelay: `${0.1 + (i * 0.05)}s`,
                  transition: 'transform 0.3s'
                }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: 28 }}>{s.icon}</div>
                    <div style={{ 
                      width: 40, height: 40, borderRadius: '12px', background: `${s.color}15`, 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color 
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    </div>
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: '#0f172a', marginBottom: 4, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions & Recent Activity layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 32 }}>
              
              {/* Quick Actions Array */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                 
                 <div onClick={() => navigate('/jobs')} style={{
                   borderRadius: '24px', padding: '36px', cursor: 'pointer', background: '#fff',
                   border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 15px 40px rgba(0,0,0,0.03)',
                   transition: 'all 0.3s', display: 'flex', gap: 24, alignItems: 'center'
                 }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#10b981'; }} 
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)'; }}>
                    <div style={{ width: 64, height: 64, flexShrink: 0, borderRadius: '16px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#fff' }}>
                      🔍
                    </div>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 6, margin: 0 }}>Discover Open Roles</h3>
                      <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 13, lineHeight: 1.5 }}>Browse the latest job openings, see live requirements, and calculate instant AI match scores against your resume.</p>
                    </div>
                 </div>

                 <div onClick={() => navigate('/my-applications')} style={{
                   borderRadius: '24px', padding: '36px', cursor: 'pointer', background: '#fff',
                   border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 15px 40px rgba(0,0,0,0.03)',
                   transition: 'all 0.3s', display: 'flex', gap: 24, alignItems: 'center'
                 }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#7c3aed'; }} 
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)'; }}>
                    <div style={{ width: 64, height: 64, flexShrink: 0, borderRadius: '16px', background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#fff' }}>
                      📂
                    </div>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 6, margin: 0 }}>Track Applications</h3>
                      <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 13, lineHeight: 1.5 }}>Monitor the pipeline statuses of roles you've applied for. Keep an eye on HR reviews and final selection decisions.</p>
                    </div>
                 </div>

                 {/* Informational Promo Card */}
                 <div style={{
                   background: '#f1f5f9', borderRadius: '24px', padding: '32px',
                   border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 16
                 }}>
                   <span style={{ fontSize: 32 }}>💡</span>
                   <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>
                     <strong>Pro Tip:</strong> Tailor your PDF resumes to closely match the "Required Technologies" specified on job pages to dramatically increase your ATS threshold clearing rate.
                   </div>
                 </div>

              </div>

              {/* Recent Activity Sidebar */}
              <div style={{
                background: '#fff', borderRadius: '24px', padding: '36px',
                border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 15px 40px rgba(0,0,0,0.03)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>Recent Activity</h3>
                  {apps.length > 3 && (
                    <Link to="/my-applications" style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed', textDecoration: 'none' }}>View All ›</Link>
                  )}
                </div>

                {recentApps.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>🚀</div>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Ready for takeoff!</div>
                    <div style={{ color: '#64748b', fontSize: 13 }}>You haven't submitted any applications yet.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {recentApps.map(app => {
                      const job = jobsDict[app.job_post_id] || { title: `Job #${app.job_post_id}`, company: 'Company', ats_threshold: 80 };
                      return (
                        <div key={app.id} onClick={() => navigate('/my-applications')} style={{
                          padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9',
                          cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: 12
                        }} onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                           onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#f1f5f9'; }}>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 16, lineHeight: 1.3, maxWidth: '70%' }}>{job.title}</div>
                            <StatusBadge status={app.status} />
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>🏢 {job.company}</span>
                            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{new Date(app.applied_at || app.created_at || Date.now()).toLocaleDateString('en-US', {month:'short', day:'numeric'})}</span>
                          </div>
                          
                          {app.ats_score !== null && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                              <div style={{ height: 6, flex: 1, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ height: '100%', background: app.ats_score >= job.ats_threshold ? '#10b981' : '#ef4444', width: `${app.ats_score}%` }} />
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 700, color: app.ats_score >= job.ats_threshold ? '#10b981' : '#ef4444' }}>
                                {app.ats_score.toFixed(0)}%
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
