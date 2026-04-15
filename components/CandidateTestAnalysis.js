// components/CandidateTestAnalysis.js  (FIXED)
// HR Dashboard: view jobs, applicants, and full test reports

import {
  Box, Building, CheckSquare, Eye, Filter, Layers2, Layers3,
  Loader2, LucideLogOut, Mail, Settings2, Target, UserCircle2,
  Video,
} from "lucide-react";
import { useState, useEffect } from "react";

const API_BASE  = "https://edevalentum.com";
const COLLAB_API = "https://edevalentum.com";

// ── Score helpers ─────────────────────────────────────────────
function scoreColor(s) {
  if (s >= 75) return "#059669";
  if (s >= 55) return "#d97706";
  return "#dc2626";
}

function ScoreRing({ value, color, label, size = 80 }) {
  const r      = (size - 10) / 2;
  const circ   = 2 * Math.PI * r;
  const filled = (value / 100) * circ;
  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0f0f0" strokeWidth={7}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={7}
          strokeDasharray={`${filled} ${circ - filled}`}
          strokeDashoffset={circ / 4} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease" }}/>
        <text x={size/2} y={size/2 + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>
          {value}%
        </text>
      </svg>
      <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function Badge({ text, color, bg }) {
  return (
    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                   letterSpacing: 0.5, background: bg, color }}>
      {text}
    </span>
  );
}

function RecommendationBadge({ rec }) {
  const map = {
    great_fit: { text: "⭐ Great Fit", color: "#15173D", bg: "#d1fae5" },
    good_fit:  { text: "👍 Good Fit",  color: "#1e40af", bg: "#dbeafe" },
    not_a_fit: { text: "✕ Not a Fit", color: "#7f1d1d", bg: "#fee2e2" },
  };
  const m = map[rec] || { text: "Pending", color: "#555", bg: "#f0f0f0" };
  return <Badge text={m.text} color={m.color} bg={m.bg} />;
}

function StatusBadge({ status }) {
  const map = {
    pending:     { text: "Pending",     color: "#92400e", bg: "#fef3c7" },
    in_progress: { text: "In Progress", color: "#1e40af", bg: "#dbeafe" },
    completed:   { text: "Completed",   color: "#15173D", bg: "#d1fae5" },
  };
  const m = map[status] || { text: status, color: "#555", bg: "#f0f0f0" };
  return <Badge text={m.text} color={m.color} bg={m.bg} />;
}

function TimeBar({ seconds, max }) {
  const pct   = Math.min((seconds / max) * 100, 100);
  const color = seconds <= max * 0.4 ? "#10b981" : seconds <= max * 0.75 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "#f0f0f0", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color,
                      borderRadius: 3, transition: "width 0.5s" }}/>
      </div>
      <span style={{ fontSize: 11, color: "#555", minWidth: 36 }}>{Math.round(seconds)}s</span>
    </div>
  );
}

// ── Psychometric — FIXED ──────────────────────────────────────
// Previously received `test` (screening_tests row), `analysis`, and `responses`
// but used fields that weren't present or computed them incorrectly.
function computePsychometric(test, analysis, responses) {
  if (!analysis || !responses?.length) return [];

  const aptResponses = responses.filter(r => r.question_type === "aptitude");
  const grmResponses = responses.filter(r => r.question_type === "grammar");
  const codResponses = responses.filter(r => r.question_type === "coding");

  // ── Logical Reasoning: % of aptitude questions correct ──────
  const logicalScore = analysis.aptitude_score ?? 0;

  // ── Communication: % of grammar questions correct ───────────
  const commScore = analysis.grammar_score ?? 0;

  // ── Technical Aptitude: coding score (50 by default) ────────
  const techScore = analysis.coding_score ?? 50;

  // ── Response Speed ───────────────────────────────────────────
  // 100 pts if avg ≤ 5 s, 0 pts if avg ≥ 28 s (linear interpolation)
  const avg = analysis.avg_time_per_question ?? 15;
  const speedScore = Math.round(Math.max(0, Math.min(100, ((28 - avg) / 23) * 100)));

  // ── Consistency (low variance in response times) ─────────────
  const times = responses.map(r => r.time_taken_seconds ?? 0).filter(t => t > 0);
  let consistencyScore = 100;
  if (times.length > 1) {
    const mean     = times.reduce((a, b) => a + b, 0) / times.length;
    const variance = times.reduce((a, b) => a + (b - mean) ** 2, 0) / times.length;
    const stdDev   = Math.sqrt(variance);
    // stdDev of 0 → 100, stdDev of 10+ → ~0
    consistencyScore = Math.max(0, Math.min(100, Math.round(100 - stdDev * 8)));
  }

  // ── Test Integrity ───────────────────────────────────────────
  const cheatEvents =
    (test.tab_switches ?? 0) +
    (test.fullscreen_exits ?? 0) +
    Math.floor((test.right_click_attempts ?? 0) / 3); // minor weight for right-clicks
  const integrityScore = Math.max(0, 100 - cheatEvents * 20);

  return [
    { trait: "Logical Reasoning",  score: Math.round(logicalScore) },
    { trait: "Communication",      score: Math.round(commScore) },
    { trait: "Technical Aptitude", score: Math.round(techScore) },
    { trait: "Response Speed",     score: speedScore },
    { trait: "Consistency",        score: consistencyScore },
    { trait: "Test Integrity",     score: integrityScore },
  ];
}

// ── Snapshots Gallery ─────────────────────────────────────────
function SnapshotsGallery({ testId, hrEmail }) {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [expanded, setExpanded]   = useState(null);

  useEffect(() => {
    if (!testId || !hrEmail) return;
    const url = `${API_BASE}/api/hr/snapshots/${testId}?hr_email=${encodeURIComponent(hrEmail)}`;
    fetch(url)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`); return r.json(); })
      .then(d  => { setSnapshots(d.snapshots || []); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [testId, hrEmail]);

  if (loading) return <div style={{ color: "#888", fontSize: 13 }}>Loading snapshots…</div>;

  if (error) return (
    <div style={{ padding: "14px 16px", background: "#fff5f5", border: "1px solid #fecaca",
                  borderRadius: 8, fontSize: 13, color: "#c00" }}>
      <strong>Failed to load snapshots</strong>
      <div style={{ marginTop: 4, color: "#888", fontFamily: "monospace", fontSize: 11 }}>{error}</div>
    </div>
  );

  if (!snapshots.length) return (
    <div style={{ padding: 16, background: "#fafafa", borderRadius: 8, border: "1px dashed #ddd",
                  fontSize: 13, color: "#999", textAlign: "center" }}>
      <div>No snapshots stored for this test.</div>
      <div style={{ marginTop: 6, fontSize: 11, color: "#bbb" }}>
        Camera may have been denied, or the candidate's browser blocked capture.
        {/* Check browser console for <code>[Snapshot #N]</code> log lines. */}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
        {snapshots.map((snap, i) => (
          <div key={i} style={{ position: "relative", cursor: "pointer" }}
               onClick={() => setExpanded(expanded === i ? null : i)}>
            <img
              src={snap.image_data}
              alt={`Snapshot ${snap.snapshot_index ?? i + 1}`}
              style={{
                width: 140, height: 100, objectFit: "cover", borderRadius: 8, display: "block",
                border: expanded === i ? "2px solid #6366f1" : "2px solid #e5e7eb",
                transition: "border-color 0.15s",
              }}
            />
            <div style={{ position: "absolute", bottom: 4, left: 4, background: "rgba(0,0,0,0.65)",
                          color: "#fff", fontSize: 10, padding: "2px 6px", borderRadius: 4 }}>
              Shot {snap.snapshot_index ?? i + 1}
            </div>
            {snap.captured_at && (
              <div style={{ position: "absolute", bottom: 4, right: 4, background: "rgba(0,0,0,0.5)",
                            color: "#ddd", fontSize: 9, padding: "1px 5px", borderRadius: 4 }}>
                {new Date(snap.captured_at).toLocaleTimeString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {expanded !== null && snapshots[expanded] && (
        <div style={{ marginTop: 8 }}>
          <img src={snapshots[expanded].image_data} alt="Expanded snapshot"
            style={{ width: "100%", maxHeight: 360, objectFit: "contain",
                     borderRadius: 10, border: "1px solid #e5e7eb" }}/>
          <p style={{ fontSize: 11, color: "#999", marginTop: 6, textAlign: "center" }}>
            Snapshot {snapshots[expanded].snapshot_index ?? expanded + 1}
            {snapshots[expanded].captured_at
              ? ` · ${new Date(snapshots[expanded].captured_at).toLocaleTimeString()}`
              : ""}
          </p>
        </div>
      )}
      <div style={{ marginTop: 8, fontSize: 11, color: "#bbb" }}>
        {snapshots.length} snapshot{snapshots.length !== 1 ? "s" : ""} captured
      </div>
    </div>
  );
}

// ── Score Breakdown Section ───────────────────────────────────
function ScoreBreakdown({ responses, analysis }) {
  const typeLabel = { aptitude: "APT", grammar: "GRM", coding: "COD" };
  const typeColor = { aptitude: "#7c3aed", grammar: "#0891b2", coding: "#059669" };
  const typeMax   = { aptitude: 15, grammar: 15, coding: 30 };

  const byType = { aptitude: [], grammar: [], coding: [] };
  responses.forEach(r => { if (byType[r.question_type]) byType[r.question_type].push(r); });

  const sections = [
    { key: "aptitude", label: "Aptitude Questions", color: "#7c3aed" },
    { key: "grammar",  label: "Grammar Questions",  color: "#0891b2" },
    { key: "coding",   label: "Coding Questions",   color: "#059669" },
  ];

  return (
    <div>
      {sections.map(sec => {
        const qs = byType[sec.key];
        if (!qs.length) return null;

        const correct = qs.filter(q => q.is_correct === true).length;
        const total   = qs.length;
        const skipped = qs.filter(q => !q.selected_answer).length;
        const avgTime = qs.reduce((a, b) => a + (b.time_taken_seconds || 0), 0) / total;

        return (
          <div key={sec.key} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                               background: sec.color + "18", color: sec.color }}>
                  {typeLabel[sec.key]}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{sec.label}</span>
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#555" }}>
                {sec.key !== "coding" && (
                  <>
                    <span style={{ color: "#059669", fontWeight: 700 }}>✓ {correct}/{total} correct</span>
                    {skipped > 0 && <span style={{ color: "#f59e0b" }}>⊘ {skipped} skipped</span>}
                  </>
                )}
                <span>⌀ {avgTime.toFixed(1)}s avg</span>
              </div>
            </div>

            {qs.map((r, i) => (
              <div key={r.id} style={{
                display: "grid",
                gridTemplateColumns: "28px 50px 1fr 160px 60px",
                gap: 10, alignItems: "center",
                padding: "9px 14px", marginBottom: 4,
                background: r.is_correct === true  ? "#f0fdf4"
                          : r.is_correct === false ? "#fff5f5"
                          :                          "#fafafa",
                border: `1px solid ${
                  r.is_correct === true  ? "#bbf7d0"
                : r.is_correct === false ? "#fecaca"
                :                          "#eee"
                }`,
                borderRadius: 8,
              }}>
                <span style={{ fontSize: 12, color: "#999" }}>#{i + 1}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 5px", borderRadius: 4,
                               textAlign: "center",
                               background: typeColor[r.question_type] + "18",
                               color: typeColor[r.question_type] }}>
                  {typeLabel[r.question_type]}
                </span>
                <div style={{ fontSize: 12 }}>
                  <span style={{ fontFamily: "monospace", color: "#666", fontSize: 11 }}>{r.question_id}</span>
                  {r.selected_answer && sec.key !== "coding" && (
                    <span style={{ marginLeft: 8, fontWeight: 600, color: "#333" }}>
                      → {r.selected_answer}
                      {r.correct_answer && r.is_correct === false && (
                        <span style={{ color: "#059669", marginLeft: 6 }}>(✓ {r.correct_answer})</span>
                      )}
                    </span>
                  )}
                  {!r.selected_answer && sec.key !== "coding" && (
                    <span style={{ marginLeft: 8, color: "#f59e0b", fontSize: 11 }}>No answer</span>
                  )}
                  {sec.key === "coding" && (
                    <span style={{ marginLeft: 8, fontSize: 11, color: "#888" }}>
                      {r.selected_answer
                        ? `${r.selected_answer.trim().slice(0, 60)}…`
                        : "No code submitted"}
                    </span>
                  )}
                </div>
                <TimeBar seconds={Math.round(r.time_taken_seconds || 0)} max={typeMax[r.question_type]} />
                <span style={{ fontSize: 16, textAlign: "center" }}>
                  {sec.key === "coding"
                    ? "🔍"
                    : r.is_correct === true  ? "✅"
                    : r.is_correct === false ? "❌"
                    : "—"}
                </span>
              </div>
            ))}
          </div>
        );
      })}

      {analysis && (
        <div style={{ marginTop: 20, padding: "14px 16px", background: "#f9f9f9",
                      border: "1px solid #eee", borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 10 }}>Score Summary</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
            {[
              { label: "Aptitude",    value: `${analysis.aptitude_score ?? 0}%`,  color: "#7c3aed" },
              { label: "Grammar",     value: `${analysis.grammar_score  ?? 0}%`,  color: "#0891b2" },
              { label: "Coding*",     value: `${analysis.coding_score   ?? 50}%`, color: "#059669" },
              { label: "Overall",     value: `${analysis.overall_score  ?? 0}%`,
                color: scoreColor(analysis.overall_score ?? 0), bold: true },
              { label: "Avg Time/Q",  value: `${analysis.avg_time_per_question ?? 0}s` },
              { label: "Total Time",
                value: `${Math.floor((analysis.total_time_seconds ?? 0) / 60)}m ${Math.round((analysis.total_time_seconds ?? 0) % 60)}s` },
            ].map(m => (
              <div key={m.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: m.bold ? 800 : 700, color: m.color || "#111" }}>
                  {m.value}
                </div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── REPORT MODAL ─────────────────────────────────────────────
function ReportModal({ testId, hrEmail, onClose }) {
  const [report, setReport]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/hr/report/${testId}?hr_email=${encodeURIComponent(hrEmail)}`)
      .then(r  => r.json())
      .then(d  => { setReport(d); setLoading(false); })
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
  const psychScores = computePsychometric(test, analysis, responses);

  // ── FIXED: compute these from responses, not analysis ───────
  const mcqResponses    = responses.filter(r => r.question_type !== "coding");
  const codResponses    = responses.filter(r => r.question_type === "coding");
  const correctCount    = mcqResponses.filter(r => r.is_correct === true).length;
  const codSubmitted    = codResponses.filter(r => r.selected_answer && r.selected_answer.trim()).length;

  return (
    <ModalShell onClose={onClose} wide>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 4 }}>
            {test.applicant_name}
          </h2>
          <p style={{ fontSize: 13, color: "#888" }}>
            {test.applicant_email} · {test.job_title} at {test.company_name}
          </p>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <StatusBadge status={test.status} />
            {analysis && <RecommendationBadge rec={analysis.recommendation} />}
          </div>
        </div>
        {analysis && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: scoreColor(analysis.overall_score) }}>
              {analysis.overall_score}%
            </div>
            <div style={{ fontSize: 11, color: "#555" }}>Overall Score</div>
          </div>
        )}
      </div>

      {/* Score rings */}
      {analysis && (
        <div style={{ display: "flex", gap: 20, justifyContent: "center",
                      padding: "20px 0", borderTop: "1px solid #f0f0f0",
                      borderBottom: "1px solid #f0f0f0", marginBottom: 28, flexWrap: "wrap" }}>
          <ScoreRing value={analysis.aptitude_score ?? 0} color="#7c3aed" label="Aptitude" />
          <ScoreRing value={analysis.grammar_score  ?? 0} color="#0891b2" label="Grammar" />
          <ScoreRing value={analysis.coding_score   ?? 50} color="#059669" label="Coding*" />
        </div>
      )}

      {/* Stats grid — FIXED counts */}
      {analysis && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                      gap: 12, marginBottom: 28 }}>
          {[
            { label: "MCQ Correct",       value: `${correctCount}/${mcqResponses.length}`, color: "#059669" },
            { label: "Coding Submitted",  value: `${codSubmitted}/${codResponses.length}`,  color: "#059669" },
            { label: "Avg Time/Question", value: `${analysis.avg_time_per_question ?? 0}s` },
            { label: "Total Time",
              value: `${Math.floor((analysis.total_time_seconds ?? 0) / 60)}m ${Math.round((analysis.total_time_seconds ?? 0) % 60)}s` },
            { label: "Tab Switches",      value: test.tab_switches ?? 0,
              warn: (test.tab_switches ?? 0) > 0 },
            { label: "Fullscreen Exits",  value: test.fullscreen_exits ?? 0,
              warn: (test.fullscreen_exits ?? 0) > 0 },
          ].map(m => (
            <div key={m.label} style={{ padding: "12px 16px",
                                         background: m.warn ? "#fff5f5" : "#f9f9f9",
                                         borderRadius: 10,
                                         border: `1px solid ${m.warn ? "#fecaca" : "#eee"}` }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700,
                            color: m.warn ? "#dc2626" : (m.color || "#111") }}>{m.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Psychometric */}
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#333", marginBottom: 14 }}>
          Psychometric Profile
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
          {psychScores.map(ps => (
            <div key={ps.trait} style={{ padding: "12px 14px", background: "#fafafa",
                                          border: "1px solid #eee", borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>{ps.trait}</div>
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

      {analysis?.psychometric_notes && (
        <div style={{ background: "white", border: "1px solid #15173D", borderRadius: 10,
                      padding: "14px 16px", marginBottom: 28, fontSize: 13,
                      color: "#15173D", lineHeight: 1.6 }}>
          <strong>Observation:</strong> {analysis.psychometric_notes}
        </div>
      )}

      {/* Full question breakdown */}
      {responses.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#333", marginBottom: 14 }}>
            Detailed Question Breakdown
          </h3>
          <ScoreBreakdown responses={responses} analysis={analysis} />
          <p style={{ fontSize: 11, color: "#888", marginTop: 10 }}>
            * Coding answers require manual HR review. Score defaulted to 50% until graded.
          </p>
        </div>
      )}

      {/* Snapshots */}
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#333", marginBottom: 14 }}>
          <Video size={18} style={{marginTop: -2}} /> Identity Verification Snapshots
        </h3>
        <SnapshotsGallery testId={testId} hrEmail={hrEmail} />
      </div>
    </ModalShell>
  );
}

function ModalShell({ children, onClose, wide }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                                     display: "flex", alignItems: "flex-start", justifyContent: "center",
                                     zIndex: 9999, padding: 24, overflowY: "auto" }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 16, padding: 32,
        width: "100%", maxWidth: wide ? 820 : 480,
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        position: "relative", margin: "auto",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16,
          border: "none", background: "#f1f1f1", borderRadius: 50,
          width: 28, height: 28, cursor: "pointer", fontSize: 14, color: "#15173D",
        }}>✕</button>
        {children}
      </div>
    </div>
  );
}

// ── MAIN DASHBOARD ───────────────────────────────────────────
export default function CandidateTestAnalysis({ hrEmail }) {
  const [jobs, setJobs]                   = useState([]);
  const [selectedJob, setSelectedJob]     = useState(null);
  const [tests, setTests]                 = useState([]);
  const [reportTestId, setReportTestId]   = useState(null);
  const [loadingJobs, setLoadingJobs]     = useState(true);
  const [loadingTests, setLoadingTests]   = useState(false);
  const [recommendations, setRecommendations] = useState({});

  useEffect(() => {
    if (!hrEmail) return;
    setLoadingJobs(true);
    Promise.all([
      fetch(`${API_BASE}/api/hr/jobs?hr_email=${encodeURIComponent(hrEmail)}`).then(r => r.json()),
      fetch(`${COLLAB_API}/collaboration/my-access/${encodeURIComponent(hrEmail)}`).then(r => r.json()),
    ])
      .then(([ownedData, collabData]) => {
        const ownedJobs  = (ownedData.jobs  || []).map(j  => ({ ...j, _source: "owned" }));
        const collabJobs = (collabData.jobs || [])
          .filter(cj => cj.collab_verified)
          .filter(cj => cj.collab_role === "admin" || cj.collab_role === "viewer")
          .filter(cj => !ownedJobs.find(j => j.id === cj.id))
          .map(cj => ({
            id: cj.id, title: cj.title, company_name: cj.company_name, location: cj.location,
            _source: "collab", _collab_role: cj.collab_role, _collab_owner: cj.collab_owner_email,
          }));
        setJobs([...ownedJobs, ...collabJobs]);
        setLoadingJobs(false);
      })
      .catch(() => setLoadingJobs(false));
  }, [hrEmail]);

  useEffect(() => {
    if (!selectedJob) return;
    setLoadingTests(true);
    setRecommendations({});
    const fetchEmail = selectedJob._source === "collab" ? selectedJob._collab_owner : hrEmail;
    fetch(`${API_BASE}/api/hr/tests?hr_email=${encodeURIComponent(fetchEmail)}&job_id=${selectedJob.id}`)
      .then(r => r.json())
      .then(async d => {
        const fetchedTests = d.tests || [];
        setTests(fetchedTests);
        setLoadingTests(false);
        const completed = fetchedTests.filter(t => t.status === "completed");
        const recMap    = {};
        await Promise.all(
          completed.map(t =>
            fetch(`${API_BASE}/api/hr/report/${t.test_id}?hr_email=${encodeURIComponent(fetchEmail)}`)
              .then(r => r.json())
              .then(data => { recMap[t.test_id] = data?.analysis?.recommendation || null; })
              .catch(() => {})
          )
        );
        setRecommendations(recMap);
      })
      .catch(() => setLoadingTests(false));
  }, [selectedJob, hrEmail]);

  return (
    <div className="dashboard">
      {reportTestId && (
        <ReportModal
          testId={reportTestId}
          hrEmail={selectedJob?._source === "collab" ? selectedJob._collab_owner : hrEmail}
          onClose={() => setReportTestId(null)}
        />
      )}

      <nav className="navbar">
        <div className="nav-brand">
          <span style={{ fontSize: 16 }}>
            <UserCircle2 size={16} style={{ verticalAlign: "middle" }} /> {hrEmail}
          </span>
        </div>
        <div className="nav-user">
          <button
            onClick={() => { localStorage.removeItem("authToken"); window.location.href = "/"; }}
            className="logout-button"
          >
            <LucideLogOut size={17} style={{ verticalAlign: "middle" }} /> Logout
          </button>
        </div>
      </nav>

      <div style={{ marginBottom: 20, padding: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 30, marginTop: 23 }}>
          <Layers2 size={15} style={{ marginTop: -2 }} />&nbsp; Your Job Posts
        </h2>
        {loadingJobs ? (
          <div style={{ color: "#555", fontSize: 13 }}>
            <Loader2 size={12} style={{ marginTop: -3 }} />&nbsp; Loading jobs…
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ color: "#555", fontSize: 13 }}>No jobs found for this account.</div>
        ) : (
          <div>
            {jobs.map(job => (
              <div key={job.id} onClick={() => setSelectedJob(job)} style={{
                padding: "14px 18px", borderRadius: 12, cursor: "pointer",
                border: selectedJob?.id === job.id ? "2px solid #000" : "1px solid #e0e0e0",
                background: selectedJob?.id === job.id ? "#f9f9f9" : "#fff",
                marginBottom: 10, transition: "all 0.15s",
              }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                  <Box size={18} style={{ marginTop: -2 }} />&nbsp; {job.title}
                  {job._source === "collab" && (
                    <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700,
                                   background: "#eef2ff", color: "#6366f1",
                                   padding: "2px 8px", borderRadius: 20 }}>
                      Shared
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>{job.company_name}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>{job.location}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedJob && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                        marginBottom: 7, padding: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700 }}>
              <Filter size={15} style={{ marginTop: -2 }} />&nbsp; Applicants — {selectedJob.title}
            </h2>
            <span style={{ fontSize: 12, color: "#888" }}>{tests.length} candidates</span>
          </div>

          {loadingTests ? (
            <div style={{ color: "#555", fontSize: 13, padding: "0 20px" }}>
              <Loader2 size={12} style={{ marginTop: -3 }} />&nbsp; Loading…
            </div>
          ) : tests.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", background: "#fafafa",
                          border: "1px dashed #e0e0e0", color: "#555", fontSize: 13 }}>
              No screening tests sent for this job yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "grid",
                            gridTemplateColumns: "1fr 180px 110px 100px 100px 130px",
                            gap: 12, padding: "8px 16px", fontSize: 11, color: "#555",
                            fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>
                <span><UserCircle2 size={12} style={{ verticalAlign: "middle" }} />&nbsp; Candidate</span>
                <span><Mail size={12} style={{ verticalAlign: "middle" }} />&nbsp; Email</span>
                <span><CheckSquare size={12} style={{ verticalAlign: "middle" }} />&nbsp; Status</span>
                <span><Target size={12} style={{ verticalAlign: "middle" }} />&nbsp; Fit</span>
                <span><Layers3 size={12} style={{ verticalAlign: "middle" }} />&nbsp; Integrity</span>
                <span><Settings2 size={12} style={{ verticalAlign: "middle" }} />&nbsp; Action</span>
              </div>

              {tests.map(test => {
                const cheat = (test.tab_switches || 0) + (test.fullscreen_exits || 0);
                return (
                  <div key={test.id} style={{
                    display: "grid", gridTemplateColumns: "1fr 180px 110px 100px 100px 130px",
                    gap: 12, alignItems: "center", padding: "14px 16px",
                    background: "#fff", border: "1px solid #eee", borderRadius: 0,
                    transition: "box-shadow 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{test.applicant_name}</div>
                      <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                        {new Date(test.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "#555", overflow: "hidden",
                                  textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {test.applicant_email}
                    </div>
                    <div><StatusBadge status={test.status} /></div>
                    <div>
                      {test.status === "completed"
                        ? recommendations[test.test_id]
                          ? <RecommendationBadge rec={recommendations[test.test_id]} />
                          : <span style={{ fontSize: 11, color: "#aaa" }}>…</span>
                        : <span style={{ fontSize: 11, color: "#aaa" }}>—</span>}
                    </div>
                    <div>
                      {cheat > 0
                        ? <Badge text={`⚠ ${cheat} flags`} color="#92400e" bg="#fef3c7" />
                        : <Badge text="Clean" color="#15173D" bg="#d1fae5" />}
                    </div>
                    <div>
                      {test.status === "completed" ? (
                        <button onClick={() => setReportTestId(test.test_id)} style={{
                          padding: "6px 16px", background: "#15173D", color: "#fff",
                          border: "none", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer",
                        }}>
                          <Eye color="white" size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
                          View Report
                        </button>
                      ) : (
                        <button style={{ padding: "7px 16px", background: "#f1f1f1", color: "#555",
                                         border: "none", borderRadius: 8, fontSize: 12, cursor: "default" }}
                                disabled>
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

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Lustria&family=DM+Sans:ital,opsz,wght@0,9..40,100..900;1,9..40,100..900&display=swap');
        .dashboard { margin-top: -95.5px; }
        .navbar { background-color: white; padding: 1.85rem 1rem; border-bottom: 0.6px solid #dfdfdf;
                  display: flex; justify-content: space-between; align-items: center; }
        .nav-brand { font-size: 1rem; font-weight: normal; color: #15173D; }
        .nav-user { display: flex; align-items: center; gap: 1rem; color: #15173D; }
        .logout-button { padding: 0.5rem 1rem; background-color: transparent; color: #15173D;
                          border: none; border-radius: 40px; cursor: pointer; font-size: 13px; }
      `}</style>
    </div>
  );
}