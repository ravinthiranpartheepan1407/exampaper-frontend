"use client";
import React, { useState } from 'react';
import { Briefcase, Building, Building2, ChartNoAxesColumn, Globe2, GlobeLock, Linkedin, Mail, MapPin, Rocket, ScanSearch, Star, Target, Timer, Trophy, UserCircle2, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'

const PublicDashboard = () => {
  const [selectedJob, setSelectedJob] = useState(null);

  const router = useRouter()

  // Hardcoded jobs data
  const matches = [
    {
        id: 1,
        title: "Full Stack Engineer",
        company: "DataFlow Systems",
        location: "New York", 
        experience_required: 4,
        description: "Build scalable full stack applications using modern technologies",
        required_skills: ["Node.js", "React", "MongoDB", "AWS", "Docker"],
        overall_match: 87,
        skills_match: 85,
        personality_match: 90,
        experience_match: 86,
        linkedin_url: "https://linkedin.com",
        website_url: "https://example.com"
    },
    {
      id: 2,
      title: "Sr. Frontend Developer",
      company: "TechCorp LLC",
      location: "Newark, CA",
      experience_required: 5,
      description: "Join our innovative team building next-gen web applications",
      required_skills: ["React", "TypeScript", "NextJS", "TailwindCSS", "GraphQL"],
      overall_match: 87,
      skills_match: 88,
      personality_match: 82,
      experience_match: 89,
      linkedin_url: "https://linkedin.com",
      website_url: "https://example.com"
    },
    {
      id: 3,
      title: "Social Media Manager",
      company: "CloudTech Inc",
      location: "Austin, TX",
      experience_required: 3,
      description: "Develop robust backend services and APIs",
      required_skills: ["Google Ads", "SEO", "Copywriting", "Data analysis"],
      overall_match: 85,
      skills_match: 82,
      personality_match: 88,
      experience_match: 84,
      linkedin_url: "https://linkedin.com",
      website_url: "https://example.com"
    },
    {
      id: 4,
      title: "DevOps Engineer",
      company: "InfraPro Solutions",
      location: "Seattle, WA",
      experience_required: 4,
      description: "Manage cloud infrastructure and CI/CD pipelines",
      required_skills: ["AWS", "Terraform", "Jenkins", "Docker", "Kubernetes"],
      overall_match: 80,
      skills_match: 78,
      personality_match: 82,
      experience_match: 81,
      linkedin_url: "https://linkedin.com",
      website_url: "https://example.com"
    },
    {
      id: 5,
      title: "Mobile Developer",
      company: "AppWorks Tech",
      location: "Boston, MA",
      experience_required: 3,
      description: "Create engaging mobile applications",
      required_skills: ["React Native", "iOS", "Android", "Firebase", "Redux"],
      overall_match: 78,
      skills_match: 75,
      personality_match: 80,
      experience_match: 79,
      linkedin_url: "https://linkedin.com",
      website_url: "https://example.com"
    }
  ];

  const formatPercentage = (value) => {
    return typeof value === 'number' ? `${value.toFixed(1)}%` : 'N/A';
  };

  return (
    <div style={{backgroundColor: 'white'}}>
      <div className="dashboard">
        <nav className="navbar">
          <div className="nav-brand">
            <span className="full_logo">
              <img src="/texture/Evalentum-2.png" alt="" className="desktop_logo" />
              <img src="/texture/Evalentum-2.png" alt="" className="retina_logo" />
            </span>
          </div>
          <div onClick={() => router.push("/")} className="nav-user">
            <span><UserCircle2 /> Login in to Apply</span>
            <button onClick={() => router.push("/")} className="logout-button">
              <span style={{fontSize: 13}}><Zap size={17} /> Login</span>
            </button>
          </div>
        </nav>

        <main className="dashboard-main">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-content">
                <span style={{backgroundColor: 'white', borderRadius: 30, padding: 10}} className="stat-icon">
                  <Rocket color='black' />
                </span>
                <div className="stat-text">
                  <h3>Total Matches</h3>
                  <p>{matches.length}</p>
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-content">
                <span style={{backgroundColor: 'white', borderRadius: 30, padding: 10}} className="stat-icon">
                  <Target color='black' />
                </span>
                <div className="stat-text">
                  <h3>Best Match Score</h3>
                  <p>{formatPercentage(Math.max(...matches.map(job => job.overall_match)))}</p>
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-content">
                <span style={{backgroundColor: 'white', borderRadius: 30, padding: 10}} className="stat-icon">
                  <Trophy color='black' />
                </span>
                <div className="stat-text">
                  <h3>Updated Skills Index</h3>
                  <p>85%</p>
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-content">
                <span style={{backgroundColor: 'white', borderRadius: 30, padding: 10}} className="stat-icon">
                  <Building color='black' />
                </span>
                <div className="stat-text">
                  <h3>Updated Culture Fit Index</h3>
                  <p>90%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="content-section">
            <div style={{marginTop: 35}}></div>
            <div className="tab-content">
              <div>
                <div className="profile-section">
                  <div className="profile-header">
                    <h2 className='hs-title-8' style={{color: 'black'}}>
                      <ScanSearch size={55} style={{marginTop: -6}} /> Find your Job Fit
                    </h2>
                    <button onClick={() => router.push("/job-search/org")} className="edit-button" style={{marginTop: -25}}>
                      <Rocket /> Create a Job Post
                    </button>
                  </div>
                  <p style={{marginTop: -25, fontSize: 14, color: 'black'}}>
                    Take a moment to review your profile and make any necessary changes. If you spot any mistakes or outdated information, you can easily edit the details in the form to make sure everything is correct and reflects your current information. <span style={{fontWeight: 600}}>Note: This is a sandbox view. To get job recommendations that match your traits, you need to log in and apply.</span>
                  </p>
                </div>

                <div className="matches-container">
                  <div className="matches-list">
                    {matches.map((job, index) => (
                      <div 
                        key={index}
                        className={`job-card ${selectedJob === job ? 'selected' : ''}`}
                        onClick={() => setSelectedJob(job)}
                      >
                        <div className="job-item">
                          <div className="job-details">
                            <div className="job-header">
                              <h3>
                                <img src="/assets/images/favicon.png" alt="Profile Picture" className="profile-picture" />
                                {job.title}
                              </h3>
                              <div style={{color: 'black'}} className="match-score">
                                <span>
                                  <Rocket size={16} color="black" /> {formatPercentage(job.overall_match)} Match
                                </span>
                              </div>
                            </div>
                            <p style={{marginLeft: 10, color: 'black'}} className="company">
                              <Zap size={16} style={{marginTop: -3}} /> {job.company} | 
                              <MapPin style={{marginTop: -3}} size={16} /> {job.location} | 
                              <Timer style={{marginTop: -3}} size={16} /> Years: {job.experience_required}+ yrs
                            </p>
                            <br />
                            <p style={{marginLeft: 10, fontSize: 14, color: 'black'}}>{job.description}</p>
                          </div>
                        </div>

                        <div style={{backgroundColor: '#E6EFF2', padding: 10, borderRadius: 20, marginTop: 15}}>
                          <div className="skills">
                            {job.required_skills.slice(0, 4).map((skill, i) => (
                              <span style={{backgroundColor: 'white', color: 'black'}} key={i} className="skill-tag">
                                <Star size={16} /> {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div style={{marginTop: 15}}></div>
                        <button className="logout-button">
                          <span style={{fontSize: 13}}>
                            <Target size={18} color='black' style={{marginTop: -4, borderRadius: 10, backgroundColor: 'white', padding: 3}} />
                            &nbsp;View Job
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>

                  {selectedJob && (
                    <div className="job-detailss">
                      <div className='job-detailss-bg'>
                        <h2>
                          <img src="/assets/images/favicon.png" alt="Profile Picture" className="profile-picture" />
                          {selectedJob.title}
                        </h2>
                        <h3 style={{marginLeft: 10, fontSize: 14, color: 'black'}}>
                          <Zap size={16} style={{marginTop: -3}} /> {selectedJob.company} | 
                          <MapPin size={16} style={{marginTop: -3}} /> {selectedJob.location} | 
                          <Timer size={16} style={{marginTop: -3}} /> Experience Required: {selectedJob.experience_required}+ years
                        </h3>
                        <p style={{marginLeft: 10, fontSize: 14, color: 'black'}}>{selectedJob.description}</p>
                        <div style={{marginTop: -10, backgroundColor: '#EBF4F6', padding: 10, borderRadius: 20, width: 120}} className="company-links">
                          <a style={{color: 'black', backgroundColor: 'white', padding: 5, borderRadius: 15}} href={selectedJob.linkedin_url} target="_blank" rel="noopener noreferrer">
                            <Linkedin color='black' style={{marginTop: -5}} size={16} />
                          </a> &nbsp;
                          <a style={{color: 'black', backgroundColor: 'white', padding: 5, borderRadius: 15}} href={selectedJob.website_url} target="_blank" rel="noopener noreferrer">
                            <Globe2 color='black' style={{marginTop: -5}} size={16} />
                          </a> &nbsp;
                          <a style={{color: 'black', backgroundColor: 'white', padding: 5, borderRadius: 15}} href={selectedJob.website_url} target="_blank" rel="noopener noreferrer">
                            <ScanSearch color='black' style={{marginTop: -5}} size={16} />
                          </a>
                        </div>
                      </div>

                      <div className="match-detailss">
                        <h4 style={{color: 'black'}} className='hs-title-6'>
                          <ScanSearch size={20} style={{marginTop: -3}} /> Match Breakdown
                        </h4>
                        <div className="progress-sectionss">
                          {[
                            { label: "Overall Match", value: selectedJob.overall_match },
                            { label: "Skills Match", value: selectedJob.skills_match },
                            { label: "Business Culture Match", value: selectedJob.personality_match },
                            { label: "Experience Match", value: selectedJob.experience_match }
                          ].map((item, index) => (
                            <div className="progress-itemss" key={index}>
                              <span>
                                <Target size={16} style={{marginTop: -3}} /> {item.label}: {formatPercentage(item.value)}
                              </span>
                              <div className="progress-barss">
                                <div className="progressss" style={{ width: `${item.value}%` }}></div>
                                <span style={{fontSize: 13}} className="progress-valuess">
                                  {formatPercentage(item.value)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="required-skillsss">
                          <h4 style={{marginBottom: 15, color: 'black'}} className='hs-title-6'>
                            <Trophy size={20} style={{marginTop: -3}} /> Required Skills
                          </h4>
                          <div className="skills-gridss">
                            {selectedJob.required_skills.map((skill, index) => (
                              <span key={index} className="skill-tagss">
                                <Star size={16} style={{marginTop: -3}} /> {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button onClick={() => router.push("/job-search")} className="apply-buttonss">
                          <Zap size={16} style={{marginTop: -3}} /> Apply Now
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

      <style jsx>{`
        .dashboard {
          min-height: 170vh;
        }

        .navbar {
          background-color: #fff;
          padding: 1rem 2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-brand {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
        }

        .nav-user {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: black;
        }

        .logout-button {
          padding: 0.5rem 1rem;
          background-color: black;
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
          background: #E6EFF2;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stat-card-content {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .stat-card h3 {
          margin: 0;
          font-size: 0.875rem;
          color: #666;
        }

        .stat-card p {
          margin: 0.5rem 0 0;
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
        }

        .tabs {
          margin-bottom: 1rem;
        }

        .tab {
          padding: 0.75rem 1.5rem;
          background: #ECF8F9;
          border: none;
          border-radius: 40px;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          color: #666;
          font-weight: 500;
        }

        .tab.active {
          color: black;
          border-radius: 40px;
           background: #DDE6ED
        }

        .matches-container {
          display: grid;
          grid-template-columns: 500px 2fr;
          gap: 2rem;
          background: #F5F7F8;
          padding: 1.5rem;
          border-radius: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
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
        scrollbar-color: black #fff; /* thumb color track color */
        scrollbar-width: thin; /* Sets the scrollbar width to thin */
        }

        .job-card {
          padding: 1rem;
          border-radius: 20px;
          margin-bottom: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          background-color: #F8FAFC;
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
        background: #E6EFF2;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        color: #333;
        }

        .job-detailss-bg{
          background: #ECF8F9;
          border-radius: 30px;
          padding: 20px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .job-detailss h2 {
        font-size: 1.8rem;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 0.5rem;
        }

        .job-detailss h3 {
        font-size: 1.2rem;
        color: #7f8c8d;
        margin-bottom: 1rem;
        }

        .match-detailss h4 {
        font-size: 1.4rem;
        color: #34495e;
        margin-bottom: 1rem;
        }

        .match-detailss{
          margin-top: 10px;
          background: #ECF8F9;
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
        color: #34495e;
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
        background: linear-gradient(90deg, #ECF8F9, black);
        height: 100%;
        border-radius: 20px;
        transition: width 0.5s ease-in-out;
        }

        .progress-valuess {
        font-size: 0.8rem;
        color: #2c3e50;
        margin-left: 10px;
        }

        .required-skillsss h4 {
        font-size: 1.4rem;
        margin-bottom: 0.5rem;
        color: #34495e;
        }

        .skills-gridss {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        }

        .skill-tagss {
        background: black;
        color: white;
        padding: 5px 10px;
        border-radius: 20px;
        font-size: 0.9rem;
        }

        .apply-buttonss {
        background-color: black;
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
          background: #BCF2F6;
          padding: 2rem;
          border-radius: 40px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: -30px;
        }

         .profile-sections {
          background: #F8FAFC;
          padding: 2rem;
          border-radius: 0px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: -30px;
        }

        textarea::-webkit-scrollbar {
          width: 4px;  /* Width of the scrollbar */
        }
        textarea::-webkit-scrollbar-thumb {
          background-color: #000;  /* Color of the scrollbar thumb */
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
          background-color: white;
          color: black;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .edit-button:hover {
          background-color: #FFF7F7;
        }

        .edit-button.save {
          background-color: white;
        }

        .edit-buttons {
          padding: 0.75rem 1.5rem;
          border-radius: 40px;
          border: none;
          background-color: black !important;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .edit-buttons:hover {
          background-color: #FFF7F7;
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
          color: black;
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
          color: #000;
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

      @media (max-width: 768px) {
      .profile-section {
        padding: 1.5rem;
      }

      .profile-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .profile-header h2 {
        width: 100%;
        margin-bottom: 0;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .profile-header .edit-button {
        width: 100%;
        margin-top: 0 !important;
        padding: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }
      
      .profile-section p {
        margin-top: 1rem !important;
      }
    }
        
      `}</style>
    </div>
    <footer className="techwave_fn_footer">
                <div className="techwave_fn_footer_content">
                    <div className="copyright">
                        <p style={{color: 'black'}}>2024© Evalentum</p>
                    </div>
                    <div className="menu_items">
                        <ul>
                            <li style={{color: 'black'}}><Mail size={20} />: info@evalentum.com </li> 
                            <li><Link href="https://www.linkedin.com/company/evalentum/"><Linkedin color='black' style={{marginTop: -8, color: 'black'}} size={20}/><span style={{color: 'black'}}> Linkedin </span></Link></li>
                            <li><Link href="/privacy"><GlobeLock color='black' size={20} style={{marginTop: -5, color: 'black'}} /><span style={{color: 'black'}}>: Privacy Policy </span></Link></li>
                        </ul>
                    </div>
                </div>
    </footer>
    </div>
  );
};

export default PublicDashboard;