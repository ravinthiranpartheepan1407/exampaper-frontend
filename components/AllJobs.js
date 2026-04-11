'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Timer, Mail, Linkedin, Globe2,
  Star, Target, Briefcase, SendHorizonal, Share2, Focus, ArrowLeft,
  Rocket,
  ScanSearch,
  Send,
  Lock
} from 'lucide-react';

export default function AllJobs() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [showDetail, setShowDetail] = useState(false); // mobile: toggle between list and detail
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(tokenData.email);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const params = userEmail ? { user_email: userEmail } : {};
        const res = await axios.get('http://localhost:8000/get-jobs', { params });
        setJobs(res.data);
        if (res.data.length > 0) setSelectedJob(res.data[0]);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [userEmail]);

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setShowDetail(true); // on mobile, switch to detail view
  };

  const handleShare = (job) => {
    const url = `${window.location.origin}/job-search/${job.id}`;
    navigator.clipboard.writeText(url);
  };

  if (loading) return (
    <div style={styles.center}>
      <p style={{ color: '#15173D', fontSize: 14 }}>Loading jobs...</p>
    </div>
  );

  if (jobs.length === 0) return (
    <div style={styles.center}>
      <p style={{ color: '#15173D', fontSize: 14 }}>No job openings found.</p>
    </div>
  );

  return (
    <>
      <div className="jobs-layout">

        {/* ── Left: job card list ── */}
        <div className={`jobs-list${showDetail ? ' jobs-list--hidden' : ''}`}>
          <div style={styles.listHeader}>
            <p style={styles.listTitle}>Job openings: {jobs.length} result{jobs.length !== 1 ? 's' : ''}</p>
            {/* <p style={styles.listCount}>{jobs.length} result{jobs.length !== 1 ? 's' : ''}</p> */}
          </div>

          {jobs.map((job) => (
            <div
              key={job.id}
              style={{
                ...styles.card,
                ...(selectedJob?.id === job.id ? styles.cardActive : {}),
              }}
              onClick={() => handleSelectJob(job)}
            >
              <div style={styles.cardTop}>
                <div style={styles.cardLogo}>
                  {job.company_logo_url ? (
                    <img src={job.company_logo_url} alt="" style={styles.logoImg} />
                  ) : (
                    <span>{job.company_name?.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div style={styles.cardInfo}>
                  <p style={styles.cardTitle}>{job.title}</p>
                  <p style={styles.cardCompany}>{job.company_name} &nbsp;·&nbsp; {job.location}</p>
                  <div style={styles.cardMeta}>
                    <span>{job.experience_required}+ yrs</span>
                    {job.required_skills?.slice(0, 2).map((s, i) => (
                      <span key={i} style={styles.tag}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Right: job detail ── */}
        {selectedJob && (
          <div className={`jobs-detail${showDetail ? ' jobs-detail--visible' : ''}`}>

            {/* Mobile back button */}
            <button className="jobs-back-btn" onClick={() => setShowDetail(false)}>
              <ArrowLeft size={14} style={{ marginTop: -1 }} /> &nbsp;All jobs
            </button>

            {/* Header */}
            <div style={styles.detailHeader}>
              <div style={styles.detailHeaderTop}>
                <div style={styles.detailLogo}>
                  {selectedJob.company_logo_url ? (
                    <img src={selectedJob.company_logo_url} alt="" style={styles.logoImgLg} />
                  ) : (
                    <span style={{ fontSize: 20 }}>{selectedJob.company_name?.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <p style={styles.detailTitle}>{selectedJob.title}</p>
                  <p style={styles.detailCompany}>{selectedJob.company_name} &nbsp;·&nbsp; {selectedJob.location}</p>
                </div>
              </div>

              <div style={styles.detailMeta}>
                <span><Timer size={13} style={styles.metaIcon} /> {selectedJob.experience_required}+ years experience</span>
                {/* <span><Mail size={13} style={styles.metaIcon} /> {selectedJob.company_email}</span> */}
                {selectedJob.linkedin_url && (
                  <a href={selectedJob.linkedin_url} target="_blank" rel="noopener noreferrer" style={styles.metaLink}>
                    <Linkedin size={13} style={styles.metaIcon} /> LinkedIn
                  </a>
                )}
                {selectedJob.website_url && (
                  <a href={selectedJob.website_url} target="_blank" rel="noopener noreferrer" style={styles.metaLink}>
                    <Globe2 size={13} style={styles.metaIcon} /> Website
                  </a>
                )}
              </div>

              <div style={styles.actions}>
                <button style={styles.btnPrimary} onClick={() => router.push('/get-started')}>
                  <ScanSearch size={13} style={{ marginTop: -1 }} /> &nbsp;Find your fit
                </button>
                <button style={styles.btnSecondary} onClick={() => handleShare(selectedJob)}>
                  <Share2 size={13} style={{ marginTop: -1 }} /> &nbsp;Share
                </button>
                <button style={styles.btnSecondary} onClick={() => router.push(`/job-search/${selectedJob.id}`)}>
                  <Send size={13} style={{ marginTop: -1 }} /> &nbsp;Contact
                </button>
              </div>
            </div>

            {/* Body */}
            <div style={styles.detailBody}>

              <div style={styles.section}>
                <p style={styles.sectionTitle}>
                  <Briefcase size={14} style={styles.sectionIcon} /> About the role
                </p>
                <p style={styles.sectionText}>{selectedJob.company_description}</p>
              </div>

              {selectedJob.required_skills?.length > 0 && (
                <div style={styles.section}>
                  <p style={styles.sectionTitle}>
                    <Star size={14} style={styles.sectionIcon} /> Required skills
                  </p>
                  <div style={styles.skillsRow}>
                    {selectedJob.required_skills.map((skill, i) => (
                      <span key={i} style={styles.skillBadge}>{skill}</span>
                    ))}
                  </div>
                </div>
              )}

            <p style={styles.sectionTitle}>
                <Target size={14} style={styles.sectionIcon} /> Desired traits
            </p>

              {selectedJob.desired_traits?.length > 0 && (
                <div style={{ position: 'relative', marginBottom: 28 }}>

                    {/* Blurred content */}
                    <div style={{ filter: 'blur(7.5px)', pointerEvents: 'none', userSelect: 'none' }}>
                    {selectedJob.desired_traits.map((trait, i) => {
                        const pct = (trait.score / 5) * 100;
                        return (
                        <div key={i} style={styles.traitRow}>
                            <div style={styles.traitLabel}>
                            <span>{trait.trait}</span>
                            <span>{trait.score.toFixed(1)} / 5</span>
                            </div>
                            <div style={styles.traitBarBg}>
                            <div style={{ ...styles.traitBar, width: `${pct}%` }} />
                            </div>
                        </div>
                        );
                    })}
                    </div>

                    {/* Overlay */}
                    <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 10, textAlign: 'center',
                    background: '#bff2f738',
                    borderRadius: 12, padding: '16px 20px',
                    }}>
                    <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: '#15173D', border: '0.5px solid #e2e8f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Lock size={12} color="white" />
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#15173D', margin: 0 }}>
                        Get to know your job fit score.
                    </p>
                    <p style={{ fontSize: 12, color: '#15173D', margin: 0, maxWidth: 240, lineHeight: 1.5 }}>
                        Find out if this role suits you by completing the screening requirements.
                    </p>
                    <button
                        onClick={() => router.push('/get-started')}
                        style={{
                        marginTop: 4,
                        background: '#15173D', color: 'white', border: 'none',
                        borderRadius: 40, padding: '8px 20px',
                        fontSize: 12, fontWeight: 500, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6,
                        }}
                    >
                        <Rocket size={12} style={{ marginTop: -2 }} /> Find your job fit
                    </button>
                    </div>

                </div>
                )}

            {/* <div style={{
                backgroundColor: '#15173D', borderRadius: 70,
                padding: '28px 32px', textAlign: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,0.12)'
                }}>
                <p style={{ color: 'white', fontSize: 15, marginBottom: 16 }}>
                    Interested in this role?
                </p>
                    <button onClick={() => router.push("/get-started")} className='edit-button'>
                    <Rocket style={{marginTop: -2}}  size={14} /> Apply Now
                    </button>
            </div> */}

            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Lustria&family=DM+Sans:ital,opsz,wght@0,9..40,100..900;1,9..40,100..900&display=swap');

        .edit-button {
          padding: 0.3rem 1.2rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;          
          color: white;
          border-radius: 40px;
          background: #15173D;
          border: 8px solid #F8FAFC;
          box-shadow: 0 8px 4px rgba(187, 205, 255, 0.44);
        }

        .edit-button:hover {
          background-color: #FFF7F7;
          color: #15173D;
        }

        .edit-button.save {
          background-color: white;
          color: #15173D;
        }

        /* ── Desktop: side-by-side ── */
        .jobs-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          height: calc(100vh - 50px);
          overflow: hidden;
          background: white;
          margin-top: -100px;
        }

        .jobs-list {
          border-right: 0.5px solid #e2e8f0;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .jobs-detail {
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        /* back button hidden on desktop */
        .jobs-back-btn {
          display: none;
        }

        /* scrollbars */
        .jobs-list::-webkit-scrollbar,
        .jobs-detail::-webkit-scrollbar { width: 4px; }
        .jobs-list::-webkit-scrollbar-thumb,
        .jobs-detail::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }

        /* ── Mobile: stacked, one panel at a time ── */
        @media (max-width: 768px) {
          .jobs-layout {
            grid-template-columns: 1fr;
            margin-top: -80px;
          }

          /* both panels sit in the same grid cell — only one shows at a time */
          .jobs-list {
            grid-column: 1;
            grid-row: 1;
            border-right: none;
            display: flex;
          }

          .jobs-list--hidden {
            display: none;
          }

          .jobs-detail {
            grid-column: 1;
            grid-row: 1;
            display: none;
          }

          .jobs-detail--visible {
            display: flex;
          }

          /* back button shown on mobile */
          .jobs-back-btn {
            display: flex;
            align-items: center;
            gap: 4px;
            background: transparent;
            border: none;
            border-bottom: 0.5px solid #e2e8f0;
            color: #15173D;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            padding: 12px 16px;
            width: 100%;
            text-align: left;
          }
        }
      `}</style>
    </>
  );
}

const styles = {
  center: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', height: '60vh',
    marginTop: '50px',
    marginBottom: '20px',
  },
  listHeader: {
    padding: '38px 16px',
    borderBottom: '0.5px solid #e2e8f0',
  },
  listTitle: { fontSize: 15, fontWeight: 500, color: '#15173D', margin: 0 },
  listCount: { fontSize: 12, color: '#15173D', marginTop: 2 },
  card: {
    padding: '14px 16px',
    borderBottom: '0.5px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  cardActive: {
    background: '#f8fafc',
    borderLeft: '2px solid #15173D',
  },
  cardTop: { display: 'flex', gap: 10, alignItems: 'flex-start' },
  cardLogo: {
    width: 40, height: 40, borderRadius: 8,
    border: '0.5px solid #e2e8f0', background: '#f1f5f9',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 500, color: '#15173D', flexShrink: 0, overflow: 'hidden',
  },
  logoImg: { width: '100%', height: '100%', objectFit: 'cover' },
  logoImgLg: { width: '100%', height: '100%', objectFit: 'cover' },
  cardInfo: { flex: 1, minWidth: 0 },
  cardTitle: {
    fontSize: 14, fontWeight: 500, color: '#15173D',
    margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  cardCompany: { fontSize: 12, color: '#15173D', margin: '2px 0 0' },
  cardMeta: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6, alignItems: 'center', fontSize: 11, color: '#94a3b8' },
  tag: {
    background: '#f1f5f9', border: '0.5px solid #e2e8f0',
    borderRadius: 20, padding: '1px 7px', fontSize: 11, color: '#15173D',
  },
  detailHeader: { padding: '24px 20px 20px', borderBottom: '0.5px solid #e2e8f0' },
  detailHeaderTop: { display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 },
  detailLogo: {
    width: 56, height: 56, borderRadius: 10,
    border: '0.5px solid #e2e8f0', background: '#f1f5f9',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 500, color: '#15173D', flexShrink: 0, overflow: 'hidden',
  },
  detailTitle: { fontSize: 20, fontWeight: 600, color: '#15173D', margin: 0, lineHeight: 1.3 },
  detailCompany: { fontSize: 14, color: '#15173D', margin: '4px 0 0' },
  detailMeta: { display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 13, color: '#15173D', marginBottom: 16 },
  metaIcon: { marginRight: 4, marginTop: -2, verticalAlign: 'middle' },
  metaLink: { color: '#15173D', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 },
  actions: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  btnPrimary: {
    background: '#15173D', color: 'white', border: 'none',
    borderRadius: 40, padding: '8px 20px', fontSize: 13,
    fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center',
  },
  btnSecondary: {
    background: 'transparent', color: '#15173D',
    border: '0.5px solid #cbd5e1', borderRadius: 40,
    padding: '8px 20px', fontSize: 13, fontWeight: 500,
    cursor: 'pointer', display: 'flex', alignItems: 'center',
  },
  detailBody: { padding: '24px 20px', flex: 1 },
  section: { marginBottom: 38 },
  sectionTitle: {
    fontSize: 14, fontWeight: 600, color: '#15173D',
    marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6,
  },
  sectionIcon: { marginTop: -2 },
  sectionText: { fontSize: 13, color: '#15173D', lineHeight: 1.75, margin: 0 },
  skillsRow: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  skillBadge: {
    background: '#bff2f77c', color: '#15173D',
    borderRadius: 20, padding: '5px 14px', fontSize: 12,
  },
  traitRow: { marginBottom: 12 },
  traitLabel: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: 12, color: '#15173D', marginBottom: 5,
  },
  traitBarBg: { background: '#e2e8f0', borderRadius: 99, height: 5 },
  traitBar: { height: 5, background: '#15173D', borderRadius: 99, transition: 'width 0.4s ease' },
};