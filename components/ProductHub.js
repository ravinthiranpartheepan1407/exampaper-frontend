"use client";
import { Disc, Info, Layers, LucideShoppingBasket, Navigation, Podcast, Rocket, ShoppingBag, ShoppingBagIcon, SquareUserRound, Target, User, UserCircle, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import CourseModules from './CourseModules';

const ProductHub = () => {
  const router = useRouter()
  const eventData = {
    title: "Vertez: How Math is Used in Data Science",
    date: "Feb 15, 2025",
    time: "9:00 AM - 1:00 PM",
    venue: "Online | Remote",
    Focus: "Worldwide",
    price: "₹199",
    description: "Vertez explores the mathematical foundations of data science, focusing on linear algebra, probability, and statistics. Whether you are starting your journey in data science or already working in the field, this book provides the essential tools needed to analyze data, uncover patterns, and make informed decisions. Vertez bridges the gap between mathematics and data science, making it easier to understand how mathematical principles drive real-world data applications",
    
    speaker: {
      name: "Ravinthiran Partheepan",
      title: "Founder and CEO of Evalentum | Co-Founder and CTO at Arkhamm AI",
      bio: "4+ years of experience working as a Software Engineer (Web3 and AI) at companies such as Kleoverse (Finland), Cyborn (Singapore), Pharmatrace (Malta), and as the former Co-Founder and CTO of SFIE (Netherlands).",
      image: "https://lnzzqqhmqqpglzhcqxjw.supabase.co/storage/v1/object/public/icons/photo.jpg?t=2025-01-24T11%3A52%3A16.116Z"
    },

    eventTopics: [
      "Mathematical Foundations – Understand how linear algebra and statistics form the core of data science. Learn the principles behind data transformations, vector spaces, probability distributions, and statistical inference.",
      "Real-World Applications – Discover how these mathematical concepts are used in industries such as finance, healthcare, and technology. See how data science helps in fraud detection, medical diagnosis, and business forecasting.",
      "Hands-On Learning – Strengthen your understanding through exercises, examples, and step-by-step tutorials. Apply theoretical concepts to practical problems and improve your analytical skills.",
      "Statistical Insights – Learn to identify trends, correlations, and patterns in data using statistical techniques. Understand how probability and hypothesis testing play a role in data-driven decision-making.",
      "Comprehensive Resource – Whether you are a beginner, an experienced data professional, or an educator, this book serves as a detailed reference to guide you through the mathematical side of data science.",
      "Interdisciplinary Approach – Explore how these concepts extend beyond data science into fields like machine learning, artificial intelligence, and big data analytics.",
    ],

    eventHighlights: [
        "Aspiring Data Scientists – Build a strong foundation in the mathematics behind data science and develop the skills needed for data analysis and modeling.",
        "Data Analysts and Professionals – Gain deeper insights into mathematical concepts that enhance your ability to work with large datasets and complex problems.",
        "Educators and Students – Use this book as a structured learning resource to teach or study the mathematical aspects of data science in a clear and practical way.",
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
          {/* <div className="">
            <span style={{color: 'white'}}>{eventData.date}</span> &nbsp;
            <span style={{color: 'white'}}>{eventData.time}</span> &nbsp;
            <span style={{color: 'white'}}>{eventData.venue}, {eventData.city}</span> &nbsp;
            <span style={{color: 'white'}}>{eventData.Focus}</span>
          </div> */}
        </div>
      </div>

      <div className="event-content">
        <div className="event-details">
          <h2 className='hs-title-10'><Info size={30} style={{marginTop: -10}} /> About Vertez</h2>
          <p>{eventData.description}</p>

          <div className="event-topics">
            <h3 className='hs-title'><Layers /> Book Index</h3>
            <ul>
              {eventData.eventTopics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </div>

          <div className="event-highlights">
            <h3 className='hs-title'><Zap /> Who is this Book For?</h3>
            <ul>
              {eventData.eventHighlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="event-sidebar">
        
          <img style={{marginBottom: 25}} src="https://zdmueezfheensjrefapy.supabase.co/storage/v1/object/sign/rust-timers/Amazon%20cover_JP.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJydXN0LXRpbWVycy9BbWF6b24gY292ZXJfSlAuanBnIiwiaWF0IjoxNzM5MTk1MjU5LCJleHAiOjMzMTU5OTUyNTl9.cjsP-IEOleD4nyylDiXwVxnCuk-H-RX0FLMogkE8zLw" />

          <div className="ticket-purchase">
            <h3 className='hs-title'><ShoppingBagIcon style={{marginTop: -5}} size={30} /> Get Your Paperback</h3>
            <div className="ticket-price">
              <span style={{color: 'black'}} className='hs-title-10'>₹399</span>
              <button onClick={() => router.push("https://rzp.io/rzp/K8oe6Hot")} className="purchase-buttons"><Navigation size={16} style={{marginTop: -3}} /> Buy Now</button>
              <button onClick={() => router.push("https://www.amazon.com/dp/B0CJ4D13TG")} className="purchase-buttons"><LucideShoppingBasket size={16} style={{marginTop: -3}} /> Purchase on Amazon</button>
            </div>
          </div>
          
          <div style={{marginTop: 25}} className="speaker-section">
            <h3 className='hs-title'><UserCircle style={{marginTop: -5}} size={30} /> About Author</h3>
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
    
        </div>
        <div style={{marginTop: -30}} className="ticket-price">
              <button onClick={() => router.push("https://rzp.io/rzp/K8oe6Hot")} className="purchase-buttons"><ShoppingBag size={16} style={{marginTop: -3}} /> Buy Now</button>
        </div>
        <br />
        <div style={{marginTop: -20}} className="ticket-prices">
              <button onClick={() => router.push("https://www.amazon.com/dp/B0CJ4D13TG")} className="purchase-buttons"><LucideShoppingBasket size={16} style={{marginTop: -3}} /> Purchase on Amazon</button>
        </div>
      </div>
      {/* <CourseModules /> */}
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
            box-shadow: 0 10px 30px rgb(234, 220, 244),
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
            background-color: rgba(111, 39, 255, 0.2); /* Darkens the background image */
            box-shadow: 0 10px 30px rgba(11, 39, 255, 0.44),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                      backdrop-filter: blur(2px);   
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
            background-color: #f5f2f5;
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
            background-color: #f5f2f5;
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

          .purchase-buttons {
            background-color: white;
            width: 100%;
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

          .purchase-buttons:hover {
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

export default ProductHub;