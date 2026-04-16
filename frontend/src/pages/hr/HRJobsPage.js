import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getJobs, deleteJob } from '../../api';
import { toast } from 'react-toastify';

const fontFamily = "'Söhne', 'Inter', sans-serif";

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

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div className="spinner" style={{ width: 48, height: 48, borderTopColor: '#7c3aed' }}></div>
    </div>
  );

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily, paddingBottom: 80, overflowX: 'hidden' }}>
      {/* Premium Header Matching Dashboard */}
      <div style={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        padding: '50px 40px 70px',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 60%)',
          borderRadius: '50%', zIndex: 0
        }} />
        
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32 }}>
            <div className="animate-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                <Link to="/hr/dashboard" style={{ color: '#7c3aed', textDecoration: 'none' }}>Dashboard</Link>
                <span>/</span>
                <span style={{ color: '#0f172a' }}>Job Posts</span>
              </div>
              <h1 style={{ fontSize: window.innerWidth < 768 ? 32 : 44, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', marginBottom: 12 }}>
                Active <span style={{ 
                  background: 'linear-gradient(135deg, #7c3aed 0%, #0ea5e9 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>Postings</span>
              </h1>
              <p style={{ fontSize: 16, color: '#64748b', margin: 0 }}>
                You have {jobs.length} job posting{jobs.length !== 1 ? 's' : ''} in your workspace.
              </p>
            </div>
            
            <button className="animate-in" onClick={() => navigate('/hr/jobs/new')} style={{ 
              animationDelay: '0.1s',
              borderRadius: '16px', padding: '16px 36px', fontWeight: 700, fontSize: 16,
              background: '#0f172a', border: 'none', color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.3s ease',
              boxShadow: '0 10px 25px rgba(15, 23, 42, 0.2)'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(15, 23, 42, 0.3)';
              e.currentTarget.style.background = '#1e293b';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(15, 23, 42, 0.2)';
              e.currentTarget.style.background = '#0f172a';
            }}>
              <span style={{ fontSize: 20, fontWeight: 300 }}>+</span> Post New Job
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1280, margin: '-30px auto 0', padding: '0 40px', position: 'relative', zIndex: 10 }}>
        
        {jobs.length === 0 ? (
          <div className="animate-in" style={{
            background: '#ffffff', borderRadius: '24px', padding: '80px 40px',
            textAlign: 'center', border: '1px solid rgba(0,0,0,0.04)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.02)', animationDelay: '0.2s'
          }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>📋</div>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>No job postings yet</h3>
            <p style={{ fontSize: 16, color: '#64748b', marginBottom: 32 }}>Create your first job to start receiving and screening applications.</p>
            <button onClick={() => navigate('/hr/jobs/new')} style={{ 
              borderRadius: '14px', fontWeight: 700, fontSize: 15, padding: '14px 28px',
              border: 'none', background: `linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)`,
              color: '#fff', cursor: 'pointer', transition: 'all 0.3s ease',
              boxShadow: `0 8px 20px rgba(139, 92, 246, 0.4)`
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 12px 28px rgba(139, 92, 246, 0.5)`;
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 8px 20px rgba(139, 92, 246, 0.4)`;
            }}>
              Post a Job →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {jobs.map((job, idx) => (
              <div key={job.id} className="animate-in" style={{ 
                animationDelay: `${0.1 + (idx * 0.05)}s`,
                background: '#fff', borderRadius: '20px', padding: '32px',
                border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                transition: 'all 0.3s ease', display: 'flex', justifyContent: 'space-between',
                cursor: 'pointer', gap: 24, flexWrap: 'wrap', alignItems: 'center'
              }} onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.06)';
                e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.15)';
              }} onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)';
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.03)';
              }} onClick={() => navigate(`/hr/jobs/${job.id}/applications`)}>
                
                <div style={{ flex: '1 1 500px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ fontWeight: 800, fontSize: 22, color: '#0f172a' }}>{job.title}</div>
                    
                    <div style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: 11, fontWeight: 800, letterSpacing: 0.8,
                      background: job.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : job.status === 'expired' ? 'rgba(239, 68, 68, 0.1)' : '#f1f5f9',
                      color: job.status === 'active' ? '#059669' : job.status === 'expired' ? '#dc2626' : '#64748b'
                    }}>
                      {job.status?.toUpperCase()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 14, color: '#64748b', fontWeight: 500 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: '#94a3b8' }}>📍</span> {job.location || 'Remote / Unspecified'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: '#94a3b8' }}>⏱</span> {job.job_type || 'Full-time'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: '#94a3b8' }}>🎯</span> ATS Target: <strong style={{ color: '#7c3aed' }}>{job.ats_threshold}%</strong>
                    </span>
                    {job.deadline && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: '#94a3b8' }}>🗓</span> {new Date(job.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/hr/jobs/${job.id}/applications`); }} style={{
                    background: 'rgba(124, 58, 237, 0.08)', borderRadius: '12px', padding: '12px 20px',
                    color: '#7c3aed', fontWeight: 700, fontSize: 14, border: 'none',
                    cursor: 'pointer', transition: 'all 0.2s ease'
                  }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(124, 58, 237, 0.15)'}
                     onMouseLeave={e => e.currentTarget.style.background = 'rgba(124, 58, 237, 0.08)'}>
                    View Candidates
                  </button>
                  
                  {job.status === 'active' && (
                    <button onClick={(e) => handleDeactivate(job.id, e)} style={{
                      background: 'transparent', borderRadius: '12px', padding: '11px 18px',
                      color: '#ef4444', fontWeight: 600, fontSize: 14, border: '1px solid rgba(239, 68, 68, 0.3)',
                      cursor: 'pointer', transition: 'all 0.2s ease'
                    }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'}
                       onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      Deactivate
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}