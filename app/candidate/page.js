"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Lock, SendHorizonal } from "lucide-react";

const API_BASE = "https://edevalentum.com";

// ============================================================
// QUESTION BANK  (unchanged)
// ============================================================
const QUESTIONS = {
  apt_001: { type: "aptitude", text: "If a train travels 360 km in 4 hours, how long will it take to travel 630 km at the same speed?", options: ["A. 6 hours", "B. 7 hours", "C. 6.5 hours", "D. 8 hours"], correct: "B", timer: 15 },
  apt_002: { type: "aptitude", text: "A shopkeeper buys an item for ₹500 and sells it at 20% profit. What is the selling price?", options: ["A. ₹550", "B. ₹580", "C. ₹600", "D. ₹620"], correct: "C", timer: 15 },
  apt_003: { type: "aptitude", text: "What comes next in the series: 2, 6, 12, 20, 30, ?", options: ["A. 42", "B. 40", "C. 44", "D. 36"], correct: "A", timer: 15 },
  apt_004: { type: "aptitude", text: "If 6 workers complete a job in 12 days, how many days would 9 workers take?", options: ["A. 9 days", "B. 7 days", "C. 6 days", "D. 8 days"], correct: "D", timer: 15 },
  apt_005: { type: "aptitude", text: "A rectangle has a perimeter of 56 cm and a width of 10 cm. What is its area?", options: ["A. 160 cm²", "B. 180 cm²", "C. 140 cm²", "D. 200 cm²"], correct: "B", timer: 15 },
  apt_006: { type: "aptitude", text: "What is 15% of 240?", options: ["A. 32", "B. 34", "C. 36", "D. 38"], correct: "C", timer: 15 },
  apt_007: { type: "aptitude", text: "A man walks 5 km North, then 12 km East. How far is he from the start?", options: ["A. 13 km", "B. 15 km", "C. 17 km", "D. 11 km"], correct: "A", timer: 15 },
  apt_008: { type: "aptitude", text: "If today is Wednesday, what day will it be after 100 days?", options: ["A. Monday", "B. Friday", "C. Saturday", "D. Sunday"], correct: "B", timer: 15 },
  apt_009: { type: "aptitude", text: "A bucket is 3/5 full. After adding 6 litres it becomes 4/5 full. What is the total capacity?", options: ["A. 25L", "B. 28L", "C. 30L", "D. 32L"], correct: "C", timer: 15 },
  apt_010: { type: "aptitude", text: "A sum doubles in 8 years at simple interest. What is the interest rate per annum?", options: ["A. 10%", "B. 11%", "C. 12.5%", "D. 15%"], correct: "C", timer: 15 },
  grm_001: { type: "grammar", text: "Choose the grammatically correct sentence:", options: ["A. She don't know the answer.", "B. She doesn't knows the answer.", "C. She doesn't know the answer.", "D. She not know the answer."], correct: "C", timer: 15 },
  grm_002: { type: "grammar", text: "Select the correct form: 'Neither the manager nor the employees ___ happy.'", options: ["A. was", "B. were", "C. is", "D. has been"], correct: "B", timer: 15 },
  grm_003: { type: "grammar", text: "Which sentence uses the past perfect correctly?", options: ["A. She had left before he arrived.", "B. She has left before he arrived.", "C. She left before he had arrived.", "D. She was leaving before he arrived."], correct: "A", timer: 15 },
  grm_004: { type: "grammar", text: "Choose the correctly punctuated sentence:", options: ["A. Its a lovely day, isnt it.", "B. It's a lovely day, isn't it?", "C. Its a lovely day isn't it?", "D. It's a lovely day isnt it?"], correct: "B", timer: 15 },
  grm_005: { type: "grammar", text: "Which word correctly completes the sentence? 'The team ___ their best effort.'", options: ["A. give", "B. gives", "C. giving", "D. gave"], correct: "D", timer: 15 },
  grm_006: { type: "grammar", text: "Identify the correct passive voice: 'The manager approved the report.'", options: ["A. The report was approved by the manager.", "B. The report is approved by the manager.", "C. The report approved by the manager.", "D. The report has been approving by the manager."], correct: "A", timer: 15 },
  grm_007: { type: "grammar", text: "Which sentence is free from redundancy?", options: ["A. Please revert back to me.", "B. Please revert to me.", "C. Please revert me back.", "D. Please revert back me."], correct: "B", timer: 15 },
  grm_008: { type: "grammar", text: "'He is one of those managers who ___ very detail-oriented.'", options: ["A. is", "B. was", "C. are", "D. has been"], correct: "C", timer: 15 },
  grm_009: { type: "grammar", text: "Choose the correct preposition: 'She has been working here ___ 2019.'", options: ["A. for", "B. from", "C. since", "D. by"], correct: "C", timer: 15 },
  grm_010: { type: "grammar", text: "Which is the correct comparative form?", options: ["A. This problem is more easier.", "B. This problem is more easy.", "C. This problem is easier.", "D. This problem is easiest."], correct: "C", timer: 15 },
  cod_001: { type: "coding", text: "Write a Python function that takes a list of numbers and returns the two numbers that sum closest to zero.", placeholder: "def closest_to_zero(nums):\n    # your code here\n    pass", timer: 30 },
  cod_002: { type: "coding", text: "Implement a function to check if a given string is a valid palindrome (ignore spaces and case).", placeholder: "def is_palindrome(s):\n    # your code here\n    pass", timer: 30 },
  cod_003: { type: "coding", text: "Write a SQL query to find the second highest salary from a table called 'employees' with column 'salary'.", placeholder: "SELECT ...", timer: 30 },
  cod_004: { type: "coding", text: "Explain the difference between a stack and a queue and implement a queue using two stacks in Python.", placeholder: "class QueueWithStacks:\n    def __init__(self):\n        pass\n    def enqueue(self, val):\n        pass\n    def dequeue(self):\n        pass", timer: 30 },
};

// ============================================================
// MAIN PAGE
// ============================================================
export default function CandidatePage() {
  const searchParams = useSearchParams();
  const testId = searchParams.get("screen");

  const [phase, setPhase] = useState("loading");
  const [testData, setTestData] = useState(null);
  const [questionIds, setQuestionIds] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [lockedAnswers, setLockedAnswers] = useState({});
  const [countdown, setCountdown] = useState(15);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [warningMsg, setWarningMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cameraError, setCameraError] = useState("");
  // Track snapshot status for debugging
  const [snapshotStatus, setSnapshotStatus] = useState([]);

  // ── Refs ──────────────────────────────────────────────────
  const answersRef        = useRef({});
  const questionStartTime = useRef(Date.now());
  const countdownRef      = useRef(null);
  const cheatRef          = useRef({ tab: 0, fs: 0, rc: 0 });
  const videoRef          = useRef(null);
  const streamRef         = useRef(null);
  const snapshotTimers    = useRef([]);
  const advancingRef      = useRef(false);
  const currentIdxRef     = useRef(0);
  const questionIdsRef    = useRef([]);
  const submittingRef     = useRef(false);
  const phaseRef          = useRef("loading");
  // Tracks when the test actually started (for relative snapshot timing)
  const testStartTime     = useRef(null);

  useEffect(() => { currentIdxRef.current  = currentIdx;  }, [currentIdx]);
  useEffect(() => { questionIdsRef.current = questionIds; }, [questionIds]);
  useEffect(() => { phaseRef.current       = phase;       }, [phase]);

  // ── Fetch test data ───────────────────────────────────────
  useEffect(() => {
    if (!testId) { setPhase("error"); return; }
    fetch(`${API_BASE}/api/test/${testId}`)
      .then((r) => {
        if (!r.ok) throw new Error(r.status === 410 ? "completed" : "not_found");
        return r.json();
      })
      .then((data) => {
        setTestData(data);
        const ids = data.question_ids.filter((qid) => {
          if (!QUESTIONS[qid]) { console.warn(`Missing question: ${qid}`); return false; }
          return true;
        });
        if (!ids.length) { setPhase("error"); return; }
        setQuestionIds(ids);
        questionIdsRef.current = ids;
        setPhase("start");
      })
      .catch((err) => setPhase(err.message === "completed" ? "done" : "error"));
  }, [testId]);

  // ── Camera setup ──────────────────────────────────────────
  // FIX: The video element must NOT be hidden with width/height:1px or
  // position off-screen. Chrome throttles/stops decoding invisible video.
  // Instead we use visibility:hidden + real dimensions so the browser
  // fully decodes the stream while keeping it visually invisible.
  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;

      const v = videoRef.current;
      if (!v) throw new Error("videoRef not mounted");

      v.srcObject = stream;

      // Wait for video metadata AND first frame to be truly ready
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("video timeout")), 10000);
        const onReady = () => {
          clearTimeout(timeout);
          resolve();
        };
        // loadeddata fires once the first frame is decoded
        if (v.readyState >= 2) {
          clearTimeout(timeout);
          resolve();
        } else {
          v.addEventListener("loadeddata", onReady, { once: true });
        }
        v.play().catch((e) => {
          // Autoplay may be blocked in some contexts — not fatal
          console.warn("video play() blocked:", e);
        });
      });

      console.log(`[Camera] Ready. videoWidth=${v.videoWidth} videoHeight=${v.videoHeight}`);
      return true;
    } catch (err) {
      console.warn("[Camera] Setup failed:", err.message);
      setCameraError("Camera access denied or unavailable. Proceeding without photo verification.");
      return false;
    }
  };

  // ── takeSnapshot ─────────────────────────────────────────
  // FIX: Added thorough checks, console logging so you can confirm
  // each shot fires, and a retry if videoWidth is still 0.
  const takeSnapshot = useCallback(
    async (index) => {
      console.log(`[Snapshot] Attempting snapshot #${index}`);

      const v = videoRef.current;
      const stream = streamRef.current;

      if (!v || !stream) {
        console.warn(`[Snapshot #${index}] Skipped — video or stream not available`);
        setSnapshotStatus((s) => [...s, { index, status: "skipped: no video/stream" }]);
        return;
      }

      // If videoWidth is 0 the frame hasn't decoded yet — wait up to 2s
      if (!v.videoWidth || !v.videoHeight) {
        console.warn(`[Snapshot #${index}] videoWidth=0, waiting for decode…`);
        await new Promise((res) => setTimeout(res, 2000));
        if (!v.videoWidth || !v.videoHeight) {
          console.warn(`[Snapshot #${index}] Still no video dimensions, giving up`);
          setSnapshotStatus((s) => [...s, { index, status: "skipped: zero dimensions" }]);
          return;
        }
      }

      try {
        const canvas = document.createElement("canvas");
        canvas.width  = v.videoWidth;
        canvas.height = v.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(v, 0, 0, canvas.width, canvas.height);

        // Verify the canvas has actual pixel data (not blank)
        const pixel = ctx.getImageData(0, 0, 1, 1).data;
        const isBlank = pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0 && pixel[3] === 0;
        if (isBlank) {
          console.warn(`[Snapshot #${index}] Canvas appears blank (RGBA all zero)`);
        }

        const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
        console.log(`[Snapshot #${index}] Captured ${Math.round(dataUrl.length / 1024)}KB, blank=${isBlank}`);

        const res = await fetch(`${API_BASE}/api/submit-snapshot`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            test_id:        testId,
            snapshot_index: index,
            image_data:     dataUrl,
          }),
        });

        if (res.ok) {
          console.log(`[Snapshot #${index}] Saved to server ✓`);
          setSnapshotStatus((s) => [...s, { index, status: "saved" }]);
        } else {
          const body = await res.text();
          console.error(`[Snapshot #${index}] Server error ${res.status}: ${body}`);
          setSnapshotStatus((s) => [...s, { index, status: `server error ${res.status}` }]);
        }
      } catch (err) {
        console.error(`[Snapshot #${index}] Exception:`, err);
        setSnapshotStatus((s) => [...s, { index, status: `exception: ${err.message}` }]);
      }
    },
    [testId]
  );

  // ── scheduleSnapshots ─────────────────────────────────────
  // FIX: Schedule relative to ACTUAL question count × avg time,
  // not a hardcoded 8-minute window. With 24 questions the real
  // test duration is ~5 min. Using 8 min pushed shot #3 past
  // test completion, causing stopCamera() to kill it early.
  const scheduleSnapshots = useCallback(
    (estimatedMs) => {
      snapshotTimers.current.forEach(clearTimeout);

      // Space 3 shots at 20%, 50%, and 78% of estimated duration
      // with small random jitter so they don't cluster
      const jitter  = () => (Math.random() - 0.5) * estimatedMs * 0.06;
      const delays  = [
        estimatedMs * 0.20 + jitter(),
        estimatedMs * 0.50 + jitter(),
        estimatedMs * 0.78 + jitter(),
      ].map((d) => Math.max(5000, d)); // at least 5s from start

      console.log(`[Snapshots] Scheduled at: ${delays.map((d) => `${Math.round(d / 1000)}s`).join(", ")}`);

      snapshotTimers.current = delays.map((delay, i) =>
        setTimeout(() => takeSnapshot(i + 1), delay)
      );
    },
    [takeSnapshot]
  );

  const stopCamera = () => {
    snapshotTimers.current.forEach(clearTimeout);
    snapshotTimers.current = [];
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  // ── Fullscreen enforcement ────────────────────────────────
  useEffect(() => {
    if (phase !== "test") return;
    let retryCount = 0;

    const reEnterFullscreen = () => {
      if (phaseRef.current !== "test") return;
      const el  = document.documentElement;
      const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen;
      if (req) {
        req.call(el).catch(() => {
          if (retryCount < 5) { retryCount++; setTimeout(reEnterFullscreen, 300); }
        });
      }
    };

    const onFsChange = () => {
      const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
      setIsFullscreen(isFs);
      if (!isFs && phaseRef.current === "test") {
        retryCount = 0;
        logCheat("fullscreen_exit");
        setWarningMsg("⚠ Fullscreen exit detected! Returning automatically…");
        setTimeout(() => setWarningMsg(""), 4000);
        reEnterFullscreen();
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── Block keyboard shortcuts ──────────────────────────────
  useEffect(() => {
    if (phase !== "test") return;
    const blockKeys = (e) => {
      if (["Escape", "F11", "F12", "F5"].includes(e.key)) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
      const ctrlBlocked = ["c","v","a","u","s","p","i","j","w","t","n","r"];
      if ((e.ctrlKey || e.metaKey) && ctrlBlocked.includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", blockKeys, true);
    document.addEventListener("keyup",   blockKeys, true);
    return () => {
      document.removeEventListener("keydown", blockKeys, true);
      document.removeEventListener("keyup",   blockKeys, true);
    };
  }, [phase]);

  // ── Window blur ───────────────────────────────────────────
  useEffect(() => {
    if (phase !== "test") return;
    const onBlur = () => {
      logCheat("tab_switch");
      setWarningMsg("⚠ Window switch/minimize detected! Recorded.");
      setTimeout(() => setWarningMsg(""), 4000);
      setTimeout(() => window.focus(), 200);
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [phase]);

  // ── Right-click block ─────────────────────────────────────
  useEffect(() => {
    if (phase !== "test") return;
    const block = (e) => {
      e.preventDefault();
      logCheat("right_click");
      setWarningMsg("⚠ Right-click disabled during test.");
      setTimeout(() => setWarningMsg(""), 3000);
    };
    document.addEventListener("contextmenu", block);
    return () => document.removeEventListener("contextmenu", block);
  }, [phase]);

  // ── Tab visibility ────────────────────────────────────────
  useEffect(() => {
    if (phase !== "test") return;
    const onVis = () => {
      if (document.hidden) {
        logCheat("tab_switch");
        setWarningMsg("⚠ Tab switch detected! This has been recorded.");
        setTimeout(() => setWarningMsg(""), 4000);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [phase]);

  // ── Per-question countdown ────────────────────────────────
  useEffect(() => {
    if (phase !== "test") return;
    const qId = questionIdsRef.current[currentIdx];
    const q   = QUESTIONS[qId];
    if (!q?.timer) return;

    advancingRef.current     = false;
    questionStartTime.current = Date.now();
    setCountdown(q.timer);
    clearInterval(countdownRef.current);

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          if (!advancingRef.current) {
            advancingRef.current = true;
            const idx        = currentIdxRef.current;
            const ids        = questionIdsRef.current;
            const currentQId = ids[idx];
            const timeTaken  = (Date.now() - questionStartTime.current) / 1000;
            const answer     = answersRef.current[currentQId] ?? null;

            setLockedAnswers((la) => ({ ...la, [currentQId]: answer }));
            submitAnswer(currentQId, answer, timeTaken);

            if (idx + 1 >= ids.length) { completeTest(); }
            else { setCurrentIdx(idx + 1); }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, phase]);

  const logCheat = async (eventType) => {
    const key = eventType === "tab_switch" ? "tab" : eventType === "fullscreen_exit" ? "fs" : "rc";
    cheatRef.current[key]++;
    try {
      await fetch(`${API_BASE}/api/log-cheat-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test_id: testId, event_type: eventType }),
      });
    } catch {}
  };

  const submitAnswer = async (qId, answer, timeTaken) => {
    const q = QUESTIONS[qId];
    if (!q) return;
    const isCorrect = q.correct ? answer === q.correct : null;
    try {
      await fetch(`${API_BASE}/api/submit-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          test_id:            testId,
          question_id:        qId,
          question_type:      q.type,
          selected_answer:    answer ?? null,
          is_correct:         isCorrect,
          correct_answer:     q.correct ?? null,
          time_taken_seconds: Math.round(timeTaken * 10) / 10,
        }),
      });
    } catch {}
  };

  const handleSelectAnswer = (qId, option) => {
    if (lockedAnswers[qId] !== undefined) return;
    const letter = option[0];
    answersRef.current = { ...answersRef.current, [qId]: letter };
    setAnswers((prev) => ({ ...prev, [qId]: letter }));
  };

  const handleNext = async () => {
    clearInterval(countdownRef.current);
    advancingRef.current = true;
    const qId       = questionIdsRef.current[currentIdx];
    const timeTaken = (Date.now() - questionStartTime.current) / 1000;
    const answer    = answersRef.current[qId] ?? null;
    setLockedAnswers((prev) => ({ ...prev, [qId]: answer }));
    await submitAnswer(qId, answer, timeTaken);
    if (currentIdx + 1 >= questionIdsRef.current.length) {
      await completeTest();
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const completeTest = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    stopCamera();
    try {
      await fetch(`${API_BASE}/api/complete-test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          test_id:              testId,
          tab_switches:         cheatRef.current.tab,
          fullscreen_exits:     cheatRef.current.fs,
          right_click_attempts: cheatRef.current.rc,
        }),
      });
    } catch {}
    setPhase("done");
  };

  const enterFullscreen = async () => {
    // 1. Setup camera and wait until video frame is decoded
    const cameraOk = await setupCamera();

    // 2. Calculate realistic test duration for snapshot timing
    //    Sum all question timers so shots land within the actual test window
    const totalTestMs = questionIdsRef.current.reduce((sum, qId) => {
      return sum + (QUESTIONS[qId]?.timer || 15) * 1000;
    }, 0);
    const estimatedMs = Math.max(totalTestMs * 0.85, 30000); // 85% of max (candidates are faster)

    if (cameraOk) {
      console.log(`[Snapshots] Test estimated at ${Math.round(estimatedMs / 1000)}s, scheduling shots…`);
      scheduleSnapshots(estimatedMs);
    }

    // 3. Enter fullscreen
    const el = document.documentElement;
    try {
      if (el.requestFullscreen)          await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.mozRequestFullScreen)    el.mozRequestFullScreen();
    } catch {}
    testStartTime.current = Date.now();
    setIsFullscreen(true);
    setPhase("test");
  };

  // ── Render ────────────────────────────────────────────────
  const currentQId = questionIdsRef.current[currentIdx];
  const currentQ   = QUESTIONS[currentQId];
  const progress   = questionIds.length > 0 ? (currentIdx / questionIds.length) * 100 : 0;
  const typeLabel  = { aptitude: "Aptitude", grammar: "Grammar", coding: "Coding" };
  const typeColor  = { aptitude: "#7c3aed", grammar: "#0891b2", coding: "#059669" };
  const timerMax   = currentQ?.timer || 15;
  const timerPct   = countdown !== null ? (countdown / timerMax) * 100 : 100;
  const timerUrgent = countdown !== null && countdown <= 5;

  return (
    <>
      {/*
        ── HIDDEN VIDEO ELEMENT ────────────────────────────────
        CRITICAL FIX: Must NOT use width:1 height:1 or off-screen
        positioning. Chrome stops decoding video frames when the
        element has no visible rendering surface, causing videoWidth
        and videoHeight to remain 0 forever.

        Use visibility:hidden with a real size (160×120) instead.
        The element is invisible but the browser fully decodes frames.
        position:fixed keeps it out of document flow.
      */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          position:   "fixed",
          top:        0,
          left:       0,
          width:      160,
          height:     120,
          visibility: "hidden",   // invisible but decoded
          pointerEvents: "none",
          zIndex:     -1,
        }}
      />

      {/* Fullscreen blocker overlay */}
      {phase === "test" && !isFullscreen && (
        <div style={{ position:"fixed", inset:0, background:"#000", zIndex:99999, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
          <div style={{ fontSize:48 }}><Lock size={38} /></div>
          <div style={{ color:"white", fontSize:18, fontWeight:700, textAlign:"center" }}>Fullscreen required</div>
          <div style={{ color:"#888", fontSize:14, textAlign:"center", maxWidth:360, lineHeight:1.6 }}>
            The test must run in fullscreen mode. Returning automatically…
          </div>
          <button
            onClick={() => {
              const el = document.documentElement;
              (el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen)?.call(el);
            }}
            style={{ marginTop:8, padding:"10px 28px", background:"#fff", color:"#000", border:"none", borderRadius:40, fontSize:14, fontWeight:600, cursor:"pointer" }}
          >
            Return to fullscreen
          </button>
        </div>
      )}

      {warningMsg && <div className="warning-bar">{warningMsg}</div>}

      {phase === "loading" && (
        <div className="screen"><div style={{ color:"#555", fontSize:14 }}>Loading your test…</div></div>
      )}

      {phase === "error" && (
        <div className="screen">
          <div className="card" style={{ textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>❌</div>
            <h1>Test Not Found</h1>
            <p className="subtitle">This screening link is invalid or has expired. Please contact the recruiter.</p>
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="screen">
          <div className="card done-screen">
            <div className="done-icon">✅</div>
            <h1 style={{ marginBottom:16 }}>Test Submitted!</h1>
            <p style={{ color:"#888", lineHeight:1.7, maxWidth:480, margin:"0 auto" }}>
              Thank you for completing the screening assessment. The HR team at{" "}
              <strong style={{ color:"#ccc" }}>{testData?.company_name || "the company"}</strong>{" "}
              will review your results and get in touch with you soon.
            </p>
            <div style={{ marginTop:32, padding:16, background:"#0d1117", borderRadius:10, fontSize:13, color:"#555" }}>
              Your results are confidential and have been securely submitted.
            </div>
          </div>
        </div>
      )}

      {phase === "start" && (
        <div className="screen">
          <div className="card">
            <div className="logo">{testData?.company_name} — Screening Test</div>
            <p style={{ marginTop:-20, color:"#ccc", fontSize:12 }}>
              Powered by <a href="https://exampaper.academy" style={{ color:"#ccc" }}>Exam Paper Academy</a>
            </p>
            <h1 style={{ color:"white" }}>Hi, {testData?.applicant_name}!</h1>
            <p className="subtitle">
              You&apos;ve been invited to complete a screening assessment for{" "}
              <strong style={{ color:"#e0e0e0" }}>{testData?.job_title}</strong> at{" "}
              <strong style={{ color:"#e0e0e0" }}>{testData?.company_name}</strong>.
            </p>
            <ul className="rules-list">
              <li>Aptitude &amp; Grammar — 15 seconds each (auto-advances)</li>
              <li>Coding questions — 30 seconds each (auto-advances)</li>
              <li>You can click Next to advance early; you cannot go back</li>
              <li>Test stays fullscreen — exits are automatically recovered &amp; flagged</li>
              <li>Tab switching, minimizing, and right-click are logged</li>
              <li>📷 Camera captures 3 random snapshots for identity verification</li>
              <li>Complete the test in one sitting</li>
            </ul>
            {cameraError && (
              <div style={{ background:"#1a0a00", border:"1px solid #7c3a00", borderRadius:10, padding:12, fontSize:13, color:"#f59e0b", marginTop:12 }}>
                ⚠ {cameraError}
              </div>
            )}
            <div style={{ display:"flex", gap:16, marginTop:32 }}>
              <button className="btn" onClick={enterFullscreen}>
                <SendHorizonal size={15} style={{ marginTop:-4 }} />&nbsp; Enter Fullscreen &amp; Begin Test
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === "test" && currentQ && (
        <div className="screen" style={{ justifyContent:"flex-start", paddingTop:60 }}>
          <div className="card">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width:`${progress}%` }} />
            </div>

            <div className="q-header">
              <span className="q-type-badge" style={{ background:typeColor[currentQ.type]+"22", color:typeColor[currentQ.type], border:`1px solid ${typeColor[currentQ.type]}44` }}>
                {typeLabel[currentQ.type]}
              </span>
              <span className="q-count">Question {currentIdx + 1} of {questionIds.length}</span>
              {countdown !== null && (
                <span className={`timer-ring ${timerUrgent ? "urgent" : ""}`}>⏱ {countdown}s</span>
              )}
            </div>

            <div className="countdown-bar">
              <div className="countdown-fill" style={{ width:`${timerPct}%`, background: timerUrgent ? "#ef4444" : typeColor[currentQ.type] }} />
            </div>

            <h2 className="q-text">{currentQ.text}</h2>

            {currentQ.options && (
              <div className="options">
                {currentQ.options.map((opt) => {
                  const key        = opt[0];
                  const isSelected = answers[currentQId] === key;
                  const isLocked   = lockedAnswers[currentQId] !== undefined;
                  return (
                    <button key={opt}
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

            {currentQ.type === "coding" && (
              <textarea className="code-area"
                placeholder={currentQ.placeholder}
                value={answers[currentQId] || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  answersRef.current = { ...answersRef.current, [currentQId]: val };
                  setAnswers((prev) => ({ ...prev, [currentQId]: val }));
                }}
                spellCheck={false}
              />
            )}

            <button className="btn" onClick={handleNext} disabled={submitting} style={{ opacity: submitting ? 0.5 : 1 }}>
              {currentIdx + 1 >= questionIds.length
                ? submitting ? "Submitting…" : "Submit Test →"
                : "Next Question →"}
            </button>
            <p style={{ color:"#555", fontSize:13, textAlign:"center", marginTop:8 }}>
              Auto-advances when time runs out. Click Next to advance early.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lustria&family=DM+Sans:ital,opsz,wght@0,9..40,100..900;1,9..40,100..900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; color: #f0f0f0; min-height: 100vh; user-select: none; -webkit-user-select: none; }
        .screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; }
        .card { background: #151515; border: 1px solid #2a2a2a; border-radius: 16px; padding: 40px; max-width: 760px; width: 100%; }
        .logo { font-size: 13px; letter-spacing: 2px; color: white; margin-bottom: 32px; text-transform: uppercase; }
        h1 { font-size: 26px; font-weight: 600; margin-bottom: 8px; }
        h2 { font-size: 20px; font-weight: 500; margin-bottom: 24px; line-height: 1.5; }
        .subtitle { color: #888; font-size: 14px; margin-bottom: 32px; line-height: 1.6; }
        .btn { background: #fff; color: #000; border: none; padding: 14px 32px; border-radius: 40px; font-size: 15px; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
        .btn:hover { opacity: 0.85; }
        .progress-bar { height: 4px; background: #1f1f1f; border-radius: 2px; margin-bottom: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #7c3aed, #06b6d4); border-radius: 2px; transition: width 0.4s ease; }
        .countdown-bar { height: 3px; background: #1f1f1f; border-radius: 2px; margin-bottom: 22px; overflow: hidden; }
        .countdown-fill { height: 100%; border-radius: 2px; transition: width 1s linear, background 0.3s; }
        .q-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
        .q-type-badge { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; font-weight: 600; }
        .q-count { font-size: 13px; color: #666; }
        .timer-ring { display: flex; align-items: center; gap: 6px; font-size: 15px; font-weight: 700; }
        .timer-ring.urgent { color: #ef4444; animation: pulse 0.5s ease infinite alternate; }
        @keyframes pulse { to { opacity: 0.5; } }
        .q-text { font-size: 18px; line-height: 1.6; margin-bottom: 28px; color: #f0f0f0; }
        .options { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
        .option-btn { display: flex; align-items: flex-start; gap: 14px; padding: 14px 18px; border-radius: 10px; border: 1px solid #2a2a2a; background: #1a1a1a; cursor: pointer; transition: all 0.15s; text-align: left; color: #d0d0d0; font-size: 14px; line-height: 1.5; }
        .option-btn:hover:not(.selected):not(.locked) { border-color: #555; background: #202020; }
        .option-btn.selected { border-color: #7c3aed; background: #1a1030; color: #c4b5fd; }
        .option-btn.locked { cursor: default; opacity: 0.6; }
        .option-key { min-width: 24px; height: 24px; border-radius: 6px; background: #2a2a2a; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #888; flex-shrink: 0; margin-top: 1px; }
        .selected .option-key { background: #7c3aed; color: #fff; }
        .code-area { width: 100%; background: #111; border: 1px solid #2a2a2a; border-radius: 10px; padding: 16px; color: #00e676; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.6; min-height: 160px; resize: vertical; outline: none; margin-bottom: 24px; user-select: text; -webkit-user-select: text; }
        .code-area:focus { border-color: #444; }
        .warning-bar { position: fixed; top: 0; left: 0; right: 0; background: #7f1d1d; color: #fca5a5; text-align: center; padding: 12px; font-size: 13px; font-weight: 600; z-index: 9999; animation: slideDown 0.3s ease; }
        @keyframes slideDown { from { transform: translateY(-100%); } }
        .done-screen { text-align: center; }
        .done-icon { font-size: 64px; margin-bottom: 24px; }
        .rules-list { list-style: none; text-align: left; margin: 20px 0; }
        .rules-list li { padding: 8px 0; border-bottom: 1px solid #1f1f1f; color: #aaa; font-size: 14px; padding-left: 20px; position: relative; }
        .rules-list li::before { content: "→"; position: absolute; left: 0; color: #555; }
      `}</style>
    </>
  );
}