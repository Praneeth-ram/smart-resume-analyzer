import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getJobApplications,
  selectCandidate,
  shortlistCandidate,
  rejectCandidate,
} from '../../api';
import { toast } from 'react-toastify';

const STATUS_MAP = {
  applied:     { label: 'Pending Upload',  cls: 'badge-neutral',  icon: '📝' },
  ats_passed:  { label: 'ATS Passed',      cls: 'badge-success',  icon: '✅' },
  ats_failed:  { label: 'ATS Failed',      cls: 'badge-danger',   icon: '❌' },
  shortlisted: { label: 'Shortlisted',     cls: 'badge-warning',  icon: '⭐' },
  rejected:    { label: 'Not Selected',    cls: 'badge-danger',   icon: '🚫' },
  selected:    { label: 'Selected',        cls: 'badge-success',  icon: '🎉' },
};

const FILTERS = ['all', 'ats_passed', 'shortlisted', 'selected', 'ats_failed', 'rejected', 'applied'];

/* ── Selection Modal ───────────────────────────────── */
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Confirm Selection</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              This will update the candidate's status and send a congratulation email automatically.
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Candidate info */}
        <div style={{
          background: 'var(--bg-offwhite)', border: '1px solid var(--border-gray)',
          padding: '16px 20px', marginBottom: 20,
        }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{app.student_name}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>{app.student_email}</div>
          {app.ats_score != null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>ATS Score:</span>
              <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--accent-green)' }}>
                {app.ats_score.toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        <div className="form-group" style={{ marginBottom: 24 }}>
          <label className="form-label">Custom Message (Optional)</label>
          <textarea className="form-input" rows={3}
            placeholder="Add a personal note to include in the congratulation email…"
            value={msg} onChange={e => setMsg(e.target.value)} />
        </div>

        <div className="alert alert-info" style={{ fontSize: 13, marginBottom: 20 }}>
          📧 An email will be sent to <strong>{app.student_email}</strong> with the subject
          "Congratulations! You've been selected."
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-success btn-full" onClick={handleConfirm} disabled={loading}>
            {loading
              ? <><span className="spinner spinner-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Sending…</>
              : '🎉 Confirm & Send Email'}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────── */
export default function ApplicationsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectApp, setSelectApp] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const load = () =>
    getJobApplications(jobId).then(r => setApps(r.data)).finally(() => setLoading(false));
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

  const filtered =
    filter === 'all' ? apps : apps.filter(a => a.status === filter);

  const stats = {
    total:       apps.length,
    passed:      apps.filter(a => ['ats_passed', 'shortlisted', 'selected'].includes(a.status)).length,
    shortlisted: apps.filter(a => a.status === 'shortlisted').length,
    selected:    apps.filter(a => a.status === 'selected').length,
    avgScore:    apps.filter(a => a.ats_score != null).length > 0
      ? apps.filter(a => a.ats_score != null).reduce((s, a, _, ar) => s + a.ats_score / ar.length, 0)
      : null,
  };

  if (loading) return <div style={{ padding: 80, textAlign: 'center' }}><div className="spinner" /></div>;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-inner">
          <div className="breadcrumb">
            <Link to="/hr/dashboard">Dashboard</Link>
            <span className="breadcrumb-sep">›</span>
            <Link to="/hr/jobs">Job Posts</Link>
            <span className="breadcrumb-sep">›</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>Applications — Job #{jobId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <h1>Candidate <span className="page-header-accent">Review</span></h1>
              <p>{apps.length} total application{apps.length !== 1 ? 's' : ''} received</p>
            </div>
            <Link to="/hr/jobs/new" className="btn btn-primary">+ Post Another Job</Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px 80px' }}>
        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: 36 }}>
          {[
            { v: stats.total,       l: 'Total Applications' },
            { v: stats.passed,      l: 'ATS Qualified'      },
            { v: stats.shortlisted, l: 'Shortlisted'        },
            { v: stats.selected,    l: 'Selected'           },
            { v: stats.avgScore ? `${stats.avgScore.toFixed(0)}%` : '—', l: 'Avg ATS Score' },
          ].map(s => (
            <div key={s.l} className="stat-card">
              <div className="stat-value">{s.v}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Filter chips */}
        <div className="filter-chips" style={{ marginBottom: 28 }}>
          {FILTERS.map(f => (
            <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}>
              {f === 'all'
                ? `All (${apps.length})`
                : `${STATUS_MAP[f]?.icon} ${STATUS_MAP[f]?.label} (${apps.filter(a => a.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Applications */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>No applications in this category</h3>
            <p>Try selecting a different filter above</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border-gray)', border: '1px solid var(--border-gray)' }}>
            {filtered.map((app, idx) => {
              const s = STATUS_MAP[app.status] || STATUS_MAP.applied;
              const isExpanded = expandedId === app.application_id;
              const canAct = ['ats_passed', 'shortlisted'].includes(app.status);

              return (
                <div key={app.application_id}
                  style={{ background: '#fff', transition: 'background 0.15s' }}
                  onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = 'var(--bg-offwhite)'; }}
                  onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = '#fff'; }}
                >
                  {/* Row */}
                  <div
                    style={{ padding: '20px 28px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}
                    onClick={() => setExpandedId(isExpanded ? null : app.application_id)}
                  >
                    {/* Rank number */}
                    <div style={{
                      width: 32, height: 32, background: 'var(--bg-offwhite)',
                      border: '1px solid var(--border-gray)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', flexShrink: 0,
                    }}>{idx + 1}</div>

                    {/* Name & email */}
                    <div style={{ flex: 2, minWidth: 160 }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{app.student_name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{app.student_email}</div>
                    </div>

                    {/* ATS Score */}
                    <div style={{ flex: '0 0 100px', textAlign: 'center' }}>
                      {app.ats_score != null ? (
                        <>
                          <div style={{
                            fontSize: 22, fontWeight: 800, fontFamily: 'Outfit',
                            color: app.ats_score >= 80 ? 'var(--accent-green)' : 'var(--danger)',
                            lineHeight: 1,
                          }}>
                            {app.ats_score.toFixed(1)}%
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 3 }}>
                            ATS Score
                          </div>
                        </>
                      ) : (
                        <span style={{ color: 'var(--light-gray)', fontSize: 13 }}>—</span>
                      )}
                    </div>

                    {/* Status badge */}
                    <div style={{ flex: '0 0 140px' }}>
                      <span className={`badge ${s.cls}`}>{s.icon} {s.label}</span>
                    </div>

                    {/* Actions */}
                    <div style={{ flex: '0 0 auto', display: 'flex', gap: 8 }}>
                      {canAct && (
                        <>
                          {app.status === 'ats_passed' && (
                            <>
                              <button className="btn btn-sm" style={{ background: 'var(--bg-offwhite)', border: '1px solid var(--border-gray)', color: 'var(--text-body)' }}
                                onClick={e => handleShortlist(app.application_id, e)}>
                                ⭐ Shortlist
                              </button>
                              <button className="btn btn-secondary btn-sm"
                                onClick={e => { e.stopPropagation(); navigate(`/hr/rag/${app.application_id}`); }}>
                                🧠 RAG Analysis
                              </button>
                            </>
                          )}
                          <button className="btn btn-success btn-sm"
                            onClick={e => { e.stopPropagation(); setSelectApp(app); }}>
                            🎉 Select
                          </button>
                          <button className="btn btn-sm" style={{ background: '#FDEEEE', border: '1px solid #F7B7BE', color: 'var(--danger)' }}
                            onClick={e => handleReject(app.application_id, e)}>
                            ✕
                          </button>
                        </>
                      )}
                      {app.status === 'selected' && (
                        <span style={{ color: 'var(--accent-green)', fontSize: 13, fontWeight: 700 }}>✅ Selected</span>
                      )}

                      {/* Expand toggle */}
                      <div style={{
                        width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text-muted)', fontSize: 18, transition: 'transform 0.2s',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}>
                        ›
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail row */}
                  {isExpanded && (
                    <div style={{
                      padding: '20px 28px 24px', background: 'var(--bg-offwhite)',
                      borderTop: '1px solid var(--border-gray)', animation: 'fadeIn 0.2s ease',
                    }}>
                      <div className="grid-3" style={{ gap: 24 }}>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>Personal Details</div>
                          <div style={{ fontSize: 14, marginBottom: 4 }}><strong>Name:</strong> {app.student_name}</div>
                          <div style={{ fontSize: 14, marginBottom: 4 }}><strong>Email:</strong> {app.student_email}</div>
                          <div style={{ fontSize: 14, marginBottom: 4 }}><strong>DOB:</strong> {app.date_of_birth}</div>
                          {app.phone && <div style={{ fontSize: 14 }}><strong>Phone:</strong> {app.phone}</div>}
                        </div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>Application Info</div>
                          <div style={{ fontSize: 14, marginBottom: 4 }}>
                            <strong>Applied:</strong> {new Date(app.applied_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                          <div style={{ fontSize: 14, marginBottom: 4 }}>
                            <strong>Resume:</strong>{' '}
                            {app.resume_filename
                              ? <span style={{ color: 'var(--purple)' }}>{app.resume_filename}</span>
                              : <span style={{ color: 'var(--light-gray)' }}>Not uploaded</span>}
                          </div>
                          {app.resume_drive_link && (
                            <a href={app.resume_drive_link} target="_blank" rel="noreferrer"
                              className="btn btn-outline btn-sm" style={{ marginTop: 8 }}>
                              ☁️ View in Drive ↗
                            </a>
                          )}
                        </div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>ATS Score Breakdown</div>
                          {app.ats_score != null ? (
                            <>
                              <div style={{ marginBottom: 10 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                                  <span>Score</span>
                                  <span style={{ color: app.ats_score >= 80 ? 'var(--accent-green)' : 'var(--danger)' }}>
                                    {app.ats_score.toFixed(1)}%
                                  </span>
                                </div>
                                <div className="progress-bar">
                                  <div className={`progress-fill ${app.ats_score >= 80 ? 'progress-green' : 'progress-danger'}`}
                                    style={{ width: `${app.ats_score}%` }} />
                                </div>
                              </div>
                              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                Status: <span className={`badge ${STATUS_MAP[app.status]?.cls}`} style={{ padding: '2px 8px', fontSize: 11 }}>
                                  {STATUS_MAP[app.status]?.label}
                                </span>
                              </div>
                            </>
                          ) : (
                            <div style={{ color: 'var(--light-gray)', fontSize: 13 }}>Resume not yet uploaded</div>
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