// components/ConnectModal.js
// Drop-in replacement for your existing "Let's Connect" <a> tag
// Usage: <ConnectModal application={application} />

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const API_BASE = "http://localhost:8002";

export default function ConnectModal({ application }) {
  const [open, setOpen] = useState(false);
  const [sendTest, setSendTest] = useState(true);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null); // { success, test_link, already_exists }
  const [error, setError] = useState("");

  const [userEmail, setUserEmail] = useState('');
  useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/');
          return;
        }
    
        try {
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          const decodedEmail = tokenData.email;
          setUserEmail(decodedEmail);
        } catch (err) {
          console.error('Error decoding token:', err);
          router.push('/');
        }
  }, []);

  const emailTo = application?.applicant_email;
  const name = application?.applicant_name;
  const jobId = application?.job_id;
  const jobTitle = application?.job_title;
  const companyName = application?.company_name;
  const hrEmail = userEmail;

  const handleSend = async () => {
    if (!emailTo) {
      setError("No applicant email found.");
      return;
    }
    setSending(true);
    setError("");
    setResult(null);

    try {
      if (sendTest) {
        // Send screening test invite
        const res = await fetch(`${API_BASE}/api/send-screening`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applicant_email: emailTo,
            applicant_name: name,
            job_id: jobId,
            job_title: jobTitle,
            company_name: companyName,
            hr_email: hrEmail,
          }),
        });
        const data = await res.json();
        console.log("Response:", data);

        if (!res.ok) {
          // Handle FastAPI validation errors
          if (Array.isArray(data.detail)) {
            const messages = data.detail.map(err => `${err.loc.slice(-1)[0]}: ${err.msg}`).join(", ");
            throw new Error(messages);
          }
          throw new Error(data.detail || "Failed to send");
        }
        if (!res.ok) throw new Error(data.detail || "Failed to send");
        setResult({ ...data, type: "test" });
      } else {
        // Plain intro email — open mailto
        const subject = encodeURIComponent(`Next Steps: ${jobTitle} at ${companyName}`);
        const body = encodeURIComponent(
          `Hi ${name},\n\nWe reviewed your application for the ${jobTitle} position at ${companyName} and would love to connect to discuss next steps. Could you please suggest some dates and times for an introductory call?\n\nBest regards,\n${companyName} Team`
        );
        window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;
        setResult({ type: "mailto" });
      }
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Trigger button — replaces your existing <a> */}
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); setResult(null); setError(""); }}
        style={{
          background: "#000",
          color: "#fff",
          padding: "10px 16px",
          borderRadius: 40,
          fontSize: 14,
          border: "none",
          cursor: "pointer",

          alignItems: "center",
          gap: 6,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>&nbsp;
        Let&apos;s Connect!
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999, padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: 16, padding: 32,
              width: "100%", maxWidth: 460, boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              position: "relative",
            }}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              style={{
                position: "absolute", top: 16, right: 16,
                border: "none", background: "#f1f1f1", borderRadius: 50,
                width: 28, height: 28, cursor: "pointer", fontSize: 14, color: "#666",
              }}
            >
              ✕
            </button>

            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: "#15173D" }}>
              Connect with Candidate
            </h2>
            <p style={{ fontSize: 13, color: "#15173D", marginBottom: 24 }}>
              {name} · {application?.job_title || jobTitle}
            </p>

            {/* Email To (read-only) */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#15173D", display: "block", marginBottom: 6 }}>
                EMAIL TO
              </label>
              <input
                value={emailTo}
                readOnly
                style={{
                  width: "100%", padding: "10px 14px", border: "1px solid #e0e0e0",
                  borderRadius: 8, fontSize: 14, background: "#fafafa", color: "#15173D",
                  outline: "none",
                }}
              />
            </div>

            {/* Toggle: Send screening test */}
            <div
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px", border: "0.2px solid #15173D", borderStyle: "dashed",
                borderRadius: 10, marginBottom: 24, background: sendTest ? "#fafafa" : "#f8f4ff7c",
                cursor: "pointer",
              }}
              onClick={() => setSendTest(!sendTest)}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#15173D" }}>
                  Send Preliminary Screening Test
                </div>
                <div style={{ fontSize: 12, color: "#15173D", marginTop: 2 }}>
                  Unique link with aptitude, grammar &amp; coding questions
                </div>
              </div>
              {/* Toggle pill */}
              <div
                style={{
                  width: 44, height: 24, borderRadius: 12, flexShrink: 0,
                  background: sendTest ? "#15173D" : "#d0d0d0",
                  position: "relative", transition: "background 0.2s", marginLeft: 16,
                }}
              >
                <div
                  style={{
                    position: "absolute", top: 2, left: sendTest ? 22 : 2,
                    width: 20, height: 20, background: "#fff",
                    borderRadius: 10, transition: "left 0.2s",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            </div>

            {/* Preview of link when toggled on */}
            {/* {sendTest && (
              <div
                style={{
                  background: "#f3f0ff", border: "1px solid #c4b5fd",
                  borderRadius: 8, padding: "10px 14px", marginBottom: 20,
                  fontSize: 12, color: "#6d28d9", fontFamily: "monospace", wordBreak: "break-all",
                }}
              >
                🔗 http://localhost:3000/candidate?screen=
                <span style={{ color: "#4c1d95" }}>[unique-id]</span>
                <br/>
                <span style={{ color: "#7c3aed", fontFamily: "sans-serif" }}>
                  Unique questions will be shuffled per candidate
                </span>
              </div>
            )} */}

            {/* Error */}
            {error && (
              <div
                style={{
                  background: "#fef2f2", border: "1px solid #fca5a5",
                  borderRadius: 8, padding: "10px 14px", marginBottom: 16,
                  fontSize: 13, color: "#dc2626",
                }}
              >
                {error}
              </div>
            )}

            {/* Success */}
            {result && (
              <div
                style={{
                  background: "#15173D", border: "1px solid #15173D",
                  borderRadius: 8, padding: "12px 14px", marginBottom: 16,
                  fontSize: 13, color: "white",
                }}
              >
                {result.type === "test" ? (
                  <>
                    <div style={{ fontWeight: 400, marginBottom: 0 }}>
                      {result.already_exists ? "Test link already sent!" : "Screening invite sent!"}
                    </div>
                  </>
                ) : (
                  <div style={{ fontWeight: 700 }}>Email client opened</div>
                )}
              </div>
            )}

            {/* Send button */}
            {!result && (
              <button
                onClick={handleSend}
                disabled={sending}
                style={{
                  width: "100%", padding: "13px 0",
                  background: sending ? "#999" : "#15173D",
                  color: "#fff", border: "none",
                  borderRadius: 10, fontSize: 15, fontWeight: 400,
                  cursor: sending ? "not-allowed" : "pointer",
                  transition: "background 0.15s",
                }}
              >
                {sending ? "Sending…" : sendTest ? "Send Screening Invite" : "Open Email Client"}
              </button>
            )}

            {result && (
              <button
                onClick={() => setOpen(false)}
                style={{
                  width: "100%", padding: "13px 0",
                  background: "#f1f1f1", color: "#333", border: "none",
                  borderRadius: 10, fontSize: 15, fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}