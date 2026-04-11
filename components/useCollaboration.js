/**
 * useCollaboration.js
 * Drop in: ./useCollaboration.js
 */
import { useState, useEffect } from "react";

export function useCollaboration(jobId, userEmail, jobCreatorEmail) {
  const [role, setRole]       = useState(null);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  const isOwner = !!(userEmail && jobCreatorEmail && userEmail === jobCreatorEmail);

  useEffect(() => {
    if (!jobId || !userEmail || isOwner) { setLoading(false); return; }

    fetch(`http://localhost:8003/collaboration/check?job_id=${encodeURIComponent(jobId)}&email=${encodeURIComponent(userEmail)}`)
      .then(r => r.json())
      .then(d => {
        if (d.has_access) { setRole(d.role); setVerified(d.verified); }
        else              { setRole(null);   setVerified(false); }
      })
      .catch(() => { setRole(null); setVerified(false); })
      .finally(() => setLoading(false));
  }, [jobId, userEmail, isOwner]);

  if (isOwner) return { role: "owner", canEdit: true, canDelete: true, canViewApplicants: true, isOwner: true, verified: true, loading: false };

  return {
    role,
    verified,
    canEdit:            role === "admin" || role === "editor",
    canDelete:          role === "admin" || role === "editor",
    canViewApplicants:  role === "admin" || role === "viewer",
    isOwner: false,
    loading,
  };
}

/**
 * useCollabJobs — fetch all jobs Person B has been invited to
 * (both pending and verified). Use this inside CompanyDashboard
 * to merge with owned jobs.
 */
export function useCollabJobs(userEmail) {
  const [collabJobs, setCollabJobs] = useState([]);
  const [loadingCollab, setLoadingCollab] = useState(false);

  const fetchCollabJobs = async (email) => {
    if (!email) return;
    setLoadingCollab(true);
    try {
      const res  = await fetch(`http://localhost:8003/collaboration/my-access/${encodeURIComponent(email)}`);
      const data = await res.json();
      setCollabJobs(data.jobs || []);
    } catch { setCollabJobs([]); }
    finally  { setLoadingCollab(false); }
  };

  useEffect(() => { fetchCollabJobs(userEmail); }, [userEmail]);

  return { collabJobs, loadingCollab, refetchCollabJobs: () => fetchCollabJobs(userEmail) };
}