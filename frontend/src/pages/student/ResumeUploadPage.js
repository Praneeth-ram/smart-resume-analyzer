import React, { useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { uploadResume } from '../../api';
import { toast } from 'react-toastify';

function ScoreRing({ score, passed }) {
  const r = 70; const cx = 80; const cy = 80;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = passed ? 'var(--accent-green)' : 'var(--danger)';

  return (
    <div className="score-ring-wrap" style={{ width: 160, height: 160 }}>
      <svg className="score-ring-svg" viewBox="0 0 160 160">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border-gray)" strokeWidth="10" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="butt" style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' }} />
      </svg>
      <div className="score-ring-inner">
        <div className="score-ring-number" style={{ color }}>{score.toFixed(0)}%</div>
        <div className="score-ring-label">ATS Score</div>
      </div>
    </div>
  );
}

function ATSResult({ result, onBack }) {
  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-inner">
          <h1>ATS Score <span className="page-header-accent">Result</span></h1>
          <p>Your resume has been analyzed against the job description</p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px 80px' }}>
        <div className="grid-2" style={{ gap: 40, alignItems: 'start' }}>
          {/* Score Panel */}
          <div>
            <div className="card" style={{ textAlign: 'center', padding: '48px 32px', marginBottom: 20 }}>
              <ScoreRing score={result.ats_score} passed={result.passed} />
              <div style={{ marginTop: 24 }}>
                {result.passed ? (
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent-green)', marginBottom: 8 }}>✅ You Passed!</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
                      Your resume exceeded the {result.threshold}% threshold and has been forwarded to HR.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--danger)', marginBottom: 8 }}>Below Threshold</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
                      Your score of {result.ats_score.toFixed(1)}% is below the required {result.threshold}%.
                    </p>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>
                  <span>Your Score: {result.ats_score.toFixed(1)}%</span>
                  <span>Threshold: {result.threshold}%</span>
                </div>
                <div className="progress-bar" style={{ height: 8, position: 'relative' }}>
                  <div className={`progress-fill ${result.passed ? 'progress-green' : 'progress-danger'}`}
                    style={{ width: `${result.ats_score}%` }} />
                  {/* Threshold marker */}
                  <div style={{
                    position: 'absolute', top: -4, bottom: -4, left: `${result.threshold}%`,
                    width: 2, background: 'var(--warning)',
                  }} />
                </div>
              </div>
            </div>

            <div className={`alert ${result.passed ? 'alert-success' : 'alert-warning'}`} style={{ fontSize: 14, lineHeight: 1.6 }}>
              💡 {result.feedback}
            </div>
          </div>

          {/* Skills breakdown */}
          <div>
            <div className="card card-accented" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--accent-green)' }}>✅</span>
                Matched Skills ({result.matched_skills.length})
              </h3>
              {result.matched_skills.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No skills matched from the required list.</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {result.matched_skills.map(s => (
                    <span key={s} className="skill-tag matched">{s}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--danger)', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--danger)' }}>❌</span>
                Missing Skills ({result.missing_skills.length})
              </h3>
              {result.missing_skills.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>All required skills are present!</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {result.missing_skills.map(s => (
                    <span key={s} className="skill-tag missing">{s}</span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/jobs" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Browse More Jobs</Link>
              <Link to="/my-applications" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>My Applications</Link>
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
      toast.success('Resume analyzed!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.');
    } finally { setUploading(false); }
  };

  if (result) return <ATSResult result={result} onBack={() => setResult(null)} />;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-inner">
          <div className="breadcrumb">
            <Link to="/jobs">Careers</Link>
            <span className="breadcrumb-sep">›</span>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>Upload Resume</span>
          </div>
          <h1>Upload Your <span className="page-header-accent">Resume</span></h1>
          <p>Step 2 of 2 — Resumes scoring 80% or above will be forwarded to HR</p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px 80px' }}>
        <div className="grid-2" style={{ gap: 48, alignItems: 'start' }}>
          {/* Upload form */}
          <div>
            {error && <div className="alert alert-error">{error}</div>}

            {/* Drop zone */}
            <div {...getRootProps()} className={`upload-zone ${isDragActive ? 'active' : ''}`} style={{ marginBottom: 20 }}>
              <input {...getInputProps()} />
              <div style={{ fontSize: 48, marginBottom: 16, opacity: file ? 1 : 0.5 }}>
                {file ? '📄' : '📤'}
              </div>
              {file ? (
                <>
                  <div className="upload-zone-title">{file.name}</div>
                  <div className="upload-zone-sub">{(file.size / 1024).toFixed(1)} KB · Click to replace</div>
                </>
              ) : (
                <>
                  <div className="upload-zone-title">
                    {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                  </div>
                  <div className="upload-zone-sub">or click to browse — PDF, DOCX, TXT accepted</div>
                </>
              )}
            </div>

            <button
              className="btn btn-primary btn-full"
              style={{ padding: '16px', fontSize: 15 }}
              onClick={handleUpload}
              disabled={!file || uploading}
            >
              {uploading ? (
                <><span className="spinner spinner-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Analyzing Resume…</>
              ) : (
                <>Analyze & Get ATS Score →</>
              )}
            </button>

            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, marginTop: 12 }}>
              Your resume is only saved to HR's Drive if your score passes the threshold
            </p>
          </div>

          {/* Info sidebar */}
          <div>
            <div className="card card-accented" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>How Scoring Works</h3>
              {[
                ['40%', 'Skill Match', 'Required skills found in your resume'],
                ['40%', 'Keyword Overlap', 'Job description keywords in your content'],
                ['20%', 'Completeness', 'Education, Experience, Skills sections'],
              ].map(([pct, title, desc]) => (
                <div key={title} style={{ display: 'flex', gap: 14, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border-gray)' }}>
                  <div style={{
                    background: 'var(--purple)', color: '#fff', width: 44, height: 44,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800, flexShrink: 0,
                  }}>{pct}</div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--off-black)', padding: '24px', color: '#fff' }}>
              <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>✅ Tips for a Higher Score</div>
              {[
                'Mirror keywords directly from the job description',
                'List all required skills explicitly in a Skills section',
                'Include Education and Work Experience sections',
                'Mention relevant tools and technologies by name',
              ].map(tip => (
                <div key={tip} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
                  <span style={{ color: 'var(--purple-light)', fontWeight: 700 }}>›</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
