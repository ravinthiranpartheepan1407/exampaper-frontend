// JobMatch.js
"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Dot, Layers3, Rocket, Save, Scale3D, ScanSearch, StepBack, StepForward, Target, Upload, Zap } from 'lucide-react';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default function JobMatch() {
  const [step, setStep] = useState(1); // 1: Test, 2: Resume Upload
  const [userEmail, setUserEmail] = useState('');
  const [answers, setAnswers] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [personalityScores, setPersonalityScores] = useState(null);

  const router = useRouter()

  useEffect(() => {
    const checkUserApplication = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        // router.push('/');
        return;
      }
  
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(tokenData.email);
  
        // Check if user exists in jobmatch table
        const { data, error } = await supabase
          .from('jobmatch')
          .select('email')
          .eq('email', tokenData.email)
          .single();
  
        if (data) {
          // User exists in jobmatch table, redirect to dashboard
          router.push('/job-search/dashboard');
        }
        // If user doesn't exist, they'll stay on current page
        
      } catch (err) {
        console.error('Error processing token:', err);
        // router.push('/');
      }
    };
  
    checkUserApplication();
  }, [router]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateScores = () => {
    const sections = {
      conflict_resolution: { questions: range(1, 15), weight: 0.35 },
      work_style: { questions: range(16, 30), weight: 0.35 },
      cultural_fit: { questions: range(31, 50), weight: 0.3 }
    };

    let scores = {};
    
    for (const [section, data] of Object.entries(sections)) {
      let sectionScore = 0;
      let answeredQuestions = 0;
      
      data.questions.forEach(q => {
        if (answers[q]) {
          let score;
          if (typeof answers[q] === 'number') {
            score = answers[q];
          } else {
            // Convert A,B,C,D to 4,3,2,1
            score = 4 - "ABCD".indexOf(answers[q]);
          }
          sectionScore += score;
          answeredQuestions++;
        }
      });
      
      scores[section] = answeredQuestions ? 
        (sectionScore / answeredQuestions) * 20 : 0; // Scale to 0-100
    }

    scores.overall = Object.entries(sections).reduce((acc, [section, data]) => {
      return acc + (scores[section] * data.weight);
    }, 0);

    return scores;
  };

  const handleTestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const scores = calculateScores();
      setPersonalityScores(scores);

      await supabase
        .from('jobmatch')
        .upsert({
          email: userEmail,
          personality_scores: scores,
          answers: answers,
          test_completed_at: new Date().toISOString()
        }, { onConflict: 'email' });

      setStep(2);
    } catch (err) {
      setError('Failed to save test results');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }
    setFile(selectedFile);
    setError('');
  };

  const handleResumeSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', userEmail);
    
    try {
      const response = await fetch('https://evalentumapi.com/analyze-resume', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Failed to analyze resume');
      
      const resumeDetails = await response.json();
      
      // Save to Supabase
      await supabase
        .from('jobmatch')
        .update({ 
          resume_details: resumeDetails,
          resume_uploaded_at: new Date().toISOString()
        })
        .eq('email', userEmail);

      // Get job matches
      const matchesResponse = await fetch('https://evalentumapi.com/find-matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_details: resumeDetails,
          personality_scores: personalityScores
        }),
      });
      
      const matchesData = await matchesResponse.json();
      
      // Save matches to Supabase
      await supabase
        .from('jobmatch')
        .update({ 
          job_matches: matchesData,
          matches_generated_at: new Date().toISOString()
        })
        .eq('email', userEmail);

      router.push('/job-search/dashboard');
    } catch (err) {
      setError('An error occurred while processing your resume');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const range = (start, end) => 
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const questions = {
    conflict_resolution: [
        {
            id: 1,
            text: "How do you usually react to disagreements in a team setting?",
            type: "multiple",
            options: [
                "Address them immediately",
                "Wait for the right moment",
                "Avoid confrontation",
                "Seek a mediator's help"
            ]
        },
        {
            id: 2,
            text: "I value constructive criticism as a tool for growth.",
            type: "scale",
            scale: [1, 5]
        },
        {
            id: 3,
            text: "When a team member disagrees with your idea, you:",
            type: "multiple",
            options: [
                "Defend your idea strongly",
                "Listen and try to understand their perspective",
                "Compromise to keep the peace",
                "Withdraw and focus on your tasks"
            ]
        },
        {
            id: 4,
            text: "A team member frequently misses deadlines. You:",
            type: "multiple",
            options: [
                "Talk to them to understand the reason",
                "Notify your supervisor immediately",
                "Adjust your tasks to compensate",
                "Ignore the issue"
            ]
        },
        {
            id: 5,
            text: "I prefer open communication to address team conflicts.",
            type: "scale",
            scale: [1, 5]
        },
        {
            id: 6,
            text: "How do you handle high-pressure situations in a team?",
            type: "multiple",
            options: [
                "Stay calm and focus on solutions",
                "Delegate tasks to share responsibility",
                "Seek guidance from a manager",
                "Avoid taking the lead"
            ]
        },
        {
            id: 7,
            text: "If a teammate undermines your authority, you:",
            type: "multiple",
            options: [
                "Confront them directly",
                "Report the issue to management",
                "Work to rebuild trust privately",
                "Ignore the behavior and move on"
            ]
        },
        {
            id: 8,
            text: "How comfortable are you with team brainstorming sessions?",
            type: "multiple",
            options: [
                "Very comfortable",
                "Somewhat comfortable",
                "Neutral",
                "Not comfortable"
            ]
        },
        {
            id: 9,
            text: "When two team members are in conflict, you:",
            type: "multiple",
            options: [
                "Mediate to find a solution",
                "Take sides based on the situation",
                "Stay neutral and uninvolved",
                "Escalate the issue to higher management"
            ]
        },
        {
            id: 10,
            text: "I prioritize team harmony over individual preferences.",
            type: "scale",
            scale: [1, 5]
        },
        {
            id: 11,
            text: "How do you approach constructive feedback?",
            type: "multiple",
            options: [
                "Embrace it as an opportunity for growth",
                "Consider it carefully but cautiously",
                "Feel defensive initially",
                "Avoid situations where feedback is given"
            ]
        },
        {
            id: 12,
            text: "I believe team success is more important than individual recognition.",
            type: "scale",
            scale: [1, 5]
        },
        {
            id: 13,
            text: "If a team project is failing, you:",
            type: "multiple",
            options: [
                "Reassess the approach with the team",
                "Suggest alternate solutions individually",
                "Focus only on your tasks",
                "Wait for leadership to provide direction"
            ]
        },
        {
            id: 14,
            text: "What do you prioritize in team meetings?",
            type: "multiple",
            options: [
                "Clear communication",
                "Goal alignment",
                "Individual accountability",
                "Avoiding conflict"
            ]
        },
        {
            id: 15,
            text: "I feel responsible for the overall success of my team.",
            type: "scale",
            scale: [1, 5]
        }
    ],
    work_style: [
        {
            id: 16,
            text: "How do you prefer to start your day at work?",
            type: "multiple",
            options: [
                "By planning tasks",
                "By tackling the most urgent work",
                "By reviewing previous accomplishments",
                "By connecting with teammates"
            ]
        },
        {
            id: 17,
            text: "I enjoy taking the lead in group projects.",
            type: "scale",
            scale: [1, 5]
        },
        {
            id: 18,
            text: "Which best describes your decision-making style?",
            type: "multiple",
            options: [
                "Analytical and data-driven",
                "Collaborative and consensus-based",
                "Quick and instinctive",
                "Cautious and risk-averse"
            ]
        },
        {
            id: 19,
            text: "I enjoy working in fast-paced environments.",
            type: "scale",
            scale: [1, 5]
        },
        {
            id: 20,
            text: "How do you feel about multitasking?",
            type: "multiple",
            options: [
                "Thrive under it",
                "Acceptable occasionally",
                "Prefer single-task focus",
                "Avoid it entirely"
            ]
        },
        {
            id: 21,
            text: "I am more comfortable with clear, detailed instructions than ambiguous goals.",
            type: "scale",
            scale: [1, 5]
        },
        {
            id: 22,
            text: "How do you prefer to communicate with colleagues?",
            type: "multiple",
            options: [
                "Face-to-face",
                "Over email",
                "Messaging apps",
                "Scheduled meetings"
            ]
        },
        {
            id: 23,
            text: "When approaching a deadline, you:",
            type: "multiple",
            options: [
                "Focus on completing tasks efficiently",
                "Coordinate with the team to divide work",
                "Prioritize quality over speed",
                "Feel stressed but manage to meet it"
            ]
        },
        {
            id: 24,
            text: "I prefer working independently over collaborative projects.",
            type: "scale",
            scale: [1, 5]
        },
        {
            id: 25,
            text: "How do you handle feedback on your work?",
            type: "multiple",
            options: [
                "Actively seek it and adjust",
                "Consider it but stick to my approach",
                "Feel motivated to improve",
                "Take it personally"
            ]
        },
        {
            id: 26,
            text: "I prefer flexible work schedules over strict timetables.",
            type: "scale",
            scale: [1, 5]
        },
        {
            id: 27,
            text: "What is your approach to problem-solving?",
            type: "multiple",
            options: [
                "Research thoroughly before acting",
                "Collaborate to find a solution",
                "Trust my instincts",
                "Defer to others with expertise"
            ]
        },
        {
            id: 28,
            text: "I often go above and beyond my job requirements.",
            type: "scale",
            scale: [1, 5]
        },
        {
            id: 29,
            text: "What motivates you to perform well at work?",
            type: "multiple",
            options: [
                "Personal growth and learning",
                "Recognition and rewards",
                "Achieving team goals",
                "Financial incentives"
            ]
        },
        {
            id: 30,
            text: "I am highly organized in managing my tasks.",
            type: "scale",
            scale: [1, 5]
        }
    ],
    cultural_fit: [
        {
            id: 31,
            text: "How do you define an ideal company culture?",
            type: "multiple",
            options: [
                "Collaborative and inclusive",
                "Innovative and fast-paced",
                "Structured and stable",
                "Growth-focused and competitive"
            ]
        },
        {
            id: 32,
            text: "I am comfortable working in a startup environment with evolving roles.",
            type: "scale",
            scale: [1, 5]
        },
        {
            id: 33,
            text: "How important are a company’s values to you?",
            type: "multiple",
            options: [
                "Extremely important",
                "Somewhat important",
                "Neutral",
                "Not important"
            ]
        },
        {
            id: 34,
            text: "I adapt quickly to new processes and tools.",
            type: "scale",
            scale: [1, 5]
        },
        {
            id: 35,
            text: "What type of leadership style do you prefer?",
            type: "multiple",
            options: [
                "Hands-on and directive",
                "Empowering and supportive",
                "Results-driven and strict",
                "Flexible and adaptive"
            ]
        },
        {
            id: 36,
            text: "I value diversity and inclusivity in the workplace.",
            type: "scale",
            scale: [1, 5]
        },
        {
            id: 37,
            text: "How do you feel about attending team-building activities?",
            type: "multiple",
            options: [
                "Enjoy and participate actively",
                "Attend occasionally if necessary",
                "Feel indifferent about them",
                "Avoid them if possible"
            ]
        },
        {
            id: 38,
            text: "I believe transparency in communication is essential for success.",
            type: "scale",
            scale: [1, 5]
        },
        {
            id: 39,
            text: "What is your preferred level of structure in a work environment?",
            type: "multiple",
            options: [
                "Highly structured and predictable",
                "Moderately structured with flexibility",
                "Minimal structure for creativity",
                "No structure, complete autonomy"
            ]
        },
        {
            id: 40,
            text: "I am motivated by contributing to a greater purpose.",
            type: "scale",
            scale: [1, 5]
        },
        {
            id: 41,
            text: "How do you feel about frequent changes in organizational priorities?",
            type: "multiple",
            options: [
                "Adapt quickly and stay positive",
                "Manage but prefer consistency",
                "Find it challenging",
                "Feel frustrated by frequent changes"
            ]
        },
        {
            id: 42,
            text: "I feel a strong sense of belonging at work is crucial.",
            type: "scale",
            scale: [1, 5]
        },
        {
            id: 43,
            text: "How important is work-life balance to you?",
            type: "multiple",
            options: [
                "Extremely important",
                "Somewhat important",
                "Neutral",
                "Not important"
            ]
        },
        {
            id: 44,
            text: "I am open to constructive discussions about differing opinions.",
            type: "scale",
            scale: [1, 5]
        },
        {
            id: 45,
            text: "How would you describe your ideal team dynamic?",
            type: "multiple",
            options: [
                "Collaborative and supportive",
                "Focused on individual contributions",
                "Goal-oriented and competitive",
                "Relaxed and independent"
            ]
        },
        {
            id: 46,
            text: "I enjoy working in a culturally diverse environment.",
            type: "scale",
            scale: [1, 5]
        },
        {
            id: 47,
            text: "What type of organizational structure do you prefer?",
            type: "multiple",
            options: [
                "Hierarchical with clear authority",
                "Flat with equal input",
                "Flexible and project-based",
                "Startup-like with evolving roles"
            ]
        },
        {
            id: 48,
            text: "I am passionate about my work aligning with my personal values.",
            type: "scale",
            scale: [1, 5]
        },
        {
            id: 49,
            text: "How do you handle cultural differences in the workplace?",
            type: "multiple",
            options: [
                "Learn and adapt to differences",
                "Respect but maintain my approach",
                "Seek to build common understanding",
                "Avoid engaging in cultural discussions"
            ]
        },
        {
            id: 50,
            text: "I believe mutual respect is key to workplace harmony.",
            type: "scale",
            scale: [1, 5]
        }
    ]
};


  return (
    <div style={{backgroundColor: 'white'}}>
    <div className="container">
    <div className="hero-section">
          <div className="hero-content">
                    <h1 style={{color: '#15173D'}} className="hs-title-8">Job Search Made Easier</h1>
                    <p style={{color: '#15173D'}} className='hs-title'>Personalized job recommendations, matching your potential with great opportunities.</p>
                    <div className="upload-sections">
                    <div className="file-upload">
                    <label className="upload-btn">
                        <StepForward style={{width: 15, color: '#15173D'}} />
                        <span>Post a Job Now!</span>
                        <button 
                        onClick={() => router.push("/job-search/org")} 
                        className="evaluate-btn"
                        >
                            <Rocket size={16} style={{marginTop: -3}} /> Create a Job Post
                        </button>
                    </label>
                    </div>
                </div>
          </div>
      </div>
      {step === 1 ? (
        <div className="test-section">
          <form onSubmit={handleTestSubmit}>
            {Object.entries(questions).map(([section, sectionQuestions]) => (
              <div key={section} className="section">
                <h2 className='hs-title-11' style={{color: '#15173D'}}><Scale3D size={20} style={{marginTop: -5}} /> {section.replace('_', ' ').toUpperCase()}</h2>
                <p>Everyone is great at something, so be honest it will help us match your personality and skills with the best cultural fit for you. This test helps us understand how you approach workplace situations, align with our company culture, and manage tasks. Your responses will give us insights into your problem-solving skills, teamwork, and working style to match a good fit for both you and the team.</p>
                <p>If any trait scores lower, don't worry! You have unique strengths that others may not, and everyone is different. Remember, you are amazing and talented in your own way.</p>
                {sectionQuestions.map(q => (
                  <div key={q.id} className="question">
                    <p style={{color: '#15173D', fontWeight: 600, fontSize: 17}}><Dot style={{marginTop: -3}} size={15} /> {q.text}</p>
                    {q.type === "multiple" ? (
                      <div className="options">
                        {q.options.map((opt, idx) => (
                          <label key={idx}>
                            <input
                              type="radio"
                              name={`q${q.id}`}
                              value={String.fromCharCode(65 + idx)}
                              onChange={e => handleAnswerChange(q.id, e.target.value)}
                              required
                            />
                            <span className="radio-label">{opt}</span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="rating">
                        {[1,2,3,4,5].map(n => (
                          <label key={n}>
                            <input
                              type="radio"
                              name={`q${q.id}`}
                              value={n}
                              onChange={e => handleAnswerChange(q.id, parseInt(e.target.value))}
                              required
                            />
                            <span className="rating-number">{n}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
            <button 
              type="submit" 
              disabled={loading}
              className="submit-button"
            >
              <Save color='white' size={15} style={{marginTop: -4}} /> {loading ? 'Saving...' : 'Submit Assessment'}
            </button>
          </form>
        </div>
      ) : (
        <div className="section">
          <div className="section">
                <h2 style={{color: '#15173D'}}><Zap size={20} style={{marginTop: -2}} /> Upload Resume</h2>
                <p>Upload your resume to show your skills and experience. This helps employers understand what you are good at and find the right job for you. A clear and complete resume makes it easier to get noticed and land a great job.</p>
          </div>
          <form onSubmit={handleResumeSubmit}>
            <div className="file-input-container">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf"
                id="resume-upload"
                className="file-input"
              />
              <label htmlFor="resume-upload" className="file-label">
                <Upload /> {file ? file.name : 'Choose PDF Resume'}
              </label>
            </div>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={!file || loading}
            >
              <Zap /> {loading ? 'Please wait...' : 'Submit Resume'}
            </button>
          </form>
          
          {error && <div className="error">{error}</div>}
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Lustria&family=DM+Sans:ital,opsz,wght@0,9..40,100..900;1,9..40,100..900&display=swap');

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem 2rem;
          margin-top: -100px;
          background: white;
          min-height: 100vh;
        }

        h1 {
          font-size: 2.5rem;
          text-align: center;
          color: #1a365d;
          margin-bottom: 3rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .section {
          margin-bottom: 0rem;
          padding: 2rem;
          background: transparent;
          border-radius: 40px;
          transition: transform 0.2s ease;
        }

        .section:hover {
          transform: translateY(-2px);
        }

        .section h2 {
          color: #2d3748;
          font-size: 1.5rem;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e2e8f0;
          font-weight: 700;
        }

        .question {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #bff2f772;
          border-radius: 40px;
          border: 1px solid rgb(191, 242, 247);
        }

        .question p {
          color: #4a5568;
          font-size: 1.1rem;
          margin-bottom: 1rem;
          line-height: 1.5;
          font-weight: 500;
        }

        .options, .rating {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .rating {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          max-width: 400px;
          margin: 1rem 0; /* Removes auto-centering and aligns to the left */
        }


        label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: background-color 0.2s ease;
        }

        label:hover {
          background-color: white;
          border-radius: 40px;
        }

        input[type="radio"] {
          appearance: none;
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid #cbd5e0;
          border-radius: 50%;
          margin: 0;
          transition: all 0.2s ease;
        }

        input[type="radio"]:checked {
          border-color: #15173D;
          background-color: #15173D;
          box-shadow: inset 0 0 0 4px white;
        }

        .radio-label {
          color: #15173D;
          font-size: 1rem;
          flex: 1;
        }

        .rating-number {
          font-weight: 600;
          color: #2d3748;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .file-input-container {
          margin: 2rem 0;
        }

        .file-input {
          display: none;
        }

        .file-label {
          display: block;
          width: 100%;
          padding: 1rem;
          text-align: center;
          background-color: #151515;
          color: white;
          border-radius: 40px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .file-label:hover {
          background-color: #2a2a2a;
          border-color: #151515;
        }

        .submit-button {
          width: 30%;
          padding: 1rem;
          background-color: #15173D;
          color: white;
          border: none;
          border-radius: 40px;
          font-size: 0.9rem;
          font-weight: 400;
          display: block;
          margin: 0 auto !important;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px rgba(66, 153, 225, 0.2);
        }

        .submit-button:hover:not(:disabled) {
          background-color: #15173deb;
          transform: translateY(-1px);
          box-shadow: 0 6px 8px rgba(66, 153, 225, 0.3);
        }

        .submit-button:disabled {
          background-color: #cbd5e0;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .error {
          color: #e53e3e;
          margin-top: 1rem;
          text-align: center;
          padding: 1rem;
          background-color: #fff5f5;
          border-radius: 0.5rem;
          border: 1px solid #feb2b2;
        }

        @media (max-width: 640px) {
          .container {
            padding: 1.5rem 1rem;
          }

          h1 {
            font-size: 2rem;
            margin-bottom: 2rem;
          }

          .section {
            padding: 1.5rem;
          }

          .rating {
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem;
          }
        }
        .hero-section {
            text-align: center;
            margin-bottom: 40px;
            margin-top: -20px;
            background-image: url('./texture/audio.jpg');
            background-size: cover;
            background-position: center;
            background-blend-mode: overlay;
            padding: 40px;
            border-radius: 40px;
            position: relative;
            box-shadow: 0 10px 30px rgba(227, 207, 250, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(1px);   
        }

        .hero-section::before {
             content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 40px;
            border: 1px solid rgba(255, 255, 255, 0.05);     
            box-shadow: 0 10px 30px rgba(208, 172, 255, 0.19),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(2px);       
            z-index: 1;
        }

        .hero-content {
            position: relative;
            z-index: 2;
        }

        .hero-section h1 {
            font-size: 3rem;
            margin-bottom: 1.5rem;
            color: #FFFFFF;
            font-weight: 700;
            letter-spacing: -0.5px;
        }

        .upload-sections {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1.5rem;
            margin-top: 2rem;
        }
            .file-upload {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .upload-btn {
          display: flex;
          align-items: center;
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 40px;
          padding: 0.5rem 1rem;
          cursor: pointer;
        }

        .upload-btn span {
          margin-left: 0.5rem;
          font-size: 0.875rem;
          color: #333;
        }

        .upload-btn input[type="file"] {
          display: none;
        }
          .evaluate-btn {
          background-color: #15173D;
          color: #fff;
          border: none;
          border-radius: 40px;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          cursor: pointer;
          margin-left: 1rem;
        }
        @media (max-width: 768px) {
        .container {
          padding: 1rem;
        }

        h1 {
          font-size: 1.75rem;
          margin-bottom: 1.5rem;
        }

        .section {
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .section h2 {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .question {
          padding: 1rem;
        }

        .question p {
          font-size: 1rem;
        }

        .rating {
          flex-direction: row;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: flex-start;
        }

        .rating-number {
          width: 1.75rem;
          height: 1.75rem;
          font-size: 0.875rem;
        }

        .hero-section {
          height: 200px;
          padding: 1.5rem 1rem;
        }

        .hero-section h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .upload-sections {
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        }

        .file-label {
          padding: 0.75rem;
          font-size: 0.875rem;
        }

        .submit-button {
          padding: 0.75rem;
          font-size: 1rem;
        }

        .options {
          gap: 0.5rem;
        }

        label {
          padding: 0.375rem;
        }

        input[type="radio"] {
          width: 1rem;
          height: 1rem;
        }

        .radio-label {
          font-size: 0.875rem;
        }
      }

      @media (max-width: 480px) {
        .container {
          padding: 0.75rem;
        }

        h1 {
          font-size: 1.5rem;
        }

        .section {
          padding: 0.75rem;
          border-radius: 0.75rem;
        }

        .question {
          padding: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .hero-section {
          height: 240px;
        }

        .hero-section h1 {
          font-size: 1.5rem;
        }

        .file-upload {
          flex-direction: column;
          gap: 0.75rem;
        }

        .evaluate-btn {
          margin-left: 0;
          width: 100%;
          margin-top: 0.5rem;
        }

        .upload-btn {
          width: 100%;
          justify-content: center;
        }
      }
      `}</style>
    </div>
    </div>
  );
}