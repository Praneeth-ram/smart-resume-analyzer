import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const fontFamily = "sans-serif";

const STATS = [
  { value: '2.1s', label: 'Analysis Time' },
  { value: '100%', label: 'Accurate Results' },
  { value: '100%', label: 'Automated Parsing' },
  { value: '3-Step', label: 'Clear Process' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (  
    <div style={{ fontFamily, overflowX: 'hidden' }}>
      
      {/* Premium Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #171717 100%)',
        minHeight: '92vh',
        display: 'flex', alignItems: 'center',
        padding: '80px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.15,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        
        <div style={{
          position: 'absolute', right: '-15%', top: '20%',
          width: '700px', height: '700px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', left: '-10%', bottom: '-10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 800 }} className="animate-in">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              padding: '8px 20px', marginBottom: 36, borderRadius: '30px', backdropFilter: 'blur(10px)'
            }}>
              <span style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px #10b981' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Next-Gen AI Hiring Intelligence
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, color: '#fff', lineHeight: 1.05, marginBottom: 32, letterSpacing: '-2px' }}>
              Hire the Right Talent,<br />
              <span style={{ 
                background: 'linear-gradient(135deg, #a78bfa 0%, #34d399 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>Faster.</span>
            </h1>

            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, maxWidth: 600, marginBottom: 48, fontWeight: 500 }}>
              SmartResume helps you identify the most suitable applicants for your job—saving time, reducing effort, and improving hiring decisions.
            </p>

            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <button style={{ 
                  borderRadius: '16px', padding: '18px 36px', fontSize: 18, fontWeight: 700,
                  background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', border: 'none', color: '#fff',
                  cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 10px 25px rgba(124, 58, 237, 0.4)',
                  display: 'flex', alignItems: 'center', gap: 12
                }} onClick={() => navigate('/jobs')} 
                 onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(124, 58, 237, 0.5)'; }} 
                 onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(124, 58, 237, 0.4)'; }}>
                Search Jobs
                <span style={{ fontSize: 22 }}>›</span>
              </button>
              <button style={{ 
                  borderRadius: '16px', padding: '18px 36px', fontSize: 18, fontWeight: 700,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
                  cursor: 'pointer', transition: 'all 0.3s'
                }} onClick={() => navigate('/register')} 
                 onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} 
                 onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                Post a Job Instead
              </button>
            </div>
          </div>

          {/* Premium Stat Bar */}
          <div style={{
            display: 'flex', gap: 40, marginTop: 80,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            padding: '40px', borderRadius: '24px', flexWrap: 'wrap', backdropFilter: 'blur(20px)'
          }} className="animate-in delay-2">
            {STATS.map((s, i) => (
              <div key={s.label} style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
                <div style={{ fontSize: 14, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Glassmorphism How It Works ── */}
      <section style={{ padding: '120px 40px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 80, alignItems: 'start' }}>
            
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ display: 'inline-block', background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', padding: '8px 16px', borderRadius: '20px', fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>The Architecture</div>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 700, color: '#0f172a', marginBottom: 20, lineHeight: 1.1, letterSpacing: '-1px' }}>How Our Engine Works</h2>
              <p style={{ color: '#475569', fontSize: 16, lineHeight: 1.8, marginBottom: 40, fontWeight: 500 }}>
                Stop parsing through unqualified resumes. Our specialized ATS engine algorithmically enforces requirements by cross-referencing semantic meaning—saving massive pipelines of time and entirely removing manual hiring bias.
              </p>
              <Link to="/register" style={{ 
                display: 'inline-flex', alignItems: 'center', gap: 10,
                borderRadius: '16px', padding: '16px 32px', fontSize: 16, fontWeight: 700,
                background: '#0f172a', textDecoration: 'none', color: '#fff',
                transition: 'all 0.3s', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.2)'
              }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                Create an Account →
              </Link>
            </div>
            
            <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                ['01', 'Browse & Execute', 'Students explore listings and confidently apply within their parameters.', '#3b82f6'],
                ['02', 'ATS File Extraction', 'Upload resumes directly to the platform. Our engine processes text, layout, and dense keywords.', '#8b5cf6'],
                ['03', 'Gatekeeper Filtering', 'AI checks strictly against the specified threshold value. Exceed limits to instantly pass through to HR.', '#10b981'],
                ['04', 'HR Review & Select', 'Review only perfectly vetted lists of candidates. Trigger automated notification emails natively with just one click.', '#f59e0b'],
              ].map(([num, title, desc, color]) => (
                <div key={num} style={{ 
                  background: '#fff', borderRadius: '24px', padding: '32px',
                  border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 15px 40px rgba(0,0,0,0.03)',
                  display: 'flex', gap: 24, transition: 'transform 0.3s'
                }} onMouseEnter={e => e.currentTarget.style.transform = 'translateX(8px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}>
                  <div style={{ 
                    fontSize: 24, fontWeight: 700, color, background: `${color}15`,
                    width: 64, height: 64, flexShrink: 0, borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {num}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 6, margin: 0 }}>{title}</h3>
                    <p style={{ color: '#64748b', margin: '4px 0 0', lineHeight: 1.6, fontSize: 14 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Premium CTA Banner ── */}
      <section style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', padding: '100px 40px', color: '#fff', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />
        
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#fff', marginBottom: 20, letterSpacing: '-1px' }}>
            Ready to discover what's possible?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, marginBottom: 48, lineHeight: 1.7, fontWeight: 500 }}>
            Upload, verify, and match against thousands of roles. Our platform secures the optimal connection for your career goals.
          </p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/jobs" style={{ 
              background: '#fff', color: '#4f46e5', padding: '18px 40px', borderRadius: '16px', 
              fontSize: 16, fontWeight: 700, textDecoration: 'none', transition: 'transform 0.2s', boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
            }} onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.target.style.transform = 'translateY(0)'}>
              Discover Jobs
            </Link>
            <Link to="/register" style={{ 
              background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '18px 40px', borderRadius: '16px', 
              border: '1px solid rgba(255,255,255,0.2)', fontSize: 16, fontWeight: 700, textDecoration: 'none',
              transition: 'background 0.2s'
            }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}>
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
