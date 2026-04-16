import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getJob, applyForJob } from '../../api';
import { toast } from 'react-toastify';

const fontFamily = "'Söhne', 'Inter', sans-serif";

export default function ApplyPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ student_name: '', student_email: '', date_of_birth: '', phone: '' });
  const [error, setError] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { getJob(jobId).then(r => setJob(r.data)); }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await applyForJob({ ...form, job_post_id: parseInt(jobId) });
      toast.success('Details submitted! Please upload your resume now.');
      navigate(`/upload/${res.data.id}`);
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(msg === 'Already applied for this job'
        ? 'You have already applied for this position.'
        : msg || 'Failed to apply. Please try again.');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '14px 18px', borderRadius: '14px',
    border: '1px solid rgba(0,0,0,0.08)', background: '#f8fafc',
    fontSize: 15, fontFamily, color: '#0f172a', transition: 'all 0.2s',
    outline: 'none', marginBottom: 6
  };
  
  const labelStyle = {
    display: 'block', fontSize: 13, fontWeight: 700, color: '#475569',
    marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5
  };

  if (!job) return <div style={{ padding: 100, textAlign: 'center' }}><div className="spinner" style={{ borderTopColor: '#7c3aed' }} /></div>;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily, paddingBottom: 80, overflowX: 'hidden' }}>
      
      {/* Premium Wizard Header */}
      <div style={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        padding: '50px 40px 90px',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 60%)',
          borderRadius: '50%', zIndex: 0
        }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="animate-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8 }}>
              <Link to="/jobs" style={{ color: '#10b981', textDecoration: 'none' }}>Careers</Link>
              <span>/</span>
              <span style={{ color: '#0f172a' }}>Job #{job.id}</span>
              <span>/</span>
              <span style={{ color: '#0f172a' }}>Apply</span>
            </div>
            
            <h1 style={{ fontSize: window.innerWidth < 768 ? 32 : 44, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', marginBottom: 16 }}>
              Submit Your <span style={{ 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>Application</span>
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
               <div style={{ position: 'relative', height: 8, width: 200, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '50%', background: '#10b981', borderRadius: 4 }} />
               </div>
               <span style={{ fontSize: 14, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5 }}>Step 1 of 2</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '-40px auto 0', padding: '0 40px', position: 'relative', zIndex: 10 }}>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'start' }}>
          
          {/* Main Left Form Column */}
          <div style={{ flex: '1 1 700px', display: 'flex', flexDirection: 'column' }}>
            
            <div className="animate-in" style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff',
              padding: '24px 32px', borderRadius: '24px', boxShadow: '0 15px 30px rgba(15, 23, 42, 0.2)',
              marginBottom: 32, animationDelay: '0.1s', display: 'flex', alignItems: 'center', gap: 20
            }}>
               <div style={{ fontSize: 32 }}>📋</div>
               <div>
                 <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>First, verify your personal details.</h3>
                 <p style={{ margin: 0, color: '#cbd5e1', fontSize: 14, lineHeight: 1.5 }}>
                   After submitting this form, you will securely upload your resume for Intelligent ATS Evaluation.
                 </p>
               </div>
            </div>

            {error && (
              <div className="animate-in" style={{
                background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#dc2626', padding: '16px 24px', borderRadius: '16px', marginBottom: 24, fontSize: 15, fontWeight: 600
              }}>
                ❌ {error}
              </div>
            )}

            <div className="animate-in" style={{
              background: '#fff', borderRadius: '24px', padding: '40px',
              border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
              marginBottom: 32, animationDelay: '0.2s'
            }}>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Full Legal Name *</label>
                  <input style={inputStyle} placeholder="As per official documents" required
                    value={form.student_name} onChange={e => set('student_name', e.target.value)} 
                    onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}/>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Email Address *</label>
                  <input style={inputStyle} type="email" placeholder="you@email.com" required
                    value={form.student_email} onChange={e => set('student_email', e.target.value)} 
                    onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}/>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 40 }}>
                  <div>
                    <label style={labelStyle}>Date of Birth *</label>
                    <input style={inputStyle} type="date" required
                      value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} 
                      onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}/>
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input style={inputStyle} placeholder="+91 98765 43210"
                      value={form.phone} onChange={e => set('phone', e.target.value)} 
                      onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}/>
                  </div>
                </div>

                <button type="submit" disabled={loading} style={{ 
                  width: '100%', borderRadius: '16px', padding: '16px', fontSize: 16, fontWeight: 800,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', color: '#fff',
                  cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s',
                  boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
                }} onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(16, 185, 129, 0.4)'; } }} 
                   onMouseLeave={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.3)'; } }}>
                  {loading ? 'Processing...' : 'Continue to Resume Upload →'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column / Job Preview Sidebar */}
          <div style={{ flex: '1 1 350px' }}>
            <div style={{ position: 'sticky', top: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              <div className="animate-in" style={{
                background: '#fff', borderRadius: '24px', padding: '32px',
                border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
                animationDelay: '0.2s'
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 20 }}>
                  You are applying for
                </div>
                
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 12, lineHeight: 1.3 }}>
                  {job.title}
                </h3>
                
                <div style={{ color: '#64748b', fontSize: 14, marginBottom: 24, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, color: '#475569' }}>🏢 {job.company}</span>
                  {job.location && <span>📍 {job.location}</span>}
                </div>

                <div style={{ height: 1, background: '#f1f5f9', margin: '0 0 24px 0' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Job Type</span>
                    <span style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', padding: '4px 12px', borderRadius: '12px', fontSize: 12, fontWeight: 700 }}>{job.job_type || 'Full-time'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Required ATS</span>
                    <span style={{ fontWeight: 900, color: '#7c3aed', fontSize: 16 }}>{job.ats_threshold}%</span>
                  </div>
                  {job.deadline && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
                      <span style={{ color: '#64748b', fontWeight: 600 }}>Deadline</span>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{new Date(job.deadline).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                    </div>
                  )}
                </div>

                {job.deadline && (() => {
                  const deadline = new Date(job.deadline);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
                  
                  if (daysLeft < 0) {
                    return <div style={{ marginTop: 24, padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>⛔ Application closed</div>;
                  } else if (daysLeft <= 3) {
                    return <div style={{ marginTop: 24, padding: '12px', background: '#fef3c7', color: '#92400e', borderRadius: '12px', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>⏳ Only {daysLeft} days left</div>;
                  }
                  return null;
                })()}

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
