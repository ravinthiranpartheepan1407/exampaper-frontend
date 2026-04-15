"use client";

/**
 * CollaborateModal.jsx
 * Drop in: /components/CollaborateModal.jsx
 *
 * Also exports:
 *   VerifyAccessButton  — shown on collab job cards for Person B (pending state)
 *   CollabRoleBadge     — role badge shown on verified collab job cards
 */

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Users, X, Plus, Mail, Shield, Eye, Edit3,
  Check, AlertCircle, Loader2, Trash2, Crown,
  ChevronDown, Send, UserCheck, Lock, KeyRound,
  SendHorizonal,
} from "lucide-react";
import { toast } from "react-toastify";

// ─── Role config ─────────────────────────────────────────────────────────────
const ROLES = [
  { id: "admin",  label: "Admin",              icon: Crown,  color: "white", bg: "#15173d", desc: "View applicants, edit & delete job post" },
  { id: "editor", label: "Editor Only",         icon: Edit3,  color: "white", bg: "#15173d", desc: "Edit & delete post, cannot view applicants" },
  { id: "viewer", label: "View Applicants Only", icon: Eye,    color: "white", bg: "#15173d", desc: "View applicants only, cannot edit or delete" },
];

export function getRoleInfo(roleId) {
  return ROLES.find(r => r.id === roleId) || ROLES[0];
}

// ─── CollabRoleBadge ─────────────────────────────────────────────────────────
export function CollabRoleBadge({ role }) {
  const r = getRoleInfo(role);
  const Icon = r.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 20,
      backgroundColor: r.bg, color: r.color,
      fontSize: 11, fontWeight: 700,
    }}>
      <Icon size={11} /> {r.label}
    </span>
  );
}

// ─── RoleDropdown ─────────────────────────────────────────────────────────────
function RoleDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const current = getRoleInfo(value);
  const Icon = current.icon;

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 6, left: rect.left });
    }
    setOpen(!open);
  };

  return (
    <div style={{ position: "relative" }}>
      <button ref={btnRef} type="button" onClick={handleOpen} style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "6px 12px", borderRadius: 20,
        border: "1.5px solid #e2e8f0",
        backgroundColor: current.bg, color: current.color,
        fontSize: 13, fontWeight: 400, cursor: "pointer", whiteSpace: "nowrap",
      }}>
        <Icon size={13} /> {current.label} <ChevronDown size={12} />
      </button>

      {open && createPortal(
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 99998 }} />
          <div style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            zIndex: 99999,
            minWidth: 230,
            overflow: "hidden",
          }}>
            {ROLES.map(role => {
              const RIcon = role.icon;
              return (
                <button key={role.id} type="button"
                  onClick={() => { onChange(role.id); setOpen(false); }}
                  style={{
                    display: "flex", flexDirection: "column",
                    padding: "10px 14px", width: "100%",
                    border: "none", backgroundColor: value === role.id ? role.bg : "white",
                    cursor: "pointer", textAlign: "left",
                    borderBottom: "1px solid #f1f5f9",
                  }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, color: role.color, fontWeight: 600, fontSize: 13 }}>
                    <RIcon size={13} /> {role.label}
                  </span>
                  <span style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{role.desc}</span>
                </button>
              );
            })}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

// ─── OTP Verify Popup (inline portal) ────────────────────────────────────────
function OtpVerifyPopup({ jobId, userEmail, onSuccess, onClose }) {
  const [otp, setOtp]       = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    try {
      const res  = await fetch("https://edevalentum.com/collaboration/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: jobId, email: userEmail, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid OTP");
      toast.success(`Access granted! Role: ${data.role}`);
      onSuccess(data.role);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        zIndex: 99999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: "white", borderRadius: 20,
          width: "100%", maxWidth: 380,
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ backgroundColor: "#15173D", padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "white" }}>
            <KeyRound size={18} />
            <span style={{ fontWeight: 700, fontSize: 15 }}>Verify Access</span>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}>
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>
          <p style={{ margin: "0 0 16px", fontSize: 13, color: "#64748b", textAlign: "center", lineHeight: 1.5 }}>
            Enter the 6-digit OTP sent to<br />
            <strong style={{ color: "#15173D" }}>{userEmail}</strong>
          </p>

          <input
            type="text"
            placeholder="• • • • • •"
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            style={{
              width: "100%", padding: "14px",
              borderRadius: 12, border: "2px solid #e2e8f0",
              fontSize: 28, letterSpacing: 14, textAlign: "center",
              color: "#15173D", fontWeight: 800,
              outline: "none", boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = "#15173D"}
            onBlur={e  => e.target.style.borderColor = "#e2e8f0"}
            autoFocus
          />

          <button
            onClick={handleVerify}
            disabled={loading || otp.length < 6}
            style={{
              width: "100%", marginTop: 14, padding: "12px",
              borderRadius: 12, border: "none",
              backgroundColor: "#15173D", color: "white",
              fontWeight: 700, fontSize: 14,
              cursor: loading || otp.length < 6 ? "not-allowed" : "pointer",
              opacity: loading || otp.length < 6 ? 0.6 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "opacity 0.2s",
            }}
          >
            {loading ? <Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} /> : <UserCheck size={16} />}
            {loading ? "Verifying..." : "Verify & Get Access"}
          </button>

          <p style={{ margin: "12px 0 0", fontSize: 11, color: "#94a3b8", textAlign: "center" }}>
            Check your email inbox for the code. Expires in 15 minutes.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── VerifyAccessButton — shown on pending collab job cards ──────────────────
export function VerifyAccessButton({ jobId, userEmail, onVerified }) {
  const [showOtp, setShowOtp] = useState(false);

  const handleSuccess = (role) => {
    setShowOtp(false);
    if (onVerified) onVerified(role);
  };

  return (
    <>
      <button
        onClick={e => { e.stopPropagation(); setShowOtp(true); }}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 14px", borderRadius: 20,
          border: "1.5px solid #f59e0b",
          backgroundColor: "#fef3c7", color: "#b45309",
          fontWeight: 600, fontSize: 12, cursor: "pointer",
        }}
      >
        <KeyRound size={12} /> Verify Access
      </button>

      {showOtp && (
        <OtpVerifyPopup
          jobId={jobId}
          userEmail={userEmail}
          onSuccess={handleSuccess}
          onClose={() => setShowOtp(false)}
        />
      )}
    </>
  );
}

// ─── Main CollaborateModal (owner sends invites) ──────────────────────────────
export default function CollaborateModal({ job, ownerEmail }) {
  const [open, setOpen]               = useState(false);
  const [emailInputs, setEmailInputs] = useState([{ email: "", role: "viewer" }]);
  const [loading, setLoading]         = useState(false);
  const [existing, setExisting]       = useState([]);
  const [loadingExisting, setLoadingExisting] = useState(false);

  useEffect(() => {
    if (!open || !job?.id) return;
    setLoadingExisting(true);
    fetch(`https://edevalentum.com/collaboration/list/${job.id}`)
      .then(r => r.json())
      .then(d => setExisting(d.collaborators || []))
      .catch(() => {})
      .finally(() => setLoadingExisting(false));
  }, [open, job?.id]);

  const addRow    = () => setEmailInputs([...emailInputs, { email: "", role: "viewer" }]);
  const removeRow = i  => setEmailInputs(emailInputs.filter((_, idx) => idx !== i));
  const updateRow = (i, field, value) =>
    setEmailInputs(emailInputs.map((row, idx) => idx === i ? { ...row, [field]: value } : row));

  const handleRevoke = async (collaboratorEmail) => {
    try {
      const res = await fetch("https://edevalentum.com/collaboration/revoke", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: job.id, owner_email: ownerEmail, collaborator_email: collaboratorEmail }),
      });
      if (!res.ok) throw new Error();
      setExisting(existing.filter(c => c.email !== collaboratorEmail));
      toast.success("Access revoked.");
    } catch { toast.error("Failed to revoke access."); }
  };

  const handleSend = async () => {
    const valid = emailInputs.filter(r => r.email.trim());
    if (!valid.length) return toast.error("Add at least one email.");
    setLoading(true);
    try {
      const res  = await fetch("https://edevalentum.com/collaboration/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: job.id, job_title: job.title, owner_email: ownerEmail, invites: valid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed");

      data.results.forEach(r => {
        if (r.status === "sent")           toast.success(`Invite sent to ${r.email}`);
        else if (r.status === "not_registered") toast.error(`${r.email} is not registered`);
        else                               toast.error(`${r.email}: ${r.reason}`);
      });

      setEmailInputs([{ email: "", role: "viewer" }]);
      const listRes  = await fetch(`https://edevalentum.com/collaboration/list/${job.id}`);
      const listData = await listRes.json();
      setExisting(listData.collaborators || []);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="edit-button"
      >
        <Users  size={14} style={{ marginTop: -3 }} /> Collaborate
      </button>
      
      <style jsx>{`
        .edit-button {
          padding: 0.3rem 0.8rem;
          border-radius: 40px;
          border: none;
          background-color: #15173D;
          border: 0.6px solid;
          border-style: dashed;
          border-color: #15173D;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          box-shadow: 0 2px 4px rgba(184, 203, 255, 0.2);
        }

        .edit-button:hover {
          background-color: #FFF7F7;
          color: #15173D;
        }  
      `}</style>

      {/* Portal modal */}
      {open && typeof document !== "undefined" && createPortal(
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(4px)",
            zIndex: 99999,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: "white", borderRadius: 20,
              width: "100%", maxWidth: 580, maxHeight: "90vh",
              overflow: "hidden", display: "flex", flexDirection: "column",
              boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "20px 24px", borderBottom: "1px solid #f1f5f9",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              backgroundColor: "#15173D", borderRadius: "20px 20px 0 0",
            }}>
              <div>
                <h3 style={{ color: "white", margin: 0, fontSize: 17, display: "flex", alignItems: "center", gap: 8 }}>
                  <Users size={18} /> Team Collaboration
                </h3>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, margin: "3px 0 0" }}>{job?.title}</p>
              </div>
              <button onClick={() => setOpen(false)} style={{
                background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%",
                width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "white",
              }}>
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div style={{ overflowY: "auto", flex: 1, padding: 24 }}>

              {/* Invite rows */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#15173D", display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <Mail size={14} /> Invite Team Members
                </label>
                {emailInputs.map((row, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                    <input
                      type="email"
                      placeholder="colleague@company.com"
                      value={row.email}
                      onChange={e => updateRow(i, "email", e.target.value)}
                      style={{
                        flex: 1, padding: "9px 14px", borderRadius: 10,
                        border: "1.5px solid #e2e8f0", fontSize: 13, color: "#15173D",
                        outline: "none",
                      }}
                      onFocus={e => e.target.style.borderColor = "#15173D"}
                      onBlur={e  => e.target.style.borderColor = "#e2e8f0"}
                    />
                    <RoleDropdown value={row.role} onChange={v => updateRow(i, "role", v)} />
                    {emailInputs.length > 1 && (
                      <button type="button" onClick={() => removeRow(i)} style={{
                        background: "#fee2e2", border: "none", borderRadius: 8,
                        width: 32, height: 32, display: "flex", alignItems: "center",
                        justifyContent: "center", cursor: "pointer", color: "#ef4444", flexShrink: 0,
                      }}>
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addRow} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 14px", borderRadius: 8,
                  border: "1.5px dashed #cbd5e1", backgroundColor: "transparent",
                  color: "#64748b", fontSize: 12, fontWeight: 500, cursor: "pointer", marginTop: 6,
                }}>
                  <Plus size={13} /> Add another email
                </button>
              </div>

              {/* Info */}
              <div style={{ backgroundColor: "#f0f9ff", borderRadius: 10, padding: "10px 14px", marginBottom: 20, display: "flex", gap: 8 }}>
                <AlertCircle size={14} color="#0ea5e9" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ margin: 0, fontSize: 12, color: "#0369a1", lineHeight: 1.5 }}>
                  Each invitee gets a unique OTP via email. They'll see a <strong>Verify Access</strong> button on their Job Posts tab and must enter the code to gain access.
                </p>
              </div>

              {/* Send */}
              <button onClick={handleSend} disabled={loading} style={{
                width: "100%", padding: "12px", borderRadius: 40, border: "none",
                backgroundColor: "#15173D", color: "white",
                fontWeight: 500, fontSize: 14,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                opacity: loading ? 0.7 : 1,
              }}>
                {loading ? <Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} /> : <SendHorizonal style={{marginTop: -3}} size={15} />}
                {loading ? "Sending Invites..." : "Send Invitations"}
              </button>

              {/* Existing collaborators */}
              {(loadingExisting || existing.length > 0) && (
                <div style={{ marginTop: 28 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 600, color: "#15173D", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
                    <Shield size={14} /> Current Collaborators
                  </h4>
                  {loadingExisting ? (
                    <div style={{ textAlign: "center", padding: 20 }}>
                      <Loader2 size={20} color="#94a3b8" style={{ animation: "spin 0.8s linear infinite" }} />
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {existing.map(c => {
                        const role = getRoleInfo(c.role);
                        const RIcon = role.icon;
                        return (
                          <div key={c.email} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "10px 14px", borderRadius: 10,
                            backgroundColor: "#f8fafc", border: "1px solid #e2e8f0",
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{
                                width: 34, height: 34, borderRadius: "50%",
                                backgroundColor: role.bg,
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}>
                                <RIcon size={15} color={role.color} />
                              </div>
                              <div>
                                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#15173D" }}>{c.email}</p>
                                <p style={{ margin: 0, fontSize: 11, color: "#15173D", fontWeight: 500 }}>
                                  {role.label} · {c.verified ? "✓ Verified" : "Pending verification"}
                                </p>
                              </div>
                            </div>
                            <button onClick={() => handleRevoke(c.email)} style={{
                              background: "#fee2e2", border: "none", borderRadius: 20,
                              padding: "5px 10px", cursor: "pointer", color: "#ef4444",
                              fontSize: 11, fontWeight: 600,
                              display: "flex", alignItems: "center", gap: 4,
                            }}>
                              <Trash2 style={{marginTop: -2}} size={11} /> Revoke
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}