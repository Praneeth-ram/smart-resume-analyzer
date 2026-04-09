import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { triggerRAG } from '../../api';
import { toast } from 'react-toastify';

export default function RAGAnalysisPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true); setError('');
    try {
      const res = await triggerRAG(applicationId);
      setResult(res.data);
      toast.success(`RAG analysis complete — ${res.data.verdict}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed');
    } finally { setLoading(false); }
  };

  const passed = result?.verdict === 'SELECTED';

  return (
    <div>
      <div className="page-header">
        <div className="page-header-inner">
          <div className="breadcrumb">
            <Link to="/hr/jobs">Jobs</Link>
            <span className="breadcrumb-sep">›</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>
              RAG Analysis — Application #{applicationId}
            </span>
          </div>
          <h1>Phase 2: <span className="page-header-accent">Semantic Analysis</span></h1>
          <p>RAG + LLM deep evaluation of this candidate</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 40px 80px' }}>
        {!result ? (
          <div className="card card-accented" style={{ textAlign: 'center', padding: '56px 40px' }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🧠</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
              Run Semantic Analysis
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
              Phase 2 uses RAG + Claude LLM to deeply evaluate this resume against
              the job description — going beyond keyword matching to assess
              contextual fit, strengths, and gaps.
            </p>
            {error && <div className="alert alert-error">{error}</div>}
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAnalyze}
              disabled={loading}
              style={{ margin: '0 auto' }}
            >
              {loading ? (
                <><span className="spinner spinner-sm"
                    style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                  Analyzing with LLM…</>
              ) : '🚀 Run RAG + LLM Analysis'}
            </button>
          </div>
        ) : (
          <div className="animate-in">
            {/* Verdict banner */}
            <div style={{
              background: passed ? 'var(--bg-light)' : '#FDEEEE',
              borderLeft: `4px solid ${passed ? 'var(--accent-green)' : 'var(--danger)'}`,
              padding: '24px 28px', marginBottom: 28,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: 16,
            }}>
              <div>
                <div style={{
                  fontSize: 22, fontWeight: 800,
                  color: passed ? 'var(--accent-green)' : 'var(--danger)',
                  marginBottom: 6,
                }}>
                  {passed ? '✅ Candidate Selected' : '❌ Candidate Rejected'}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                  Semantic similarity score:{' '}
                  <strong style={{ color: passed ? 'var(--accent-green)' : 'var(--danger)', fontSize: 18 }}>
                    {(result.semantic_score * 100).toFixed(1)}%
                  </strong>
                </div>
              </div>
              <div className="progress-bar" style={{ width: 200, height: 10 }}>
                <div
                  className={`progress-fill ${passed ? 'progress-green' : 'progress-danger'}`}
                  style={{ width: `${result.semantic_score * 100}%` }}
                />
              </div>
            </div>

            <div className="grid-2" style={{ gap: 20, marginBottom: 24 }}>
              {/* Strengths */}
              <div className="card card-accented">
                <h3 style={{ fontWeight: 700, marginBottom: 14, color: 'var(--accent-green)', fontSize: 16 }}>
                  Strengths
                </h3>
                {result.strengths?.length ? result.strengths.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 14 }}>
                    <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>›</span>
                    {s}
                  </div>
                )) : <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>None identified</p>}
              </div>

              {/* Gaps */}
              <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
                <h3 style={{ fontWeight: 700, marginBottom: 14, color: 'var(--danger)', fontSize: 16 }}>
                  Gaps
                </h3>
                {result.gaps?.length ? result.gaps.map((g, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 14 }}>
                    <span style={{ color: 'var(--danger)', fontWeight: 700 }}>›</span>
                    {g}
                  </div>
                )) : <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No gaps found</p>}
              </div>
            </div>

            {/* LLM reasoning */}
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 12 }}>LLM Reasoning</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 15 }}>
                {result.reasoning}
              </p>
            </div>

            {/* Top matching resume chunks */}
            {result.top_chunks?.length > 0 && (
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>
                  Top Matched Resume Sections
                </h3>
                {result.top_chunks.slice(0, 3).map((c, i) => (
                  <div key={i} style={{
                    background: 'var(--bg-offwhite)', padding: '12px 16px',
                    marginBottom: 10, borderLeft: '3px solid var(--purple)',
                    fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6,
                  }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: 'var(--purple)',
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                      display: 'block', marginBottom: 6,
                    }}>
                      Similarity: {(c.score * 100).toFixed(1)}%
                    </span>
                    {c.text.substring(0, 200)}…
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                ← Back to Applications
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}