import React, { useEffect, useState } from 'react';
import { getHRAnalytics } from '../../api';
import { Link } from 'react-router-dom';

const fontFamily = "'Söhne', 'Inter', sans-serif";

export default function HRAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHRAnalytics()
      .then(res => setData(res.data))
      .catch(err => {
          console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

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
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 60%)',
          borderRadius: '50%', zIndex: 0
        }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32 }}>
            <div className="animate-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                <Link to="/hr/dashboard" style={{ color: '#7c3aed', textDecoration: 'none' }}>Dashboard</Link>
                <span>/</span>
                <span style={{ color: '#0f172a' }}>Reports & Analytics</span>
              </div>
              <h1 style={{ fontSize: window.innerWidth < 768 ? 32 : 44, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', marginBottom: 12 }}>
                Reports & <span style={{ 
                  background: 'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>Analytics</span>
              </h1>
              <p style={{ fontSize: 16, color: '#64748b', margin: 0 }}>
                Comprehensive insights on your pipeline, jobs performance, and AI optimizations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '-45px auto 0', padding: '0 40px', position: 'relative', zIndex: 10 }}>

        {/* 📊 KPI STATS - Glassmorphism */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, marginBottom: 40 }}>
          {[
            { label: 'Total Applications', value: data?.applied, c: '#8b5cf6' },
            { label: 'ATS Passed', value: data?.ats_passed, c: '#3b82f6' },
            { label: 'Selected', value: data?.selected, c: '#10b981' },
            {
              label: 'Selection Rate',
              value: data?.applied ? ((data?.selected / data?.applied) * 100).toFixed(1) + '%' : '0%',
              c: '#f59e0b'
            }
          ].map((stat, i) => (
            <div key={i} className="animate-in" style={{
              animationDelay: `${0.1 + (i * 0.05)}s`,
              background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(16px)',
              borderRadius: '20px', padding: '24px 28px',
              border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
            }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', marginBottom: 4, background: `linear-gradient(135deg, #0f172a 0%, ${stat.c} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {stat.value || 0}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ATS Funnel & AI Insights Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 32, marginBottom: 40 }}>
          
          {/* 🔥 ATS FUNNEL */}
          <div className="animate-in" style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#fff', borderRadius: '24px', padding: '36px',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
            position: 'relative', overflow: 'hidden', animationDelay: '0.3s'
          }}>
            <div style={{
              position: 'absolute', top: '-10%', right: '-10%',
              width: 150, height: 150,
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
              borderRadius: '50%'
            }}/>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 32, position: 'relative', color: '#ffffff' }}>
              ATS Funnel Conversion
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              {[
                { label: 'Applied', value: data?.applied },
                { label: 'ATS Passed', value: data?.ats_passed },
                { label: 'Shortlisted', value: data?.shortlisted },
                { label: 'Selected', value: data?.selected }
              ].map((item, i, arr) => (
                <React.Fragment key={i}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, color: '#ffffff' }}>
                      {item.value || 0}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#94a3b8' }}>
                      {item.label}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: 24, fontWeight: 300, flexShrink: 0 }}>
                      ›
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 🧠 AI INSIGHTS */}
          <div className="animate-in" style={{
            background: '#ffffff', borderRadius: '24px', padding: '36px',
            border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
            animationDelay: '0.4s'
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>🧠</span> AI Insights
            </h2>
            
            {data?.insights && data.insights.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {data.insights.map((insight, i) => (
                  <div key={i} style={{
                    padding: '16px 20px', background: '#f8fafc', borderRadius: '14px',
                    borderLeft: '4px solid #7c3aed', color: '#334155', fontSize: 15, lineHeight: 1.5
                  }}>
                    {insight}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#94a3b8', fontSize: 15, fontStyle: 'italic', padding: '20px 0' }}>
                Not enough data yet to generate AI insights on your hiring pipeline.
              </div>
            )}
          </div>
        </div>

        {/* 📋 JOB PERFORMANCE TABLE */}
        <div className="animate-in" style={{ marginBottom: 40, animationDelay: '0.5s' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 20 }}>Job Performance</h2>

          <div style={{
            background: '#fff', borderRadius: '24px',
            border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th style={th}>Job Title</th>
                  <th style={th}>Applications</th>
                  <th style={th}>ATS Passed</th>
                  <th style={th}>Selected</th>
                </tr>
              </thead>
              <tbody>
                {data?.jobs && data.jobs.length > 0 ? data.jobs.map((job, i) => (
                  <tr key={i} style={{ transition: 'background 0.2s', cursor: 'default' }} 
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ ...td, fontWeight: 700, color: '#0f172a' }}>{job.title}</td>
                    <td style={td}>
                      <span style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px', fontWeight: 600 }}>{job.applied || 0}</span>
                    </td>
                    <td style={td}>
                      <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#2563eb', padding: '4px 12px', borderRadius: '20px', fontWeight: 600 }}>{job.ats_passed || 0}</span>
                    </td>
                    <td style={td}>
                      <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '4px 12px', borderRadius: '20px', fontWeight: 600 }}>{job.selected || 0}</span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
                      No active jobs accumulating data at this time.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

const th = {
  padding: '18px 24px',
  fontSize: 12,
  fontWeight: 800,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: 0.8,
  borderBottom: '2px solid #e2e8f0'
};

const td = {
  padding: '18px 24px',
  borderBottom: '1px solid #f1f5f9',
  fontSize: 15,
  color: '#475569'
};