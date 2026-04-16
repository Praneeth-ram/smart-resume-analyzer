import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHRDashboard } from '../../api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';
import { toast } from 'react-toastify';

const fontFamily = "'Söhne', 'Inter', sans-serif";

const StatCard = ({ icon, color, label, value, delay }) => (
  <div className="animate-in" style={{
    animationDelay: delay,
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '24px',
    padding: '28px',
    boxShadow: `0 4px 24px ${color}15, inset 0 0 0 1.5px ${color}10`,
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    position: 'relative',
    overflow: 'hidden'
  }} onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
    e.currentTarget.style.boxShadow = `0 20px 40px ${color}25, inset 0 0 0 2px ${color}30`;
    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
  }} onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0) scale(1)';
    e.currentTarget.style.boxShadow = `0 4px 24px ${color}15, inset 0 0 0 1.5px ${color}10`;
    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
  }}>
    <div style={{
      position: 'absolute', top: '-20px', right: '-20px',
      width: '120px', height: '120px',
      background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
      borderRadius: '50%'
    }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
      <div style={{
        width: 56, height: 56, borderRadius: '18px',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, color: color,
        boxShadow: `inset 0 2px 4px ${color}10`
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
          {label}
        </div>
      </div>
    </div>
    <div>
      <div style={{ 
        fontSize: 42, 
        fontWeight: 800, 
        color: '#0f172a',
        background: `linear-gradient(135deg, #0f172a 0%, ${color} 100%)`,
        backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        lineHeight: 1
      }}>
        {value}
      </div>
    </div>
  </div>
);

const ActionCard = ({ icon, color, title, desc, action, cta, delay }) => (
  <div className="animate-in" style={{
    animationDelay: delay,
    background: '#ffffff',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
    border: `1px solid rgba(0,0,0,0.04)`,
    transition: 'all 0.3s ease',
    display: 'flex', flexDirection: 'column',
    position: 'relative', overflow: 'hidden'
  }} onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = `0 20px 40px ${color}15`;
    e.currentTarget.style.transform = 'translateY(-6px)';
    e.currentTarget.style.borderColor = `${color}30`;
  }} onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)';
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.borderColor = `rgba(0,0,0,0.04)`;
  }}>
    <div style={{
      width: 60, height: 60, borderRadius: '16px',
      background: `linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 28, color: color, marginBottom: 24
    }}>
      {icon}
    </div>
    <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, color: '#0f172a' }}>{title}</h3>
    <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6, marginBottom: 32, flex: 1 }}>{desc}</p>
    <button onClick={action} style={{ 
      width: '100%', borderRadius: '14px', fontWeight: 700, fontSize: 15, padding: '16px 20px',
      border: 'none', background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
      color: '#fff', cursor: 'pointer', transition: 'all 0.3s ease',
      boxShadow: `0 8px 20px ${color}40`
    }} onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = `0 12px 28px ${color}50`;
    }} onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = `0 8px 20px ${color}40`;
    }}>
      {cta}
    </button>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)',
        padding: '16px', border: '1px solid rgba(226, 232, 240, 0.8)', borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#64748b', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</p>
        <p style={{ margin: 0, fontWeight: 800, color: payload[0].payload.color, fontSize: 22 }}>
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function HRDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { 
    getHRDashboard().then(r => setData(r.data)).finally(() => setLoading(false)); 
  }, []);

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div className="spinner" style={{ width: 48, height: 48, borderTopColor: '#7c3aed' }}></div>
    </div>
  );

  const pipelineData = [
    { name: 'Total Applications', value: data?.total_applications || 0, color: '#3b82f6' },
    { name: 'ATS Passed', value: data?.ats_passed || 0, color: '#10b981' },
    { name: 'Selected', value: data?.selected || 0, color: '#f59e0b' },
  ];

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 32 }}>
            <div className="animate-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ 
                  padding: '6px 14px', background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', 
                  borderRadius: '20px', fontSize: 13, fontWeight: 800, letterSpacing: 0.8,
                  border: '1px solid rgba(124, 58, 237, 0.15)'
                }}>
                  HR WORKSPACE
                </span>
                <span style={{ fontSize: 15, color: '#64748b', fontWeight: 600 }}>{data?.company_name}</span>
              </div>
              <h1 style={{ fontSize: window.innerWidth < 768 ? 36 : 48, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', marginBottom: 12, lineHeight: 1.1 }}>
                Welcome back,{" "}
                <span style={{ 
                  background: 'linear-gradient(135deg, #7c3aed 0%, #0ea5e9 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>
                  {data?.hr_name?.split(' ')[0]}
                </span>
              </h1>
              <p style={{ fontSize: 16, color: '#64748b', maxWidth: 500, lineHeight: 1.6, margin: 0 }}>
                Here is your overview of job postings, candidates, and AI screening performance today.
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

      {/* Main Content Dashboard */}
      <div style={{ maxWidth: 1280, margin: '-45px auto 0', padding: '0 40px', position: 'relative', zIndex: 10 }}>
        
        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: 24, marginBottom: 56 
        }}>
          <StatCard icon="💼" color="#8b5cf6" label="Total Jobs" value={data?.total_jobs ?? 0} delay="0.1s" />
          <StatCard icon="🟢" color="#10b981" label="Active Listings" value={data?.active_jobs ?? 0} delay="0.2s" />
          <StatCard icon="📄" color="#3b82f6" label="Applications" value={data?.total_applications ?? 0} delay="0.3s" />
          <StatCard icon="✨" color="#f59e0b" label="ATS Passed" value={data?.ats_passed ?? 0} delay="0.4s" />
        </div>

        {/* Dash Grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'stretch' }}>
          
          {/* Main Column */}
          <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column' }}>
            
            {/* Pipeline Chart */}
            <div className="animate-in" style={{ 
              background: '#fff', borderRadius: '24px', padding: '36px',
              border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
              animationDelay: '0.3s', flex: 1, display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ marginBottom: 36 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Candidate Flow</h2>
                <p style={{ fontSize: 15, color: '#64748b', margin: 0 }}>Visual mapping of the candidate screening pipeline.</p>
              </div>
              
              <div style={{ width: '100%', flex: 1, minHeight: 340 }}>
                <ResponsiveContainer>
                  <BarChart data={pipelineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" axisLine={false} tickLine={false} 
                      tick={{ fill: '#0f172a', fontSize: 14, fontWeight: 700 }} dy={8} 
                    />
                    <YAxis 
                      axisLine={false} tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 13 }} 
                    />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]} maxBarSize={65}>
                      {pipelineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 24, justifyContent: 'space-between' }}>
            
            {/* Support Widget */}
            <div className="animate-in" style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              borderRadius: '24px', padding: '36px',
              color: '#fff', position: 'relative', overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
              border: '1px solid rgba(255,255,255,0.05)',
              animationDelay: '0.4s'
            }}>
              <div style={{
                position: 'absolute', top: '-20%', right: '-20%',
                width: 200, height: 200,
                background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)',
                borderRadius: '50%'
              }}/>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, position: 'relative', color: '#ffffff' }}>AI Screening</h3>
              <p style={{ fontSize: 14, color: '#ffffff', lineHeight: 1.6, margin: '0 0 24px 0', position: 'relative' }}>
                Our system dynamically screens resumes focusing on keyword overlaps and experience thresholds. Check your Active Jobs to tweak criteria.
              </p>
              <button onClick={() => navigate('/hr/jobs')} style={{
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', borderRadius: '12px', padding: '12px 20px',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s', width: '100%', position: 'relative',
                backdropFilter: 'blur(10px)'
              }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                 onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
                Explore Active Jobs
              </button>
            </div>

            {/* Selection Rate Donut */}
            <div className="animate-in" style={{
              background: '#fff', borderRadius: '24px', padding: '36px',
              border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
              animationDelay: '0.5s', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
              <div style={{ fontSize: 13, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24 }}>
                Hire Rate
              </div>
              
              <div style={{ position: 'relative', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="70" cy="70" r="60" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                  <circle cx="70" cy="70" r="60" fill="none" stroke="#10b981" strokeWidth="12" 
                    strokeDasharray="377" strokeDashoffset={
                      377 - (377 * (data?.total_applications ? ((data.selected || 0) / data.total_applications) : 0))
                    } strokeLinecap="round" 
                    style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                </svg>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column'
                }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: '#0f172a' }}>
                    {data?.total_applications ? Math.round(((data.selected || 0) / data.total_applications) * 100) : 0}%
                  </span>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>Selected</span>
                </div>
              </div>
            </div>
            
          </div>

        </div>

        {/* Quick Actions Title moved outside fully */}
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            <ActionCard 
              icon="📝" color="#8b5cf6"
              title="Create Job Posting" 
              desc="Draft a new opening & setup AI-powered ATS screening." 
              action={() => navigate('/hr/jobs/new')} 
              cta="Post New Job" 
              delay="0.3s"
            />
            <ActionCard 
              icon="👥" color="#0ea5e9"
              title="Review Candidates" 
              desc="Browse and manage top-matched candidates across all jobs." 
              action={() => navigate('/hr/jobs')} 
              cta="View Candidates" 
              delay="0.4s"
            />
            <ActionCard 
              icon="📊" color="#10b981"
              title="Reports & Analytics" 
              desc="Generate insights on your pipeline and ATS performance." 
              action={() => navigate('/hr/analytics')} 
              cta="View Analytics" 
              delay="0.5s"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
