import React, { useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { uploadResume } from '../../api';
import { toast } from 'react-toastify';

const fontFamily = "'Söhne', 'Inter', sans-serif";

function ScoreRing({ score, passed }) {
  const r = 70; const cx = 80; const cy = 80;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = passed ? '#10b981' : '#ef4444';

  return (
    <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto' }}>
      <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="12" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 36, fontWeight: 900, color, lineHeight: 1 }}>{score.toFixed(0)}%</div>
        <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#64748b', marginTop: 4 }}>Match</div>
      </div>
    </div>
  );
}

function ATSResult({ result, onBack }) {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily, paddingBottom: 80, overflowX: 'hidden' }}>
      <div style={{ 
        position: 'relative', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '50px 40px 90px', overflow: 'hidden'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center', color: '#fff' }}>
          <div className="animate-in">
            <h1 style={{ fontSize: window.innerWidth < 768 ? 32 : 44, fontWeight: 900, marginBottom: 16 }}>
              AI Parsing <span style={{ color: result.passed ? '#34d399' : '#f87171' }}>Result</span>
            </h1>
            <p style={{ fontSize: 16, color: '#cbd5e1', margin: 0 }}>Review how your resume stands against the role requirements.</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '-40px auto 0', padding: '0 40px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'start' }}>
          
          {/* Score Panel */}
          <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column' }}>
            <div className="animate-in" style={{
              background: '#fff', borderRadius: '24px', padding: '48px 32px', textAlign: 'center',
              border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)', marginBottom: 24
            }}>
              <ScoreRing score={result.ats_score} passed={result.passed} />
              <div style={{ marginTop: 32 }}>
                {result.passed ? (
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#10b981', marginBottom: 10 }}>✅ Outstanding! You Passed.</div>
                    <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.6, margin: '0 auto', maxWidth: 350 }}>
                      Your resume has been forwarded directly to HR. Sit tight—you exceeded the strict <strong>{result.threshold}%</strong> cutoff threshold.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#ef4444', marginBottom: 10 }}>⛔ Below Threshold</div>
                    <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.6, margin: '0 auto', maxWidth: 350 }}>
                      Your resume score was <strong>{result.ats_score.toFixed(1)}%</strong> which is below the strictly required <strong>{result.threshold}%</strong> limit. Review the missing skill gaps carefully.
                    </p>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: 40 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 800, color: '#64748b', marginBottom: 12 }}>
                  <span>Your Score: {result.ats_score.toFixed(1)}%</span>
                  <span>Target: {result.threshold}%</span>
                </div>
                <div style={{ height: 10, background: '#f1f5f9', borderRadius: 5, overflow: 'visible', position: 'relative' }}>
                  <div style={{ 
                    position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: 5,
                    background: result.passed ? 'linear-gradient(90deg, #34d399 0%, #10b981 100%)' : 'linear-gradient(90deg, #fca5a5 0%, #ef4444 100%)',
                    width: `${result.ats_score}%`, transition: 'width 1s cubic-bezier(0.4,0,0.2,1)'
                  }} />
                  <div style={{
                    position: 'absolute', top: -6, bottom: -6, left: `${result.threshold}%`,
                    width: 3, background: '#0f172a', borderRadius: 2
                  }} />
                </div>
              </div>
            </div>

            <div className="animate-in" style={{
              background: result.passed ? '#ecfdf5' : '#fef2f2', border: `1px solid ${result.passed ? '#a7f3d0' : '#fecaca'}`,
              padding: '24px', borderRadius: '16px', color: result.passed ? '#065f46' : '#991b1b',
              fontSize: 15, lineHeight: 1.6, fontWeight: 500, animationDelay: '0.1s'
            }}>
              💡 {result.feedback}
            </div>
          </div>

          {/* Breakdown Sidebar */}
          <div style={{ flex: '1 1 350px' }}>
            <div style={{ position: 'sticky', top: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              <div className="animate-in" style={{
                background: '#fff', borderRadius: '24px', padding: '32px',
                border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
                borderLeft: '4px solid #10b981', animationDelay: '0.2s'
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 20 }}>✅ Matched Skills ({result.matched_skills.length})</h3>
                {result.matched_skills.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: 14 }}>No skills matched from the required list.</p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {result.matched_skills.map(s => (
                      <span key={s} style={{ background: '#ecfdf5', color: '#059669', padding: '6px 14px', borderRadius: '12px', fontSize: 13, fontWeight: 700 }}>{s}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="animate-in" style={{
                background: '#fff', borderRadius: '24px', padding: '32px',
                border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
                borderLeft: '4px solid #ef4444', animationDelay: '0.3s'
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 20 }}>❌ Missing Skills ({result.missing_skills.length})</h3>
                {result.missing_skills.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: 14 }}>Wow! You hit every single critical requirement.</p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {result.missing_skills.map(s => (
                      <span key={s} style={{ background: '#fef2f2', color: '#dc2626', padding: '6px 14px', borderRadius: '12px', fontSize: 13, fontWeight: 700 }}>{s}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="animate-in" style={{ display: 'flex', gap: 16, animationDelay: '0.4s' }}>
                <Link to="/jobs" style={{ 
                  flex: 1, textAlign: 'center', padding: '16px', borderRadius: '16px', fontSize: 15, fontWeight: 800,
                  background: '#f1f5f9', color: '#0f172a', textDecoration: 'none', transition: 'background 0.2s'
                }} onMouseEnter={e => e.target.style.background = '#e2e8f0'} onMouseLeave={e => e.target.style.background = '#f1f5f9'}>
                  Browse Core Jobs
                </Link>
                <Link to="/my-applications" style={{ 
                  flex: 1, textAlign: 'center', padding: '16px', borderRadius: '16px', fontSize: 15, fontWeight: 800,
                  background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', color: '#fff', textDecoration: 'none',
                  boxShadow: '0 10px 25px rgba(124, 58, 237, 0.3)', transition: 'transform 0.2s'
                }} onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.target.style.transform = 'translateY(0)'}>
                  My Applications
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResumeUploadPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const onDrop = useCallback((accepted) => { if (accepted.length > 0) setFile(accepted[0]); }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'text/plain': ['.txt'] },
    maxFiles: 1, disabled: !!result,
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true); setError('');
    try {
      const res = await uploadResume(applicationId, file);
      setResult(res.data);
      toast.success('Resume intensely analyzed!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again or verify file formats.');
    } finally { setUploading(false); }
  };

  if (result) return <ATSResult result={result} onBack={() => setResult(null)} />;

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
              <span style={{ color: '#0f172a' }}>Job App</span>
              <span>/</span>
              <span style={{ color: '#0f172a' }}>Upload</span>
            </div>
            
            <h1 style={{ fontSize: window.innerWidth < 768 ? 32 : 44, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', marginBottom: 16 }}>
              Upload Your <span style={{ 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>Resume</span>
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
               <div style={{ position: 'relative', height: 8, width: 200, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '100%', background: '#10b981', borderRadius: 4 }} />
               </div>
               <span style={{ fontSize: 14, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5 }}>Step 2 of 2</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '-40px auto 0', padding: '0 40px', position: 'relative', zIndex: 10 }}>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'start' }}>
          
          {/* Main Upload Column */}
          <div style={{ flex: '1 1 700px', display: 'flex', flexDirection: 'column' }}>
            
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
              marginBottom: 32, animationDelay: '0.1s'
            }}>
              
              {/* Drop zone */}
              <div {...getRootProps()} style={{ 
                border: `3px dashed ${isDragActive ? '#10b981' : '#e2e8f0'}`, 
                background: isDragActive ? '#f0fdf4' : '#f8fafc',
                padding: '60px 32px', textAlign: 'center', borderRadius: '20px', cursor: 'pointer',
                transition: 'all 0.3s', marginBottom: 32 
              }}>
                <input {...getInputProps()} />
                <div style={{ fontSize: 64, marginBottom: 24, opacity: file ? 1 : 0.5, transition: 'all 0.3s', transform: isDragActive ? 'scale(1.1)' : 'scale(1)' }}>
                  {file ? '📄' : '📤'}
                </div>
                {file ? (
                  <>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{file.name}</div>
                    <div style={{ fontSize: 14, color: '#64748b' }}>{(file.size / 1024).toFixed(1)} KB • Click or drag to replace</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
                      {isDragActive ? 'Release to drop your resume!' : 'Drag & drop your resume here'}
                    </div>
                    <div style={{ fontSize: 14, color: '#64748b' }}>or click to browse local files — PDF, DOCX, TXT completely supported</div>
                  </>
                )}
              </div>

              <button disabled={!file || uploading} onClick={handleUpload} style={{ 
                width: '100%', borderRadius: '16px', padding: '18px', fontSize: 18, fontWeight: 800,
                background: (!file || uploading) ? '#e2e8f0' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                border: 'none', color: (!file || uploading) ? '#94a3b8' : '#fff',
                cursor: (!file || uploading) ? 'not-allowed' : 'pointer', transition: 'all 0.3s',
                boxShadow: (!file || uploading) ? 'none' : '0 10px 25px rgba(16, 185, 129, 0.3)'
              }} onMouseEnter={e => { if(file && !uploading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(16, 185, 129, 0.4)'; } }} 
                 onMouseLeave={e => { if(file && !uploading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.3)'; } }}>
                {uploading ? 'Analyzing Resume...' : 'Analyze & Secure ATS Score →'}
              </button>
              
              <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, marginTop: 20, fontWeight: 600 }}>
                🔒 Your resume is securely evaluated and only shared with HR upon clearing the cutoff threshold.
              </div>
            </div>
          </div>

          {/* Guidelines Sidebar */}
          <div style={{ flex: '1 1 350px' }}>
            <div style={{ position: 'sticky', top: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              <div className="animate-in" style={{
                background: '#fff', borderRadius: '24px', padding: '32px',
                border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
                animationDelay: '0.2s'
              }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>How Scoring Works</h3>
                
                {[
                  ['40%', 'Skill Match', 'Checks explicitly requested technologies and skills against your summary and entries.'],
                  ['40%', 'Keyword Overlap', 'Calculates algorithmic semantic overlap across the overall job description.'],
                  ['20%', 'Completeness', 'Validates that Education, Work Experience, and Context metadata is present.'],
                ].map(([pct, title, desc]) => (
                  <div key={title} style={{ display: 'flex', gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{
                      background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', width: 48, height: 48, borderRadius: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, flexShrink: 0
                    }}>{pct}</div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{title}</div>
                      <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="animate-in" style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff',
                padding: '32px', borderRadius: '24px', boxShadow: '0 15px 30px rgba(15, 23, 42, 0.2)',
                position: 'relative', overflow: 'hidden', animationDelay: '0.3s'
              }}>
                <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 120, height: 120, background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)', borderRadius: '50%' }}/>
                
                <h3 style={{ fontWeight: 800, marginBottom: 16, fontSize: 18, color: '#fff', position: 'relative' }}>💡 Tips for a Higher Score</h3>
                {[
                  'Ensure your PDF has selectable text (not an image scan)',
                  'Mirror technical keywords exactly directly from the description',
                  'Include an explicit Skills section so they are instantly identified',
                  'Follow standard resume formatting',
                ].map(tip => (
                  <div key={tip} style={{ display: 'flex', gap: 12, fontSize: 13, color: '#cbd5e1', marginBottom: 12, lineHeight: 1.6, position: 'relative' }}>
                    <span style={{ color: '#10b981', fontWeight: 900, fontSize: 16 }}>›</span>
                    {tip}
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
