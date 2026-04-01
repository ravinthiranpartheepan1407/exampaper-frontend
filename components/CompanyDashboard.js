"use client"
import React, { useState, useEffect } from 'react';
import { 
  Building, MapPin, Timer, Star, Target, Trophy, 
  Users, Mail, Briefcase, Edit2, Trash2, PlusCircle,
  ScanSearch, Rocket, Zap, Globe, Linkedin,
  UserCircle2,
  LucideLogOut,
  Globe2,
  FileText,
  User2,
  ScanText,
  BriefcaseBusiness,
  Text,
  X,
  Sliders,
  Disc,
  FileDown,
  Github,
  Check,
  ChevronDownSquare,
  Building2,
  Link,
  Medal,
  ArrowLeftCircle,
  Image,
  ChevronDownCircle,
  ChevronDown,
  Layers
} from 'lucide-react';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ConnectModal from './ConnectModal';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const CompanyDashboard = () => {  
  const [activeTab, setActiveTab] = useState('posts');
  const [jobs, setJobs] = useState([]);
  const [jobss, setJobss] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState(null);

  const [subscription, setSubscription] = useState('free');
  const JOB_LIMIT = subscription === 'premium' ? 7 : 1;
  const APPLICANT_LIMIT = subscription === 'premium' ? 20 : 1;

  const allTraits = [
    { trait: "Problem Solving", score: 4.0 },
    { trait: "Team Collaboration", score: 4.5 },
    { trait: "Communication", score: 4.0 },
    { trait: "Leadership", score: 4.0 },
    { trait: "Adaptability", score: 4.3 },
    { trait: "Innovation", score: 4.0 },
    { trait: "Strategic Thinking", score: 4.0 },
    { trait: "Attention to Detail", score: 4.5 },
    { trait: "Time Management", score: 4.0 },
    { trait: "Project Management", score: 4.0 },
  ];
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    company_email: '',
    location: '',
    company_description: '',
    required_skills: [],
    desired_traits: allTraits.slice(0, 5).map(t => ({ ...t, enabled: true })),
    linkedin_url: '',
    website_url: '',
    experience_required: 0,
    company_logo_url: '',
    creator: '',
  });

  const [selectedTraits, setSelectedTraits] = useState(allTraits.slice(0, 5).map(t => ({ ...t, enabled: true })));

  const handleTraitSelect = (trait) => {
    if (selectedTraits.length >= 5 && !selectedTraits.find(t => t.trait === trait.trait)) return;
    
    const isSelected = selectedTraits.find(t => t.trait === trait.trait);
    if (isSelected) {
      setSelectedTraits(selectedTraits.filter(t => t.trait !== trait.trait));
    } else {
      setSelectedTraits([...selectedTraits, { ...trait, enabled: true }]);
    }
  };

  const router = useRouter()

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
      fetchUserId(decodedEmail);
      fetchJobss(decodedEmail);
    } catch (err) {
      console.error('Error decoding token:', err);
      router.push('/');
    }
  }, []);

  const fetchUserId = async (email) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('ID, subscription')
      .eq('email', email)
      .single();

    if (error) throw error;
    if (data) {
      setUserId(data.ID);
      setSubscription(data.subscription || 'free');
    }
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    fetchJobs();
    // fetchApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get-jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  // const fetchJobss = async (email) => {
  //   try {
  //     const response = await axios.get(`http://localhost:8000/creator-jobs/${email}`);
  //     setJobss(response.data);
  //   } catch (error) {
  //     console.error('Error fetching jobs:', error);
  //   }
  // };

  const fetchJobss = async (email) => {
    try {
      // Get only jobs created by this user's email
      const response = await axios.get(`http://localhost:8000/matching-creator-jobs/${email}`);
      setJobss(response.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobss([]);
    }
  };

  const fetchApplications = async (jobId) => {
    try {
      const response = await axios.get(`http://localhost:8000/job-applications/${jobId}`, {
        params: { creator_email: userEmail }
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  // const fetchApplications = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:8000/applications');
  //     setApplications(response.data || []);
  //   } catch (error) {
  //     console.error('Error fetching applications:', error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...formData,
        required_skills: Array.isArray(formData.required_skills) 
          ? formData.required_skills 
          : formData.required_skills.split(',').map(skill => skill.trim()),
        desired_traits: selectedTraits, // Add this line
        creator: userEmail
      };

      if (selectedJob) {
        await axios.put(`http://localhost:8000/jobs/${selectedJob.id}`, jobData);
      } else {
        await axios.post('http://localhost:8000/create-job', jobData);
        toast.success('Job Posted successfully!', {
                onClose: () => {
                  // Wait for the toast to be visible before refreshing
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }
        });
      }
      setShowJobForm(false);
      fetchJobs();
      // Reset form
      setFormData({
        title: '',
        company_name: '',
        company_email: '',
        location: '',
        company_description: '',
        required_skills: [],
        desired_traits: [
          { trait: "Problem Solving", score: 4.5 },
          { trait: "Team Collaboration", score: 4.0 },
          { trait: "Communication", score: 4.2 },
          { trait: "Leadership", score: 4.0 },
          { trait: "Adaptability", score: 4.3 }
        ],
        linkedin_url: '',
        website_url: '',
        experience_required: 0,
        company_logo_url: ''
      });
    }  catch (error) {
        if (error.response?.status === 422) {
          const detail = error.response.data.detail;
          toast.error(`Validation error: ${detail.message} (Field: ${detail.field})`);
        } else {
          console.error('Error creating job:', error);
          toast.error('Failed to create job. Please try again.');
        
        }
    }
  };

  const handleRejectApplication = async (applicationId) => {
    try {
      const token = localStorage.getItem('authToken');
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const creatorEmail = tokenData.email;

      const response = await fetch(`http://localhost:8000/applications/${applicationId}?creator_email=${creatorEmail}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reject application');
      }

      // Remove the application from the local state
      setApplications(prevApplications => 
        prevApplications.filter(app => app.id !== applicationId)
      );

      // Optionally show a success message
      toast.success('Application Closed successfully');

    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error('Failed to reject application. Please try again.');
    }
  };

  // const handleSubmits = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const jobData = {
  //       ...formData,
  //       required_skills: Array.isArray(formData.required_skills) 
  //         ? formData.required_skills 
  //         : formData.required_skills.split(',').map(skill => skill.trim()),
  //       creator: userEmail
  //     };

  //     if (selectedJob) {
  //       await axios.put(`http://localhost:8000/jobs/${selectedJob.id}`, jobData);
  //     } else {
  //       await axios.post('http://localhost:8000/create-job', jobData);
  //     }
      
  //     setShowJobForm(false);
  //     setSelectedJob(null);
  //     fetchJobss(userEmail);
  //     resetForm();
  //   } catch (error) {
  //     console.error('Error saving job:', error);
  //     alert('Failed to save job. Please try again.');
  //   }
  // };

  const deleteJob = async (jobId) => {
    try {
      const token = localStorage.getItem('authToken');
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      await axios.delete(`http://localhost:8000/jobs/${jobId}`, {
        params: { creator_email: tokenData.email }
      });
      fetchJobs(tokenData.email);
      fetchJobss(tokenData.email);
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const deleteApplication = async (applicationId) => {
    try {
      await axios.delete(`http://localhost:8000/applications/${applicationId}`, {
        params: { creator_email: userEmail }
      });
      if (selectedJob) {
        fetchApplications(selectedJob.id);
      }
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const editJob = (job) => {
    setSelectedJob(job);
    setFormData({
      ...job,
      required_skills: job.required_skills.join(', ')
    });
    setShowJobForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company_name: '',
      company_email: '',
      location: '',
      company_description: '',
      required_skills: [],
      desired_traits: [
        { trait: "Problem Solving", score: 4.5 },
        { trait: "Team Collaboration", score: 4.0 },
        { trait: "Communication", score: 4.2 },
        { trait: "Leadership", score: 4.0 },
        { trait: "Adaptability", score: 4.3 }
      ],
      linkedin_url: '',
      website_url: '',
      experience_required: 0,
      company_logo_url: '',
      creator: '',
    });
  };

  const formatPercentage = (value) => {
    return typeof value === 'number' ? `${value.toFixed(1)}%` : 'N/A';
  };

  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = (email) => {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsValidEmail(false);
      return;
    }

    // Check if email ends with @gmail.com
    if (email.toLowerCase().endsWith('@gmail.com')) {
      toast.error('Please use your company email address instead of Gmail');
      setIsValidEmail(false);
      return;
    }

    setIsValidEmail(true);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData({ ...formData, company_email: email });
    validateEmail(email);
  };


  return (
    <div style={{ backgroundColor: 'white' }}>
      <div className="dashboard">
        <nav className="navbar">
          <div className="nav-brand">
            <span className="full_logo">
              <span style={{fontSize: 16}}><UserCircle2 /> {userEmail}</span>
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
                <span className="stat-icon"><Briefcase color='#15173D' /></span>
                <div className="stat-text">
                  <h3>Total Jobs</h3>
                  <p>{jobss.length}</p>
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-content">
                <span className="stat-icon"><Users color='#15173D' /></span>
                <div className="stat-text">
                  <h3>Total Applications</h3>
                  <p>{applications.length} / {APPLICANT_LIMIT}</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{marginTop: -13}} className="content-section">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
                onClick={() => setActiveTab('posts')}
              >
                <span><Zap /> Job Posts</span>
              </button>
              <button 
                className={`tab ${activeTab === 'applications' ? 'active' : ''}`}
                onClick={() => setActiveTab('applications')}
              >
                <span><Users /> Applications</span>
              </button>
              <button 
                className={`tab ${activeTab === 'goback' ? 'active' : ''}`}
                onClick={() => router.push("/job-search/dashboard")}
              >
                <span><ArrowLeftCircle /> Go to Dashboard</span>
              </button>
            </div>

            <div className="profile-section">
              <div className="profile-header">
                <h2 className='hs-title-11' style={{color: '#15173D'}}>
                  <ScanText size={18} style={{marginTop: -3}} /> Candidate Screening
                </h2>
                <div>
                <button
                    className="upgrade-plan"
                    style={{ marginTop: -25 }}
                    onClick={() => {
                      if (jobss.length >= JOB_LIMIT) {
                        toast.error(`Plan limit reached: max ${JOB_LIMIT} job posts`);
                        return;
                      }
                      setShowJobForm(true);
                    }}
                >
                  <PlusCircle size={14} style={{marginTop: -2}} /> Create New Job
                </button> &nbsp;
                  <button 
                    className="upgrade-plan"
                    style={{marginTop: -25}}
                    onClick={() => router.push("/candidate-filter")}
                  >
                  <Layers size={14} style={{marginTop: -2}} /> View Reports
                </button>
                </div>
              </div>
              <p style={{marginTop: 0, fontSize: 14, color: '#15173D'}}>Take a moment to review your profile and make any necessary changes. If you spot any mistakes or outdated information, you can easily edit the details in the form to make sure everything is correct and reflects your current information. Keeping your profile up to date helps you to present the best version of yourself.</p>

            </div>
            
            <div style={{borderRadius: 0}}>
            <div className="profile-content">
            {showJobForm && (
              <div className="edit-form">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label><Zap size={16} style={{marginTop: -5}} /> Job Title</label>
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={formData.title}
                      style={{color: '#15173D'}}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label style={{marginTop: 20}} ><Rocket style={{marginTop: -4}}  size={16} /> Business Name</label>
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={formData.company_name}
                      style={{color: '#15173D'}}
                      onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label style={{marginTop: 20}} ><Image style={{marginTop: -4}}  size={16} /> Company Logo URL</label>
                    <input
                      type="text"
                      placeholder="Company Logo URL"
                      value={formData.company_logo_url}
                      style={{color: '#15173D'}}
                      onChange={(e) => setFormData({...formData, company_logo_url: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label style={{marginTop: 20}} ><Mail style={{marginTop: -4}}  size={16} />  Business Email Address</label>
                    <input
                      type="email"
                      placeholder="Company Email"
                      value={formData.company_email}
                      style={{color: '#15173D'}}
                      onChange={handleEmailChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label style={{marginTop: 20}} ><MapPin style={{marginTop: -4}}  size={16} />  Location</label>
                    <input
                      type="text"
                      placeholder="Location"
                      value={formData.location}
                      style={{color: '#15173D'}}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label style={{marginTop: 20}} ><Text style={{marginTop: -4}}  size={16} />  About your Business (in short)</label>
                    <textarea
                      placeholder="Company Description"
                      value={formData.company_description}
                      style={{color: '#15173D'}}
                      onChange={(e) => setFormData({...formData, company_description: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label style={{marginTop: 20}} ><Star style={{marginTop: -4}}  size={16} /> Required Skills <span style={{color: 'grey', fontSize: 14}}>(Seperated by ", ")</span> </label>
                    <input
                      type="text"
                      placeholder="Required Skills (comma-separated)"
                      onChange={(e) => setFormData({...formData, required_skills: e.target.value.split(',').map(skill => skill.trim())})}
                      style={{color: '#15173D'}}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label style={{marginTop: 20}} ><Timer style={{marginTop: -4}}  size={16} /> Required Years of Working Experience</label>
                    <input
                      type="number"
                      placeholder="Experience Required (years)"
                      value={formData.experience_required}
                      style={{color: '#15173D'}}
                      onChange={(e) => setFormData({...formData, experience_required: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label style={{marginTop: 20, marginBottom: 10, color: '#15173D', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <Sliders color='#15173D' size={16} /> Desired Traits
                    </label>
                    
                    <div className="traits-container">
                      <div style={{
                        padding: '10px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '6px',
                        marginBottom: '15px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{color: '#15173D'}}><Zap size={16} color='#15173D' /> Available Traits</span>
                        <span className="trait-value"><Star size={16} color='#15173D' /> Selected: {selectedTraits.length}/5</span>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '10px',
                        marginBottom: '20px'
                      }}>
                        {allTraits.map((trait) => {
                          const isSelected = !!selectedTraits.find(t => t.trait === trait.trait);
                          const isDisabled = !isSelected && selectedTraits.length >= 5;
                          
                          return (
                            <div 
                              key={trait.trait} 
                              className="trait-slider"
                              onClick={() => !isDisabled && handleTraitSelect(trait)}
                              style={{
                                padding: '10px',
                                backgroundColor: isSelected ? '#E6EFF2' : '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '10px',
                                color: '#15173D',
                                transition: 'all 0.2s',
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                opacity: isDisabled ? 0.6 : 1,
                              }}
                            >
                              <div className="trait-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                  width: '18px',
                                  height: '18px',
                                  borderRadius: '4px',
                                  border: '2px solid #e2e8f0',
                                  backgroundColor: isSelected ? '#15173D' : 'transparent',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.2s'
                                }}>
                                  {isSelected && (
                                    <div style={{
                                      width: '10px',
                                      height: '10px',
                                      backgroundColor: 'white',
                                      borderRadius: '2px'
                                    }} />
                                  )}
                                </div>
                                <span><Target size={16} color='#15173D' /> {trait.trait}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {selectedTraits.length > 0 && (
                        <div style={{
                          padding: '15px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '6px'
                        }}>
                          <div style={{
                            marginBottom: '15px',
                            fontWeight: 600,
                            color: '#15173D'
                          }}>
                            Set Score For Selected Traits
                          </div>
                          {selectedTraits.map((trait) => {
                            const percentage = ((trait.score - 0) / (5 - 0)) * 100;
                            return (
                              <div key={trait.trait} className="trait-slider" style={{ marginBottom: '12px' }}>
                                <div className="trait-label">
                                  <span style={{color: '#15173D'}}><Zap size={16} color='#15173D' /> {trait.trait}</span>
                                  <span style={{color: '#15173D'}} className="trait-value"> <Disc size={16} color='#15173D' /> {trait.score.toFixed(1)}</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="5"
                                  step="0.1"
                                  value={trait.score}
                                  onChange={(e) => {
                                    setSelectedTraits(selectedTraits.map(t =>
                                      t.trait === trait.trait ? { ...t, score: parseFloat(e.target.value) } : t
                                    ));
                                  }}
                                  className="slider"
                                  style={{
                                    background: `linear-gradient(90deg, #15173D ${percentage}%, white ${percentage}%)`
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label style={{marginTop: 20}} ><Linkedin style={{marginTop: -4}}  size={16} /> Business LinkedIn Page</label>
                    <input
                      type="url"
                      required
                      placeholder="Business LinkedIn URL"
                      value={formData.linkedin_url}
                      style={{color: '#15173D'}}
                      onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{marginTop: 20}} ><Globe2 style={{marginTop: -4}}  size={16} /> Business Website</label>
                    <input
                      type="url"
                      required
                      placeholder="Business Website URL"
                      value={formData.website_url}
                      style={{color: '#15173D'}}
                      onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                    />
                  </div>
                  <div className="button-group">
                    <button disabled={!isValidEmail} style={{backgroundColor: '#15173D', opacity: isValidEmail ? 1 : 0.5, cursor: isValidEmail ? 'pointer' : 'not-allowed'}}  type="submit" className="apply-buttonss">
                      <Rocket /> Post Job
                    </button>
                    <button
                    style={{backgroundColor: '#E6EFF2', color: '#15173D'}} 
                      type="button" 
                      className="apply-buttonss"
                      onClick={() => setShowJobForm(false)}
                    >
                      <X /> Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          </div>

            <div>
                  {activeTab === 'posts' ? (
                    <div className="matches-container">
                    <div className="matches-list">
                      {jobss.slice(0, JOB_LIMIT).map((job, index) => (
                        <div key={index}
                        className={`job-card ${selectedJob === job ? 'selected' : ''}`}
                        onClick={() => setSelectedJob(job)}
                        >
                          <div style={{borderRadius: 20}} className="job-item">
                            <div style={{marginTop: -10}} className="job-details">
                              <div className="job-header">
                                <h3>
                                  <img 
                                    src={job.company_logo_url}
                                    alt="Company Logo" 
                                    className="profile-picture" 
                                  /> 
                                  {job.title}
                                </h3>
                              </div>
                              <p style={{color: '#15173D', fontSize: 12}}>About: {job.company_description}</p>
                              <p style={{marginTop: -10, color: '#15173D'}} className="company">
                                <Building size={16} /> {job.company_name} | 
                                <MapPin size={16} /> {job.location} | 
                                <Timer size={16} /> {job.experience_required}+ yrs
                              </p>                          
                              <div style={{marginTop: 15}} className="company-links">
                                {job.linkedin_url && (
                                  <a style={{color: '#15173D'}} href={job.linkedin_url} target="_blank" rel="noopener noreferrer">
                                    <Linkedin style={{marginTop: -5}} size={16} />
                                  </a>
                                )} &nbsp;
                                {job.website_url && (
                                  <a style={{color: '#15173D'}} href={job.website_url} target="_blank" rel="noopener noreferrer">
                                    <Globe2 style={{marginTop: -5}} size={16} />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                          <br />
                          <div className="skills">
                            {job.required_skills.slice(0, 4).map((skill, i) => (
                              <span key={i} className="skill-tag">
                                <Star size={14} /> {skill}
                              </span>
                            ))}
                          </div>
                          <br />
                          <div className="button-group">
                            <button className="edit-button" onClick={() => editJob(job)}>
                              <Edit2 size={14} style={{marginTop: -3}} /> &nbsp;Edit
                            </button> &nbsp;
                            <button className="logout-buttons" onClick={() => deleteJob(job.id)}>
                              <Trash2 size={14} style={{marginTop: -3}} /> Delete
                            </button>
                            {/* <button className="apply-buttonss" onClick={() => fetchApplications(job.id)}>
                              <FileText size={16} /> View Applications
                            </button> */}
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedJob && (
                       <div className="job-detailss">
                       <div className='job-detailss-bg'>
                         <h2>
                           <img src={selectedJob.company_logo_url} alt="Profile Picture" className="profile-picture" />
                           {selectedJob.title}
                         </h2>
                         <h3 style={{marginLeft: 10, fontSize: 14, color: '#15173D'}}>
                           <Zap size={16} style={{marginTop: -3}} /> {selectedJob.company} | 
                           <MapPin size={16} style={{marginTop: -3}} /> {selectedJob.location} | 
                           <Timer size={16} style={{marginTop: -3}} /> Experience Required: {selectedJob.experience_required}+ years
                         </h3>
                         <p style={{marginLeft: 10, fontSize: 14, color: '#15173D'}}>{selectedJob.company_description}</p>
                       </div>
                       
                       <div className="match-detailss">
                         <h4 style={{color: '#15173D'}} className='hs-title-11'>
                           <ScanSearch size={18} style={{marginTop: -3}} /> Personal Traits Requirement
                         </h4>
                         <div className="progress-sectionss">
                           {selectedJob.desired_traits && selectedJob.desired_traits.map((trait, index) => (
                             <div className="progress-itemss" key={index}>
                               <span>
                                 <Target size={16} style={{marginTop: -3}} /> {trait.trait}: {((trait.score / 5) * 100).toFixed(1)}%
                               </span>
                               <div className="progress-barss">
                                 <div
                                   className="progressss"
                                   style={{ width: `${(trait.score / 5) * 100}%` }}
                                 ></div>
                                 {/* <span style={{fontSize: 13}} className="progress-valuess">
                                   {((trait.score / 5) * 100).toFixed(1)}%
                                 </span> */}
                               </div>
                             </div>
                           ))}
                         </div>
                 
                         <div className="required-skillsss">
                           <h4 style={{marginBottom: 15, color: '#15173D'}} className='hs-title-11'>
                             <Trophy size={16} style={{marginTop: -3}} /> Required Skills
                           </h4>
                           <div className="skills-gridss">
                             {selectedJob.required_skills.map((skill, index) => (
                               <span key={index} className="skill-tagss">
                                 <Star color='white' size={1} style={{marginTop: -3}} /> {skill}
                               </span>
                             ))}
                           </div>
                         </div>
                 
                         <button 
                          onClick={() => {
                            fetchApplications(selectedJob.id);
                            toast.success("Navigate to Applications Tab above", {
                              duration: 4000,
                              position: 'top-right',
                            });
                          }} 
                          className="apply-buttonss"
                        >
                          <Zap size={16} style={{marginTop: -3}} /> Enable View Applicants
                        </button>
                       </div>
                     </div>
                    )}
                    </div>
                  ) : (
                    <div style={{
                      maxHeight: '80vh',  // 80% of viewport height
                      overflowY: 'auto',
                      padding: '10px',
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#CBD5E0 #F1F5F9',
                      marginTop: '70px',
                      borderRadius: '40px'
                    }} className="matches-lists">
                      {applications.slice(0, APPLICANT_LIMIT).map((application, index) => (
                        <div key={index} className="job-cards" onClick={() => toggleExpand(index)}>
                          <div className="job-items">
                            <div style={{marginTop: -15}} className="job-details">
                              <div className="job-header">
                                <h3 style={{fontSize: 16}}>
                                  <img
                                    src={selectedJob.company_logo_url}
                                    alt="Applicant"
                                    className="profile-picture"
                                  /><span>{selectedJob.title}</span>|&nbsp;
                                  {application.resume_details.name} | <Zap size={16} color='#15173D' /> Overall Match: {' '}
                                    {application.personality_scores.overall >= 70 ? (
                                      <span style={{ 
                                        backgroundColor: '#2ecc71', 
                                        color: 'white', 
                                        padding: '2px 8px', 
                                        borderRadius: '12px', 
                                        fontSize: '0.9em' 
                                      }}>Great Match</span>
                                    ) : application.personality_scores.overall >= 60 ? (
                                      <span style={{ 
                                        backgroundColor: '#f1c40f', 
                                        color: 'white', 
                                        padding: '2px 8px', 
                                        borderRadius: '12px', 
                                        fontSize: '0.7em' 
                                      }}>Good Fit</span>
                                    ) : null} | <Timer size={16} color='#15173D' /> Years of working experience: {application.resume_details.experience_years}+ years  <ChevronDown fill='#15173D' color='white' size={30} style={{marginLeft: 40}} />
                                  </h3>
                              </div>
                              
                              <div className={`content ${expandedItems[index] ? 'expanded' : ''}`}>
                                <p style={{backgroundColor: 'white', padding: 10, borderRadius: 40, color: '#15173D'}} className="company">
                                  <Mail size={16} /> {application.applicant_email} | 
                                  <Zap size={16} color='#15173D' />Overall Psychometric Score: {application.personality_scores.overall.toFixed(2)}% |
                                  <Zap size={16} color='#15173D' /> Cultural Fit: {application.personality_scores?.cultural_fit.toFixed(2)}% |
                                  <Zap size={16} color='#15173D' /> Conflict Resolution: {application.personality_scores?.conflict_resolution.toFixed(2)}% |
                                  <a onClick={(e) => e.stopPropagation()} href={application.resume_details?.github_url}><Github size={20} color='white' style={{backgroundColor: '#15173D', padding: 4, borderRadius: 20, marginTop: -2}} /></a>
                                  <a onClick={(e) => e.stopPropagation()} href={application.resume_details?.linkedin_url}><Linkedin size={18} style={{marginTop: -3}} color='#15173D' /></a>
                                  
                                </p>
                                <br />
                                <ConnectModal
                                  application={{
                                    applicant_email: application.applicant_email,
                                    applicant_name: application.resume_details?.name,
                                    job_id: selectedJob?.id,           // from selectedJob state
                                    job_title: selectedJob?.title,     // from selectedJob state
                                    company_name: selectedJob?.company_name,  // from selectedJob state
                                    hr_email: userEmail,
                                  }}
                                /> &nbsp;

                                <button onClick={(e) => { e.stopPropagation(); handleRejectApplication(application.id);}} style={{backgroundColor: 'red', color: 'white', padding: 10, borderRadius: 40, fontSize: 14}}><X size={16} style={{marginTop: -3}} /> Different Direction </button>
                                    
                                {expandedItems[index] && (
                                  <>
                                    <div style={{marginTop: 50}} className="skills">
                                      <h4 style={{
                                        color: '#1a202c',
                                        fontSize: '17px',
                                        fontWeight: '600',
                                        width: '100%',
                                      }}><Rocket size={16} style={{marginTop:-2}} /> Skills:</h4>
                                      {application.resume_details.skills.map((skill, i) => (
                                        <span style={{backgroundColor: 'white'}} key={i} className="skill-tag">
                                          <Star size={16} /> {skill}
                                        </span>
                                      ))}
                                    </div>
                                    <div style={{
                                      marginTop: 45,
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                      gap: '20px',
                                    }} className="experience">
                                      <h4 style={{
                                        color: '#1a202c',
                                        fontSize: '17px',
                                        fontWeight: '600',
                                        width: '100%',
                                      }}><Zap size={16} style={{marginTop:-2}} /> Work Experience:</h4>
                                      
                                      {application.resume_details.work_experience.map((exp, i) => (
                                        <div key={i} style={{
                                          width: 'calc(50% - 10px)',
                                          backgroundColor: 'white',
                                          borderRadius: '12px',
                                          padding: '20px',
                                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                          border: '1px solid #e2e8f0',
                                          transition: 'transform 0.2s ease',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: '8px',
                                          minHeight: '140px',
                                        }}>
                                          <div style={{ 
                                            fontWeight: '600', 
                                            color: '#2d3748',
                                            fontSize: '16px',
                                            borderBottom: '2px solid #e2e8f0',
                                            paddingBottom: '8px'
                                          }}>
                                            <Zap size={16} style={{marginTop: -2}} /> Title: {exp.job_position}
                                          </div>
                                          <div style={{ 
                                            color: '#15173D',
                                            fontSize: '15px',
                                            fontWeight: '500'
                                          }}>
                                            <Building2 size={16} style={{marginTop: -2}} /> Company: {exp.company}
                                          </div>
                                          <div style={{ 
                                            color: '#15173D',
                                            fontSize: '14px',
                                            marginTop: 'auto'
                                          }}>
                                            <Timer size={16} style={{marginTop: -2}} /> Years of Experience: {exp.duration}
                                          </div>
                                        </div>
                                      ))}
                                    </div>

                                    <div style={{
                                      marginTop: 45,
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                      gap: '20px',
                                    }} className="experience">
                                      <h4 style={{
                                        color: '#1a202c',
                                        fontSize: '17px',
                                        fontWeight: '600',
                                        width: '100%',
                                      }}><Trophy size={16} style={{marginTop:-3}} /> Projects / Achievements:</h4>
                                      
                                      {application.resume_details.projects.map((exp, i) => (
                                        <div key={i} style={{
                                          width: 'calc(50% - 10px)',
                                          backgroundColor: 'white',
                                          borderRadius: '12px',
                                          padding: '20px',
                                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                          border: '1px solid #e2e8f0',
                                          transition: 'transform 0.2s ease',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: '8px',
                                          minHeight: '140px',
                                        }}>
                                          <div style={{ 
                                            fontWeight: '600', 
                                            color: '#2d3748',
                                            fontSize: '16px',
                                            borderBottom: '2px solid #e2e8f0',
                                            paddingBottom: '8px'
                                          }}>
                                            <Medal size={16} style={{marginTop: -2}} /> Title: {exp.name}
                                          </div>
                                          <div style={{ 
                                            color: '#15173D',
                                            fontSize: '15px',
                                            fontWeight: '500'
                                          }}>
                                            <Target size={16} style={{marginTop: -2}} /> Summary: {exp.description}
                                          </div>
                                          <div style={{ 
                                            color: '#15173D',
                                            fontSize: '14px',
                                            marginTop: 'auto'
                                          }}>
                                            <Link size={16} style={{marginTop: -2}} /> Project Link: {exp.url}
                                          </div>
                                        </div>
                                      ))}
                                    </div>

                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
          </div>
        </main>
      </div>
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

        .job-items{
          border: 14px solid #F8FAFC;
          box-shadow: 0 8px 4px rgba(187, 205, 255, 0.44);
          borderRadius: 30px !important; 
          padding: 30px !important;
          marginTop: 0px; 
          backgroundColor: '#bff2f7';
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
          padding: 1rem;
          border-radius: 20px;
          margin-bottom: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 8px 4px rgba(187, 205, 255, 0.24);
          border: 10px solid #F8FAFC;
          background-color: #bff2f7 !important;
        }

        .job-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .job-card.selected {
          background-color: #E6EFF2;
        }

        .job-card h3 {
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
        color: #15173D;
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
        background: linear-gradient(90deg, #ECF8F9, #DDE6ED);
        border-radius: 30px;
        padding: 10px;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 0.5rem; /* Adds space between the icon and text */
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }


        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .skill-tag {
          background-color: white;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          font-size: 0.75rem;
          color: #15173D;
          border: 5px solid #F8FAFC;
          box-shadow: 0 8px 4px rgba(187, 205, 255, 0.24);
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
        border: 5px solid #F8FAFC;
          box-shadow: 0 8px 4px rgba(187, 205, 255, 0.24);
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
        border-radius: 30px;
        padding: 20px;
        border: 10px solid #F8FAFC;
          box-shadow: 0 8px 4px rgba(187, 205, 255, 0.24);
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
        color: #34495e;
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
        height: 7px;
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
        background: #bff2f7;
        color: #15173D;
        padding: 5px 10px;
        border-radius: 20px;
        font-size: 0.7rem;
        font-weight: 700;
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
          color: #666;
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
          padding: 0.3rem 1.2rem;
          border-radius: 40px;
          border: none;
          background-color: #15173D;
          border: 0.6px solid;
          border-style: dotted;
          border-color: #15173D;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          box-shadow: 0 2px 4px rgba(184, 203, 255, 0.2);
        }

        .logout-buttons {
          padding: 0.3rem 1.2rem;
          border-radius: 40px;
          border: none;
          background-color: transparent;
          border: 0.6px solid;
          border-style: dotted;
          border-color: #15173D;
          color: #15173D;
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

        .logout-buttons:hover {
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
          margin-top: 50px;
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
        .traits-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 20px;
        }

        .trait-slider {
          width: 100%;
        }

        .trait-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .trait-value {
          font-weight: 600;
          color: #15173D;
        }

        .slider {
          width: 100%;
          -webkit-appearance: none;
          height: 6px;
          border-radius: 4px;
          background: linear-gradient(to left, #15173D, #00f2fe);
          outline: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
          border: 2px solid #15173D;
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #0070f3;
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
        .dashboard {
          min-height: auto;
          padding: 1rem;
        }

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

        .nav-brand {
          font-size: 1.25rem;
        }

        .dashboard-main {
          margin: 1rem auto;
          padding: 0 0.5rem;
        }

        .stats-grid {
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }

        .stat-card {
          padding: 1rem;
        }

        .matches-container {
          grid-template-columns: 1fr;
          padding: 1rem;
          gap: 1rem;
        }

        .matches-list {
          height: auto;
          max-height: 400px;
          border-right: none;
          border-bottom: 1px solid #eee;
          padding-right: 0;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }

        .job-card {
          padding: 0.75rem;
        }

        .job-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .match-score {
          width: 100%;
        }

        .match-score span {
          width: 100%;
          justify-content: center;
        }

        .skills {
          margin-top: 0.5rem;
        }

        .job-detailss {
          padding: 1rem;
        }

        .job-detailss h2 {
          font-size: 1.5rem;
        }

        .job-detailss h3 {
          font-size: 1rem;
        }

        .match-detailss {
          padding: 1rem;
          margin-top: 0.5rem;
        }

        .skills-gridss {
          gap: 0.5rem;
        }

        .skill-tagss {
          padding: 0.25rem 0.5rem;
          font-size: 0.8rem;
        }

        .apply-buttonss {
          margin-top: 1rem;
          padding: 0.75rem;
        }

        .profile-section {
          padding: 1rem;
          margin-bottom: -15px;
        }

        .edit-form {
          padding: 1rem;
        }

        .form-group input,
        .form-group textarea {
          padding: 1rem;
        }

        .traits-container {
          padding: 0.75rem;
        }

        .card-container {
          grid-template-columns: 1fr;
        }

        .card {
          padding: 1rem;
        }

        .project-card {
          padding: 1rem;
        }

        /* Improved touch targets for mobile */
        // .logout-button,
        // .logout-buttons {
        //   min-height: 44px; /* Minimum touch target size */
        //   padding: 0.5rem 1rem;
        // }

        .logout-buttons {
          padding: 0.3rem 1.2rem;
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

        /* Improve form inputs for touch */
        .form-input,
        .form-textarea,
        .slider::-webkit-slider-thumb {
          min-height: 44px;
        }

        /* Adjust slider for touch */
        .slider {
          height: 12px;
        }

        .slider::-webkit-slider-thumb {
          width: 24px;
          height: 24px;
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
        }

        /* Improve spacing for touch targets */
        .trait-slider {
          margin: 1rem 0;
        }

        /* Font size adjustments for better readability */
        body {
          font-size: 16px;
        }

        .stat-card p {
          font-size: 1.25rem;
        }

        /* Improve button spacing */
        .buttons-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        /* Better scrolling experience */
        .matches-list::-webkit-scrollbar {
          width: 6px;
        }

        /* Adjust modal sizes if any */
        .modal-content {
          width: 90%;
          margin: 2rem auto;
          max-height: 80vh;
          overflow-y: auto;
        }
      }

      /* Additional breakpoint for very small devices */
      @media (max-width: 380px) {
        .navbar {
          padding: 0.5rem;
        }

        .stat-card {
          padding: 0.75rem;
        }

        .job-card h3 {
          font-size: 1rem;
        }

        .skill-tag {
          font-size: 0.7rem;
          padding: 0.2rem 0.5rem;
        }

        .match-score span {
          font-size: 0.8rem;
          padding: 0.5rem;
        }
      }

      `}</style>
    </div>
  );
};

export default CompanyDashboard;