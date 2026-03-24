import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const AREAS = [
  { icon: '💻', title: 'Technology', desc: 'Cloud, AI, Cybersecurity, Engineering' },
  { icon: '📊', title: 'Data & AI', desc: 'Analytics, Machine Learning, BI' },
  { icon: '🎯', title: 'Strategy', desc: 'Consulting, Business Analysis' },
  { icon: '⚙️', title: 'Operations', desc: 'Supply Chain, Finance, HR' },
  { icon: '🎨', title: 'Design', desc: 'UX/UI, Creative, Digital' },
  { icon: '🔒', title: 'Security', desc: 'InfoSec, Risk, Compliance' },
];

const STATS = [
  { value: '2.1s', label: 'Resume Analysis Time' },
  { value: '80%', label: 'Default ATS Threshold' },
  { value: '100%', label: 'Automated Screening' },
  { value: '3-Step', label: 'Hiring Process' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{
        background: 'var(--off-black)',
        minHeight: '88vh',
        display: 'flex', alignItems: 'center',
        padding: '80px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        {/* Purple accent blob */}
        <div style={{
          position: 'absolute', right: '-80px', top: '50%', transform: 'translateY(-50%)',
          width: '520px', height: '520px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123,45,139,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 720 }} className="animate-in">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'rgba(123,45,139,0.2)', border: '1px solid rgba(123,45,139,0.4)',
              padding: '6px 16px', marginBottom: 32,
            }}>
              <span style={{ width: 8, height: 8, background: 'var(--purple-light)', borderRadius: '50%', display: 'inline-block' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--purple-light)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                AI-Powered Hiring Platform
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(40px,5.5vw,76px)', fontWeight: 800, color: '#fff', lineHeight: 1.08, marginBottom: 28 }}>
              Hire the Right<br />
              <span style={{ color: 'var(--purple-light)' }}>Talent, Faster.</span>
            </h1>

            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.62)', lineHeight: 1.75, maxWidth: 540, marginBottom: 44 }}>
              Smart Resume Analyzer uses ATS scoring to automatically evaluate
              resumes against job descriptions — so the best candidates rise to the top.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/jobs')}>
                Search Jobs
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => navigate('/register')}>
                Post a Job
              </button>
            </div>
          </div>

          {/* Stat bar */}
          <div style={{
            display: 'flex', gap: 0, marginTop: 72,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: 40, flexWrap: 'wrap',
          }} className="animate-in2">
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                flex: '1 1 160px', paddingRight: 40,
                borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                marginRight: 40,
              }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--purple-light)', fontFamily: 'Outfit' }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Career Areas ── */}
      <section style={{ padding: '80px 40px', background: 'var(--bg-offwhite)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--purple)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>Explore Opportunities</p>
            <h2 style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: 800 }}>Career Areas</h2>
          </div>
          <div className="grid-3" style={{ gap: 1, background: 'var(--border-gray)', border: '1px solid var(--border-gray)' }}>
            {AREAS.map((area) => (
              <div key={area.title} onClick={() => navigate('/jobs')}
                style={{
                  background: '#fff', padding: '32px 28px', cursor: 'pointer',
                  transition: 'var(--transition)',
                  borderBottom: '3px solid transparent',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderBottomColor = 'var(--purple)'; e.currentTarget.style.background = 'var(--bg-light)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderBottomColor = 'transparent'; e.currentTarget.style.background = '#fff'; }}
              >
                <div style={{ fontSize: 32, marginBottom: 14 }}>{area.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{area.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{area.desc}</div>
                <div style={{ marginTop: 16, fontSize: 13, fontWeight: 700, color: 'var(--purple)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  View Jobs
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: '80px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="grid-2" style={{ gap: 80, alignItems: 'start' }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--purple)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>The Process</p>
              <h2 style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: 800, marginBottom: 16 }}>How Hiring Works</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
                Our ATS engine evaluates every resume against the exact requirements of the role —
                saving time, removing bias, and ensuring the best-fit candidates move forward.
              </p>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </div>
            <div>
              {[
                ['01', 'Browse & Apply', 'Students explore active job listings and apply with their basic details.'],
                ['02', 'ATS Resume Scoring', 'Upload your resume. Our engine instantly scores it against the JD — skills, keywords, completeness.'],
                ['03', 'Threshold Filter', 'Only resumes above the set threshold (default 80%) pass to HR. Failed ones receive improvement tips.'],
                ['04', 'HR Review & Selection', 'HR sees only qualified resumes. Select candidates with one click — and an email goes out automatically.'],
              ].map(([num, title, desc]) => (
                <div key={num} className="how-step">
                  <div className="how-step-num">{num}</div>
                  <div>
                    <div className="how-step-title">{title}</div>
                    <div className="how-step-desc">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ background: 'var(--purple)', padding: '64px 40px', color: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            Ready to find your next opportunity?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, marginBottom: 36, lineHeight: 1.7 }}>
            Search thousands of jobs and get instant AI-powered feedback on your resume — for free.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/jobs" className="btn btn-secondary btn-lg" style={{ background: '#fff', color: 'var(--purple)', borderColor: '#fff' }}>Search Jobs</Link>
            <Link to="/register" className="btn btn-ghost btn-lg">Create Account</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
