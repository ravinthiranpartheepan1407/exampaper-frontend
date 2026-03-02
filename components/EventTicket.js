"use client";
import { Disc, Info, Layers, Navigation, Podcast, Rocket, SquareUserRound, Target, Ticket, TicketPlus, User, UserCircle, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import CourseModules from './CourseModules';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-toastify';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const EventTicket = () => {
  const router = useRouter()

  const [userEmail, setUserEmail] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/');
        return;
      }
    
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const decodedEmail = tokenData.email;
        setUserEmail(decodedEmail);
        await checkExistingTicket(decodedEmail);
      } catch (err) {
        console.error('Error decoding token:', err);
        router.push('/');
      }
    };

    checkAuth();
  }, []);

  const checkExistingTicket = async (email) => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('ticket_email', email)
        .single();

      if (error) throw error;
      setIsRegistered(!!data);
    } catch (error) {
      console.error('Error checking ticket:', error);
      // If error is not found, then user is not registered
      if (error.code === 'PGRST116') {
        setIsRegistered(false);
      }
    }
  };

  const handleTicketRegistration = async () => {
    if (isRegistered) {
      toast.error('You have already registered for this event!');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert([
          { ticket_email: userEmail }
        ]);

      if (error) throw error;

      setIsRegistered(true);
      toast.success('Successfully registered for the event!');
    } catch (error) {
      console.error('Error registering ticket:', error);
      toast.error('Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  
  const eventData = {
    title: "Transformer From Scratch - Ep.1",
    date: "Feb 23, 2025 (Updated)",
    time: "9:00 AM - 1:00 PM (IST)",
    venue: "Online | Remote",
    Focus: "Worldwide",
    price: "₹199",
    description: "Join us for a Builder Session on Transformer, where you will learn to build a transformer model from scratch. In event, we will cover the math behind transformer architecture, key components like attention mechanisms, how they are used in Generative AI applications, and much more.",
    
    speaker: {
      name: "Ravinthiran Partheepan",
      title: "Founder and CEO of Evalentum | Co-Founder and CTO at Arkhamm AI",
      bio: "4+ years of experience working as a Software Engineer (Web3 and AI) at companies such as Kleoverse (Finland), Cyborn (Singapore), Pharmatrace (Malta), and as the former Co-Founder and CTO of SFIE (Netherlands).",
      image: "https://lnzzqqhmqqpglzhcqxjw.supabase.co/storage/v1/object/public/icons/photo.jpg?t=2025-01-24T11%3A52%3A16.116Z"
    },

    eventTopics: [
      "Core Concepts and Math Behind Transformer: Learn what transformers are and why they are important",
      "Architecture Overview: Understand attention mechanisms, encoder-decoder design, and positional encoding.",
      "Hands-On Coding: Step-by-step implementation in Python from scratch.",
      "Applications: Discover how transformers are used in natural language processing and other fields",
    ],

    eventHighlights: [
      "The entire event will be carried out in English Language",
      "Builders will have their 15-minute Q&A session during the final session of the event day",
      "Event Location: Online",
      "Event Start Time: 9:00 A.M (IST)",
      "Event End Time: 1:00 P.M (IST)",
      "Q&A Session: 12:45 P.M - 12:55 P.M (IST)",
      "Group Selfie and End of Session: 12:55 - 1:00 P.M (IST)",
      "Note: The event streaming link will be shared on February 20th, 2025."
    ]
  };

  return (
    <div className="theme-main">
    <div className="dark-mode">
    <div className="page bg-dark-1" id="top"></div>
    <div className="event-ticket-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 style={{color: 'white'}} className='hs-title-8'>{eventData.title}</h1>
          {/* <p className='hs-title'>Improve service quality with emotion-based call insights.</p> */}
          <div className="">
            <span style={{color: 'white'}}>{eventData.date}</span> &nbsp;
            <span style={{color: 'white'}}>{eventData.time}</span> &nbsp;
            <span style={{color: 'white'}}>{eventData.venue}, {eventData.city}</span> &nbsp;
            <span style={{color: 'white'}}>{eventData.Focus}</span>
          </div>
        </div>
      </div>

      <div className="event-content">
        <div className="event-details">
          <h2 className='hs-title-10'><Info size={30} style={{marginTop: -10}} /> Event Details</h2>
          <p>{eventData.description}</p>

          <div className="event-topics">
            <h3 className='hs-title'><Layers /> Event Topics</h3>
            <ul>
              {eventData.eventTopics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </div>

          <div className="event-highlights">
            <h3 className='hs-title'><Zap /> Event Protocols</h3>
            <ul>
              {eventData.eventHighlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="event-sidebar">
          <div className="speaker-section">
            <h3 className='hs-title'><UserCircle style={{marginTop: -5}} size={30} /> Event Speaker</h3>
            <div className="speaker-card">
              <img 
                src={eventData.speaker.image} 
                alt={eventData.speaker.name} 
                className="speaker-image"
              />
              <div className="speaker-info">
                <h3 style={{borderRadius: 15, padding: 10, fontSize: 16}} className='hs-title cardz'><Podcast style={{marginTop: -2}} /> {eventData.speaker.name}</h3>
                <p style={{color: 'black', fontSize: 13}}><Target size={12} style={{marginTop: -2}} /> {eventData.speaker.title}</p>
                <p style={{color: 'black', marginTop: 5, fontSize: 13}} className="speaker-bio"><SquareUserRound style={{marginTop: -2}} size={12} /> {eventData.speaker.bio}</p>
              </div>
            </div>
          </div>

          <div className="ticket-purchase">
            <h3 className='hs-title'><TicketPlus style={{marginTop: -5}} size={30} /> Register Your Seat</h3>
            <div className="ticket-price">
              <span style={{color: 'black'}} className='hs-title-10'>Free</span>
              <button 
                    className="purchase-button"
                    onClick={handleTicketRegistration}
                    disabled={isLoading || isRegistered}
                  >
                    <Ticket size={18} style={{marginTop: -3}} />&nbsp;
                    {isLoading ? 'Processing...' : isRegistered ? 'Already Registered' : 'Get your Ticket'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <CourseModules />
      <style jsx>{`
          .event-ticket-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            color: #333;
          }

          .hero-section {
            text-align: center;
            margin-bottom: 40px;
            background-image: url('/texture/match.jpg');
            background-size: cover;
            background-position: center;
            background-blend-mode: overlay;
            padding: 40px;
            border-radius: 10px;
            position: relative;
          }

          .cardz{
            background-color: white;
            font-weight: 700;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                      backdrop-filter: blur(2px); 
          }

          .hero-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(106, 44, 231, 0.16); /* Darkens the background image */
            box-shadow: 0 10px 30px rgba(116, 37, 221, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(3px);     
            z-index: 1;
            border-radius: 10px;
          }

          .hero-content {
            position: relative;
            z-index: 2;
          }

          .hero-section h1 {
            font-size: 2.5rem;
            margin-bottom: 20px;
            color: 'white';
          }

          .event-header {
            text-align: center;
            margin-bottom: 2rem;
            background-color: grey;
            padding-bottom: 1rem;
          }

          .event-header h1 {
            font-size: 2.5rem;
            color: #1a1a1a;
            margin-bottom: 0.5rem;
          }

          .event-meta {
            display: flex;
            justify-content: center;
            gap: 1rem;
            color: #666;
          }

          .event-content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 2rem; 
          }

          .event-details h2, .event-sidebar h2 {
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
            color: #1a1a1a;
          }

          .event-topics ul, .event-highlights ul {
            list-style-type: disc;
            padding-left: 1.5rem;
            color: #444;
          }

          .speaker-section {
            background-color: #bcf2f6;
            border-radius: 20px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                      backdrop-filter: blur(2px);  
          }

          .speaker-card {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .speaker-image {
            width: 30px;
            height: 30px;
            margin-top: -165px;
            border-radius: 50%;
          }

          .speaker-info h3 {
            margin: 0 0 0.5rem 0;
            color: #1a1a1a;
          }

          .speaker-info p {
            margin: 0;
            color: #666;
          }

          .speaker-bio {
            margin-top: 0.5rem;
            font-size: 0.9rem;
          }

          .ticket-purchase {
            background-color: #bcf2f6;
            padding: 1.5rem;
            border-radius: 20px;
            text-align: left;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                      backdrop-filter: blur(2px);   
          }

          .ticket-price {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .purchase-button {
            background-color: white;
            color: black;
            border: 2px solid black;
            border-width: 2px;
            padding: 0.75rem 1.5rem;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(5px); 
          }

          .purchase-button:hover {
            background-color: #E6EFF2;
          }

          @media (max-width: 768px) {
            .event-content {
              grid-template-columns: 1fr;
            }
          }
      `}</style>
    </div>
    </div>
    </div>
  );
};

export default EventTicket;