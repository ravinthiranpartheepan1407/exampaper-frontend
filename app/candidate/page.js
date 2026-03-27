// pages/candidate.js
// Next.js (Pages Router) — plain JS + plain CSS
// Route: /candidate?screen=<test_id>

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Head from "next/head";

const API_BASE = "http://localhost:8002";

// ============================================================
// QUESTION BANK — full content lives here (shuffled by backend)
// ============================================================
const QUESTIONS = {
  // ── APTITUDE ──
  apt_001: {
    type: "aptitude",
    text: "If a train travels 360 km in 4 hours, how long will it take to travel 630 km at the same speed?",
    options: ["A. 6 hours", "B. 7 hours", "C. 6.5 hours", "D. 8 hours"],
    correct: "B",
    timer: 30,
  },
  apt_002: {
    type: "aptitude",
    text: "A shopkeeper buys an item for ₹500 and sells it at 20% profit. What is the selling price?",
    options: ["A. ₹550", "B. ₹580", "C. ₹600", "D. ₹620"],
    correct: "C",
    timer: 30,
  },
  apt_003: {
    type: "aptitude",
    text: "What comes next in the series: 2, 6, 12, 20, 30, ?",
    options: ["A. 42", "B. 40", "C. 44", "D. 36"],
    correct: "A",
    timer: 30,
  },
  apt_004: {
    type: "aptitude",
    text: "If 6 workers complete a job in 12 days, how many days would 9 workers take?",
    options: ["A. 9 days", "B. 7 days", "C. 6 days", "D. 8 days"],
    correct: "D",
    timer: 30,
  },
  apt_005: {
    type: "aptitude",
    text: "A rectangle has a perimeter of 56 cm and a width of 10 cm. What is its area?",
    options: ["A. 160 cm²", "B. 180 cm²", "C. 140 cm²", "D. 200 cm²"],
    correct: "B",
    timer: 30,
  },
  apt_006: {
    type: "aptitude",
    text: "What is 15% of 240?",
    options: ["A. 32", "B. 34", "C. 36", "D. 38"],
    correct: "C",
    timer: 30,
  },
  apt_007: {
    type: "aptitude",
    text: "A man walks 5 km North, then 12 km East. How far is he from the start?",
    options: ["A. 13 km", "B. 15 km", "C. 17 km", "D. 11 km"],
    correct: "A",
    timer: 30,
  },
  apt_008: {
    type: "aptitude",
    text: "If today is Wednesday, what day will it be after 100 days?",
    options: ["A. Monday", "B. Friday", "C. Saturday", "D. Sunday"],
    correct: "B",
    timer: 30,
  },
  apt_009: {
    type: "aptitude",
    text: "A bucket is 3/5 full. After adding 6 litres it becomes 4/5 full. What is the total capacity?",
    options: ["A. 25L", "B. 28L", "C. 30L", "D. 32L"],
    correct: "C",
    timer: 30,
  },
  apt_010: {
    type: "aptitude",
    text: "A sum doubles in 8 years at simple interest. What is the interest rate per annum?",
    options: ["A. 10%", "B. 11%", "C. 12.5%", "D. 15%"],
    correct: "C",
    timer: 30,
  },

  // ── GRAMMAR ──
  grm_001: {
    type: "grammar",
    text: "Choose the grammatically correct sentence:",
    options: [
      "A. She don't know the answer.",
      "B. She doesn't knows the answer.",
      "C. She doesn't know the answer.",
      "D. She not know the answer.",
    ],
    correct: "C",
    timer: null,
  },
  grm_002: {
    type: "grammar",
    text: "Select the correct form: 'Neither the manager nor the employees ___ happy.'",
    options: ["A. was", "B. were", "C. is", "D. has been"],
    correct: "B",
    timer: null,
  },
  grm_003: {
    type: "grammar",
    text: "Which sentence uses the past perfect correctly?",
    options: [
      "A. She had left before he arrived.",
      "B. She has left before he arrived.",
      "C. She left before he had arrived.",
      "D. She was leaving before he arrived.",
    ],
    correct: "A",
    timer: null,
  },
  grm_004: {
    type: "grammar",
    text: "Choose the correctly punctuated sentence:",
    options: [
      "A. Its a lovely day, isnt it.",
      "B. It's a lovely day, isn't it?",
      "C. Its a lovely day isn't it?",
      "D. It's a lovely day isnt it?",
    ],
    correct: "B",
    timer: null,
  },
  grm_005: {
    type: "grammar",
    text: "Which word correctly completes the sentence? 'The team ___ their best effort.'",
    options: ["A. give", "B. gives", "C. giving", "D. gave"],
    correct: "D",
    timer: null,
  },
  grm_006: {
    type: "grammar",
    text: "Identify the correct passive voice: 'The manager approved the report.'",
    options: [
      "A. The report was approved by the manager.",
      "B. The report is approved by the manager.",
      "C. The report approved by the manager.",
      "D. The report has been approving by the manager.",
    ],
    correct: "A",
    timer: null,
  },
  grm_007: {
    type: "grammar",
    text: "Which sentence is free from redundancy?",
    options: [
      "A. Please revert back to me.",
      "B. Please revert to me.",
      "C. Please revert me back.",
      "D. Please revert back me.",
    ],
    correct: "B",
    timer: null,
  },
  grm_008: {
    type: "grammar",
    text: "'He is one of those managers who ___ very detail-oriented.'",
    options: ["A. is", "B. was", "C. are", "D. has been"],
    correct: "C",
    timer: null,
  },
  grm_009: {
    type: "grammar",
    text: "Choose the correct preposition: 'She has been working here ___ 2019.'",
    options: ["A. for", "B. from", "C. since", "D. by"],
    correct: "C",
    timer: null,
  },
  grm_010: {
    type: "grammar",
    text: "Which is the correct comparative form?",
    options: [
      "A. This problem is more easier.",
      "B. This problem is more easy.",
      "C. This problem is easier.",
      "D. This problem is easiest.",
    ],
    correct: "C",
    timer: null,
  },

  // ── CODING ──
  cod_001: {
    type: "coding",
    text: "Write a Python function that takes a list of numbers and returns the two numbers that sum closest to zero.",
    placeholder: "def closest_to_zero(nums):\n    # your code here\n    pass",
    timer: null,
  },
  cod_002: {
    type: "coding",
    text: "Implement a function to check if a given string is a valid palindrome (ignore spaces and case).",
    placeholder: "def is_palindrome(s):\n    # your code here\n    pass",
    timer: null,
  },
  cod_003: {
    type: "coding",
    text: "Write a SQL query to find the second highest salary from a table called 'employees' with column 'salary'.",
    placeholder: "SELECT ...",
    timer: null,
  },
  cod_004: {
    type: "coding",
    text: "Explain the difference between a stack and a queue and implement a queue using two stacks in Python.",
    placeholder: "class QueueWithStacks:\n    def __init__(self):\n        pass\n    def enqueue(self, val):\n        pass\n    def dequeue(self):\n        pass",
    timer: null,
  },
};

// ============================================================
// MAIN PAGE
// ============================================================
export default function CandidatePage() {
  const searchParams = useSearchParams();
  const testId = searchParams.get("screen");



  const [phase, setPhase] = useState("loading"); // loading|start|test|done|error
  const [testData, setTestData] = useState(null);
  const [questionIds, setQuestionIds] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [lockedAnswers, setLockedAnswers] = useState({});
  const [timers, setTimers] = useState({}); // time spent per question
  const [countdown, setCountdown] = useState(30);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cheatCounts, setCheatCounts] = useState({ tab: 0, fs: 0, rc: 0 });
  const [warningMsg, setWarningMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const questionStartTime = useRef(Date.now());
  const countdownRef = useRef(null);
  const cheatRef = useRef({ tab: 0, fs: 0, rc: 0 });

  // ── Fetch test data ──────────────────────────────────────
  // ── Fetch test data ──────────────────────────────────────
  useEffect(() => {
  if (!testId) {
    setPhase("error");
    return;
  }
  fetch(`${API_BASE}/api/test/${testId}`)
    .then((r) => {
      if (!r.ok) throw new Error(r.status === 410 ? "completed" : "not_found");
      return r.json();
    })
    .then((data) => {
      setTestData(data);
      const ids = data.question_ids.filter((qid) => {
        const found = QUESTIONS[qid];
        if (!found) console.warn(`Missing frontend question definition for: ${qid}`);
        return found;
      });

      if (ids.length === 0) {
        console.error("No matching questions found in QUESTIONS map!", data.question_ids);
        setPhase("error");
        return;
      }

      setQuestionIds(ids);
      setPhase("start");
    })
    .catch((err) => {
      setPhase(err.message === "completed" ? "done" : "error");
    });
}, [testId]);

  // ── Anti-cheat: right-click ──────────────────────────────
  useEffect(() => {
    if (phase !== "test") return;
    const blockContext = (e) => {
      e.preventDefault();
      logCheat("right_click");
      setWarningMsg("⚠ Right-click is disabled during the test.");
      setTimeout(() => setWarningMsg(""), 3000);
    };
    const blockKeys = (e) => {
      // Block common shortcuts
      const blocked = ["F12", "F5", "Esc"];
      const ctrlBlocked = ["c", "v", "a", "u", "s", "p", "i", "j"];
      if (blocked.includes(e.key)) { e.preventDefault(); return; }
      if ((e.ctrlKey || e.metaKey) && ctrlBlocked.includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", blockContext);
    document.addEventListener("keydown", blockKeys);
    return () => {
      document.removeEventListener("contextmenu", blockContext);
      document.removeEventListener("keydown", blockKeys);
    };
  }, [phase]);

  // ── Anti-cheat: visibility (tab switch) ─────────────────
  useEffect(() => {
    if (phase !== "test") return;
    const onVisibility = () => {
      if (document.hidden) {
        logCheat("tab_switch");
        setWarningMsg("⚠ Tab switch detected! This has been recorded.");
        setTimeout(() => setWarningMsg(""), 4000);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [phase]);

  // ── Anti-cheat: fullscreen exit ──────────────────────────
  useEffect(() => {
    if (phase !== "test") return;
    const onFsChange = () => {
      const isFs =
        !!document.fullscreenElement ||
        !!document.webkitFullscreenElement ||
        !!document.mozFullScreenElement;
      setIsFullscreen(isFs);
      if (!isFs) {
        logCheat("fullscreen_exit");
        setWarningMsg("⚠ Fullscreen exit detected! Please re-enter fullscreen.");
        setTimeout(() => setWarningMsg(""), 5000);
      }
    };
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    document.addEventListener("mozfullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
      document.removeEventListener("mozfullscreenchange", onFsChange);
    };
  }, [phase]);

  // ── Countdown timer for aptitude ────────────────────────
  useEffect(() => {
    if (phase !== "test") return;
    const q = QUESTIONS[questionIds[currentIdx]];
    if (!q) return;

    questionStartTime.current = Date.now();

    if (q.timer) {
      setCountdown(q.timer);
      clearInterval(countdownRef.current);
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            handleAutoAdvance(questionIds[currentIdx]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(countdownRef.current);
      setCountdown(null);
    }

    return () => clearInterval(countdownRef.current);
  }, [currentIdx, phase]);

  const logCheat = async (eventType) => {
    const key = eventType === "tab_switch" ? "tab" : eventType === "fullscreen_exit" ? "fs" : "rc";
    cheatRef.current[key]++;
    setCheatCounts({ ...cheatRef.current });
    try {
      await fetch(`${API_BASE}/api/log-cheat-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test_id: testId, event_type: eventType }),
      });
    } catch (_) {}
  };

  const submitAnswer = async (qId, answer, timeTaken) => {
    const q = QUESTIONS[qId];
    if (!q) return;
    try {
      await fetch(`${API_BASE}/api/submit-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          test_id: testId,
          question_id: qId,
          question_type: q.type,
          selected_answer: answer || null,
          time_taken_seconds: timeTaken,
        }),
      });
    } catch (_) {}
  };

  const handleAutoAdvance = useCallback(
    async (qId) => {
      const timeTaken = (Date.now() - questionStartTime.current) / 1000;
      const currentAnswer = answers[qId] || null;
      setLockedAnswers((prev) => ({ ...prev, [qId]: currentAnswer }));
      setTimers((prev) => ({ ...prev, [qId]: timeTaken }));
      await submitAnswer(qId, currentAnswer, timeTaken);

      setCurrentIdx((prev) => {
        if (prev + 1 >= questionIds.length) {
          completeTest();
          return prev;
        }
        return prev + 1;
      });
    },
    [answers, questionIds, testId]
  );

  const handleSelectAnswer = (qId, option) => {
    if (lockedAnswers[qId] !== undefined) return; // locked
    setAnswers((prev) => ({ ...prev, [qId]: option[0] })); // store "A"/"B"/"C"/"D"
  };

  const handleNext = async () => {
    const qId = questionIds[currentIdx];
    const timeTaken = (Date.now() - questionStartTime.current) / 1000;
    const answer = answers[qId] || null;
    setLockedAnswers((prev) => ({ ...prev, [qId]: answer }));
    setTimers((prev) => ({ ...prev, [qId]: timeTaken }));
    await submitAnswer(qId, answer, timeTaken);

    if (currentIdx + 1 >= questionIds.length) {
      await completeTest();
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const completeTest = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await fetch(`${API_BASE}/api/complete-test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          test_id: testId,
          tab_switches: cheatRef.current.tab,
          fullscreen_exits: cheatRef.current.fs,
          right_click_attempts: cheatRef.current.rc,
        }),
      });
    } catch (_) {}
    setPhase("done");
  };

  const enterFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
    setIsFullscreen(true);
    setPhase("test");
  };

  // ── Render helpers ───────────────────────────────────────
  const currentQId = questionIds[currentIdx];
  const currentQ = QUESTIONS[currentQId];
  const progress = questionIds.length > 0 ? ((currentIdx) / questionIds.length) * 100 : 0;

  const typeLabel = { aptitude: "Aptitude", grammar: "Grammar", coding: "Coding" };
  const typeColor = { aptitude: "#7c3aed", grammar: "#0891b2", coding: "#059669" };

  return (
    <>
      {warningMsg && <div className="warning-bar">{warningMsg}</div>}

      {/* ── LOADING ── */}
      {phase === "loading" && (
        <div className="screen">
          <div style={{ color: "#555", fontSize: 14 }}>Loading your test…</div>
        </div>
      )}

      {/* ── ERROR ── */}
      {phase === "error" && (
        <div className="screen">
          <div className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
            <h1>Test Not Found</h1>
            <p className="subtitle">This screening link is invalid or has expired. Please contact the recruiter.</p>
          </div>
        </div>
      )}

      {/* ── ALREADY DONE ── */}
      {phase === "done" && (
        <div className="screen">
          <div className="card done-screen">
            <div className="done-icon">✅</div>
            <h1 style={{ marginBottom: 16 }}>Test Submitted!</h1>
            <p style={{ color: "#888", lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
              Thank you for completing the screening assessment. The HR team at{" "}
              <strong style={{ color: "#ccc" }}>
                {testData?.company_name || "the company"}
              </strong>{" "}
              will review your results and get in touch with you soon. No further action is required from your side.
            </p>
            <div
              style={{
                marginTop: 32,
                padding: 16,
                background: "#0d1117",
                borderRadius: 10,
                fontSize: 13,
                color: "#555",
              }}
            >
              Your results are confidential and have been securely submitted.
            </div>
          </div>
        </div>
      )}

      {/* ── START SCREEN ── */}
      {phase === "start" && (
        <div className="screen">
          <div className="card">
            <div className="logo">Evalentum AI — Screening Test</div>
            <h1>Hi, {testData?.applicant_name}!</h1>
            <p className="subtitle">
              You&apos;ve been invited to complete a screening assessment for{" "}
              <strong style={{ color: "#e0e0e0" }}>{testData?.job_title}</strong> at{" "}
              <strong style={{ color: "#e0e0e0" }}>{testData?.company_name}</strong>.
            </p>

            <ul className="rules-list">
              <li>5 Aptitude questions — 30 seconds each (auto-advances)</li>
              <li>5 Grammar questions — no time limit</li>
              <li>2 Coding questions — write your solution</li>
              <li>You cannot go back or change a submitted answer</li>
              <li>The test must stay fullscreen — exits are flagged</li>
              <li>Tab switching and right-click are disabled and logged</li>
              <li>Complete the test in one sitting</li>
            </ul>

            <div style={{ display: "flex", gap: 16, marginTop: 32, flexWrap: "wrap" }}>
              <button className="btn" onClick={enterFullscreen}>
                🔒 Enter Fullscreen & Begin Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TEST SCREEN ── */}
      {phase === "test" && currentQ && (
        <div className="screen" style={{ justifyContent: "flex-start", paddingTop: 60 }}>
          {!isFullscreen && (
            <div className="fs-warning" style={{ marginBottom: 24 }}>
              ⚠ Please re-enter fullscreen to continue.{" "}
              <button
                className="btn"
                style={{ padding: "6px 16px", fontSize: 13, marginLeft: 12 }}
                onClick={enterFullscreen}
              >
                Re-enter Fullscreen
              </button>
            </div>
          )}

          <div className="card">
            {/* <div className="cheat-badges">
              <span className={`cheat-badge ${cheatCounts.tab > 0 ? "active" : ""}`}>
                Tab switches: {cheatCounts.tab}
              </span>
              <span className={`cheat-badge ${cheatCounts.fs > 0 ? "active" : ""}`}>
                Fullscreen exits: {cheatCounts.fs}
              </span>
              <span className={`cheat-badge ${cheatCounts.rc > 0 ? "active" : ""}`}>
                Right-click: {cheatCounts.rc}
              </span>
            </div> */}

            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="q-header">
              <span
                className="q-type-badge"
                style={{
                  background: typeColor[currentQ.type] + "22",
                  color: typeColor[currentQ.type],
                  border: `1px solid ${typeColor[currentQ.type]}44`,
                }}
              >
                {typeLabel[currentQ.type]}
              </span>
              <span className="q-count">
                Question {currentIdx + 1} of {questionIds.length}
              </span>
              {countdown !== null && (
                <span className={`timer-ring ${countdown <= 10 ? "urgent" : ""}`}>
                  ⏱ {countdown}s
                </span>
              )}
            </div>

            <h2 className="q-text">{currentQ.text}</h2>

            {/* MCQ Options */}
            {currentQ.options && (
              <div className="options">
                {currentQ.options.map((opt) => {
                  const key = opt[0];
                  const isSelected = answers[currentQId] === key;
                  const isLocked = lockedAnswers[currentQId] !== undefined;
                  return (
                    <button
                      key={opt}
                      className={`option-btn ${isSelected ? "selected" : ""} ${isLocked ? "locked" : ""}`}
                      onClick={() => handleSelectAnswer(currentQId, opt)}
                    >
                      <span className="option-key">{key}</span>
                      <span>{opt.slice(3)}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Coding Text Area */}
            {currentQ.type === "coding" && (
              <textarea
                className="code-area"
                placeholder={currentQ.placeholder}
                value={answers[currentQId] || ""}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [currentQId]: e.target.value }))
                }
                spellCheck={false}
              />
            )}

            {/* Next / Submit button (not shown for timed aptitude) */}
            {!currentQ.timer && (
              <button
                className="btn"
                onClick={handleNext}
                disabled={submitting}
                style={{ opacity: submitting ? 0.5 : 1 }}
              >
                {currentIdx + 1 >= questionIds.length
                  ? submitting
                    ? "Submitting…"
                    : "Submit Test →"
                  : "Next Question →"}
              </button>
            )}

            {currentQ.timer && (
              <p style={{ color: "#555", fontSize: 13, textAlign: "center", marginTop: 8 }}>
                This question auto-advances when time runs out. Select your answer now.
              </p>
            )}
          </div>
        </div>
      )}
      <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #0a0a0a;
            color: #f0f0f0;
            min-height: 100vh;
            user-select: none;
            -webkit-user-select: none;
          }
          .screen {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 24px;
          }
          .card {
            background: #151515;
            border: 1px solid #2a2a2a;
            border-radius: 16px;
            padding: 40px;
            max-width: 760px;
            width: 100%;
          }
          .logo { font-size: 13px; letter-spacing: 2px; color: #555; margin-bottom: 32px; text-transform: uppercase; }
          h1 { font-size: 26px; font-weight: 600; margin-bottom: 8px; }
          h2 { font-size: 20px; font-weight: 500; margin-bottom: 24px; line-height: 1.5; }
          .subtitle { color: #888; font-size: 14px; margin-bottom: 32px; line-height: 1.6; }
          .btn {
            background: #fff;
            color: #000;
            border: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: opacity 0.15s;
          }
          .btn:hover { opacity: 0.85; }
          .btn-dark {
            background: #222;
            color: #fff;
            border: 1px solid #333;
          }
          .progress-bar {
            height: 4px;
            background: #1f1f1f;
            border-radius: 2px;
            margin-bottom: 28px;
            overflow: hidden;
          }
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #7c3aed, #06b6d4);
            border-radius: 2px;
            transition: width 0.4s ease;
          }
          .q-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .q-type-badge {
            font-size: 11px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            padding: 4px 10px;
            border-radius: 20px;
            font-weight: 600;
          }
          .q-count { font-size: 13px; color: #666; }
          .timer-ring {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 15px;
            font-weight: 700;
          }
          .timer-ring.urgent { color: #ef4444; animation: pulse 0.5s ease infinite alternate; }
          @keyframes pulse { to { opacity: 0.5; } }
          .q-text {
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 28px;
            color: #f0f0f0;
          }
          .options { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
          .option-btn {
            display: flex;
            align-items: flex-start;
            gap: 14px;
            padding: 14px 18px;
            border-radius: 10px;
            border: 1px solid #2a2a2a;
            background: #1a1a1a;
            cursor: pointer;
            transition: all 0.15s;
            text-align: left;
            color: #d0d0d0;
            font-size: 14px;
            line-height: 1.5;
          }
          .option-btn:hover:not(.selected):not(.locked) { border-color: #555; background: #202020; }
          .option-btn.selected { border-color: #7c3aed; background: #1a1030; color: #c4b5fd; }
          .option-btn.locked { cursor: default; opacity: 0.6; }
          .option-key {
            min-width: 24px;
            height: 24px;
            border-radius: 6px;
            background: #2a2a2a;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 700;
            color: #888;
            flex-shrink: 0;
            margin-top: 1px;
          }
          .selected .option-key { background: #7c3aed; color: #fff; }
          .code-area {
            width: 100%;
            background: #111;
            border: 1px solid #2a2a2a;
            border-radius: 10px;
            padding: 16px;
            color: #00e676;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.6;
            min-height: 200px;
            resize: vertical;
            outline: none;
            margin-bottom: 24px;
            user-select: text;
            -webkit-user-select: text;
          }
          .code-area:focus { border-color: #444; }
          .warning-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #7f1d1d;
            color: #fca5a5;
            text-align: center;
            padding: 12px;
            font-size: 13px;
            font-weight: 600;
            z-index: 9999;
            animation: slideDown 0.3s ease;
          }
          @keyframes slideDown { from { transform: translateY(-100%); } }
          .cheat-badges {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
            flex-wrap: wrap;
          }
          .cheat-badge {
            font-size: 11px;
            padding: 3px 10px;
            border-radius: 20px;
            background: #1f1f1f;
            color: #666;
          }
          .cheat-badge.active { background: #450a0a; color: #fca5a5; }
          .done-screen { text-align: center; }
          .done-icon { font-size: 64px; margin-bottom: 24px; }
          .fs-warning {
            background: #1a1200;
            border: 1px solid #854d0e;
            border-radius: 10px;
            padding: 16px;
            text-align: center;
            color: #fbbf24;
            margin-top: 20px;
          }
          .rules-list { list-style: none; text-align: left; margin: 20px 0; }
          .rules-list li {
            padding: 8px 0;
            border-bottom: 1px solid #1f1f1f;
            color: #aaa;
            font-size: 14px;
            padding-left: 20px;
            position: relative;
          }
          .rules-list li::before { content: "→"; position: absolute; left: 0; color: #555; }
        `}</style>
    </>
  );
}