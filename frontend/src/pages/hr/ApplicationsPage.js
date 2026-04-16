import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getJobApplications,
  selectCandidate,
  shortlistCandidate,
  rejectCandidate,
} from '../../api';
import { toast } from 'react-toastify';

const fontFamily = "'Söhne', 'Inter', sans-serif";

const STATUS_MAP = {
  applied:     { label: 'Pending Upload',  bg: '#f1f5f9', color: '#64748b', icon: '📝' },
  ats_passed:  { label: 'ATS Passed',      bg: 'rgba(16, 185, 129, 0.1)', color: '#059669', icon: '✅' },
  ats_failed:  { label: 'ATS Failed',      bg: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', icon: '❌' },
  shortlisted: { label: 'Shortlisted',     bg: 'rgba(245, 158, 11, 0.1)', color: '#d97706', icon: '⭐' },
  rejected:    { label: 'Not Selected',    bg: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', icon: '🚫' },
  selected:    { label: 'Selected',        bg: 'rgba(16, 185, 129, 0.15)', color: '#047857', icon: '🎉' },
};

const FILTERS = ['all', 'ats_passed', 'shortlisted', 'selected', 'ats_failed', 'rejected', 'applied'];

function SelectModal({ app, onClose, onDone }) {
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await selectCandidate({ application_id: app.application_id, message: msg });
      toast.success(`✅ ${app.student_name} selected! Congratulation email sent.`);
      onDone();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Selection failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', 
      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }} onClick={onClose}>
      <div className="animate-in" style={{
        background: '#fff', width: '100%', maxWidth: 540, borderRadius: '24px',
        padding: '36px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        position: 'relative'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Confirm Selection</h3>
            <p style={{ color: '#64748b', fontSize: 14 }}>
              This will update the candidate's status and send a congratulation email automatically.
            </p>
          </div>
          <button style={{ 
            background: 'rgba(15, 23, 42, 0.05)', border: 'none', borderRadius: '50%',
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, cursor: 'pointer', color: '#64748b', transition: 'all 0.2s'
          }} onClick={onClose} onMouseEnter={e => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.1)'} 
             onMouseLeave={e => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.05)'}>
            ×
          </button>
        </div>

        {/* Candidate info block */}
        <div style={{
          background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px',
          padding: '20px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a', marginBottom: 4 }}>{app.student_name}</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>{app.student_email}</div>
          </div>
          {app.ats_score != null && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#10b981' }}>{app.ats_score.toFixed(1)}%</div>
              <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>ATS Score</div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Custom Message (Optional)
          </label>
          <textarea rows={3} style={{
            background: '#fff', border: '2px solid #e2e8f0', borderRadius: '14px',
            padding: '16px', color: '#0f172a', fontFamily: fontFamily, fontSize: 15,
            width: '100%', outline: 'none', transition: 'border-color 0.2s'
          }} placeholder="Add a personal note to include in the congratulation email…"
             value={msg} onChange={e => setMsg(e.target.value)}
             onFocus={e => e.target.style.borderColor = '#8b5cf6'}
             onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
        </div>

        <div style={{ 
          background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.2)', 
          borderRadius: '12px', padding: '14px 18px', fontSize: 13, color: '#0369a1', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <span style={{ fontSize: 18 }}>📧</span>
          <span>An email will be sent to <strong>{app.student_email}</strong> with the subject "Congratulations! You've been selected."</span>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ 
            flex: 1, borderRadius: '14px', fontWeight: 700, fontSize: 15, padding: '14px 0',
            border: 'none', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)', opacity: loading ? 0.7 : 1
          }} onClick={handleConfirm} disabled={loading}
             onMouseEnter={e => { if(!loading){ e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.4)'; } }}
             onMouseLeave={e => { if(!loading){ e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.3)'; } }}>
            {loading ? 'Sending...' : '🎉 Confirm & Send Email'}
          </button>
          <button style={{ 
            flex: '0 0 120px', borderRadius: '14px', fontWeight: 600, fontSize: 15, padding: '14px 0',
            background: '#f1f5f9', border: 'none', color: '#475569', cursor: 'pointer', transition: 'all 0.2s'
          }} onClick={onClose}
             onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
             onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectApp, setSelectApp] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const load = () => getJobApplications(jobId).then(r => setApps(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, [jobId]);

  const handleShortlist = async (id, e) => {
    e.stopPropagation();
    await shortlistCandidate(id);
    toast.success('Candidate shortlisted ⭐');
    load();
  };

  const handleReject = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Mark this candidate as not selected?')) return;
    await rejectCandidate(id);
    toast.success('Candidate marked as not selected');
    load();
  };

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter);

  const stats = {
    total:       apps.length,
    passed:      apps.filter(a => ['ats_passed', 'shortlisted', 'selected'].includes(a.status)).length,
    shortlisted: apps.filter(a => a.status === 'shortlisted').length,
    selected:    apps.filter(a => a.status === 'selected').length,
    avgScore:    apps.filter(a => a.ats_score != null).length > 0
      ? apps.filter(a => a.ats_score != null).reduce((s, a, _, ar) => s + a.ats_score / ar.length, 0)
      : null,
  };

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div className="spinner" style={{ width: 48, height: 48, borderTopColor: '#7c3aed' }}></div>
    </div>
  );

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily, paddingBottom: 80, overflowX: 'hidden' }}>
      {/* Premium Header Container */}
      <div style={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        padding: '50px 40px 90px',
        overflow: 'hidden'
      }}>
        {/* Background Decorative Elements */}
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 60%)',
          borderRadius: '50%', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', left: '5%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.04) 0%, transparent 60%)',
          borderRadius: '50%', zIndex: 0
        }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32 }}>
            <div className="animate-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                <Link to="/hr/dashboard" style={{ color: '#7c3aed', textDecoration: 'none' }}>Dashboard</Link>
                <span>/</span>
                <Link to="/hr/jobs" style={{ color: '#7c3aed', textDecoration: 'none' }}>Job Posts</Link>
                <span>/</span>
                <span style={{ color: '#0f172a' }}>Job #{jobId}</span>
              </div>
              <h1 style={{ fontSize: window.innerWidth < 768 ? 32 : 44, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', marginBottom: 12 }}>
                Candidate <span style={{ 
                  background: 'linear-gradient(135deg, #7c3aed 0%, #0ea5e9 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>Review</span>
              </h1>
              <p style={{ fontSize: 16, color: '#64748b', margin: 0 }}>
                {apps.length} total application{apps.length !== 1 ? 's' : ''} received for this position.
              </p>
            </div>
            
            <button className="animate-in" onClick={() => navigate('/hr/jobs')} style={{ 
              animationDelay: '0.1s',
              borderRadius: '16px', padding: '14px 28px', fontWeight: 700, fontSize: 15,
              background: '#fff', border: '1px solid rgba(0,0,0,0.05)', color: '#0f172a', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.06)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)';
            }}>
              ← Back to Jobs
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '-45px auto 0', padding: '0 40px', position: 'relative', zIndex: 10 }}>
        
        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
          {[
            { v: stats.total,       l: 'Total Applications', c: '#8b5cf6' },
            { v: stats.passed,      l: 'ATS Qualified', c: '#3b82f6' },
            { v: stats.shortlisted, l: 'Shortlisted', c: '#f59e0b' },
            { v: stats.selected,    l: 'Selected', c: '#10b981' },
            { v: stats.avgScore ? `${stats.avgScore.toFixed(0)}%` : '—', l: 'Avg ATS Score', c: '#0ea5e9' },
          ].map((s, i) => (
            <div key={s.l} className="animate-in" style={{
              animationDelay: `${0.1 + (i * 0.05)}s`,
              background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(16px)',
              borderRadius: '20px', padding: '24px 28px',
              border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', marginBottom: 4, background: `linear-gradient(135deg, #0f172a 0%, ${s.c} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {s.v}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                {s.l}
              </div>
            </div>
          ))}
        </div>

        {/* Filter Chips */}
        <div className="animate-in" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32, animationDelay: '0.3s' }}>
          {FILTERS.map(f => {
            const isActive = filter === f;
            const styleOpt = STATUS_MAP[f] || STATUS_MAP.applied;
            return (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '8px 18px', borderRadius: '30px', fontWeight: 700, fontSize: 13, border: 'none',
                background: isActive ? '#0f172a' : '#fff', color: isActive ? '#fff' : '#64748b',
                cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: isActive ? '1px solid #0f172a' : '1px solid rgba(0,0,0,0.05)'
              }} onMouseEnter={e => !isActive && (e.currentTarget.style.background = '#f1f5f9')}
                 onMouseLeave={e => !isActive && (e.currentTarget.style.background = '#fff')}>
                {f === 'all'
                  ? `All (${apps.length})`
                  : `${styleOpt.icon} ${styleOpt.label} (${apps.filter(a => a.status === f).length})`}
              </button>
            )
          })}
        </div>

        {/* Applications List */}
        {filtered.length === 0 ? (
          <div className="animate-in" style={{
            background: '#ffffff', borderRadius: '24px', padding: '80px 40px',
            textAlign: 'center', border: '1px solid rgba(0,0,0,0.04)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.02)', animationDelay: '0.4s'
          }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>📭</div>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>No applications in this category</h3>
            <p style={{ fontSize: 16, color: '#64748b' }}>Try selecting a different filter above.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map((app, idx) => {
              const s = STATUS_MAP[app.status] || STATUS_MAP.applied;
              const isExpanded = expandedId === app.application_id;
              const canAct = ['ats_passed', 'shortlisted'].includes(app.status);

              return (
                <div key={app.application_id} className="animate-in" style={{
                  animationDelay: `${0.3 + (idx * 0.05)}s`,
                  background: '#fff', borderRadius: '20px',
                  border: isExpanded ? '1px solid rgba(124, 58, 237, 0.2)' : '1px solid rgba(0,0,0,0.03)', 
                  boxShadow: isExpanded ? '0 15px 40px rgba(124, 58, 237, 0.08)' : '0 4px 20px rgba(0,0,0,0.02)',
                  transition: 'all 0.3s ease', overflow: 'hidden'
                }}>
                  {/* Row */}
                  <div style={{ 
                    padding: '24px 32px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' 
                  }} onClick={() => setExpandedId(isExpanded ? null : app.application_id)}
                     onMouseEnter={e => { if(!isExpanded) { e.currentTarget.style.background = '#f8fafc'; } }}
                     onMouseLeave={e => { if(!isExpanded) { e.currentTarget.style.background = '#fff'; } }}>
                    
                    {/* Rank Number */}
                    <div style={{
                      width: 36, height: 36, borderRadius: '10px', background: '#f1f5f9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 800, color: '#94a3b8', flexShrink: 0
                    }}>
                      {idx + 1}
                    </div>

                    {/* Name & Title */}
                    <div style={{ flex: '2 1 200px' }}>
                      <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a', marginBottom: 4 }}>{app.student_name}</div>
                      <div style={{ fontSize: 13, color: '#64748b' }}>{app.student_email}</div>
                    </div>

                    {/* ATS Score */}
                    <div style={{ flex: '0 0 100px', textAlign: 'center' }}>
                      {app.ats_score != null ? (
                        <>
                          <div style={{
                            fontSize: 24, fontWeight: 900,
                            color: app.ats_score >= 80 ? '#10b981' : '#f59e0b',
                            lineHeight: 1, marginBottom: 4
                          }}>
                            {app.ats_score.toFixed(1)}%
                          </div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            ATS Match
                          </div>
                        </>
                      ) : (
                        <div style={{ color: '#cbd5e1', fontSize: 14, fontWeight: 600 }}>N/A</div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div style={{ flex: '0 0 150px' }}>
                      <span style={{
                        padding: '6px 14px', borderRadius: '20px', fontSize: 12, fontWeight: 700,
                        background: s.bg, color: s.color, display: 'inline-flex', alignItems: 'center', gap: 6
                      }}>
                        {s.icon} {s.label}
                      </span>
                    </div>

                    {/* Actions & Chevron */}
                    <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                      {canAct && (
                        <>
                          {app.status === 'ats_passed' && (
                            <>
                              <button onClick={e => handleShortlist(app.application_id, e)} style={{
                                background: 'transparent', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px',
                                padding: '8px 14px', fontSize: 13, fontWeight: 600, color: '#0f172a',
                                cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6
                              }} onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                ⭐ Shortlist
                              </button>
                              <button onClick={e => { e.stopPropagation(); navigate(`/hr/rag/${app.application_id}`); }} style={{
                                background: 'rgba(124, 58, 237, 0.08)', border: 'none', borderRadius: '10px',
                                padding: '9px 14px', fontSize: 13, fontWeight: 700, color: '#7c3aed',
                                cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6
                              }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(124, 58, 237, 0.15)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(124, 58, 237, 0.08)'}>
                                🧠 RAG Analysis
                              </button>
                            </>
                          )}
                          <button onClick={e => { e.stopPropagation(); setSelectApp(app); }} style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', borderRadius: '10px',
                            padding: '9px 16px', fontSize: 13, fontWeight: 700, color: '#fff',
                            cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
                          }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            🎉 Select
                          </button>
                          <button onClick={e => handleReject(app.application_id, e)} style={{
                            background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px',
                            padding: '8px 12px', fontSize: 13, fontWeight: 600, color: '#dc2626',
                            cursor: 'pointer', transition: 'all 0.2s'
                          }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            ✕
                          </button>
                        </>
                      )}
                      
                      {app.status === 'selected' && (
                        <span style={{ color: '#10b981', fontSize: 14, fontWeight: 800 }}>✅ Hired</span>
                      )}

                      <div style={{
                         width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                         color: '#94a3b8', fontSize: 20, transition: 'all 0.3s',
                         transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                         background: isExpanded ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                         marginLeft: 8
                      }}>
                        ›
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div style={{ padding: '0 32px 32px', animation: 'fadeIn 0.3s ease' }}>
                      <div style={{
                        background: '#f8fafc', borderRadius: '16px', padding: '24px',
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32,
                        border: '1px solid #e2e8f0'
                      }}>
                        
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>Personal Details</div>
                          <div style={{ fontSize: 14, color: '#0f172a', marginBottom: 8 }}><strong>Name:</strong> {app.student_name}</div>
                          <div style={{ fontSize: 14, color: '#0f172a', marginBottom: 8 }}><strong>Email:</strong> {app.student_email}</div>
                          <div style={{ fontSize: 14, color: '#0f172a', marginBottom: 8 }}><strong>DOB:</strong> {app.date_of_birth}</div>
                          {app.phone && <div style={{ fontSize: 14, color: '#0f172a' }}><strong>Phone:</strong> {app.phone}</div>}
                        </div>

                        <div>
                          <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>Application Tracking</div>
                          <div style={{ fontSize: 14, color: '#0f172a', marginBottom: 8 }}>
                            <strong>Date Applied:</strong> {new Date(app.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                          <div style={{ fontSize: 14, color: '#0f172a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <strong>Resume:</strong>{' '}
                            {app.resume_filename ? (
                              <span style={{ color: '#7c3aed', background: 'rgba(124, 58, 237, 0.1)', padding: '2px 8px', borderRadius: '6px', fontSize: 13, fontWeight: 600 }}>{app.resume_filename}</span>
                            ) : (
                              <span style={{ color: '#94a3b8' }}>Pending Upload</span>
                            )}
                          </div>
                          {app.resume_drive_link && (
                            <a href={app.resume_drive_link} target="_blank" rel="noreferrer" style={{
                              display: 'inline-flex', alignItems: 'center', gap: 6,
                              background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px',
                              padding: '8px 14px', fontSize: 13, fontWeight: 600, color: '#0f172a', textDecoration: 'none', transition: 'all 0.2s'
                            }} onMouseEnter={e => e.currentTarget.style.borderColor = '#94a3b8'} onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
                              ☁️ View in Drive
                            </a>
                          )}
                        </div>

                        <div>
                          <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>ATS Score Breakdown</div>
                          {app.ats_score != null ? (
                            <>
                              <div style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                                  <span style={{ color: '#0f172a' }}>Overall Match</span>
                                  <span style={{ color: app.ats_score >= 80 ? '#10b981' : '#f59e0b' }}>{app.ats_score.toFixed(1)}%</span>
                                </div>
                                <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                                  <div style={{ 
                                    height: '100%', background: app.ats_score >= 80 ? '#10b981' : '#f59e0b',
                                    width: `${app.ats_score}%`, borderRadius: 4
                                  }} />
                                </div>
                              </div>
                              <div style={{ fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <strong>System Status:</strong> 
                                <span style={{ background: s.bg, color: s.color, padding: '2px 8px', borderRadius: '6px', fontSize: 12, fontWeight: 700 }}>
                                  {s.label}
                                </span>
                              </div>
                            </>
                          ) : (
                            <div style={{ color: '#94a3b8', fontSize: 14 }}>Not yet processed by ATS due to missing file.</div>
                          )}
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selection Modal */}
      {selectApp && (
        <SelectModal
          app={selectApp}
          onClose={() => setSelectApp(null)}
          onDone={() => { setSelectApp(null); load(); }}
        />
      )}
    </div>
  );
}