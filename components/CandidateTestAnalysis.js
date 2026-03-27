// components/CandidateTestAnalysis.js
// HR Dashboard: view jobs, applicants, and full test reports
// Usage: <CandidateTestAnalysis hrEmail="hr@company.com" />

import { Box, Building, CheckSquare, Eye, Filter, Layers2, Layers3, Loader2, LucideLogOut, Mail, Pin, ScanLine, Settings2, Target, UserCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8002";

// ── Helpers ──────────────────────────────────────────────────
function ScoreRing({ value, color, label, size = 80 }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (value / 100) * circ;
  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0f0f0" strokeWidth={7}/>
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={7}
          strokeDasharray={`${filled} ${circ - filled}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
        <text x={size/2} y={size/2+5} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>
          {value}%
        </text>
      </svg>
      <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function Badge({ text, color, bg }) {
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 20, fontSize: 11,
      fontWeight: 700, letterSpacing: 0.5,
      background: bg, color,
    }}>
      {text}
    </span>
  );
}

function RecommendationBadge({ rec }) {
  const map = {
    great_fit: { text: "⭐ Great Fit", color: "#15173D", bg: "#d1fae5" },
    good_fit: { text: "👍 Good Fit", color: "#1e40af", bg: "#dbeafe" },
    not_a_fit: { text: "✕ Not a Fit", color: "#7f1d1d", bg: "#fee2e2" },
  };
  const m = map[rec] || { text: "Pending", color: "#555", bg: "#f0f0f0" };
  return <Badge text={m.text} color={m.color} bg={m.bg} />;
}

function StatusBadge({ status }) {
  const map = {
    pending: { text: "Pending", color: "#92400e", bg: "#fef3c7" },
    in_progress: { text: "In Progress", color: "#1e40af", bg: "#dbeafe" },
    completed: { text: "Completed", color: "#15173D", bg: "#d1fae5" },
  };
  const m = map[status] || { text: status, color: "#555", bg: "#f0f0f0" };
  return <Badge text={m.text} color={m.color} bg={m.bg} />;
}

function TimeBar({ seconds, max }) {
  const pct = Math.min((seconds / max) * 100, 100);
  const color = seconds <= 10 ? "#10b981" : seconds <= 20 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "#f0f0f0", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.5s" }}/>
      </div>
      <span style={{ fontSize: 11, color: "#15173D", minWidth: 32 }}>{seconds}s</span>
    </div>
  );
}

// ── REPORT MODAL ─────────────────────────────────────────────
function ReportModal({ testId, hrEmail, onClose }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/hr/report/${testId}?hr_email=${encodeURIComponent(hrEmail)}`)
      .then(r => r.json())
      .then(d => { setReport(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [testId, hrEmail]);

  if (loading) return (
    <ModalShell onClose={onClose}>
      <div style={{ textAlign: "center", padding: 48, color: "#888" }}>Loading report…</div>
    </ModalShell>
  );
  if (!report) return (
    <ModalShell onClose={onClose}>
      <div style={{ textAlign: "center", padding: 48, color: "#c00" }}>Failed to load report.</div>
    </ModalShell>
  );

  const { test, analysis, responses } = report;
  const typeLabel = { aptitude: "APT", grammar: "GRM", coding: "COD" };
  const typeColor = { aptitude: "#7c3aed", grammar: "#0891b2", coding: "#059669" };

  // Psychometric scoring (derived from test data)
  const psychScores = computePsychometric(test, analysis, responses);

  return (
    <ModalShell onClose={onClose} wide>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 4 }}>
            {test.applicant_name}
          </h2>
          <p style={{ fontSize: 13, color: "#888" }}>
            {test.applicant_email} · {test.job_title} at {test.company_name}
          </p>
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <StatusBadge status={test.status} />
            {analysis && <RecommendationBadge rec={analysis.recommendation} />}
          </div>
        </div>
        {analysis && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: scoreColor(analysis.overall_score) }}>
              {analysis.overall_score}%
            </div>
            <div style={{ fontSize: 11, color: "#15173D" }}>Overall Score</div>
          </div>
        )}
      </div>

      {/* Score rings */}
      {analysis && (
        <div style={{
          display: "flex", gap: 20, justifyContent: "center",
          padding: "20px 0", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0",
          marginBottom: 28, flexWrap: "wrap",
        }}>
          <ScoreRing value={analysis.aptitude_score} color="#7c3aed" label="Aptitude" />
          <ScoreRing value={analysis.grammar_score} color="#0891b2" label="Grammar" />
          <ScoreRing value={analysis.coding_score} color="#059669" label="Coding*" />
        </div>
      )}

      {/* Performance metrics */}
      {analysis && (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12, marginBottom: 28,
        }}>
          {[
            { label: "Avg Time / Question", value: `${analysis.avg_time_per_question}s` },
            { label: "Total Time", value: `${Math.round(analysis.total_time_seconds / 60)}m ${analysis.total_time_seconds % 60}s` },
            { label: "Tab Switches", value: test.tab_switches, warn: test.tab_switches > 0 },
            { label: "Fullscreen Exits", value: test.fullscreen_exits, warn: test.fullscreen_exits > 0 },
          ].map(m => (
            <div key={m.label} style={{
              padding: "12px 16px", background: m.warn ? "#fff5f5" : "#f9f9f9",
              borderRadius: 10, border: `1px solid ${m.warn ? "#fecaca" : "#eee"}`,
            }}>
              <div style={{ fontSize: 11, color: "#15173D", marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: m.warn ? "#dc2626" : "#111" }}>{m.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Psychometric scores */}
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#333", marginBottom: 14 }}>
          Psychometric Profile
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
          {psychScores.map(ps => (
            <div key={ps.trait} style={{
              padding: "12px 14px", background: "#fafafa",
              border: "1px solid #eee", borderRadius: 10,
            }}>
              <div style={{ fontSize: 11, color: "#15173D", marginBottom: 6 }}>{ps.trait}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, height: 6, background: "#efefef", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    width: `${ps.score}%`, height: "100%", borderRadius: 3,
                    background: ps.score >= 70 ? "#10b981" : ps.score >= 45 ? "#f59e0b" : "#ef4444",
                  }}/>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#333", minWidth: 36 }}>
                  {ps.score}/100
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Psychometric notes */}
      {analysis?.psychometric_notes && (
        <div style={{
          background: "white", border: "1px solid #15173D",
          borderRadius: 10, padding: "14px 16px", marginBottom: 28,
          fontSize: 13, color: "#15173D", lineHeight: 1.6,
        }}>
          <strong>Observation:</strong> {analysis.psychometric_notes}
        </div>
      )}

      {/* Per-question breakdown */}
      {responses.length > 0 && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#333", marginBottom: 14 }}>
            Question Breakdown
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {responses.map((r, i) => (
              <div key={r.id} style={{
                display: "grid", gridTemplateColumns: "28px 50px 1fr 120px 80px",
                gap: 12, alignItems: "center",
                padding: "10px 14px", background: "#fafafa",
                border: "1px solid #eee", borderRadius: 8,
              }}>
                <span style={{ fontSize: 12, color: "#999" }}>#{i+1}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 6px",
                  borderRadius: 4, textAlign: "center",
                  background: typeColor[r.question_type] + "18",
                  color: typeColor[r.question_type],
                }}>
                  {typeLabel[r.question_type]}
                </span>
                <span style={{ fontSize: 12, color: "#555", fontFamily: "monospace" }}>
                  {r.question_id}
                </span>
                <TimeBar seconds={Math.round(r.time_taken_seconds || 0)} max={30} />
                <span style={{ fontSize: 16, textAlign: "center" }}>
                  {r.question_type === "coding"
                    ? "🔍"
                    : r.is_correct === true ? "✅" : r.is_correct === false ? "❌" : "—"}
                </span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "#15173D", marginTop: 10 }}>
            * Coding answers require manual HR review. Score defaulted to 50%.
          </p>
        </div>
      )}

      {/* Recommendation summary */}
      {/* {analysis && (
        <div style={{
          marginTop: 28, padding: "16px 20px",
          background: recBg(analysis.recommendation),
          border: `1px solid ${recBorder(analysis.recommendation)}`,
          borderRadius: 12, display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{ fontSize: 32 }}>{recIcon(analysis.recommendation)}</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 4 }}>
              {recTitle(analysis.recommendation)}
            </div>
            <div style={{ fontSize: 13, color: "#15173D" }}>
              {recDescription(analysis.recommendation, analysis.overall_score)}
            </div>
          </div>
        </div>
      )} */}
    </ModalShell>
  );
}

function ModalShell({ children, onClose, wide }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        zIndex: 9999, padding: 24, overflowY: "auto",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 16,
          padding: 32, width: "100%", maxWidth: wide ? 760 : 480,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          position: "relative", margin: "auto",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            border: "none", background: "#f1f1f1", borderRadius: 50,
            width: 28, height: 28, cursor: "pointer", fontSize: 14, color: "#15173D",
          }}
        >✕</button>
        {children}
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────
function scoreColor(s) {
  if (s >= 75) return "#059669";
  if (s >= 55) return "#d97706";
  return "#dc2626";
}

function recBg(rec) {
  return rec === "great_fit" ? "#f0fdf4" : rec === "good_fit" ? "#eff6ff" : "#fff5f5";
}
function recBorder(rec) {
  return rec === "great_fit" ? "#86efac" : rec === "good_fit" ? "#93c5fd" : "#fca5a5";
}
function recIcon(rec) {
  return rec === "great_fit" ? "🌟" : rec === "good_fit" ? "👍" : "❌";
}
function recTitle(rec) {
  return rec === "great_fit"
    ? "Strong Recommendation — Great Fit"
    : rec === "good_fit"
    ? "Potential Candidate — Good Fit"
    : "Below Threshold — Not a Fit";
}
function recDescription(rec, score) {
  if (rec === "great_fit")
    return `Scored ${score}% overall with strong performance. Recommend proceeding to interview.`;
  if (rec === "good_fit")
    return `Scored ${score}%. Shows potential — consider a follow-up technical interview.`;
  return `Scored ${score}%. Performance was below the required threshold for this role.`;
}

function computePsychometric(test, analysis, responses) {
  const avgTime = analysis?.avg_time_per_question || 15;
  const cheatFlag = (test.tab_switches || 0) + (test.fullscreen_exits || 0);

  // Speed index: faster → higher confidence
  const speedScore = Math.max(0, Math.min(100, Math.round(100 - (avgTime / 30) * 60)));
  // Integrity: no cheating events = 100
  const integrityScore = Math.max(0, 100 - cheatFlag * 20);
  // Logical reasoning: aptitude score proxy
  const logicalScore = Math.round(analysis?.aptitude_score || 0);
  // Communication: grammar score proxy
  const commScore = Math.round(analysis?.grammar_score || 0);
  // Technical aptitude: coding score proxy
  const techScore = Math.round(analysis?.coding_score || 0);
  // Consistency: low variance in time = steady
  const times = responses.map(r => r.time_taken_seconds || 0);
  const mean = times.reduce((a, b) => a + b, 0) / (times.length || 1);
  const variance = times.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (times.length || 1);
  const consistencyScore = Math.max(0, Math.min(100, Math.round(100 - Math.sqrt(variance) * 4)));

  return [
    { trait: "Logical Reasoning", score: logicalScore },
    { trait: "Communication", score: commScore },
    { trait: "Technical Aptitude", score: techScore },
    { trait: "Response Speed", score: speedScore },
    { trait: "Consistency", score: consistencyScore },
    { trait: "Test Integrity", score: integrityScore },
  ];
}

// ── MAIN DASHBOARD ───────────────────────────────────────────
export default function CandidateTestAnalysis({ hrEmail }) {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [tests, setTests] = useState([]);
  const [reportTestId, setReportTestId] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingTests, setLoadingTests] = useState(false);

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState({});

  useEffect(() => {
    if (!selectedJob) return;
    setLoadingTests(true);
    fetch(`${API_BASE}/api/hr/tests?hr_email=${encodeURIComponent(hrEmail)}&job_id=${selectedJob.id}`)
      .then(r => r.json())
      .then(async d => {
        const tests = d.tests || [];
        setTests(tests);
        setLoadingTests(false);

        // Fetch recommendations for completed tests
        const completed = tests.filter(t => t.status === "completed");
        const recMap = {};
        await Promise.all(
          completed.map(t =>
            fetch(`${API_BASE}/api/hr/report/${t.test_id}?hr_email=${encodeURIComponent(hrEmail)}`)
              .then(r => r.json())
              .then(data => {
                recMap[t.test_id] = data?.analysis?.recommendation || null;
              })
              .catch(() => {})
          )
        );
        setRecommendations(recMap);
      })
      .catch(() => setLoadingTests(false));
  }, [selectedJob, hrEmail]);

  const analysis = report;

  function Badge({ text, color, bg }) {
    return (
      <span style={{
        padding: "3px 10px", borderRadius: 20, fontSize: 11,
        fontWeight: 700, letterSpacing: 0.5,
        background: bg, color,
      }}>
        {text}
      </span>
    );
  }

  function RecommendationBadge({ rec }) {
    const map = {
      great_fit: { text: "⭐ Great Fit", color: "#15173D", bg: "#d1fae5" },
      good_fit: { text: "👍 Good Fit", color: "#1e40af", bg: "#dbeafe" },
      not_a_fit: { text: "✕ Not a Fit", color: "#7f1d1d", bg: "#fee2e2" },
    };
    const m = map[rec] || { text: "Pending", color: "#555", bg: "#f0f0f0" };
    return <Badge text={m.text} color={m.color} bg={m.bg} />;
  }

  // Fetch jobs
  useEffect(() => {
    if (!hrEmail) return;
    fetch(`${API_BASE}/api/hr/jobs?hr_email=${encodeURIComponent(hrEmail)}`)
      .then(r => r.json())
      .then(d => { setJobs(d.jobs || []); setLoadingJobs(false); })
      .catch(() => setLoadingJobs(false));
  }, [hrEmail]);

  // Fetch tests when job selected
  useEffect(() => {
    if (!selectedJob) return;
    setLoadingTests(true);
    fetch(`${API_BASE}/api/hr/tests?hr_email=${encodeURIComponent(hrEmail)}&job_id=${selectedJob.id}`)
      .then(r => r.json())
      .then(d => { setTests(d.tests || []); setLoadingTests(false); })
      .catch(() => setLoadingTests(false));
  }, [selectedJob, hrEmail]);

  return (
    <div className="dashboard">
      {/* Report modal */}
      {reportTestId && (
        <ReportModal
          testId={reportTestId}
          hrEmail={hrEmail}
          onClose={() => setReportTestId(null)}
        />
      )}

      {/* Jobs panel */}

        <nav className="navbar">
            <div className="nav-brand">
              <span className="full_logo">
                <span style={{fontSize: 16}}><UserCircle2 /> {hrEmail}</span>
              </span>
            </div>
            <div className="nav-user">
            <button onClick={() => {
              localStorage.removeItem('authToken');
              window.location.href = '/';
            }} className="logout-button">
              <span style={{fontSize: 13}}><LucideLogOut size={17} /> Logout</span>
            </button>
          </div>
        </nav>
        <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Lustria&family=DM+Sans:ital,opsz,wght@0,9..40,100..900;1,9..40,100..900&display=swap');


        .dashboard {
          min-height: 190vh;
          margin-top: -100px;
        }

        .navbar {
          background-color: white;
          padding: 1.85rem 1rem;
          border-bottom: 0.6px solid;
          border-color: #dfdfdf;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-brand {
          font-size: 1.5rem;
          font-weight: normal;
          color: #15173D;
        }

        .nav-user {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #15173D;
        }

        .logout-button {
          padding: 0.5rem 1rem;
          background-color: transparent;
          color: #15173D;
          border: none;
          border-radius: 40px;
          cursor: pointer;
        }

        .dashboard-main {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 1rem;
        }
      `}</style>


      <div style={{ marginBottom: 20, padding: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 30, marginTop: 23 }}>
          <Layers2 size={18} style={{marginTop: -2}} />&nbsp; Your Job Posts
        </h2>
        {loadingJobs ? (
          <div style={{ color: "#15173D", fontSize: 13 }}><Loader2 size={12} style={{marginTop: -3, marginLeft: 4}} />&nbsp;  Loading jobs…</div>
        ) : jobs.length === 0 ? (
          <div style={{ color: "#15173D", fontSize: 13 }}>No jobs found for this account.</div>
        ) : (
          <div>
            {jobs.map(job => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                style={{
                  padding: "14px 18px", borderRadius: 12, cursor: "pointer",
                  border: selectedJob?.id === job.id ? "2px solid #000" : "1px solid #e0e0e0",
                  background: selectedJob?.id === job.id ? "#f9f9f9" : "#fff",
                  transition: "all 0.15s", minWidth: 200,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}><Box size={18} style={{marginTop: -2}} />&nbsp; {job.title}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{job.company_name}</div>
                <div style={{ fontSize: 11, color: "#15173D", marginTop: 4 }}>{job.location}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tests table */}
      {selectedJob && (
        <div>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 7, padding: 20
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>
              <Filter size={18} style={{marginTop: -2, marginLeft: 4}} />&nbsp;  Applicants — {selectedJob.title}
            </h2>
            <span style={{ fontSize: 12, color: "#888" }}>{tests.length} candidates</span>
          </div>

          {loadingTests ? (
            <div style={{ color: "#15173D", fontSize: 13 }}><Loader2 size={12} style={{marginTop: -3, marginLeft: 4}} />&nbsp;  Loading candidates…</div>
          ) : tests.length === 0 ? (
            <div style={{
              padding: "32px", textAlign: "center",
              background: "#fafafa", borderRadius: 12,
              border: "1px dashed #e0e0e0", color: "#15173D", fontSize: 13,
            }}>
              No screening tests sent for this job yet.
              Use the &ldquo;Let&apos;s Connect&rdquo; button on applicant cards to send one.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Table header */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 180px 110px 100px 100px 130px",
                gap: 12, padding: "8px 16px",
                fontSize: 11, color: "#15173D", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase",
              }}>
                <span><UserCircle2 size={12} style={{marginTop: -2, marginLeft: 4}} />&nbsp;  Candidate</span>
                <span><Mail size={12} style={{marginTop: -2, marginLeft: 4}} />&nbsp;  Email</span>
                <span><CheckSquare size={12} style={{marginTop: -2, marginLeft: 4}} />&nbsp; Status</span>
                <span><Target size={12} style={{marginTop: -2, marginLeft: 4}} />&nbsp; Fit</span>
                <span><Layers3 size={12} style={{marginTop: -2, marginLeft: 4}} />&nbsp; Integrity</span>
                <span><Settings2 size={12} style={{marginTop: -2, marginLeft: 4}} />&nbsp; Action</span>
              </div>

              {tests.map(test => {
                const cheat = (test.tab_switches || 0) + (test.fullscreen_exits || 0);
                return (
                  <div
                    key={test.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 180px 110px 100px 100px 130px",
                      gap: 12, alignItems: "center",
                      padding: "14px 16px", background: "#fff",
                      border: "1px solid #eee", borderRadius: 0,
                      transition: "box-shadow 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{test.applicant_name}</div>
                      <div style={{ fontSize: 11, color: "#15173D", marginTop: 2 }}>
                        {new Date(test.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "#15173D", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {test.applicant_email}
                    </div>
                    <div><StatusBadge status={test.status} /></div>


                    {/* Fit Recommendation */}
                    <div>
                      {test.status === "completed" ? (
                        recommendations[test.test_id]
                          ? <RecommendationBadge rec={recommendations[test.test_id]} />
                          : <span style={{ fontSize: 11, color: "#15173D" }}>…</span>
                      ) : (
                        <span style={{ fontSize: 11, color: "#15173D" }}>—</span>
                      )}
                    </div>


                    <div>
                      {cheat > 0
                        ? <Badge text={`⚠ ${cheat} flags`} color="#15173D" bg="#fef3c7" />
                        : <Badge text="Clean" color="#15173D" bg="#d1fae5" />}
                    </div>
                    <div>
                      {test.status === "completed" ? (
                        <button
                          onClick={() => setReportTestId(test.test_id)}
                          style={{
                            padding: "3px 16px", background: "#15173D", color: "#fff",
                            border: "none", borderRadius: 20, fontSize: 10,
                            fontWeight: 400, cursor: "pointer",
                          }}
                        >
                          <Eye color="white" size={12} style={{marginTop: -1.5}} />&nbsp;View Report
                        </button>
                      ) : (
                        <button
                          style={{
                            padding: "7px 16px", background: "#f1f1f1", color: "#15173D",
                            border: "none", borderRadius: 8, fontSize: 12, cursor: "default",
                          }}
                          disabled
                        >
                          Awaiting Test
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}