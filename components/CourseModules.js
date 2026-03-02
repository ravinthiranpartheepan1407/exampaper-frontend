"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Lock, PlayCircle, CheckCircle, Target } from 'lucide-react';
import Link from 'next/link';
import Player from '@vimeo/player';

const CourseModules = () => {
  const [activeModule, setActiveModule] = useState(null);

  const [isDropdown, setIsDropdown] = useState(false)
  const handleIsDropdown = () => {
    setIsDropdown(!isDropdown)
  }

  const playerRef = useRef(null);
  const videoId = 1021270658; // Replace with your Vimeo video ID

  useEffect(() => {
    if (playerRef.current) {
      const player = new Player(playerRef.current, {
        id: videoId,
        width: '100%', // Full width player
        responsive: true,
      });

      // Optional: Attach event listeners to the player
      player.on('play', () => {
        console.log('Video is playing!');
      });

      // Clean up the player when the component unmounts
      return () => {
        player.destroy();
      };
    }
  }, [videoId]);

  const courseStructure = [
    {
      id: 1,
      title: 'Web Development Masterclass',
      totalLectures: 82,
      totalHours: 21.5,
      modules: [
        {
          id: 'intro',
          title: 'Course Introduction',
          lectures: [
            { id: 1, title: 'Welcome & Course Overview', duration: '05:23', status: 'completed' },
            { id: 2, title: 'How to Use This Course', duration: '03:45', status: 'completed' }
          ]
        },
        {
          id: 'html',
          title: 'HTML Fundamentals',
          lectures: [
            { id: 3, title: 'HTML Document Structure', duration: '12:34', status: 'completed' },
            { id: 4, title: 'Semantic HTML', duration: '15:22', status: 'current' },
            { id: 5, title: 'Forms and Input Types', duration: '18:45', status: 'locked' }
          ]
        },
        {
          id: 'css',
          title: 'Advanced CSS Techniques',
          lectures: [
            { id: 6, title: 'CSS Grid Layout', duration: '22:11', status: 'locked' },
            { id: 7, title: 'Flexbox Mastery', duration: '19:56', status: 'locked' }
          ]
        }
      ]
    }
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle color="#2ecc71" size={18} />;
      case 'current': return <PlayCircle color="#3498db" size={18} />;
      case 'locked': return <Lock color="#95a5a6" size={18} />;
      default: return null;
    }
  };

  return (
    <div className="techwave_fn_doc_page">
        <div className="docpage">
    <div className="moduleContainer">
      <div className="courseHeader">
            <div id="doc_introduction">
            <iframe width="1920" height="480" src="https://www.youtube.com/embed/Patk3_a1_WU?si=CFws8bAoctPeQacA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
        {/* <div className="courseStats">
          <span>82 Lectures</span>
          <span>•</span>
          <span>21.5 Total Hours</span>
        </div> */}
      </div>

      <div className="moduleAccordion">
            

        <div className="docsidebar moduleAccordion">
          <ul>
          {courseStructure[0].modules.map((module, moduleIndex) => (
          <div key={module.id} className="moduleSection">
            <div 
              className="moduleTitle"
              onClick={() => setActiveModule(activeModule === moduleIndex ? null : moduleIndex)}
            >
              <h3 style={{fontSize: 13}}><Target size={14} /> {module.title}</h3>
              <span>{module.lectures.length} lectures</span>
            </div>

            {activeModule === moduleIndex && (
              <div className="lectureList">
                {module.lectures.map(lecture => (
                  <div key={lecture.id} className="lectureItem">
                    <div className="lectureDetails">
                      {getStatusIcon(lecture.status)}
                      <span style={{fontSize: 13}} className="lectureTitle">{lecture.title}</span>
                    </div>
                    <span className="lectureDuration">{lecture.duration}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

          </ul>
        </div>
      </div>
      <style jsx>{`
        .moduleContainer {
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .courseHeader {
        padding: 20px;
        }

        .courseHeader h2 {
        margin: 0;
        font-size: 1.5rem;
        color: #1c1d1f;
        font-weight: 700;
        }

        .courseStats {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #6a6f73;
        margin-top: 10px;
        font-size: 0.9rem;
        }

        .moduleAccordion {
        padding: 10px 0;
        }

        .moduleSection {
        border-bottom: 1px solid #e7e7e7;
        }

        .moduleTitle {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        }

        .moduleTitle:hover {
        background-color: #f5f5f5;
        }

        .moduleTitle h3 {
        margin: 0;
        font-size: 1rem;
        color: #1c1d1f;
        font-weight: 600;
        }

        .moduleTitle span {
        color: #6a6f73;
        font-size: 0.85rem;
        }

        .lectureList {
        background-color: #f7f9fa;
        padding: 10px 0;
        }

        .lectureItem {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 20px;
        transition: background-color 0.2s ease;
        }

        .lectureItem:hover {
        background-color: #f0f0f0;
        }

        .lectureDetails {
        display: flex;
        align-items: center;
        gap: 10px;
        }

        .lectureTitle {
        font-size: 0.9rem;
        color: #1c1d1f;
        }

        .lectureDuration {
        color: #6a6f73;
        font-size: 0.8rem;
        }
      `}</style>
    </div>
    </div>
    </div>
  );
};

export default CourseModules;