// pages/courses/Course1.js
"use client"
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import axios from 'axios';
import styles from '../../public/CourseMod.module.css';
import Script from 'next/script';
import { Disc, Disc2, Focus, Layers, Lock, Send, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function Course2() {

  // Add these to your state
  const [queryEngineEnabled, setQueryEngineEnabled] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [subtitleContent, setSubtitleContent] = useState(null);
  const [currentLessonHasSubtitles, setCurrentLessonHasSubtitles] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Function to completely disable right-click
    const disableRightClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Function to disable keyboard shortcuts that might open context menu
    const disableKeyboardShortcuts = (e) => {
      // Disable F12 key
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      
      // Disable Ctrl+Shift+I (inspect element)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
      }
      
      // Disable Ctrl+Shift+C (inspect element)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
      }
      
      // Disable Ctrl+Shift+J (console)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
      }
      
      // Disable Ctrl+U (view source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }
    };

    // Disable mouse down for right click (mousedown event happens before contextmenu)
    const disableMouseDown = (e) => {
      if (e.button === 2) { // Right mouse button
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Disable selection to prevent copy
    const disableSelection = () => {
      return false;
    };

    // Apply all event listeners
    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('keydown', disableKeyboardShortcuts);
    document.addEventListener('mousedown', disableMouseDown);
    document.addEventListener('selectstart', disableSelection);

    // Disable drag start
    document.ondragstart = () => { return false; };

    // Create CSS to prevent selection
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    `;
    document.head.appendChild(style);

    // Clean up all event listeners when component unmounts
    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableKeyboardShortcuts);
      document.removeEventListener('mousedown', disableMouseDown);
      document.removeEventListener('selectstart', disableSelection);
      document.ondragstart = null;
      
      // Remove added style
      if (style && style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // Initialize Supabase client
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

    // Add these to your state declarations
  const [userEmail, setUserEmail] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  // Add this useEffect for authentication and course access verification
  useEffect(() => {
    const checkCourseAccess = async () => {
      // Get token from localStorage
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/');
        return;
      }

      try {
        // Decode the JWT token to get user email
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const decodedEmail = tokenData.email;
        setUserEmail(decodedEmail);
        
        // Query the Courses table to check if user has paid for this course
        const { data, error } = await supabase
          .from('courses')
          .select('courses')
          .eq('email', decodedEmail)
          .single();
        
        if (error) {
          router.push('/');
          return;
        }
        
        // Check if the user has paid for this specific course
        if (data && data.courses) {
          const courseAccess = data.courses.find(course => 
            course.ID === courseData.courseId && course.Paid === true
          );
          
          if (courseAccess) {
            setIsAuthorized(true);
          } else {
            router.push('/s24-courses');
          }
        } else {
          router.push('/s24-courses');
        }
      } catch (err) {
        router.push('/');
      }
    };

    checkCourseAccess();
  }, [router]);
  
  const courseData = {
    title: "Build Deep Learning Transformers From Scratch: Core of Chatgpt & Google Translate",
    description: "Learn to build Deep Learning Transformers From Scratch.",
    instructor: "Ravinthiran Partheepan",
    courseId: 'transformers_from_scratch_002',
    modules: [
      {
        title: "Introduction",
        lessons: [
          { 
            id: "vid1", 
            title: "Getting Started with Codebase", 
            duration: "8:25", 
            dyntubeId: "bf8FzfWIiUGJ8MnI4zRcCw", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/1.txt" 
          },
          { 
            id: "vid2", 
            title: "Introduction to Transformers", 
            duration: "8:25", 
            dyntubeId: "nBtpNDbi4Uy2EUtJOGBZQ", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/2.txt" 
          },
          { 
            id: "vid3", 
            title: "Transformer Explained - Analogy Point of View - Part 1", 
            duration: "8:25", 
            dyntubeId: "G4Lhnu2CkOshUfG9DQskQ", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/3.txt" 
          },
           { 
            id: "vid4", 
            title: "Transformer Explained - Analogy Point of View - Part 2", 
            duration: "8:25", 
            dyntubeId: "CEEIG3rTfUKTfWZij5ewkQ", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/4.txt" 
          },
            { 
            id: "vid5", 
            title: "Transformer Explained - Core Point of View", 
            duration: "8:25", 
            dyntubeId: "3Nz3upFIm0Sa21nhIL7AAw", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/5.txt" 
          },
            { 
            id: "vid6", 
            title: "Transformer - Repeated Layers Explanation", 
            duration: "8:25", 
            dyntubeId: "Roo7f2xPEiDITvVOIC4g", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/6.txt" 
          },
        { 
            id: "vid7", 
            title: "Self attention Mechanism Explained", 
            duration: "8:25", 
            dyntubeId: "GnHArbPyikOFL3g4XxaOtw", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/7.txt" 
          },
        ],
        artifacts: [
          { 
            id: "art1", 
            title: "Requirements and Artifacts", 
            type: "PDF", 
            content: "## Welcome to the course! I am Ravinthiran, and I will be your instructor, at your service throughout this learning process. I am really happy you are here! You are about to learn how to build Transformers from scratch – the technology behind tools like ChatGPT and Google Translate. Don’t worry, we will go through everything slowly and step by step. Just take your time, and remember, 45 minutes a day is enough. Stay focused for that short time, and you’ll see great progress. The key is consistency! If you study for just 45 minutes each day, you will get closer to your goal without feeling overwhelmed. So, stay hydrated, take it easy, and keep your focus. You can do it! Before we get started, you will need to set up your environment: Download and Install Anaconda IDE: Anaconda Download, Download and Install Python: Python Download, Read the Attention is All You Need Paper: Attention Paper. Reference: [1] Transformer architecture: Transformer Architecture Image. Let’s get started!"
          },
        ]
      },


      {
        title: "Math Behind Transformer Stacks and Sub-Layers",
        lessons: [
          { 
            id: "vid8", 
            title: "Tokenization and Word Embedding", 
            duration: "12:41", 
            dyntubeId: "IvJNKzw8kmf5214V1f2zw", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/8.txt" 
          },
            { 
            id: "vid9", 
            title: "Positional Encoding", 
            duration: "12:41", 
            dyntubeId: "TnVdSVLUPvRQR3zXkw", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/9.txt" 
          },
            { 
            id: "vid10", 
            title: "Multi Head Self Attention Mechanism", 
            duration: "12:41", 
            dyntubeId: "FmYsEKJ7PkiXDwbMGD56Q", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/10.txt" 
          },
            { 
            id: "vid11", 
            title: "Feed Forward Neural Network", 
            duration: "12:41", 
            dyntubeId: "wwyVrDGwhU2ETChU2eQpg", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/11.txt" 
          },
            { 
            id: "vid12", 
            title: "Layer Normalization", 
            duration: "12:41", 
            dyntubeId: "CBEJgXXCGkKRguuS0FRLQQ", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/12.txt" 
          },
           { 
            id: "vid13", 
            title: "Final Linear Projection to Vocabulary", 
            duration: "12:41", 
            dyntubeId: "Z8OMLHOeQEiyK0oI1Nohg", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/13.txt" 
          },
        ],
        artifacts: [
        ]
      },

      {
        title: "Transformer Stacks and Sub-Layers from Scratch",
        lessons: [
          { 
            id: "vid14", 
            title: "Project Environment Setup", 
            duration: "12:41", 
            dyntubeId: "jeZcYIIdNUWJNsUg4ZbIrw", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/14.txt" 
          },
          { 
            id: "vid15", 
            title: "Constructor and Hyperparameter Initialization", 
            duration: "12:41", 
            dyntubeId: "i0L1MhYGI0WWBYF0XJdDSg", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/15.txt" 
          },
          { 
            id: "vid16", 
            title: "Feed Forward Pass Layer", 
            duration: "12:41", 
            dyntubeId: "1CeGEzaoMk2Aj9UEiGkGbA", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/16.txt" 
          },
          { 
            id: "vid17", 
            title: "Positional Encoding", 
            duration: "12:41", 
            dyntubeId: "hCTCEPJ0zU6y7LpTN7FpA", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/17.txt" 
          },
          { 
            id: "vid18", 
            title: "Attention Layer Visualization", 
            duration: "12:41", 
            dyntubeId: "kHH2ppKxh0GidaoQn9G9gw", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/18.txt" 
          },
          { 
            id: "vid19", 
            title: "Text Generator Function", 
            duration: "12:41", 
            dyntubeId: "nrTECNWbb0aTEq74J4JOqA", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/19.txt" 
          },
          { 
            id: "vid20", 
            title: "Softmax Activation", 
            duration: "12:41", 
            dyntubeId: "uq4sF2JOhkyuFdtHfdQ2Jg", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/20.txt" 
          },
          { 
            id: "vid21", 
            title: "Dropout Layer", 
            duration: "12:41", 
            dyntubeId: "5u08TFU06b9OCiaWfdWg", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/21.txt" 
          },
          { 
            id: "vid22", 
            title: "Model Training Step", 
            duration: "12:41", 
            dyntubeId: "nym0aLtnmEawd2soEPyIwg", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/22.txt" 
          },
        ],
        artifacts: [
        ]
      },


      {
        title: "Encoder Stack and Sub-Layers from Scratch",
        lessons: [
            { 
                id: "vid23", 
                title: "2-Layer MLP or Feed Forward Neural Network", 
                duration: "12:41", 
                dyntubeId: "HTQDosiHEW11KgqlWHZpw", 
                search: true,
                subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/23.txt" 
            },
        ],
        artifacts: [
        ]
      },


      {
        title: "Decoder Stack and Sub-Layers from Scratch",
        lessons: [
            { 
                id: "vid24", 
                title: "Forward Passand Dropout Layer", 
                duration: "12:41", 
                dyntubeId: "21NG5ewnkqkfJxmD9pxTQ", 
                search: true,
                subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/24.txt" 
            },
        ],
        artifacts: [
        ]
      },


      {
        title: "Multihead Self Attention - Forward Pass and Softmax",
        lessons: [
            { 
                id: "vid25", 
                title: "Code: Multihead Self Attention - Forward Pass and Softmax", 
                duration: "12:41", 
                dyntubeId: "ZKdEUePGk0GUvxc0O3Tl8Q", 
                search: true,
                subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/25.txt" 
            },
        ],
        artifacts: [
        ]
      },


      {
        title: "Feed Forward Neural Network Layer",
        lessons: [
            { 
                id: "vid26", 
                title: "Code: 2-Layer MLP or Feed Forward Neural Network Layer", 
                duration: "12:41", 
                dyntubeId: "QdaUZFB2EECUWrXjzOQ", 
                search: true,
                subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/26.txt" 
            },
        ],
        artifacts: [
        ]
      },

      {
        title: "Layer Normalization and Residual Connections",
        lessons: [
            { 
                id: "vid27", 
                title: "Code: Layer Normalization and Residual Connections", 
                duration: "12:41", 
                dyntubeId: "X4z2Dx4Uh0OmycXnUueqBA", 
                search: true,
                subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/27.txt" 
            },
        ],
        artifacts: [
        ]
      },

      {
        title: "Stacking Transformer Layers and Running the Model",
        lessons: [
            { 
                id: "vid28", 
                title: "Code: Stacking Transformer Layers and Running the Model", 
                duration: "12:41", 
                dyntubeId: "9z77ZFfQQUCnB07hg8cWwA", 
                search: true,
                subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/28.txt" 
            },
            { 
                id: "vid29", 
                title: "Pre - Code Review", 
                duration: "12:41", 
                dyntubeId: "glPe8e6hUuIVG6tVOkRFw", 
                search: false,
                subtitleFile: "" 
            },
            { 
                id: "vid30", 
                title: "Token Prediction Analysis", 
                duration: "12:41", 
                dyntubeId: "fY7QNvbqWUWQcg0IyLXlzQ", 
                search: true,
                subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/transformer-scratch/30.txt" 
            },
        ],
        artifacts: [
            { 
                id: "art2", 
                title: "Vocabulary Layer", 
                type: "PDF", 
                content: "Copy and paste this Vocab for Model training: vocab = {\"<pad>\": 0, \"<eos>\": 1, \"I\": 2, \"like\": 3, \"to\": 4, \"learn\": 5, \"about\": 6, \"machine\": 7, \"learning\": 8, \"and\": 9, \"artificial\": 10, \"intelligence\": 11, \"because\": 12, \"they\": 13, \"are\": 14, \"fascinating\": 15, \"technologies\": 16, \"of\": 17, \"the\": 18, \"future\": 19, \"transformers\": 20, \"have\": 21, \"revolutionized\": 22, \"natural\": 23, \"language\": 24, \"processing\": 25, \"with\": 26, \"their\": 27, \"attention\": 28, \"mechanism\": 29, \"which\": 30, \"allows\": 31, \"models\": 32, \"understand\": 33, \"context\": 34, \"better\": 35 }"
            },
            { 
                id: "art3", 
                title: "Final Code review", 
                type: "PDF", 
                content: "## Code Repository Link: https://github.com/ravinthiranpartheepan1407/transformers-from-scratch-course"
            },
        ]
      },
    ]
  };

  // State for currently selected video
  const [currentVideo, setCurrentVideo] = useState({
    id: courseData.modules[0].lessons[0].id,
    title: courseData.modules[0].lessons[0].title,
    dyntubeId: courseData.modules[0].lessons[0].dyntubeId,
    subtitleFile: courseData.modules[0].lessons[0].subtitleFile,
    videoUrl: null,
    description: ""
  });
  
  // State for managing expanded modules
  const [expandedModules, setExpandedModules] = useState({0: true});
  
  // State for video loading
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for screenshot alert
  const [showScreenshotAlert, setShowScreenshotAlert] = useState(false);
  
  // State for video blur protection
  const [blurVideo, setBlurVideo] = useState(false);
  
  // Reference for video container
  const videoContainerRef = useRef(null);

  // Fetch video details from DynTube API
  const fetchVideoDetails = async (dyntubeId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`https://api.dyntube.com/v1/videos/${dyntubeId}`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      });
      
      const videoData = response.data;
      return {
        id: videoData.id,
        title: videoData.title,
        description: videoData.description,
        url: videoData.hlsUrlWeb || videoData.mp4Url, // Prefer HLS for web, fallback to MP4
        thumbnailUrl: videoData.thumbnailUrl
      };
    } catch (err) {
      console.error("Error fetching video:", err);
      setError("Failed to load video. Please try again later.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle module expansion
  const toggleModule = (moduleIndex) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleIndex]: !prev[moduleIndex]
    }));
  };
  
  // Change current video
  const changeVideo = async (lesson) => {
    setIsLoading(true);
    setChatMessages([]);
    setSubtitleContent(null);
    
    // Set preliminary info while loading
    setCurrentVideo({
      id: lesson.id,
      title: lesson.title,
      dyntubeId: lesson.dyntubeId,
      subtitleFile: lesson.subtitleFile,
      videoUrl: null,
      description: ""
    });
    
    try {
      // Fetch detailed video information from DynTube
      const videoDetails = await fetchVideoDetails(lesson.dyntubeId);
      
      if (videoDetails) {
        setCurrentVideo(prev => ({
          ...prev,
          title: videoDetails.title || prev.title,
          description: videoDetails.description || "",
          videoUrl: videoDetails.url
        }));
      }

      // Check if current lesson has subtitles
      if (lesson.subtitleFile) {
        setCurrentLessonHasSubtitles(true);
        await loadSubtitleFile(lesson.subtitleFile);
      } else {
        setCurrentLessonHasSubtitles(false);
      }
    } catch (err) {
      console.error("Error changing video:", err);
      setError("Failed to load video details.");
    }
  };

  // Load subtitle file
  const loadSubtitleFile = async (subtitleFilePath) => {
    try {
      const response = await axios.get(subtitleFilePath);
      setSubtitleContent(response.data);
      
      // Add system message indicating subtitle content loaded
      setChatMessages([{
        type: 'system',
        content: 'Module Processed! Feel free to ask questions about this module!',
        timestamp: new Date().toLocaleTimeString()
      }]);
      
      return response.data;
    } catch (error) {
      console.error("Error loading subtitle file:", error);
      setSubtitleContent(null);
      setChatMessages([{
        type: 'system',
        content: 'Failed to load subtitle content for this video.',
        timestamp: new Date().toLocaleTimeString()
      }]);
      return null;
    }
  };

  // Track video completion (in a real app, this would connect to an API)
  const [completedVideos, setCompletedVideos] = useState({});
  
  const markAsCompleted = (videoId) => {
    setCompletedVideos(prev => ({
      ...prev,
      [videoId]: true
    }));
  };
  
  // Function to apply blur to video and show alert
  const showScreenshotDetectedAlert = () => {
    // Apply blur to video
    setBlurVideo(true);
    
    // Show alert message
    setShowScreenshotAlert(true);
    
    // After a delay, remove the blur and hide the alert
    setTimeout(() => {
      setBlurVideo(false);
      setShowScreenshotAlert(false);
    }, 5000);
  };
  
  // Anti-screenshot and recording methods
  useEffect(() => {
    // 1. Detect browser screenshot attempts 
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Most browsers trigger visibility change when taking screenshots
        showScreenshotDetectedAlert();
      }
    };

    // 2. Block browser default screenshot shortcuts
    const blockScreenshotShortcuts = (e) => {
      // Block print screen key
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        showScreenshotDetectedAlert();
        return false;
      }
      
      // Block Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5 (Mac screenshot shortcuts)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) {
        e.preventDefault();
        showScreenshotDetectedAlert();
        return false;
      }
      
      // Block Windows Snipping Tool shortcut (Win+Shift+S)
      if (e.shiftKey && e.key === 'S' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        showScreenshotDetectedAlert();
        return false;
      }
    };

    // 3. Additional checks
    const preventContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // 4. Detect media recorder API usage
    const detectMediaRecording = () => {
      const originalGetUserMedia = navigator.mediaDevices?.getUserMedia;
      if (originalGetUserMedia) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
          // If screen capture is requested
          if (constraints && constraints.video && constraints.video.mediaSource === 'screen') {
            showScreenshotDetectedAlert();
            return Promise.reject(new Error('Screen recording is not allowed'));
          }
          return originalGetUserMedia.call(this, constraints);
        };
      }
      
      // Detect Screen Capture API
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
        navigator.mediaDevices.getDisplayMedia = function() {
          showScreenshotDetectedAlert();
          return Promise.reject(new Error('Screen capture is not allowed'));
        };
      }
    };

    // 5. Apply CSS to prevent screengrabs
    const applyAntiScreenshotCSS = () => {
      if (videoContainerRef.current) {
        // These styles make it harder to extract video content
        videoContainerRef.current.style.userSelect = 'none';
        videoContainerRef.current.style.webkitUserSelect = 'none';
      }
    };
    
    // 6. Additional protection against third-party tools
    // Monitor for potential Canvas extraction techniques
    const detectCanvasExtraction = () => {
      const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
      HTMLCanvasElement.prototype.toDataURL = function(type) {
        showScreenshotDetectedAlert();
        // Return empty data or distorted data
        return 'data:,';
      };
      
      const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
      CanvasRenderingContext2D.prototype.getImageData = function() {
        showScreenshotDetectedAlert();
        // Return empty or manipulated data
        return originalGetImageData.apply(this, arguments);
      };
    };

    // Apply all the protection methods
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', blockScreenshotShortcuts);
    document.addEventListener('contextmenu', preventContextMenu);
    detectMediaRecording();
    applyAntiScreenshotCSS();
    detectCanvasExtraction();
    
    // Periodically check if any screen recording is happening (can detect some third-party tools)
    const screenRecordingCheckInterval = setInterval(() => {
      if (document.pictureInPictureElement) {
        showScreenshotDetectedAlert();
      }
    }, 1000);

    // Clean up event listeners
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', blockScreenshotShortcuts);
      document.removeEventListener('contextmenu', preventContextMenu);
      clearInterval(screenRecordingCheckInterval);
    };
  }, []);
  
  // Load initial video on component mount
  useEffect(() => {
    const initialLesson = courseData.modules[0].lessons[0];
    changeVideo(initialLesson);
  }, []);

  // Function to handle chat submission
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !subtitleContent || isProcessing) return;
    
    // Add user message
    const userMessage = {
      type: 'user',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    try {
      // Send message to FastAPI backend with subtitle content
      const response = await axios.post('https://evalentumapi.com/insurance-research-assistant', {
        query: chatInput,
        context: subtitleContent,
        videoTitle: currentVideo.title
      });
      
      // Add bot response
      setChatMessages(prev => [...prev, {
        type: 'bot',
        content: response.data.answer,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (error) {
      console.error("Error getting response:", error);
      
      // Add error message
      setChatMessages(prev => [...prev, {
        type: 'error',
        content: "Sorry, I encountered an error processing your request.",
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsProcessing(false);
      setChatInput('');
    }
  };

  // Scroll to bottom of chat when new messages come in
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Find current lesson to check if search is enabled
  const getCurrentLesson = () => {
    for (const module of courseData.modules) {
      const lesson = module.lessons.find(lesson => lesson.id === currentVideo.id);
      if (lesson) return lesson;
    }
    return null;
  };

  // Add these to your existing state declarations
const [showArtifactPopup, setShowArtifactPopup] = useState(false);
const [selectedArtifact, setSelectedArtifact] = useState(null);

// Add this function to display a popup when an artifact is clicked
const handleArtifactClick = (artifact) => {
  setSelectedArtifact(artifact);
  setShowArtifactPopup(true);
};

// Add this function to close the popup
const closeArtifactPopup = () => {
  setShowArtifactPopup(false);
};
  

  return (
    <div className={styles.courseContainer}>
      <Head>
        <title>{courseData.title}</title>
        <meta name="description" content={courseData.description} />
        <style>{`
          /* Prevent selection and drag/drop operations */
          * {
            user-select: none !important;
            -webkit-user-select: none !important;
            -ms-user-select: none !important;
            -moz-user-select: none !important;
            pointer-events: auto;
          }
          
          /* Hide content when DevTools is open */
          @media screen and (min-height: 1px) {
            @media screen and (min-width: 1px) {
              body * {
                visibility: visible;
              }
            }
          }
        `}</style>
      </Head>
      
      <main className={styles.courseMain}>
        {/* Video Player Section */}
        <div className={styles.videoSection}>
          <div ref={videoContainerRef} style={{ position: 'relative' }}>
            <div 
              style={{
                height: 375,
                position: 'relative',
                overflow: 'hidden'
              }} 
              className={styles.videoPlayer}
            >
              <iframe 
                style={{
                  height: 375,
                  filter: blurVideo ? 'blur(20px)' : 'none',
                  transition: 'filter 0.3s ease'
                }}
                className={styles.videoPlayer}
                webkitallowfullscreen="true"
                mozallowfullscreen="true"
                allowFullScreen={true}            
                src={`https://videos.dyntube.com/iframes/${currentVideo.dyntubeId}`}
                title={currentVideo.title}
              />
              <Script src="https://embed.dyntube.com/v2/player/player.js" />
              
              {/* Blur overlay that appears when screenshot is detected */}
              {blurVideo && (
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 1001,
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: '20px'
                  }}
                >
                  <div>
                    <p style={{ marginBottom: '10px' }}>⚠️ CONTENT PROTECTED ⚠️</p>
                    <p>Screen recording detected.</p>
                    <p>Video content has been blurred for protection.</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Watermark overlay */}
            <div 
              style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'white',
                opacity: '0.7',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                zIndex: 1000,
                pointerEvents: 'none',
                userSelect: 'none'
              }}
            >
              Studypoints24
            </div>
          </div>
          
          {/* Screenshot alert */}
          {showScreenshotAlert && (
            <div 
              style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(220, 53, 69, 0.9)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '5px',
                zIndex: 9999,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              ⚠️ Screenshot and screen recording are not allowed! Content has been protected.
            </div>
          )}
          
          <div className={styles.videoInfo}>
            <h1>{currentVideo.title}</h1>
            <p className={styles.instructorName}>Instructor: {courseData.instructor}</p>
            <div className={styles.videoActions}>
              <button className={styles.actionButton}>
                <span className={styles.icon}><Lock size={16} style={{marginTop: -5}} /></span> Key Notes
              </button>
              
              {getCurrentLesson()?.search && (
                <div className={styles.actionButton}>
                  <span className={styles.toggleLabel}>Query Engine</span>
                  <label className={styles.toggleSwitch}>
                    <input 
                      type="checkbox" 
                      checked={queryEngineEnabled}
                      onChange={() => setQueryEngineEnabled(prev => !prev)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              )}
            </div>
          </div>
          <br />

          {/* Chat UI - only show when enabled and current lesson has search=true */}
          {queryEngineEnabled && getCurrentLesson()?.search && (
            <div className={styles.chatContainer}>
              <div className={styles.chatMessages}>
                {chatMessages.length === 0 ? (
                  <div className={styles.emptyChat}>
                    Ask questions about this lesson!
                  </div>
                ) : (
                  chatMessages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`${styles.chatMessage} ${msg.type === 'user' ? styles.userMessage : styles.botMessage}`}
                    >
                      <div className={styles.messageContent}>{msg.content}</div>
                      <div className={styles.messageTime}>{msg.timestamp}</div>
                    </div>
                  ))
                )}
              </div>
              <form className={styles.chatInputForm} onSubmit={handleChatSubmit}>
                <input
                  type="text"
                  className={styles.chatInputField}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question about this lesson..."
                />
                <button type="submit" className={styles.chatSubmitButton}>
                  <Send size={14} style={{marginTop: -3}} /> Ask Away
                </button>
              </form>
            </div>
          )}

          <div className={styles.videoDescription}>
            {/* <h2>About this lesson</h2> */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>

                <div style={{ flex: '1 1 300px', borderRadius: '8px', padding: '16px', border: '0.5px dotted lightBlue'}}>
                <h3 style={{ fontSize: 16, marginBottom: '8px', fontWeight: 600 }}> <Disc2 size={16} style={{marginTop: -3}} /> Why Take This Course?</h3>
                  <ul style={{ paddingLeft: '20px', margin: 0, fontSize: 14 }}>
                    <li>Hands-on project: build models without external libraries</li>
                    <li>Beginner-friendly: no Rust experience needed</li>
                    <li>Boost your skills in Rust and time-series analysis</li>
                    <li>Create and share your own open-source library</li>
                  </ul>
                </div>

                <div style={{ flex: '1 1 300px', borderRadius: '8px', padding: '16px', border: '0.5px dotted lightBlue' }}>
                  <h3 style={{ fontSize: 16, marginBottom: '8px', fontWeight: 600 }}><Disc2 size={16} style={{marginTop: -3}} /> Who This Course Is For</h3>
                  <ul style={{ paddingLeft: '20px', margin: 0, fontSize: 14 }}>
                    <li>Developers new to Rust</li>
                    <li>Engineers building high-performance data tools</li>
                    <li>Data scientists and analysts exploring Rust</li>
                    <li>Anyone interested in open-source contributions</li>
                  </ul>
                </div>

                {/* <div style={{ flex: '1 1 300px', borderRadius: '8px', padding: '16px', border: '0.5px dotted lightBlue'  }}>
                  <h3 style={{ fontSize: 16, marginBottom: '8px', fontWeight: 600 }}><Disc2 size={16} style={{marginTop: -3}} /> What You Will Learn</h3>
                  <ul style={{ paddingLeft: '20px', margin: 0, fontSize: 14 }}>
                    <li>Time-series data and its applications</li>
                    <li>Rust basics for data processing</li>
                    <li>Building Moving Averages, ARIMA, SARIMA models from scratch</li>
                    <li>Mathematical concepts behind time-series models</li>
                    <li>Performance optimization using Rust</li>
                    <li>Publishing an open-source Cargo library</li>
                  </ul>
                </div> */}


                <div style={{ flex: '1 1 300px', borderRadius: '8px', padding: '16px', border: '0.5px dotted lightBlue' }}>
                  <h3 style={{ fontSize: 16, marginBottom: '8px', fontWeight: 600 }}><Disc2 size={16} style={{marginTop: -3}} /> Prerequisites</h3>
                  <ul style={{ paddingLeft: '20px', margin: 0, fontSize: 14 }}>
                    <li>Basic knowledge of statistics recommended</li>
                    <li>No prior Rust knowledge required</li>
                  </ul>
                </div>
              </div>
          </div>

        </div>

        {showArtifactPopup && selectedArtifact && (
        <div className={styles.artifactPopupOverlay} onClick={closeArtifactPopup}>
          <div 
            className={styles.artifactPopupContent} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.artifactPopupHeader}>
              <div className={styles.artifactPopupTitle}>
                <span className={styles.artifactPopupIcon}>
                  {selectedArtifact.type === 'PDF' && '📄'}
                  {selectedArtifact.type === 'DOC' && '📝'}
                  {selectedArtifact.type === 'ZIP' && '📦'}
                  {selectedArtifact.type === 'LINK' && '🔗'}
                </span>
                <h2>{selectedArtifact.title}</h2>
              </div>
              <button 
                className={styles.artifactPopupClose}
                onClick={closeArtifactPopup}
              >
                ✕
              </button>
            </div>
            <div className={styles.artifactPopupBody}>
              {/* Render content based on type */}
              {selectedArtifact.type === 'PDF' || selectedArtifact.type === 'DOC' ? (
                <div className={styles.markdownContent}>
                  {/* This is a simple markdown renderer - you can use a proper markdown library */}
                  {selectedArtifact.content.split('\n').map((line, index) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={index}>{line.substring(2)}</h1>;
                    } else if (line.startsWith('## ')) {
                      return <h2 key={index}>{line.substring(3)}</h2>;
                    } else if (line.startsWith('- ')) {
                      return <li key={index}>{line.substring(2)}</li>;
                    } else if (line.startsWith('1. ')) {
                      return <ol key={index}><li>{line.substring(3)}</li></ol>;
                    } else if (line.includes('`') && !line.startsWith('```')) {
                      // Handle inline code
                      const parts = line.split('`');
                      return (
                        <p key={index}>
                          {parts.map((part, i) => 
                            i % 2 === 0 ? part : <code key={i}>{part}</code>
                          )}
                        </p>
                      );
                    } else if (line === '') {
                      return <br key={index} />;
                    } else {
                      return <p key={index}>{line}</p>;
                    }
                  })}
                </div>
              ) : (
                <div className={styles.artifactContent}>
                  {selectedArtifact.content || "No preview available. Click download to access this file."}
                </div>
              )}
            </div>
            <div className={styles.artifactPopupFooter}>
              <button className={styles.artifactDownloadBtn}>
                Download {selectedArtifact.type}
              </button>
            </div>
          </div>
        </div>
      )}

        
        {/* Course Sidebar */}
        <div className={styles.courseSidebar}>
          <div className={styles.modulesList}>
            {courseData.modules.map((module, moduleIndex) => (
              <div key={moduleIndex} className={styles.moduleItem}>
                <div 
                  className={styles.moduleHeader}
                  onClick={() => toggleModule(moduleIndex)}
                >
                  <h3 style={{fontWeight:600, fontSize: 15}}><Layers size={14} style={{marginTop: -2}} /> {module.title}</h3>
                  <span className={styles.expandIcon}>
                    {expandedModules[moduleIndex] ? '▼' : '►'}
                  </span>
                </div>
                
                {expandedModules[moduleIndex] && (
                  <div className={styles.moduleContent}>
                    
                    {module.artifacts.length > 0 && (
                    <div className={styles.artifactsList}>
                      <h4>Resources & Materials</h4>
                      {module.artifacts.map((artifact) => (
                        <div key={artifact.id} className={styles.artifactItem}>
                          <div className={styles.artifactIcon}>
                            {artifact.type === 'PDF' && '📄'}
                            {artifact.type === 'DOC' && '📝'}
                            {artifact.type === 'ZIP' && '📦'}
                            {artifact.type === 'LINK' && '🔗'}
                          </div>
                          {/* Update the title to be clickable */}
                          <p 
                            className={styles.artifactTitle} 
                            onClick={() => handleArtifactClick(artifact)}
                            style={{ cursor: 'pointer' }}
                          >
                            {artifact.title}
                          </p>
                          <div className={styles.artifactDownload}>
                            {/* Update the download button to trigger the popup */}
                            <button 
                              className={styles.downloadButton}
                              onClick={() => handleArtifactClick(artifact)}
                            >
                              ⬇️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                    <div className={styles.lessonsList}>
                      {module.lessons.map((lesson) => (
                        <div 
                          key={lesson.id} 
                          className={`${styles.lessonItem} ${currentVideo.id === lesson.id ? styles.activeLesson : ''} ${completedVideos[lesson.id] ? styles.completedLesson : ''}`}
                          onClick={() => changeVideo(lesson)}
                        >
                          <div className={styles.lessonIcon}>
                            {completedVideos[lesson.id] 
                              ? <span className={styles.checkmark}>✓</span> 
                              : currentVideo.id === lesson.id 
                                ? <span className={styles.playingIcon}>▶</span>
                                : <span className={styles.videoIcon}>🎬</span>
                            }
                          </div>
                          <div className={styles.lessonInfo}>
                            <p className={styles.lessonTitle}>{lesson.title}</p>
                            <span className={styles.lessonDuration}>{lesson.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                  {showArtifactPopup && selectedArtifact && (
                    <div className={styles.artifactPopupOverlay} onClick={closeArtifactPopup}>
                      <div 
                        className={styles.artifactPopupContent} 
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className={styles.artifactPopupHeader}>
                          <div className={styles.artifactPopupTitle}>
                            <span className={styles.artifactPopupIcon}>
                              {selectedArtifact.type === 'PDF' && '📄'}
                              {selectedArtifact.type === 'DOC' && '📝'}
                              {selectedArtifact.type === 'ZIP' && '📦'}
                              {selectedArtifact.type === 'LINK' && '🔗'}
                            </span>
                            <h2>{selectedArtifact.title}</h2>
                          </div>
                          <button 
                            className={styles.artifactPopupClose}
                            onClick={closeArtifactPopup}
                          >
                            ✕
                          </button>
                        </div>
                        <div className={styles.artifactPopupBody}>
                          {/* Render content based on type */}
                          {selectedArtifact.content ? (
                            <div className={styles.markdownContent}>
                              {/* Simple markdown renderer */}
                              {selectedArtifact.content.split('\n').map((line, index) => {
                                if (line.startsWith('# ')) {
                                  return <h1 key={index}>{line.substring(2)}</h1>;
                                } else if (line.startsWith('## ')) {
                                  return <h2 key={index}>{line.substring(3)}</h2>;
                                } else if (line.startsWith('- ')) {
                                  return <li key={index}>{line.substring(2)}</li>;
                                } else if (line.startsWith('1. ')) {
                                  return <ol key={index}><li>{line.substring(3)}</li></ol>;
                                } else if (line.includes('`') && !line.startsWith('```')) {
                                  // Handle inline code
                                  const parts = line.split('`');
                                  return (
                                    <p key={index}>
                                      {parts.map((part, i) => 
                                        i % 2 === 0 ? part : <code key={i}>{part}</code>
                                      )}
                                    </p>
                                  );
                                } else if (line === '') {
                                  return <br key={index} />;
                                } else {
                                  return <p key={index}>{line}</p>;
                                }
                              })}
                            </div>
                          ) : (
                            <div className={styles.noContent}>
                              <p>No preview available for this resource.</p>
                            </div>
                          )}
                        </div>
                        <div className={styles.artifactPopupFooter}>
                          <button onClick={closeArtifactPopup} className={styles.artifactDownloadBtn}>
                            <X size={16} style={{marginTop: -3}} /> Close
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}