// app/dashboard/page.js
"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Building, Building2, ChartNoAxesColumn, ChartNoAxesGantt, Edit, Edit2, Edit3, Folder, Github, Globe2, Linkedin, LogOut, LucideLogOut, Mail, MapPin, PlusCircle, Rocket, Save, ScanSearch, Settings2, Star, Target, Timer, ToggleLeft, Trash2, Trophy, User2, UserCircle2, Users, Zap } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const JobDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('matches');
  const [selectedJob, setSelectedJob] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  

  const [appliedJobs, setAppliedJobs] = useState([]);

  const router = useRouter()

  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);

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

  // Add this constant near the top of the component (outside or inside, before the return)
  const PERSONAL_EMAIL_DOMAINS = new Set([
    'gmail.com','yahoo.com','outlook.com','hotmail.com','live.com',
    'icloud.com','me.com','mac.com','aol.com','protonmail.com',
    'proton.me','yandex.com','mail.com','gmx.com',
    'rediffmail.com','msn.com','inbox.com'
  ]);

  const [showBusinessOnlyModal, setShowBusinessOnlyModal] = useState(false);

  const isPersonalEmail = (email) => {
    const domain = email.split('@')[1]?.toLowerCase();
    return PERSONAL_EMAIL_DOMAINS.has(domain);
  };

  const handleOrgNav = () => {
    if (isPersonalEmail(userEmail)) {
      setShowBusinessOnlyModal(true);
      // router.push("/job-search/org");
    } else {
      router.push("/job-search/org");
    }
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        window.location.href = '/';
        return;
      }
      
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      
      // Get user profile
      const response = await fetch(`https://evalentumapi.com/user-profile/${tokenData.email}`);
      const userData = await response.json();

      const appliedResponse = await supabase
        .from('applications')
        .select('job_id')
        .eq('applicant_email', tokenData.email);

      const appliedJobIds = new Set(appliedResponse.data?.map(app => app.job_id) || []);

      // If we have resume details and personality scores, get fresh matches
      if (userData.resume_details && userData.personality_scores) {
        const matchesResponse = await fetch('https://evalentumapi.com/find-matches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resume_details: userData.resume_details,
            personality_scores: userData.personality_scores,
            skills: userData.resume_details?.skills  // add this if API requires it top-level
          }),
        });
        
        if (matchesResponse.ok) {
          const matchesData = await matchesResponse.json();
          // Filter out applied jobs and ensure score > 55%
          userData.job_matches = matchesData
            .filter(job => job.overall_match > 55 && !appliedJobIds.has(job.id));

          // Get applied jobs details
          const appliedJobsData = matchesData.filter(job => appliedJobIds.has(job.id));
          setAppliedJobs(appliedJobsData);

          // Update matches in database
          await supabase
            .from('jobmatch')
            .update({ 
              job_matches: userData.job_matches,
              matches_generated_at: new Date().toISOString()
            })
            .eq('email', tokenData.email);
        }
      }
      
      setUserData(userData);
      setEditedProfile({
        name: userData.resume_details?.name || '',
        email: userData.resume_details?.email || '',
        company_description: userData.company_description || '',
        skills: userData.resume_details?.skills || [],
        github_url: userData.resume_details?.github_url || '',
        linkedin_url: userData.resume_details?.linkedin_url || '',
        projects: userData.resume_details?.projects || [],
        work_experience: userData.resume_details?.work_experience || [],
        experience_years: userData.resume_details?.experience_years || '',
        company_logo_url: userData.resume_details?.company_logo_url || '',
      });
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Set up periodic refresh
  useEffect(() => {
    // Refresh every 5 minutes
    const refreshInterval = setInterval(() => {
      fetchUserData();
    }, 15 * 60 * 1000); // 5 minutes

    // Cleanup on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  // Add event listener for window focus
  useEffect(() => {
    const handleFocus = () => {
      fetchUserData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);
  

  if (loading) {
    return(
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '70vh'}}>
        <img style={{maxWidth: '100%', height: 'auto'}} src="https://cdn.dribbble.com/users/1186261/screenshots/3718681/_______.gif" />
      </div>
    );
  }
  if (!userData) return <div className="error">Failed to load dashboard data</div>;

  const matches = Array.isArray(userData.job_matches) ? userData.job_matches : [];
  console.log(matches)
  const personalityScores = userData.personality_scores || {};

  const handleEnterEditMode = () => {
    // Reinitialize editedProfile with current data when entering edit mode
    setEditedProfile({
      name: userData.resume_details?.name || '',
      email: userData.resume_details?.email || '',
      company_description: userData.company_description || '',
      skills: userData.resume_details?.skills || [],
      github_url: userData.resume_details?.github_url || '',
      linkedin_url: userData.resume_details?.linkedin_url || '',
      projects: userData.resume_details?.projects || [], // Add projects
      work_experience: userData.resume_details?.work_experience || [], // Add work experience
      experience_years: userData.resume_details?.experience_years || '',
      company_logo_url: userData.resume_details?.company_logo_url || '',
    });
    setEditing(true);
  };

  const handleApply = async (jobId) => {
    try {
        const token = localStorage.getItem('authToken');
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const response = await fetch(`https://evalentumapi.com/apply/${jobId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: tokenData.email }), // Properly structured request body
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to apply for job');
        }

        await fetchJobs(); // Refresh jobs to update apply button
        // Optionally add success message
        toast.success('Successfully Applied! Please wait..', {
                        onClose: () => {
                          // Wait for the toast to be visible before refreshing
                          setTimeout(() => {
                            window.location.reload();
                          }, 1000);
                        }
        });
    } catch (err) {
      toast.success('Successfully Applied! Please wait..', {
        onClose: () => {
          // Wait for the toast to be visible before refreshing
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      });
        // Optionally add error handling UI feedback
    }
};


const handleProfileUpdate = async () => {
  try {
    // Start a transaction-like operation for both tables
    const updatePromises = [];

    // Update jobmatch table
    updatePromises.push(
      supabase
        .from('jobmatch')
        .update({ resume_details: editedProfile })
        .eq('email', userData.email)
    );

    // Update applications table
    // This updates all applications made by this user
    updatePromises.push(
      supabase
        .from('applications')
        .update({ resume_details: editedProfile })
        .eq('applicant_email', userData.email)
    );

    // Execute both updates concurrently
    const results = await Promise.all(updatePromises);

    // Check for errors in either update
    const errors = results.filter(result => result.error);
    if (errors.length > 0) {
      console.error('Errors occurred during update:', errors);
      throw new Error('Failed to update one or more tables');
    }

    // Update local state if both database updates succeeded
    setUserData(prevData => ({
      ...prevData,
      resume_details: {
        ...prevData.resume_details,
        ...editedProfile
      }
    }));

    setEditing(false);

  } catch (err) {
    console.error('Error updating profile:', err);
    // You might want to show an error message to the user here
    toast.error('Failed to update profile. Please try again.');
  }
};

  const formatPercentage = (value) => {
    return typeof value === 'number' ? `${value.toFixed(1)}%` : 'N/A';
  };

  return (
    <div style={{backgroundColor: 'white'}}>
    <div className="dashboard">
      <nav className="navbar">
        <div className="nav-brand">
        <span className="full_logo">
          <span style={{fontSize: 14}}><UserCircle2 size={14} /> {userEmail}</span>
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

      <main className="dashboard-main">
        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-card-content">
                <span style={{backgroundColor: 'white', borderRadius: 30, padding: 10}} className="stat-icon"><Rocket color='#15173D' /></span>
                <div className="stat-text">
                    <h3 style={{color: '#15173D'}}>Total Matches</h3>
                    <p>{matches.length}</p>
                </div>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-card-content">
                <span style={{backgroundColor: 'white', borderRadius: 30, padding: 10}} className="stat-icon"><Target color='#15173D' /></span>
                <div className="stat-text">
                    <h3>Best Match Score</h3>
                    <p>{matches[0] ? formatPercentage(matches[0].overall_match) : 'N/A'}</p>
                </div>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-card-content">
                <span style={{backgroundColor: 'white', borderRadius: 30, padding: 10}} className="stat-icon"><Trophy color='#15173D' /></span>
                <div className="stat-text">
                    <h3>Updated Skills Index</h3>
                    <p>{formatPercentage(personalityScores.work_style)}</p>
                </div>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-card-content">
                <span style={{backgroundColor: 'white', borderRadius: 30, padding: 10}} className="stat-icon"><Building color='#15173D' /></span>
                <div className="stat-text">
                    <h3>Updated Culture Fit Index</h3>
                    <p>{formatPercentage(personalityScores.cultural_fit)}</p>
                </div>
                </div>
            </div>
            </div>

        <div className="content-section">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'matches' ? 'active' : ''}`}
              onClick={() => setActiveTab('matches')}
            >
              <span><Zap size={14} /> Job Matches</span>
            </button>
            <button 
              className={`tab ${activeTab === 'applied' ? 'active' : ''}`}
              onClick={() => setActiveTab('applied')}
            >
              <span><Briefcase size={14} /> Applied Jobs</span>
            </button>
            <button 
              className={`tab`}
              onClick={handleOrgNav}
            >
              <span><Rocket size={14} /> Create a Job Post</span>
            </button>
            <button className={`tab ${activeTab === 'jobpost' ? 'active' : ''}`} onClick={handleOrgNav}>
              <span><Edit size={14} /> Manage Jobs</span>
            </button>
          </div>

        {showBusinessOnlyModal && (
          <div
            onClick={() => setShowBusinessOnlyModal(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: '#fff', borderRadius: 16, padding: 32,
                maxWidth: 420, width: '90%', textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#15173D', marginBottom: 8 }}>
                Business Account Required
              </h2>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 20 }}>
                This feature is only available to users with a business account.
                Please sign in with your business email (e.g. you@yourcompany.com) to create
                and manage job posts.
              </p>
              <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 24 }}>
                Currently signed in as: <strong style={{ color: '#15173D' }}>{userEmail}</strong>
              </p>
              <button
                onClick={() => setShowBusinessOnlyModal(false)}
                style={{
                  padding: '10px 28px', background: '#15173D', color: '#fff',
                  border: 'none', borderRadius: 40, fontSize: 13,
                  fontWeight: 600, cursor: 'pointer',
                }}
              >
                Got it
              </button>
            </div>
          </div>
        )}

        <div style={{marginTop: 35}}></div>
          <div className="tab-content">
            {activeTab === 'matches' ? (
              <div>
                <div className="profile-section">
                  <div className="profile-header">
                    <h2 className='hs-title-11' style={{color: '#15173D'}}><ScanSearch size={20} style={{marginTop: -6}} /> Find your Job Fit</h2>
                    <button 
                      className={`edit-button ${activeTab === 'profile' ? 'active' : ''}`}
                      style={{marginTop: -25}}
                      onClick={() => setActiveTab('profile')} 
                    >
                      <Settings2 size={14} /> Edit Profile
                    </button>
                  </div>
                  <p style={{marginTop: -25, fontSize: 14, color: '#15173D'}}>Take a moment to review your profile and make any necessary changes. If you spot any mistakes or outdated information, you can easily edit the details in the form to make sure everything is correct and reflects your current information. Keeping your profile up to date helps you to present the best version of yourself.</p>
                </div>
              <div className="matches-container">
                <div className="matches-list">
                  {matches.map((job, index) => (
                    <div 
                      key={index}
                      className={`job-cardz ${selectedJob === job ? 'selected' : ''}`}
                      onClick={() => setSelectedJob(job)}
                    >
                    <div class="job-item">
                        <div class="job-details">
                            <div className="job-header">
                                <h3>
                                    <img 
                                    src={job.company_logo_url}
                                    alt="Profile Picture" 
                                    className="profile-picture" 
                                    /> 
                                    {job.title}
                                </h3>
                                <div style={{color: '#15173D'}} className="match-score">
                                    <span>
                                    <Rocket size={16} color="white" /> {formatPercentage(job.overall_match)} Match
                                    </span>
                                </div>
                            </div>
                            <p style={{marginLeft: 10, color: '#15173D'}} class="company">
                                <Zap size={16} style={{marginTop: -3}} /> {job.company_name} | <MapPin style={{marginTop: -3}} size={16} /> {job.location} | <Timer style={{marginTop: -3}} size={16} /> Years: {job.experience_required}+ yrs
                            </p>
                            <p style={{marginLeft: 10, fontSize: 14, color: '#15173D'}}> {job.company_description}</p>
                        </div>
                     </div>                 
                      <div>                       
                        <div className="skills">
                            {job.required_skills.slice(0, 4).map((skill, i) => (
                            <span style={{backgroundColor: 'white', color: '#15173D'}}  key={i} className="skill-tag"><Star style={{marginTop: -3}} size={12} /> {skill}</span>
                            ))}
                        </div>
                      </div>
                      <div style={{marginTop: 15}}></div>
                      {/* <button className="logout-buttonz">
                            <span style={{fontSize: 13}}><Target size={14} color='#15173D' style={{marginTop: -2, borderRadius: 10, backgroundColor: 'white', padding: 3}} />&nbsp;View Job</span>
                      </button> */}
                    </div>
                  ))}
                </div>

                {selectedJob && (
                    <div className="job-detailss">
                      <div className='job-detailss-bg'>
                        <h2> <img src={selectedJob.company_logo_url} alt="Profile Picture"  className="profile-picture" />  {selectedJob.title} </h2>
                        <h3 style={{marginLeft: 10, fontSize: 14, color: '#15173D'}}><Zap size={16} style={{marginTop: -3}} /> {selectedJob.company_name} | <MapPin size={16} style={{marginTop: -3}} />{selectedJob.location} | <Timer size={16} style={{marginTop: -3}} />  Experience Required: {selectedJob.experience_required}+ years </h3>
                        <p style={{marginLeft: 10, fontSize: 14, color: '#15173D'}}> {selectedJob.company_description}</p>
                        <div style={{marginTop: -10, backgroundColor: '#EBF4F6', padding: 10, borderRadius: 20, width: 120}} className="company-links">
                                {selectedJob.linkedin_url && (
                                  <a style={{color: '#15173D', backgroundColor: 'white', padding: 5, borderRadius: 15}} href={selectedJob.linkedin_url} target="_blank" rel="noopener noreferrer">
                                    <Linkedin color='#15173D' style={{marginTop: -5}} size={16} />
                                  </a>
                                )} &nbsp;
                                {selectedJob.website_url && (
                                  <a style={{color: '#15173D', backgroundColor: 'white', padding: 5, borderRadius: 15}} href={selectedJob.website_url} target="_blank" rel="noopener noreferrer">
                                    <Globe2 color='#15173D' style={{marginTop: -5}} size={16} />
                                  </a>
                                )} &nbsp;
                                {selectedJob.website_url && (
                                  <a style={{color: '#15173D', backgroundColor: 'white', padding: 5, borderRadius: 15}} href={selectedJob.website_url} target="_blank" rel="noopener noreferrer">
                                    <ScanSearch color='#15173D' style={{marginTop: -5}} size={16} />
                                  </a>
                                )}
                      </div> 
                      </div>
                        <div className="match-detailss">
                        <h4 style={{color: '#15173D'}} className='hs-title-11'><ScanSearch size={20} style={{marginTop: -3}} /> Match Breakdown</h4>
                        <div className="progress-sectionss">
                            {[
                            { label: "Overall Match", value: selectedJob.overall_match },
                            { label: "Skills Match", value: selectedJob.skills_match + 50 <= 55 ? 0 : selectedJob.skills_match + 50 },
                            { label: "Business Culture Match", value: selectedJob.personality_match },
                            { label: "Experience Match", value: selectedJob.experience_match <= 60 ? 0 : selectedJob.experience_match }
                            ].map((item, index) => (
                            <div className="progress-itemss" key={index}>
                                <span><Target size={16} style={{marginTop: -3}} /> {item.label}: {formatPercentage(item.value)}</span>
                                <div className="progress-barss">
                                <div
                                    className="progressss"
                                    style={{ width: `${item.value}%` }}
                                ></div>
                                {/* <span style={{fontSize: 13}} className="progress-valuess">{formatPercentage(item.value)}</span> */}
                                </div>
                            </div>
                            ))}
                        </div>

                        <div className="required-skillsss">
                            <h4 style={{marginBottom: 15, color: '#15173D'}} className='hs-title-11'><Trophy size={20} style={{marginTop: -3}} /> Required Skills</h4>
                            <div className="skills-gridss">
                            {selectedJob.required_skills.map((skill, index) => (
                                <span key={index} className="skill-tagss"><Star size={14} style={{marginTop: -3}} /> {skill}</span>
                            ))}
                            </div>
                        </div>

                        <button onClick={() => handleApply(selectedJob.id)} className="apply-buttonss"><Zap size={16} style={{marginTop: -3}} /> Apply Now</button>
                        </div>
                    </div>
                    )}
              </div>
              </div>
            ) : (
              <div className="profile-section">
                <div className="profile-header">
                  <h2 className='hs-title-11' style={{color: '#15173D'}}><UserCircle2 size={18} style={{marginTop: -2}} /> Profile Details</h2>
                  <button 
                    className={`edit-button ${editing ? 'save' : ''}`}
                    style={{marginTop: -25}}
                    onClick={() => {
                      if (editing) {
                        handleProfileUpdate();
                      } else {
                        handleEnterEditMode();
                      }
                    }}
                  >
                    {editing ? <><Save size={14} style={{marginTop: -2}} /> Save Changes</> : <><Edit3 size={14}  style={{marginTop: -2}} /> Edit Profile</>}
                  </button>
                </div>
                <p style={{marginTop: -25, fontSize: 14, color: '#15173D'}}>Take a moment to review your profile and make any necessary changes. If you spot any mistakes or outdated information, you can easily edit the details in the form to make sure everything is correct and reflects your current information. Keeping your profile up to date helps you to present the best version of yourself.</p>

                <div className="profile-content">
                {editing && editedProfile && (
                  <div className="edit-form">
                    <div className="form-group">
                      <label><User2 size={16} style={{marginTop: -5}} /> Name</label>
                      <input 
                        type="text" 
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({
                          ...editedProfile,
                          name: e.target.value
                        })}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label><Mail size={16} style={{marginTop: -2}} /> Gmail <ToggleLeft color='grey' />: <span style={{color: 'grey'}}>read only</span> </label>
                      <input 
                        type="text"
                        readOnly
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile({
                          ...editedProfile,
                          email: e.target.value
                        })}
                      />
                    </div>

                    <div className="form-group">
                      <label><Github size={16} style={{marginTop: -5}} /> GitHub URL</label>
                      <input 
                        type="text"
                        value={editedProfile.github_url}
                        onChange={(e) => setEditedProfile({
                          ...editedProfile,
                          github_url: e.target.value
                        })}
                      />
                    </div>

                    <div className="form-group">
                      <label><Linkedin size={16} style={{marginTop: -5}} /> LinkedIn URL</label>
                      <input 
                        type="text"
                        value={editedProfile.linkedin_url}
                        onChange={(e) => setEditedProfile({
                          ...editedProfile,
                          linkedin_url: e.target.value
                        })}
                      />
                    </div>

                    <div className="form-group">
                      <label><Zap size={16} style={{marginTop: -5}} /> Skills</label>
                      <input
                        style={{overflowY: 'none'}}
                        value={editedProfile.skills.join(', ')}
                        onChange={(e) => setEditedProfile({
                          ...editedProfile,
                          skills: e.target.value.split(',').map(s => s.trim())
                        })}
                      />
                    </div>

                    <div className="form-group">
                      <label><Zap size={16} style={{marginTop: -5}} /> Years of Experience</label>
                      <input
                        type="number"
                        name="experience_years"
                        value={editedProfile.experience_years || ''}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            experience_years: Number(e.target.value), // Ensures the input is stored as a number
                          })
                        }
                      />
                    </div>

                    {/* Work Experience Section */}
                    <div className="form-group">
                      <label><Briefcase size={16} style={{ marginTop: -5 }} /> Work Experience</label>
                      <div className="card-container">
                        {editedProfile.work_experience.map((work, index) => (
                          <div key={index} className="card experience-card">
                            <div className="experience-grid-item">
                              <label style={{color: '#15173D'}}><Building2 size={16} color='#15173D' style={{marginTop: -3}} /> Company Name</label>
                              <input
                                type="text"
                                value={work.company}
                                placeholder="Enter company name"
                                onChange={(e) => {
                                  const newExperience = [...editedProfile.work_experience];
                                  newExperience[index].company = e.target.value;
                                  setEditedProfile({ ...editedProfile, work_experience: newExperience });
                                }}
                                className="form-input"
                              />
                            </div>

                            <div className="experience-grid-item">
                              <label style={{color: '#15173D'}}><Zap size={16} color='#15173D' style={{marginTop: -3}} /> Job Position</label>
                              <input
                                type="text"
                                value={work.job_position}
                                placeholder="e.g., Full stack developer"
                                onChange={(e) => {
                                  const newExperience = [...editedProfile.work_experience];
                                  newExperience[index].job_position = e.target.value;
                                  setEditedProfile({ ...editedProfile, work_experience: newExperience });
                                }}
                                className="form-input"
                              />
                            </div>

                            <div className="experience-grid-item">
                              <label style={{color: '#15173D'}}><Timer size={16} color='#15173D' style={{marginTop: -3}} /> Duration</label>
                              <input
                                type="text"
                                value={work.duration}
                                placeholder="e.g., 2022-2024"
                                onChange={(e) => {
                                  const newExperience = [...editedProfile.work_experience];
                                  newExperience[index].duration = e.target.value;
                                  setEditedProfile({ ...editedProfile, work_experience: newExperience });
                                }}
                                className="form-input"
                              />
                            </div>
                            <div className="experience-grid-item">
                              <label style={{color: '#15173D'}}><MapPin size={16} color='#15173D' style={{marginTop: -3}} /> Location</label>
                              <input
                                type="text"
                                value={work.location}
                                placeholder="Enter location"
                                onChange={(e) => {
                                  const newExperience = [...editedProfile.work_experience];
                                  newExperience[index].location = e.target.value;
                                  setEditedProfile({ ...editedProfile, work_experience: newExperience });
                                }}
                                className="form-input"
                              />
                            </div>
                            <button
                              className="delete-button"
                              onClick={() => {
                                const newExperience = editedProfile.work_experience.filter((_, i) => i !== index);
                                setEditedProfile({ ...editedProfile, work_experience: newExperience });
                              }}
                            >
                              <Trash2 size={16} style={{marginTop: -3}} /> Delete
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        className="add-button"
                        onClick={() => {
                          const newExperience = [
                            ...editedProfile.work_experience,
                            { company: '', duration: '', location: '', job_position: '' },
                          ];
                          setEditedProfile({ ...editedProfile, work_experience: newExperience });
                        }}
                      >
                        <PlusCircle size={16} style={{marginTop: -3}} /> Add New Experience
                      </button>
                    </div>

                    <div className="form-group">
                      <label><Zap size={16} style={{ marginTop: -5 }} /> Projects</label>
                      <div className="card-container">
                        {editedProfile.projects.map((project, index) => (
                          <div key={index} className="card project-card">
                            <label>Project Name</label>
                            <input
                              type="text"
                              value={project.name}
                              placeholder="Enter project name"
                              onChange={(e) => {
                                const newProjects = [...editedProfile.projects];
                                newProjects[index].name = e.target.value;
                                setEditedProfile({ ...editedProfile, projects: newProjects });
                              }}
                              className="form-input"
                            />
                            <label>Description</label>
                            <textarea
                              value={project.description}
                              placeholder="Enter project description"
                              onChange={(e) => {
                                const newProjects = [...editedProfile.projects];
                                newProjects[index].description = e.target.value;
                                setEditedProfile({ ...editedProfile, projects: newProjects });
                              }}
                              className="form-input"
                            />
                            <button
                              className="delete-button"
                              onClick={() => {
                                const newProjects = editedProfile.projects.filter((_, i) => i !== index);
                                setEditedProfile({ ...editedProfile, projects: newProjects });
                              }}
                            >
                              <Trash2 size={16} style={{marginTop: -3}} /> Delete
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        className="add-button"
                        onClick={() => {
                          const newProject = [
                            ...editedProfile.projects,
                            { name: '', description: '' },
                          ];
                          setEditedProfile({ ...editedProfile, projects: newProject });
                        }}
                      >
                        <PlusCircle size={16} style={{marginTop: -3}} /> Add New Project
                      </button>
                    </div>


                    <button 
                      className={`edit-buttons ${editing ? 'save' : ''}`}
                      style={{marginTop: 10}}
                      onClick={() => {
                        if (editing) {
                          handleProfileUpdate();
                        } else {
                          handleEnterEditMode();
                        }
                      }}
                    >
                      {editing ? <><Save /> Save Changes</> : <><Edit3 /> Edit Profile</>}
                    </button>
                  </div>
                )}
                </div>
              </div>
            )}
          </div>

          {/* ------------------------------------------------------------------------------------------------------------------------- */}

          <div className="tab-content">
            {activeTab === 'applied' ? (
              <div>
                <div className="profile-sections">
                  <div className="profile-header">
                    <h2 className='hs-title-11' style={{color: '#15173D'}}>
                      <ScanSearch size={16} style={{marginTop: -2}} /> Applied Jobs
                    </h2>
                    {/* <button 
                      className={`edit-button`}
                      style={{marginTop: -25}}
                      onClick={() => router.push("/job-search/org")}
                    >
                      <Rocket /> Create a Job Post
                    </button> */}
                  </div>
                  <p style={{marginTop: -25, fontSize: 14, color: '#15173D'}}>
                    View and track all the jobs you've applied to. Stay organized and monitor the status of your applications. Keep your job search momentum going by regularly checking for updates and new opportunities.
                  </p>
                </div>
              <div className="matches-container">
                <div className="matches-list">
                  {appliedJobs.map((job, index) => (
                    <div 
                      key={index}
                      className={`job-card ${selectedJob === job ? 'selected' : ''}`}
                      onClick={() => setSelectedJob(job)}
                    >
                    <div class="job-item">
                        <div class="job-details">
                            <div className="job-header">
                                <h3>
                                    <img 
                                    src={job.company_logo_url}
                                    alt="Profile Picture" 
                                    className="profile-picture" 
                                    /> 
                                    {job.title}
                                </h3>
                                <div style={{color: '#15173D'}} className="match-score">
                                    <span>
                                    <Rocket size={16} color="white" /> {formatPercentage(job.overall_match)} Match
                                    </span>
                                </div>
                            </div>
                            <p style={{marginLeft: 10, color: '#15173D'}} class="company">
                                <Zap size={14} style={{marginTop: -3}} /> {job.company_name} | <MapPin size={14} style={{marginTop: -3}} /> {job.location} | <Timer size={14} style={{marginTop: -3}} /> Years: {job.experience_required}+ yrs
                            </p>
                            {/* <p style={{marginLeft: 10, fontSize: 14, color: '#15173D'}}> {job.company_description}</p> */}
                        </div>
                     </div>
                      <div>
                       
                        <div className="skills">
                            {job.required_skills.slice(0, 4).map((skill, i) => (
                            <span style={{backgroundColor: '#15173D', color: 'white'}}  key={i} className="skill-tag"><Star size={12} style={{marginTop: -3}} /> {skill}</span>
                            ))}
                        </div>
                      </div>
                      <div style={{marginTop: 15}}></div>
                      {/* <button className="logout-buttonz">
                            <span style={{fontSize: 13}}>View Job</span>
                      </button> */}
                    </div>
                  ))}
                </div>

                {selectedJob && (
                    <div className="job-detailss">
                      <div className='job-detailss-bg'>
                        <h2> <img src={selectedJob.company_logo_url} alt="Profile Picture"  className="profile-picture" />  {selectedJob.title} </h2>
                        <h3 style={{marginLeft: 10, fontSize: 14, color: '#15173D'}}><Zap size={14} style={{marginTop: -3}} /> {selectedJob.company_name} | <MapPin size={14} style={{marginTop: -3}} />{selectedJob.location} | <Timer size={14} style={{marginTop: -3}} />  Experience Required: {selectedJob.experience_required}+ years </h3>
                        <p style={{marginLeft: 10, fontSize: 14, color: '#15173D'}}> {selectedJob.company_description}</p>
                        <div style={{marginTop: -10, backgroundColor: '#EBF4F6', padding: 10, borderRadius: 20, width: 120}} className="company-links">
                                {selectedJob.linkedin_url && (
                                  <a style={{color: '#15173D', backgroundColor: 'white', padding: 5, borderRadius: 15}} href={selectedJob.linkedin_url} target="_blank" rel="noopener noreferrer">
                                    <Linkedin color='#15173D' style={{marginTop: -5}} size={16} />
                                  </a>
                                )} &nbsp;
                                {selectedJob.website_url && (
                                  <a style={{color: '#15173D', backgroundColor: 'white', padding: 5, borderRadius: 15}} href={selectedJob.website_url} target="_blank" rel="noopener noreferrer">
                                    <Globe2 color='#15173D' style={{marginTop: -5}} size={16} />
                                  </a>
                                )} &nbsp;
                                {selectedJob.website_url && (
                                  <a style={{color: '#15173D', backgroundColor: 'white', padding: 5, borderRadius: 15}} href={selectedJob.website_url} target="_blank" rel="noopener noreferrer">
                                    <ScanSearch color='#15173D' style={{marginTop: -5}} size={16} />
                                  </a>
                                )}
                      </div> 
                      </div>
                        <div className="match-detailss">
                        <h4 style={{color: '#15173D'}} className='hs-title-11'><ScanSearch size={20} style={{marginTop: -3}} /> Match Breakdown</h4>
                        <div className="progress-sectionss">
                            {[
                            { label: "Overall Match", value: selectedJob.overall_match },
                            { label: "Skills Match", value: selectedJob.skills_match + 50 <= 55 ? 0 : selectedJob.skills_match + 50 },
                            { label: "Business Culture Match", value: selectedJob.personality_match },
                            { label: "Experience Match", value: selectedJob.experience_match <= 60 ? 0 : selectedJob.experience_match }
                            ].map((item, index) => (
                            <div className="progress-itemss" key={index}>
                                <span><Target size={16} style={{marginTop: -3}} /> {item.label}: {formatPercentage(item.value)}</span>
                                <div className="progress-barss">
                                <div
                                    className="progressss"
                                    style={{ width: `${item.value}%` }}
                                ></div>
                                {/* <span style={{fontSize: 13}} className="progress-valuess">{formatPercentage(item.value)}</span> */}
                                </div>
                            </div>
                            ))}
                        </div>

                        <div className="required-skillsss">
                            <h4 style={{marginBottom: 15, color: '#15173D'}} className='hs-title-11'><Trophy size={20} style={{marginTop: -3}} /> Required Skills</h4>
                            <div className="skills-gridss">
                            {selectedJob.required_skills.map((skill, index) => (
                                <span key={index} className="skill-tagss"><Star size={16} style={{marginTop: -3}} /> {skill}</span>
                            ))}
                            </div>
                        </div>

                        {/* <button onClick={() => handleApply(selectedJob.id)} className="apply-buttonss"><Zap size={16} style={{marginTop: -3}} /> Apply Now</button> */}
                        </div>
                    </div>
                    )}
              </div>
              </div>
            ) : (
              <></>
            )}
          </div>


        </div>
      </main>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Lustria&family=DM+Sans:ital,opsz,wght@0,9..40,100..900;1,9..40,100..900&display=swap');


        .dashboard {
          min-height: 190vh;
          margin-top: -100px;
        }

        .navbar {
          background-color: white;
          padding: 1.85rem 1.9rem;
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

        .logout-buttonz {
          padding: 0.4rem 2rem;
          background-color: #15173D;
          color: white;
          border: none;
          border-radius: 40px;
          cursor: pointer;
        }

        .dashboard-main {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: #bff2f7;
          padding: 1rem;
          border-radius: 40px;
          box-shadow: 0 2px 4px rgba(187, 205, 255, 0.1);
        }

        .stat-card-content {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .stat-card h3 {
          margin: 0;
          font-size: 0.85rem;
          color: #15173D;
        }

        .stat-card p {
          margin: 0.5rem 0 0;
          font-size: 1rem;
          font-weight: bold;
          color: #15173D;
        }

        .tabs {
          margin-bottom: 1rem;
        }

        .tab {
          padding: 0.5rem 1rem;
          background: #F8FAFC;
          border-radius: 40px;
          border: 0.6px solid #15173D;
          border-style: dotted;
          cursor: pointer;
          color: #15173D;
          font-weight: 500;
          margin-right: 0.7rem !important;
          font-size: 0.84rem;
          box-shadow: 0 8px 4px rgba(187, 205, 255, 0.1);

        }

        .tab.active {
          color: white;
          border-radius: 40px;
          background: #15173D;
          border: 8px solid #F8FAFC;
          box-shadow: 0 8px 4px rgba(187, 205, 255, 0.44);

        }

        .matches-container {
          display: grid;
          grid-template-columns: 500px 2fr;
          gap: 2rem;
          padding: 1.5rem;
          border-radius: 0px 0px 40px 40px;
          margin-top: 30px;
        }

        .matches-list {
        border-right: 1px solid #eee;
        padding-right: 1rem;
        overflow-y: auto;
        max-height: 700px;
        }

        .matches-list::-webkit-scrollbar {
        width: 8px; /* Set the width of the scrollbar */
        }

        .matches-list::-webkit-scrollbar-track {
        background: #f0f0f0; /* Background of the scrollbar track */
        border-radius: 8px; /* Optional: rounded corners */
        }

        .matches-list::-webkit-scrollbar-thumb {
        background-color: #2196f3; /* Scrollbar color */
        border-radius: 8px; /* Optional: rounded corners */
        border: 2px solid #f0f0f0; /* Adds padding around the thumb */
        }

        .matches-list::-webkit-scrollbar-thumb:hover {
        background-color: #1976d2; /* Color when hovering over the scrollbar */
        }

        /* Optional: For Firefox, use the scrollbar-color and scrollbar-width properties */
        .matches-list {
        scrollbar-color: #15173D #fff; /* thumb color track color */
        scrollbar-width: thin; /* Sets the scrollbar width to thin */
        }

        .job-card {
          background: #bff2f7;
          padding: 2rem;
          border-radius: 40px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 15.75rem;
          border: 10px solid #F8FAFC;
          box-shadow: 0 8px 4px rgba(187, 205, 255, 0.24);
        }

        .job-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .job-card.selected {
          background-color: #f5f7f8;
          border: 10px solid #F8FAFC;
          box-shadow: 0 8px 4px rgba(187, 205, 255, 0.24);
        }

        .job-card h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #333;
        }

        // Dummy

        .job-cardz {
          background: #bff2f7;
          padding: 2rem;
          border-radius: 40px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 1.75rem;
          border: 10px solid #F8FAFC;
          box-shadow: 0 8px 4px rgba(187, 205, 255, 0.24);
        }

        .job-cardz:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .job-cardz.selected {
          background-color: #f5f7f8;
          border: 1px solid #15173D;
          box-shadow: 0 8px 4px rgba(187, 205, 255, 0.24);
        }

        .job-cardz h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #333;
        }

        .company, .location {
          margin: 0.25rem 0;
          font-size: 0.875rem;
          color: #666;
        }

        .job-header {
        display: flex;
        justify-content: space-between;
        align-items: center; /* Align items vertically in the center */
        gap: 1rem; /* Optional: Adds space between the elements */
        padding: 0.5rem 0; /* Adds spacing above and below */
        }

        .job-header h3 {
        display: flex;
        align-items: center;
        margin: 0; /* Reset margin for alignment */
        font-size: 1.1rem; /* Adjust font size */
        color: #333;
        }

        .profile-picture {
        width: 32px; /* Set size for the profile picture */
        height: 32px;
        border-radius: 50%; /* Make the image circular */
        margin-right: 0.5rem; /* Adds space between the image and text */
        }

        .match-score {
        display: flex;
        align-items: center;
        }

        .match-score span {
        background: #15173D;
        color: white;
        border-radius: 30px;
        padding: 10px;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 0.2rem; /* Adds space between the icon and text */
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }


        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .skill-tag {
          background-color: #f0f0f0;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          font-size: 0.75rem;
          color: #666;
        }

        .job-item {
        display: flex;
        align-items: center;
        gap: 1rem; /* Space between the image and content */
        padding: 1rem;
        background: #fff;
        border: 1px solid #eee;
        border-radius: 8px;
        transition: box-shadow 0.3s ease;
        }

        .job-item:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .profile-picture {
        width: 50px; /* Set the width of the profile picture */
        height: 50px; /* Set the height of the profile picture */
        border-radius: 50%; /* Makes it a circle */
        object-fit: cover; /* Ensures the image doesn't stretch */
        }

        .job-details {
        display: flex;
        flex-direction: column; /* Stack the content vertically */
      
        }

        .job-detailss {
        background: #bff2f7;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        color: #15173D;
        }

        .job-detailss-bg{
          background: white;
          border-radius: 30px;
          padding: 20px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .job-detailss h2 {
        font-size: 1.8rem;
        font-weight: bold;
        color: #15173D;
        margin-bottom: 0.5rem;
        }

        .job-detailss h3 {
        font-size: 1.2rem;
        color: #15173D;
        margin-bottom: 1rem;
        }

        .match-detailss h4 {
        font-size: 1.4rem;
        color: #15173D;
        margin-bottom: 1rem;
        }

        .match-detailss{
          margin-top: 10px;
          background: white;
          border-radius: 30px;
          padding: 20px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .progress-sectionss {
        margin-bottom: 2rem;
        }

        .progress-itemss {
        margin-bottom: 1rem;
        }

        .progress-itemss span {
        font-size: 0.9rem;
        color: #15173D;
        }

        .progress-barss {
        display: flex;
        align-items: center;
        background: #ecf0f1;
        border-radius: 20px;
        overflow: hidden;
        height: 10px;
        margin: 5px 0;
        position: relative;
        }

        .progressss {
        background: linear-gradient(90deg, #15173D, #15173D);
        height: 100%;
        border-radius: 20px;
        transition: width 0.5s ease-in-out;
        }

        .progress-valuess {
        font-size: 0.6rem;
        color: #15173D;
        margin-left: 10px;
        }

        .required-skillsss h4 {
        font-size: 1.4rem;
        margin-bottom: 0.5rem;
        color: #15173D;
        }

        .skills-gridss {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        }

        .skill-tagss {
        background: #15173D;
        color: white;
        padding: 2px 10px;
        border-radius: 20px;
        font-size: 0.9rem;
        }

        .apply-buttonss {
        background-color: #15173D;
        width: 100%;
        padding: 1rem;
        color: white;
        margin-top: 30px;
          border: none;
          border-radius: 40px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .apply-buttonss:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 10px rgba(231, 76, 60, 0.3);
        }


        .job-details h3 {
        margin: 0;
        font-size: 1.2rem;
        color: #333;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        }

        .job-details .company {
        margin: 0.25rem 0 0;
        font-size: 0.9rem;
        color: #666;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        }


        .progress-section {
          margin: 1.5rem 0;
        }

        .progress-item {
          margin-bottom: 1rem;
        }

        .progress-bar {
          height: 8px;
          background-color: #f0f0f0;
          border-radius: 999px;
          overflow: hidden;
          position: relative;
          margin-top: 0.5rem;
        }

        .progress {
          height: 100%;
          background-color: #2196f3;
          transition: width 0.3s ease;
        }

        .progress-bar span {
          position: absolute;
          right: 0;
          top: -1.5rem;
          font-size: 0.875rem;
          color: #15173D;
        }

        .required-skills {
          margin: 1.5rem 0;
        }

        .skills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .apply-button {
          width: 100%;
          padding: 1rem;
          background-color: #2196f3;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .apply-button:hover {
          background-color: #1976d2;
        }

        .profile-section {
          background: #bff2f7;
          padding: 2rem;
          border-radius: 40px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: -30px;
                    border: 10px solid #F8FAFC;
          box-shadow: 0 8px 4px rgba(187, 205, 255, 0.24);
        }

         .profile-sections {
           background: #f5f7f8;
          padding: 2rem;
          border-radius: 40px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: -30px;
                    border: 10px solid #F8FAFC;
          box-shadow: 0 8px 4px rgba(187, 205, 255, 0.24);
          margin-top:50px;
        }

        textarea::-webkit-scrollbar {
          width: 4px;  /* Width of the scrollbar */
        }
        textarea::-webkit-scrollbar-thumb {
          background-color: #15173D;  /* Color of the scrollbar thumb */
          border-radius: 4px;  /* Round corners for the scrollbar thumb */
        }
        textarea::-webkit-scrollbar-track {
          background-color: #f0f0f0;  /* Background color of the scrollbar track */
          border-radius: 4px;  /* Round corners for the track */
        }
          
        .score-grid {
          display: grid;
          gap: 1.5rem;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .matches-container {
            grid-template-columns: 1fr;
          }

          .matches-list {
            border-right: none;
            border-bottom: 1px solid #eee;
            padding-right: 0;
            padding-bottom: 1rem;
            max-height: 300px;
          }
        }
          /* Profile Section */

        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .edit-button {
          padding: 0.75rem 1.5rem;
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

        .edit-button.save {
          background-color: white;
          color: #15173D;
        }

        .edit-buttons {
          padding: 0.75rem 1.5rem;
          border-radius: 40px;
          border: none;
          background-color: #15173D !important;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .edit-buttons:hover {
          background-color: #FFF7F7;
          color: #15173D;
        }

        .edit-buttons.save {
          background-color: white;
        }

        /* Edit Form */
        .edit-form {
          display: grid;
          gap: 1.5rem;
          margin-bottom: 2rem;
          background-color: white;
          padding: 1.75rem;
          border-radius: 40px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 500;
          color: #15173D;
        }

        .form-group input,
        .form-group textarea {
          padding: 1.75rem;
          background-color: #F5F7F8;
          border: none;
          border-radius: 24px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
          color: #45474B;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #2196f3;
        }

        /* Skills Grid */

        /* Experience Cards */
        

        /* Apply Button */


        /* Responsive Design */
        @media (max-width: 768px) {
          .matches-container {
            grid-template-columns: 1fr;
          }

          .matches-list {
            border-right: none;
            border-bottom: 1px solid #e2e8f0;
            padding-right: 0;
            padding-bottom: 1rem;
            max-height: 300px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .profile-section {
            padding: 1.5rem;
          }
        }

        /* Error Screen */
        .error-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f5f5f5;
          text-align: center;
          padding: 2rem;
        }

        .error-screen button {
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background-color: #2196f3;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .error-screen button:hover {
          background-color: #1976d2;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 10px !important;
          margin-top: 8px;
          border-radius: 4px;
          font-size: 14px;
          background-color: white !important;
        }

        /* Overall layout for the experience and project cards */
        .card-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        /* Styling for each individual card (experience or project) */
        .card {
          background: #EAF6F6;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 20px;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 10px;
          height: 100%;
        }

        /* Card label styles */
        .card label {
          font-size: 14px;
          margin-bottom: 5px;
          color: #555;
        }

        /* Form input styles */
        // .form-input {
        //   width: 100%;
        //   padding: 8px;
        //   border: 1px solid #ddd;
        //   border-radius: 4px;
        //   font-size: 14px;
        //   margin-bottom: 10px;
        // }

        /* Delete button (appears on experience cards) */
        .delete-button {
          background: #FF2929;
          color: #fff;
          border: none;
          padding: 5px 10px;
          border-radius: 40px;
          cursor: pointer;
          align-self: start;
          justify-self: end;
          font-size: 12px;
          position: absolute;
          top: 10px;
          right: 10px;
        }

        /* Hover effect for delete button */
        .delete-button:hover {
          background: #d9363e;
        }

        /* Add new button */
        .add-button {
          background: #EAF6F6;
          color: #15173D;
          border: none;
          padding: 10px 15px;
          border-radius: 40px;
          cursor: pointer;
          margin-top: 10px;
          width: 100%;
          font-size: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        /* Hover effect for add button */
        .add-button:hover {
          background: #151515;
          color: white;
        }

        /* Styling for the project-card */
        .project-card {
          background: #f9f9f9;
          padding: 15px;
          border-radius: 20px;
          margin-bottom: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .project-card input, .project-card textarea {
          width: 100%;
          padding: 8px;
          border-radius: 20px;
        }

        .project-card textarea {
          resize: vertical;
          height: 100px;
        }

        /* Adjustments to fit cards within compact space */
        .card-container {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 15px;
        }

        /* Mobile view adjustments for the edit form */
        @media (max-width: 768px) {
          .edit-form {
            display: grid;
            gap: 1.5rem;
            margin-bottom: 2rem;
            background-color: white;
            padding: 1rem;
            border-radius: 12px; /* Adjusted for a cleaner mobile look */
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
          }

          /* Grid for cards on mobile */
          .card-container {
            display: flex;
            flex-direction: column; /* Stacks cards vertically */
            gap: 1rem; /* Adjust spacing between cards */
          }

          /* Individual cards */
          .card {
            background: #f9f9f9;
            padding: 1rem;
            border: 1px solid #ddd;
            border-radius: 12px;
            position: relative;
            display: flex;
            flex-direction: column; /* Stacked layout for mobile */
            gap: 0.5rem; /* Compact spacing inside the card */
            font-size: 14px; /* Slightly smaller font for mobile */
          }

          /* Form input fields */
          .form-input, .form-textarea {
            width: 100%;
            padding: 10px;
            font-size: 14px; /* Adjusted for mobile readability */
            border: 1px solid #ddd;
            border-radius: 8px;
            box-sizing: border-box;
          }

          /* Labels inside cards */
          .card label {
            font-size: 13px;
            font-weight: bold;
            color: #555;
          }

          /* Delete button for cards */
          .delete-button {
            background: #ff4d4f;
            color: white;
            border: none;
            padding: 8px;
            border-radius: 8px;
            font-size: 12px;
            width: auto;
            align-self: flex-end; /* Aligns button to the right in vertical layout */
          }

          /* Add button */
          .add-button {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 8px;
            font-size: 14px;
            text-align: center;
            width: 100%;
          }

          /* Hover effect for buttons */
          .delete-button:hover {
            background: #d9363e;
          }

          .add-button:hover {
            background: #0056b3;
          }

          /* Adjustments for textareas in project cards */
          .project-card textarea {
            resize: none;
            font-size: 14px;
            padding: 8px;
            height: 80px; /* Compact height for mobile */
          }

          /* Subtle shadow for cards */
          .card {
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
          }

          /* Compact gap for all inputs and fields */
          .card-container .card {
            gap: 0.75rem;
          }
        }
        
        @media (max-width: 768px) {
        .dashboard {
          min-height: 100vh;
        }

        .navbar {
          padding: 0.75rem 1rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .nav-brand {
          font-size: 1.25rem;
        }

        .dashboard-main {
          margin: 1rem auto;
          padding: 0 0.75rem;
        }

        .stats-grid {
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }

        .stat-card {
          padding: 1rem;
        }

        .stat-card p {
          font-size: 1.25rem;
        }

        .matches-container {
          grid-template-columns: 1fr;
          padding: 1rem;
          gap: 1rem;
        }

        .matches-list {
          max-height: 400px;
          padding-right: 0;
          border-right: none;
          border-bottom: 1px solid #eee;
          padding-bottom: 1rem;
        }

        .job-card {
          padding: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .job-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .match-score span {
          padding: 6px 12px;
          font-size: 12px;
        }

        .skills {
          margin-top: 0.5rem;
        }

        .skill-tag {
          padding: 0.2rem 0.5rem;
          font-size: 0.7rem;
        }

        .job-detailss {
          padding: 15px;
          margin-top: 1rem;
        }

        .job-detailss h2 {
          font-size: 1.4rem;
        }

        .job-detailss h3 {
          font-size: 1rem;
        }

        .match-detailss {
          padding: 15px;
          margin-top: 0.75rem;
        }

        .progress-itemss {
          margin-bottom: 0.75rem;
        }

        .skills-gridss {
          gap: 8px;
        }

        .skill-tagss {
          padding: 4px 8px;
          font-size: 0.8rem;
        }

        .apply-buttonss {
          padding: 0.75rem;
          margin-top: 20px;
        }
      }

      @media (max-width: 480px) {
        .navbar {
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .nav-user {
          justify-content: center;
          flex-wrap: wrap;
        }

        .logout-button {
          width: 100%;
        }

        .tabs {
          display: flex;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          gap: 0.5rem;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .tabs::-webkit-scrollbar {
          display: none;
        }

        .tab {
          padding: 0.5rem 1rem;
          white-space: nowrap;
          font-size: 0.875rem;
        }

        .profile-section, .profile-sections {
          padding: 1rem;
          border-radius: 20px;
          margin-bottom: -15px;
        }

        .edit-form {
          padding: 1rem;
          gap: 1rem;
        }

        .form-group input,
        .form-group textarea {
          padding: 1rem;
          border-radius: 16px;
          font-size: 0.875rem;
        }

        .edit-button, .edit-buttons {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .card {
          border-radius: 16px;
          padding: 12px;
        }

        .delete-button {
          padding: 4px 8px;
          font-size: 11px;
          top: 8px;
          right: 8px;
        }

        .add-button {
          padding: 8px 12px;
          font-size: 14px;
        }

        .score-grid {
          gap: 1rem;
          margin-top: 0.75rem;
        }

        .error-screen {
          padding: 1rem;
        }

        .error-screen button {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }
      }

      /* Additional tablet-specific optimizations */
      @media (min-width: 481px) and (max-width: 768px) {
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .matches-container {
          gap: 1.5rem;
        }

        .card-container {
          grid-template-columns: repeat(2, 1fr);
        }
      }
        
      `}</style>
    </div>
    </div>
  );
};

export default JobDashboard;