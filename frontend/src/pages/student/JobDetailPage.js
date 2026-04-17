import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getJob } from '../../api';
import { useAuth } from '../../context/AuthContext';

const fontFamily = "sans-serif";

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => { getJob(id).then(r => setJob(r.data)).finally(() => setLoading(false)); }, [id]);

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" style={{ borderTopColor: '#7c3aed' }} /></div>;
  if (!job) return <div style={{ padding: 80, textAlign: 'center', fontFamily }}><h2>Job Not Found.</h2></div>;

  const handleApply = () => {
    if (!user) { navigate('/login'); return; }
    navigate(`/apply/${job.id}`);
  };

  const isUrgent = () => {
    if(!job.deadline) return false;
    const days = Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 && days <= 3;
  };
  
  const isClosed = () => {
    if(!job.deadline) return false;
    return Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24)) <= 0;
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily, paddingBottom: 80, overflowX: 'hidden' }}>
      
      {/* Premium Header */}
      <div style={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '60px 40px 80px',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-30%', right: '-5%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 60%)',
          borderRadius: '50%', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', left: '10%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%)',
          borderRadius: '50%', zIndex: 0
        }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1, color: '#fff' }}>
          <div className="animate-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8 }}>
              <Link to="/" style={{ color: '#a78bfa', textDecoration: 'none' }}>Home</Link>
              <span>/</span>
              <Link to="/jobs" style={{ color: '#a78bfa', textDecoration: 'none' }}>Careers</Link>
              <span>/</span>
              <span style={{ color: '#f8fafc' }}>{job.title}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32 }}>
              <div>
                <h1 style={{ fontSize: window.innerWidth < 768 ? 24 : 32, fontWeight: 700, color: '#ffffff', letterSpacing: '-1px', marginBottom: 16 }}>
                  {job.title}
                </h1>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 15, fontWeight: 600, color: '#cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '8px', color: '#fff', fontWeight: 700 }}>🏢 {job.company}</span>
                  </div>
                  {job.location && <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>📍 {job.location}</div>}
                  {job.job_type && <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>⏱ {job.job_type}</div>}
                  {job.salary_range && <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ color: '#34d399' }}>💰</span> {job.salary_range}</div>}
                </div>
              </div>

              {!isClosed() && (
                <button className="animate-in" onClick={handleApply} style={{ 
                  animationDelay: '0.2s', padding: '16px 32px', borderRadius: '16px', fontSize: 16, fontWeight: 700,
                  background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', border: 'none', color: '#fff',
                  cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 10px 25px rgba(124, 58, 237, 0.4)',
                  display: 'flex', alignItems: 'center', gap: 10
                }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(124, 58, 237, 0.5)'; }} 
                   onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(124, 58, 237, 0.4)'; }}>
                  Apply now
                  <span style={{ fontSize: 20 }}>›</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '-20px auto 0', padding: '0 40px', position: 'relative', zIndex: 10 }}>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'start' }}>
          
          {/* Main Left Column */}
          <div style={{ flex: '1 1 700px', display: 'flex', flexDirection: 'column' }}>
            
            {/* ATS Intelligent Score Banner */}
            <div className="animate-in" style={{
              background: '#ffffff', borderRadius: '24px', padding: '24px 32px',
              border: '1px solid rgba(124, 58, 237, 0.2)', boxShadow: '0 10px 40px rgba(124, 58, 237, 0.05)',
              display: 'flex', gap: 24, alignItems: 'center', marginBottom: 32, animationDelay: '0.1s'
            }}>
              <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
                <svg width="64" height="64" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#7c3aed" strokeWidth="3" strokeDasharray={`${job.ats_threshold}, 100`} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#7c3aed' }}>
                  {job.ats_threshold}%
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Automated Tracking System Filter</h3>
                <p style={{ color: '#64748b', fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                  Resumes submitted to this role will be instantly analyzed by AI. Only applicants successfully demonstrating a match score of <strong>{job.ats_threshold}%</strong> or higher will be forwarded to HR. 
                </p>
              </div>
            </div>

            {/* Content Body */}
            <div className="animate-in" style={{
              background: '#fff', borderRadius: '24px', padding: '40px',
              border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
              marginBottom: 32, animationDelay: '0.2s'
            }}>
              
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
                About the Role
              </h2>
              <div style={{ color: '#475569', lineHeight: 1.8, fontSize: 16, whiteSpace: 'pre-wrap', marginBottom: 40 }}>
                {job.description}
              </div>

              {job.requirements && (
                <>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
                    Requirements & Qualifications
                  </h2>
                  <div style={{ color: '#475569', lineHeight: 1.8, fontSize: 16, whiteSpace: 'pre-wrap' }}>
                    {job.requirements}
                  </div>
                </>
              )}

            </div>
          </div>

          {/* Right Column / Sticky Sidebar */}
          <div style={{ flex: '1 1 350px' }}>
            <div style={{ position: 'sticky', top: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              <div className="animate-in" style={{
                background: '#fff', borderRadius: '24px', padding: '32px',
                border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
                animationDelay: '0.2s'
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Recruitment Details</h3>
                
                {[
                  ['Job Type', job.job_type || 'Full-time'],
                  ['Location', job.location || 'Not specified'],
                  ['Experience', job.experience_required || 'Not specified'],
                  ['Salary', job.salary_range || 'Not disclosed'],
                  ['Deadline', job.deadline ? new Date(job.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Open'],
                  ['ATS Threshold', <span style={{ color: '#7c3aed', fontWeight: 700 }}>{job.ats_threshold}%</span>],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9', fontSize: 14 }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>{label}</span>
                    <span style={{ fontWeight: 700, color: '#0f172a', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
                  </div>
                ))}

                {isUrgent() && (
                   <div style={{ marginTop: 24, padding: '12px', background: '#fef3c7', borderRadius: '12px', color: '#92400e', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>
                     ⏳ Applications are closing very soon.
                   </div>
                )}
                {isClosed() && (
                   <div style={{ marginTop: 24, padding: '12px', background: '#fee2e2', borderRadius: '12px', color: '#b91c1c', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>
                     ⛔ This position is no longer accepting applications.
                   </div>
                )}
              </div>

              {/* Skills */}
              {job.skills_required && (
                <div className="animate-in" style={{
                  background: '#fff', borderRadius: '24px', padding: '32px',
                  border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
                  animationDelay: '0.3s'
                }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Required Technologies</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {job.skills_required.split(',').filter(Boolean).map(s => (
                      <span key={s} style={{ 
                        background: '#f1f5f9', color: '#475569', padding: '8px 14px', 
                        borderRadius: '12px', fontSize: 13, fontWeight: 700 
                      }}>{s.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Apply CTA Box */}
              {!isClosed() && (
                <div className="animate-in" style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff',
                  padding: '32px', borderRadius: '24px', boxShadow: '0 15px 30px rgba(15, 23, 42, 0.2)',
                  position: 'relative', overflow: 'hidden', animationDelay: '0.4s'
                }}>
                  <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 120, height: 120, background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%)', borderRadius: '50%' }}/>
                  
                  <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 18, color: '#fff', position: 'relative' }}>Ready for your next move?</h3>
                  <p style={{ margin: '0 0 24px 0', fontSize: 14, color: '#cbd5e1', lineHeight: 1.6, position: 'relative' }}>
                    Upload your latest resume and immediately see how well you match this position's expectations.
                  </p>
                  <button onClick={handleApply} style={{ 
                    width: '100%', borderRadius: '16px', padding: '16px', fontSize: 16, fontWeight: 700,
                    background: '#fff', border: 'none', color: '#0f172a',
                    cursor: 'pointer', transition: 'all 0.2s', position: 'relative'
                  }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 15px rgba(255,255,255,0.2)'; }} 
                     onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    Start Applying
                  </button>
                </div>
              )}
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
