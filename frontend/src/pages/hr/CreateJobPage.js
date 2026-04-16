import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createJob } from '../../api';
import { toast } from 'react-toastify';

const fontFamily = "'Söhne', 'Inter', sans-serif";

const INITIAL = {
  title: '', company: '', location: '', job_type: 'Full-time',
  description: '', requirements: '', skills_required: '',
  experience_required: '', salary_range: '', ats_threshold: 80, deadline: '',
};

export default function CreateJobPage() {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('basic');
  const navigate = useNavigate();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (!form.deadline) {
        setError('Application deadline is required');
        setActiveSection('details');
        setLoading(false);
        return;
      }
      
      const deadlineDate = new Date(form.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        setError('Deadline must be in the future');
        setActiveSection('details');
        setLoading(false);
        return;
      }
      
      const payload = { ...form, ats_threshold: parseFloat(form.ats_threshold) };
      await createJob(payload);
      toast.success('Job posted successfully! 🎉');
      navigate('/hr/jobs');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create job. Please try again.');
      setActiveSection('basic');
    } finally { setLoading(false); }
  };

  const sections = [
    { id: 'basic', label: '1. Basic Info' },
    { id: 'details', label: '2. Job Details' },
    { id: 'description', label: '3. Description' },
  ];

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

  const cardStyle = {
    background: '#fff', borderRadius: '24px', padding: '36px',
    border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
    marginBottom: 32
  };

  const btnPrimary = {
    borderRadius: '14px', padding: '14px 24px', fontSize: 15, fontWeight: 800,
    background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', border: 'none', color: '#fff',
    cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 8px 20px rgba(124, 58, 237, 0.2)'
  };
  
  const btnSecondary = {
    borderRadius: '14px', padding: '14px 24px', fontSize: 15, fontWeight: 800,
    background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569',
    cursor: 'pointer', transition: 'all 0.2s'
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily, paddingBottom: 80, overflowX: 'hidden' }}>
      
      {/* Premium Header */}
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
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 60%)',
          borderRadius: '50%', zIndex: 0
        }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="animate-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8 }}>
              <Link to="/hr/dashboard" style={{ color: '#7c3aed', textDecoration: 'none' }}>Dashboard</Link>
              <span>/</span>
              <Link to="/hr/jobs" style={{ color: '#7c3aed', textDecoration: 'none' }}>Job Posts</Link>
              <span>/</span>
              <span style={{ color: '#0f172a' }}>New Job</span>
            </div>
            <h1 style={{ fontSize: window.innerWidth < 768 ? 32 : 44, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', marginBottom: 12 }}>
              Post a <span style={{ 
                background: 'linear-gradient(135deg, #7c3aed 0%, #0ea5e9 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>New Job</span>
            </h1>
            <p style={{ fontSize: 16, color: '#64748b', margin: 0 }}>
              Create a rich job listing with integrated AI screening heuristics.
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '-45px auto 0', padding: '0 40px', position: 'relative', zIndex: 10 }}>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'start' }}>
          
          {/* Main Left Column Form Sections */}
          <div style={{ flex: '1 1 700px', display: 'flex', flexDirection: 'column' }}>
            
            {/* Step Navigation Tabs */}
            <div className="animate-in" style={{ display: 'flex', gap: 12, marginBottom: 32, overflowX: 'auto', paddingBottom: 10 }}>
              {sections.map(s => (
                <button key={s.id} onClick={() => setActiveSection(s.id)} type="button" style={{
                  padding: '12px 24px', borderRadius: '16px', fontSize: 14, fontWeight: 800, cursor: 'pointer',
                  border: activeSection === s.id ? 'none' : '1px solid #e2e8f0', whiteSpace: 'nowrap',
                  background: activeSection === s.id ? '#7c3aed' : '#ffffff',
                  color: activeSection === s.id ? '#ffffff' : '#64748b',
                  boxShadow: activeSection === s.id ? '0 10px 20px rgba(124, 58, 237, 0.2)' : '0 4px 6px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s'
                }}>
                  {s.label}
                </button>
              ))}
            </div>

            {error && (
              <div className="animate-in" style={{
                background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#dc2626', padding: '16px 24px', borderRadius: '16px', marginBottom: 24, fontSize: 15, fontWeight: 600
              }}>
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              
              {/* Basic Info */}
              {activeSection === 'basic' && (
                <div className="animate-in" style={cardStyle}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>Basic Information</h2>
                  
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Job Title *</label>
                    <input style={inputStyle} placeholder="e.g. Senior React Developer" required
                      value={form.title} onChange={e => set('title', e.target.value)} 
                      onFocus={e => e.target.style.borderColor = '#7c3aed'}
                      onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}/>
                  </div>
                  
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>Company Name *</label>
                    <input style={inputStyle} placeholder="e.g. TechCorp India" required
                      value={form.company} onChange={e => set('company', e.target.value)} 
                      onFocus={e => e.target.style.borderColor = '#7c3aed'}
                      onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}/>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 20 }}>
                    <div>
                      <label style={labelStyle}>Location</label>
                      <input style={inputStyle} placeholder="e.g. Bangalore / Remote"
                        value={form.location} onChange={e => set('location', e.target.value)} 
                        onFocus={e => e.target.style.borderColor = '#7c3aed'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}/>
                    </div>
                    <div>
                      <label style={labelStyle}>Job Type</label>
                      <select style={{...inputStyle, appearance: 'none', cursor: 'pointer', background: '#f8fafc url("data:image/svg+xml;utf8,<svg fill=\'%2364748b\' viewBox=\'0 0 24 24\' width=\'24\' height=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>") no-repeat right 12px center'}} 
                        value={form.job_type} onChange={e => set('job_type', e.target.value)}
                        onFocus={e => e.target.style.borderColor = '#7c3aed'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Remote</option>
                        <option>Internship</option>
                        <option>Contract</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
                    <div>
                      <label style={labelStyle}>Experience Required</label>
                      <input style={inputStyle} placeholder="e.g. 2–4 years"
                        value={form.experience_required} onChange={e => set('experience_required', e.target.value)} 
                        onFocus={e => e.target.style.borderColor = '#7c3aed'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}/>
                    </div>
                    <div>
                      <label style={labelStyle}>Salary Range</label>
                      <input style={inputStyle} placeholder="e.g. ₹8–12 LPA"
                        value={form.salary_range} onChange={e => set('salary_range', e.target.value)} 
                        onFocus={e => e.target.style.borderColor = '#7c3aed'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}/>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="button" style={btnPrimary} onClick={() => setActiveSection('details')} onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.target.style.transform = 'translateY(0)'}>
                      Next: Job Details →
                    </button>
                  </div>
                </div>
              )}

              {/* Job Details & ATS */}
              {activeSection === 'details' && (
                <div className="animate-in" style={cardStyle}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>Screening Configuration</h2>
                  
                  <div style={{ marginBottom: 24 }}>
                    <label style={labelStyle}>Required Skills (ATS Keywords) *</label>
                    <input style={inputStyle} placeholder="e.g. React, Node.js, PostgreSQL, REST API, Git" required
                      value={form.skills_required} onChange={e => set('skills_required', e.target.value)} 
                      onFocus={e => e.target.style.borderColor = '#7c3aed'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}/>
                    <span style={{ fontSize: 13, color: '#94a3b8' }}>Separate with commas. These determine candidate match scores.</span>
                  </div>

                  <div style={{ marginBottom: 32 }}>
                    <label style={labelStyle}>Application Deadline *</label>
                    <input style={inputStyle} type="date" required
                      min={new Date().toISOString().split('T')[0]}
                      value={form.deadline} onChange={e => set('deadline', e.target.value)} 
                      onFocus={e => e.target.style.borderColor = '#7c3aed'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}/>
                    <span style={{ fontSize: 13, color: '#94a3b8' }}>Job automatically expires after this date.</span>
                  </div>

                  {/* ATS Threshold Custom */}
                  <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: 32 }}>
                    <label style={{...labelStyle, marginBottom: 16}}>ATS Rejection Threshold</label>
                    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                      <div style={{ position: 'relative', width: 100 }}>
                        <input style={{...inputStyle, paddingRight: 30, marginBottom: 0, textAlign: 'center', fontSize: 18, fontWeight: 700}} type="number" min="0" max="100"
                          value={form.ats_threshold} onChange={e => set('ats_threshold', e.target.value)} 
                          onFocus={e => e.target.style.borderColor = '#7c3aed'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}/>
                        <span style={{ position: 'absolute', right: 16, top: 14, color: '#94a3b8', fontWeight: 700 }}>%</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
                          <div style={{ 
                            height: '100%', background: 'linear-gradient(90deg, #8b5cf6 0%, #10b981 100%)',
                            width: `${form.ats_threshold}%`, transition: 'width 0.3s ease'
                          }} />
                        </div>
                        <span style={{ fontSize: 13, color: '#64748b' }}>
                          Resumes matching below <strong>{form.ats_threshold}%</strong> will be sent to the "ATS Failed" bucket.
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
                      {[50, 60, 70, 75, 80, 85, 90].map(v => {
                        const active = parseInt(form.ats_threshold) === v;
                        return (
                          <button key={v} type="button" onClick={() => set('ats_threshold', v)} style={{
                            padding: '6px 16px', borderRadius: '20px', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                            background: active ? '#7c3aed' : '#ffffff', color: active ? '#ffffff' : '#64748b',
                            boxShadow: active ? '0 4px 10px rgba(124, 58, 237, 0.3)' : '0 2px 5px rgba(0,0,0,0.05)',
                            border: active ? '1px solid #7c3aed' : '1px solid #e2e8f0'
                          }} onMouseEnter={e => { if(!active) e.currentTarget.style.borderColor = '#94a3b8'; }} 
                             onMouseLeave={e => { if(!active) e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                            {v}%
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button type="button" style={btnSecondary} onClick={() => setActiveSection('basic')}>← Back</button>
                    <button type="button" style={btnPrimary} onClick={() => setActiveSection('description')} onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.target.style.transform = 'translateY(0)'}>Next: Description →</button>
                  </div>
                </div>
              )}

              {/* Description */}
              {activeSection === 'description' && (
                <div className="animate-in" style={cardStyle}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>Posting Content</h2>
                  
                  <div style={{ marginBottom: 24 }}>
                    <label style={labelStyle}>Job Description *</label>
                    <textarea style={{...inputStyle, resize: 'vertical'}} rows={6} required
                      placeholder="Describe the role, key responsibilities, what success looks like in this position…"
                      value={form.description} onChange={e => set('description', e.target.value)} 
                      onFocus={e => e.target.style.borderColor = '#7c3aed'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}/>
                    <span style={{ fontSize: 13, color: '#94a3b8' }}>Detailed descriptions help candidates structure their resumes better.</span>
                  </div>
                  
                  <div style={{ marginBottom: 32 }}>
                    <label style={labelStyle}>Requirements & Qualifications</label>
                    <textarea style={{...inputStyle, resize: 'vertical'}} rows={5}
                      placeholder="Educational qualifications, certifications, preferred background…"
                      value={form.requirements} onChange={e => set('requirements', e.target.value)} 
                      onFocus={e => e.target.style.borderColor = '#7c3aed'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}/>
                  </div>

                  <div style={{ display: 'flex', gap: 16 }}>
                    <button type="button" style={btnSecondary} onClick={() => setActiveSection('details')}>← Back</button>
                    <button type="submit" disabled={loading} style={{ 
                      flex: 1, borderRadius: '14px', padding: '14px 24px', fontSize: 16, fontWeight: 800,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', color: '#fff',
                      cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s',
                      boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
                    }} onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(16, 185, 129, 0.4)'; } }} 
                       onMouseLeave={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.3)'; } }}>
                      {loading ? 'Publishing...' : '🚀 Publish Job Posting'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right Column / Live Preview */}
          <div style={{ flex: '1 1 350px' }}>
            <div style={{ position: 'sticky', top: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              <div className="animate-in" style={{
                background: '#fff', borderRadius: '24px', padding: '32px',
                border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 20px 50px rgba(0,0,0,0.04)'
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 20 }}>
                  Candidate View Preview
                </div>
                
                <h3 style={{ fontSize: 22, fontWeight: 800, color: form.title ? '#0f172a' : '#cbd5e1', marginBottom: 12, lineHeight: 1.3 }}>
                  {form.title || 'Job Title Goes Here'}
                </h3>
                
                <div style={{ color: '#64748b', fontSize: 14, marginBottom: 20, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  {form.company ? <span style={{ fontWeight: 600, color: '#475569' }}>🏢 {form.company}</span> : <span>🏢 Company</span>}
                  {form.location ? <span>📍 {form.location}</span> : <span>📍 Location</span>}
                  {form.job_type && <span>⏱ {form.job_type}</span>}
                </div>

                {form.salary_range && (
                  <div style={{ marginBottom: 20 }}>
                    <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '6px 14px', borderRadius: '20px', fontSize: 14, fontWeight: 700 }}>
                      💰 {form.salary_range}
                    </span>
                  </div>
                )}

                {form.skills_required && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                    {form.skills_required.split(',').slice(0, 5).map(s => s.trim()).filter(Boolean).map(s => (
                      <span key={s} style={{ 
                        background: '#f1f5f9', color: '#475569', padding: '4px 12px', 
                        borderRadius: '10px', fontSize: 12, fontWeight: 600 
                      }}>{s}</span>
                    ))}
                    {form.skills_required.split(',').filter(Boolean).length > 5 && (
                      <span style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center' }}>+ more</span>
                    )}
                  </div>
                )}

                <div style={{ height: 1, background: '#f1f5f9', margin: '24px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>ATS Cutoff Limit</span>
                  <span style={{ fontWeight: 900, color: '#7c3aed', fontSize: 20 }}>{form.ats_threshold}%</span>
                </div>
              </div>

              {/* Form Progress Box */}
              <div className="animate-in" style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff',
                padding: '28px', borderRadius: '24px', boxShadow: '0 15px 30px rgba(15, 23, 42, 0.2)',
                position: 'relative', overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute', top: '-10%', right: '-10%', width: 120, height: 120,
                  background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%)', borderRadius: '50%'
                }}/>
                <div style={{ fontWeight: 800, marginBottom: 16, fontSize: 18, color: '#fff', position: 'relative' }}>
                  Step {sections.findIndex(s => s.id === activeSection) + 1} of 3
                </div>
                <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, marginBottom: 16 }}>
                    <div style={{ 
                        position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: 3,
                        background: '#10b981', transition: 'width 0.3s ease',
                        width: `${((sections.findIndex(s => s.id === activeSection) + 1) / 3) * 100}%`
                    }} />
                </div>
                <p style={{ margin: 0, fontSize: 13, color: '#cbd5e1', lineHeight: 1.5, position: 'relative' }}>
                  {activeSection === 'basic' && "Start by identifying the core role you want to fill."}
                  {activeSection === 'details' && "Configure AI screening parameters and deadlines."}
                  {activeSection === 'description' && "Add context to attract top-tier talent matches."}
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
