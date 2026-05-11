import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { triggerRAG } from '../../api';
import { toast } from 'react-toastify';

const fontFamily = "sans-serif";

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
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily, paddingBottom: 80, overflowX: 'hidden' }}>
      {/* Premium Header */}
      <div style={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        padding: '60px 40px 90px',
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
          <div className="breadcrumb" style={{ marginBottom: 16 }}>
            <button onClick={() => navigate(-1)} style={{ 
              background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', 
              fontSize: 14, fontWeight: 600, padding: 0 
            }}>
              ← Back to Application
            </button>
            <span style={{ margin: '0 8px', color: '#cbd5e1' }}>|</span>
            <span style={{ fontSize: 13, color: '#7c3aed', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>
              Phase 2: Semantic Analysis
            </span>
          </div>

          <h1 style={{ fontSize: window.innerWidth < 768 ? 24 : 32, fontWeight: 700, color: '#0f172a', letterSpacing: '-1px', marginBottom: 12, lineHeight: 1.1 }}>
            RAG Evaluation —{" "}
            <span style={{ 
              background: 'linear-gradient(135deg, #7c3aed 0%, #0ea5e9 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              App #{applicationId}
            </span>
          </h1>
          <p style={{ fontSize: 16, color: '#64748b', maxWidth: 600, lineHeight: 1.6, margin: 0 }}>
            Deep evaluation of the candidate's resume using RAG + Claude LLM.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '-45px auto 0', padding: '0 40px', position: 'relative', zIndex: 10 }}>
        {!result ? (
          <div className="animate-in" style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '56px 40px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
            border: `1px solid rgba(0,0,0,0.04)`,
            textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
          }}>
            <div style={{ 
              width: 80, height: 80, borderRadius: '24px', 
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 40, marginBottom: 24,
              boxShadow: 'inset 0 2px 10px rgba(124, 58, 237, 0.05)'
            }}>
              🧠
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, color: '#0f172a' }}>
              Run Semantic Analysis
            </h2>
            <p style={{ color: '#64748b', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7, fontSize: 15 }}>
              Phase 2 uses RAG + Claude LLM to deeply evaluate this resume against
              the job description — going beyond keyword matching to assess
              contextual fit, strengths, and gaps.
            </p>
            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444',
                padding: '12px 20px', borderRadius: '12px', marginBottom: 24,
                fontSize: 14, fontWeight: 600
              }}>
                {error}
              </div>
            )}
            <button
              onClick={handleAnalyze}
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                color: '#fff', border: 'none', borderRadius: '16px',
                padding: '16px 36px', fontSize: 16, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 12,
                boxShadow: '0 10px 25px rgba(124, 58, 237, 0.3)',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.8 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(124, 58, 237, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(124, 58, 237, 0.3)';
                }
              }}
            >
              {loading ? (
                <><span className="spinner spinner-sm"
                    style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff', width: 20, height: 20 }} />
                  Analyzing with LLM…</>
              ) : '🚀 Run RAG + LLM Analysis'}
            </button>
          </div>
        ) : (
          <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Verdict banner */}
            <div style={{
              background: '#fff',
              borderLeft: `6px solid ${passed ? '#10b981' : '#ef4444'}`,
              borderRadius: '20px',
              padding: '28px 32px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: 16,
            }}>
              <div>
                <div style={{
                  fontSize: 24, fontWeight: 800,
                  color: passed ? '#10b981' : '#ef4444',
                  marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10
                }}>
                  {passed ? '✅ Candidate Selected' : '❌ Candidate Rejected'}
                </div>
                <div style={{ fontSize: 15, color: '#64748b' }}>
                  Semantic similarity score:{' '}
                  <strong style={{ color: passed ? '#10b981' : '#ef4444', fontSize: 20, fontWeight: 800 }}>
                    {(result.semantic_score * 100).toFixed(1)}%
                  </strong>
                </div>
              </div>
              <div style={{ width: 240 }}>
                <div style={{ height: 12, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden' }}>
                  <div
                    style={{ 
                      width: `${result.semantic_score * 100}%`, height: '100%',
                      background: passed ? '#10b981' : '#ef4444',
                      transition: 'width 1s ease-out'
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              {/* Strengths */}
              <div style={{
                background: '#fff', borderRadius: '24px', padding: '32px',
                borderTop: '4px solid #10b981',
                boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
              }}>
                <h3 style={{ fontWeight: 700, marginBottom: 20, color: '#0f172a', fontSize: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: '#10b981' }}>★</span> Strengths
                </h3>
                {result.strengths?.length ? result.strengths.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, fontSize: 15, color: '#475569', lineHeight: 1.6 }}>
                    <span style={{ color: '#10b981', fontWeight: 700, fontSize: 18, lineHeight: 1 }}>›</span>
                    {s}
                  </div>
                )) : <p style={{ color: '#94a3b8', fontSize: 14, fontStyle: 'italic' }}>None identified</p>}
              </div>

              {/* Gaps */}
              <div style={{
                background: '#fff', borderRadius: '24px', padding: '32px',
                borderTop: '4px solid #ef4444',
                boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
              }}>
                <h3 style={{ fontWeight: 700, marginBottom: 20, color: '#0f172a', fontSize: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: '#ef4444' }}>⚠</span> Gaps
                </h3>
                {result.gaps?.length ? result.gaps.map((g, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, fontSize: 15, color: '#475569', lineHeight: 1.6 }}>
                    <span style={{ color: '#ef4444', fontWeight: 700, fontSize: 18, lineHeight: 1 }}>›</span>
                    {g}
                  </div>
                )) : <p style={{ color: '#94a3b8', fontSize: 14, fontStyle: 'italic' }}>No gaps found</p>}
              </div>
            </div>

            {/* LLM reasoning */}
            <div style={{
              background: '#fff', borderRadius: '24px', padding: '32px',
              border: '1px solid rgba(0,0,0,0.04)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.02)'
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: 16, color: '#0f172a', fontSize: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>🤖</span> LLM Reasoning
              </h3>
              <p style={{ color: '#475569', lineHeight: 1.8, fontSize: 15, background: '#f8fafc', padding: '20px', borderRadius: '16px', margin: 0 }}>
                {result.reasoning}
              </p>
            </div>

            {/* Top matching resume chunks */}
            {result.top_chunks?.length > 0 && (
              <div style={{
                background: '#fff', borderRadius: '24px', padding: '32px',
                border: '1px solid rgba(0,0,0,0.04)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.02)'
              }}>
                <h3 style={{ fontWeight: 700, marginBottom: 20, color: '#0f172a', fontSize: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: '#8b5cf6' }}>📄</span> Top Matched Resume Sections
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {result.top_chunks.slice(0, 3).map((c, i) => (
                    <div key={i} style={{
                      background: 'rgba(139, 92, 246, 0.03)', padding: '20px', borderRadius: '16px',
                      borderLeft: '4px solid #8b5cf6',
                      fontSize: 14, color: '#475569', lineHeight: 1.6,
                    }}>
                      <div style={{
                        fontSize: 12, fontWeight: 700, color: '#8b5cf6',
                        textTransform: 'uppercase', letterSpacing: '0.5px',
                        marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8
                      }}>
                        <span style={{ padding: '4px 10px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px' }}>
                          Similarity: {(c.score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div style={{ fontStyle: 'italic' }}>
                        "{c.text.substring(0, 300)}{c.text.length > 300 ? '...' : ''}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}