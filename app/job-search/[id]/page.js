'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Building, MapPin, Timer, Linkedin, Globe2,
  Star, Target, Briefcase, Mail, ArrowLeft,
  Share2,
  Focus,
  SendHorizonal
} from 'lucide-react';
import Layout from '@/layouts/layout'

export default function PublicJobPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`https://evalentumapi.com/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error('Job not found:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p style={{ color: '#15173D' }}>Loading job...</p>
    </div>
  );

  if (!job) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p style={{ color: '#15173D' }}>Job not found.</p>
    </div>
  );

  return (
    <>
    <Layout>
    <div style={{ backgroundColor: 'white', minHeight: '100vh', marginTop: -100, padding: '40px 20px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header Card */}
        <div style={{
          backgroundColor: '#bff2f77c',
          padding: '32px', marginBottom: 20,
          borderRadius: 30,
          boxShadow: '0 8 4 rgba(187, 205, 255, 0.24)',
          color: '#15173D'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <img
              src={job.company_logo_url}
              alt="Company Logo"
              style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover', border: '1px solid #e2e8f0' }}
            />
            <div>
              <h1 style={{ fontSize: 22, color: '#15173D', fontWeight: 600, margin: 0 }}>{job.title}</h1>
              <p style={{ fontSize: 14, color: '#15173D', fontWeight: 600, margin: '4px 0 0' }}>
                <Building size={13} style={{ marginRight: 4, marginTop: -3 }} />
                {job.company_name}
              </p>
            </div>
          </div>

          {/* Meta Row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: '#15173D' }}>
            <span><MapPin style={{marginTop: -2}}  size={14} /> {job.location}</span>
            <span><Timer style={{marginTop: -3}}  size={14} /> {job.experience_required}+ years experience</span>
            <span><Mail style={{marginTop: -2}} size={14} /> {job.company_email}</span>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            {job.linkedin_url && (
              <a href={job.linkedin_url} target="_blank" rel="noopener noreferrer"
                style={{ color: '#15173D', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                <Linkedin size={15} style={{marginTop: -3}} /> LinkedIn
              </a>
            )}
            {job.website_url && (
              <a href={job.website_url} target="_blank" rel="noopener noreferrer"
                style={{ color: '#15173D', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                <Globe2 size={15} style={{marginTop: -3}} /> Website
              </a>
            )}
          </div>
          <br />

          <div className="button-group">
            <button
                className="edit-button"
                onClick={() => {
                const url = `${window.location.origin}/job-search/${job.id}`;
                navigator.clipboard.writeText(url);
                toast.success('Job link copied to clipboard!');
                }}
            >
                <Focus size={14} style={{ marginTop: -3 }} /> &nbsp;Find your fit
            </button>
          </div>
        </div>

        {/* About Section */}
        <div style={{
          backgroundColor: 'white', borderRadius: 16,
          padding: '24px 32px', marginBottom: 0,
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#15173D', marginBottom: 20 }}>
            <Briefcase size={15} style={{ marginRight: 6, marginTop: -3 }} />About the Job Position
          </h2>
          <p style={{ fontSize: 14, color: '#15173D', lineHeight: 1.7 }}>{job.company_description}</p>
        </div>

        {/* Required Skills */}
        <div style={{
          backgroundColor: 'white', borderRadius: 16,
          padding: '24px 32px', marginBottom: 20,
        }}>
          <h2 style={{ fontSize: 16, color: '#15173D', fontWeight: 600, marginBottom: 20 }}>
            <Star size={15} style={{ marginRight: 6, marginTop: -3 }} />Required Skills
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {job.required_skills.map((skill, i) => (
              <span key={i} style={{
                backgroundColor: '#bff2f7', color: '#15173D',
                padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 200
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Desired Traits */}
        {job.desired_traits?.length > 0 && (
          <div style={{
            backgroundColor: 'white', borderRadius: 16,
            padding: '24px 32px', marginBottom: 20,
          }}>
            <h2 style={{ fontSize: 16, color: '#15173D', fontWeight: 600, marginBottom: 20 }}>
              <Target size={15} style={{ marginRight: 6, marginTop: -3 }} />Desired Traits
            </h2>
            {job.desired_traits.map((trait, i) => {
              const pct = (trait.score / 5) * 100;
              return (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#15173D', marginBottom: 5 }}>
                    <span>{trait.trait}</span>
                    <span>{trait.score.toFixed(1)} / 5</span>
                  </div>
                  <div style={{ backgroundColor: '#e2e8f0', borderRadius: 99, height: 6 }}>
                    <div style={{
                      width: `${pct}%`, height: 6,
                      backgroundColor: '#15173D', borderRadius: 99,
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Apply CTA */}
        <div style={{
          backgroundColor: '#15173D', borderRadius: 70,
          padding: '28px 32px', textAlign: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.12)'
        }}>
          <p style={{ color: 'white', fontSize: 15, marginBottom: 16 }}>
            Interested in this role?
          </p>
            <button onClick={() => router.push("/get-started")} className='edit-button'>
              <SendHorizonal style={{marginTop: -2}}  size={14} /> Find your fit
            </button>
        </div>
      </div>
    </div>
    </Layout>
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
    `}
    </style>
    </>
  );
}