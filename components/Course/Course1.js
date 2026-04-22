// pages/courses/Course1.js
"use client"
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import axios from 'axios';
import styles from '../../public/CourseMod.module.css';
import Script from 'next/script';
import { Disc, Disc2, Download, Eye, Focus, Layers, Layers2, Lock, NotebookTabs, Paperclip, Send, SendHorizonal, User2, Video, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export default function Course1() {

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
    title: "Build an Open-Source Time Series Lib from Scratch in Rust",
    description: "Learn to build an open-source time-series library in Rust from scratch.",
    instructor: "Ravinthiran Partheepan",
    courseId: 'rust_time_series_001',
    modules: [
      {
        title: "Introduction",
        lessons: [
          { 
            id: "vid1", 
            title: "Getting Started with Codebase", 
            duration: "8:25", 
            dyntubeId: "a4wp0iM3p0eXsh88FBhMFA", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/1.txt" 
          },
        ],
        artifacts: [
          { 
            id: "art1", 
            title: "Welcome Message!", 
            type: "PDF", 
            content: "## Welcome to the course! I am Ravinthiran, and I will be your instructor, at your service throughout this learning process. I am excited to have you here. In this course, you will understand the mathematical foundation behind each time-series model and learn how to build an open-source time-series library using Rust. We will explore how to build time-series models from scratch, without relying on external library dependencies, and how you can use them for forecasting purposes. Whether you are new to Rust or just want to learn more, this course is designed to guide you step by step. Let’s get started!"
          },
          { 
            id: "art2", 
            title: "Open Source Requirements", 
            type: "PDF", 
            content: "## Open Source Development Requirements (Must Read)\n\nYou can find the links to the required tools and libraries we need for this experimentation below:\n\n- [Hyper terminal](https://hyper.is/)\n- [Rust](https://www.rust-lang.org/tools/install)\n- [Cargo Setup](https://doc.rust-lang.org/cargo/getting-started/installation.html)\n- [Git Setup](https://git-scm.com/downloads)\n\n\n## Cargo Setup Instructions (Reference) | Install Rust and Cargo\n\nThe easiest way to get Cargo is to install the current stable release of Rust by using rustup. Installing Rust using rustup will also install cargo.\n\nOn Linux and macOS systems, run the following command:\n\n```bash\ncurl https://sh.rustup.rs -sSf | sh\n```\n\nIt will download a script and start the installation. If everything goes well, you’ll see:\n\n> Rust is installed now. Great!\n\nOn Windows, download and run [rustup-init.exe](https://www.rust-lang.org/tools/install). It will start the installation in a console and present the success message.\n\nAfter installation, you can use the `rustup` command to also install beta or nightly channels for Rust and Cargo.\n\nFor other installation options, visit the [Rust install page](https://www.rust-lang.org/tools/install).\n\n\n## Environmental Variable Setup (Reference)\n\nConfiguring the PATH environment variable\n\nIn the Rust development environment, all tools are installed to the `~/.cargo/bin` directory, including `rustc`, `cargo`, and `rustup`.\n\nIt is customary for Rust developers to include this directory in their `PATH` environment variable.\n\nDuring installation, rustup will attempt to configure `PATH`. Due to platform differences and shell types, sometimes PATH changes don't take effect immediately. Restart the console or log out and back in if necessary.\n\nIf, after installation, running `rustc --version` in the console fails, it likely means PATH was not set correctly."},
        ]
      },
      {
        title: "Module: Autocorrelation",
        lessons: [
          { 
            id: "vid2", 
            title: "Autocorrelation: Math and Code", 
            duration: "12:41", 
            dyntubeId: "pNRlrhl1EGoKZ7QkKGbrA", 
            search: true,
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/2.txt" 
          },
        ],
        artifacts: [
        ]
      },
      {
        title: "Module: Stationarity",
        lessons: [
          { 
            id: "vid3", 
            title: "Stationarity: Math and Code", 
            duration: "15:30", 
            dyntubeId: "qUVyzWS30up1D8RWQ4GIw",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/3.txt",
            search: true,
          }
        ],
        artifacts: [
        ]
      },
      {
        title: "Module: Linear regression - Trend Detection",
        lessons: [
          { 
            id: "vid4", 
            title: "Math behind Linear Regression for Identifying Trend Patterns", 
            duration: "15:30", 
            dyntubeId: "ekShe44OfEe9sd0UDSgKA",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/4.txt",
            search: true,
          },
          { 
            id: "vid5", 
            title: "Conversion of Linear Regression Math to Code", 
            duration: "15:30", 
            dyntubeId: "i9gyD8zYOkW0BFp6qemAuw",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/5.txt",
            search: true,
          }
        ],
        artifacts: [
        ]
      },
      {
        title: "Module: Seasonality - Differencing Method",
        lessons: [
          { 
            id: "vid6", 
            title: "Seasonality Detection using Differencing Technique", 
            duration: "15:30", 
            dyntubeId: "bpCt4yiIdEGnu0oumLYE5g",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/6.txt",
            search: true,
          }
        ],
        artifacts: [
        ]
      },
      {
        title: "Module: White Noise",
        lessons: [
          { 
            id: "vid7", 
            title: "Mathematical Intuition and Code Implementation", 
            duration: "15:30", 
            dyntubeId: "N3ytoryeYUq0h7Natay3Ng",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/7.txt",
            search: true,
          }
        ],
        artifacts: [
        ]
      },
      {
        title: "Module: Autoregressive Model",
        lessons: [
          { 
            id: "vid8", 
            title: "Math behind Autoregressive Model", 
            duration: "15:30", 
            dyntubeId: "3n83YbAsUkXxtUX6wGfZw",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/8.txt",
            search: true,
          },
          { 
            id: "vid9", 
            title: "Building Autoregressive Model from Scratch", 
            duration: "15:30", 
            dyntubeId: "QlWNZPThq0GMV2dMlacXUQ",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/9.txt",
            search: true,
          }
        ],
        artifacts: [
        ]
      },
      {
        title: "Module: Moving Average",
        lessons: [
          { 
            id: "vid10", 
            title: "Math behind Moving Average", 
            duration: "15:30", 
            dyntubeId: "Tfvz30GVUa2bzTAXfyrg",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/10.txt",
            search: true,
          },
          { 
            id: "vid11", 
            title: "Code: Moving Average Module", 
            duration: "15:30", 
            dyntubeId: "LJ863aD90WGEp5OEVCDhA",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/11.txt",
            search: true,
          },
          { 
            id: "vid12", 
            title: "Math behind Weighted Moving Average", 
            duration: "15:30", 
            dyntubeId: "8BjMP2vP6UqNmrILzJgLZw",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/12.txt",
            search: true,
          },
          { 
            id: "vid13", 
            title: "Code: Weighted Moving Average", 
            duration: "15:30", 
            dyntubeId: "XInl9rplA0GFmixiqcyzVg",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/13.txt",
            search: true,
          }
        ],
        artifacts: [
        ]
      },
      {
        title: "ARMA Model - Autoregressive Moving Average",
        lessons: [
          { 
            id: "vid14", 
            title: "Math behind ARMA Model", 
            duration: "15:30", 
            dyntubeId: "2CPyUWh8k6GJwrr78Iog",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/14.txt",
            search: true,
          },
          { 
            id: "vid15", 
            title: "Build ARMA Model from Scratch", 
            duration: "15:30", 
            dyntubeId: "BzSQUFxWEORI9dTRc3h9w",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/15.txt",
            search: true,
          }
        ],
        artifacts: [
        ]
      },
      {
        title: "ARIMA Model - Autoregressive Integrated Moving Average",
        lessons: [
          { 
            id: "vid16", 
            title: "Math behind Autoregressive Integrated Moving Average Model", 
            duration: "15:30", 
            dyntubeId: "mz1XeeKFE6ts1ExYnqaAQ",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/16.txt",
            search: true,
          },
          { 
            id: "vid17", 
            title: "Build ARIMA Model from Scratch", 
            duration: "15:30", 
            dyntubeId: "530zlrBRJESDvnS0hEj9Q",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/17.txt",
            search: true,
          }
        ],
        artifacts: [
        ]
      },
      {
        title: "SARIMA Model - Seasonal AutoregressiveIntegrated Moving Average",
        lessons: [
          { 
            id: "vid18", 
            title: "Math behind SARIMA Model", 
            duration: "15:30", 
            dyntubeId: "VmmA6Rn6vk6ZFVM8L3cPXA",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/18.txt",
            search: true,
          },
          { 
            id: "vid19", 
            title: "Build SARIMA Model from Scratch", 
            duration: "15:30", 
            dyntubeId: "FwnqcQBksUmcbaqOSKF7ug",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/19.txt",
            search: true,
          }
        ],
        artifacts: [
        ]
      },
      {
        title: "Module: Exponential Smoothing",
        lessons: [
          { 
            id: "vid20", 
            title: "Math behind Exponential Smoothing", 
            duration: "15:30", 
            dyntubeId: "qbkAkx3dqkuGnlLo5saijA",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/20.txt",
            search: true,
          },
          { 
            id: "vid21", 
            title: "Build Single Exponential Smoothing from Scratch", 
            duration: "15:30", 
            dyntubeId: "Ps9bkILEaImc6AKljOw",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/21.txt",
            search: true,
          },
          { 
            id: "vid22", 
            title: "Math behind Holt's Linear Trend Model", 
            duration: "15:30", 
            dyntubeId: "6BtSpRLe0yl36iEEti3Jw",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/22.txt",
            search: true,
          },
          { 
            id: "vid23", 
            title: "Build Holt's Linear Trend Model from Scratch", 
            duration: "15:30", 
            dyntubeId: "yfzzpzuENU6wm4orf5ZSxQ",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/23.txt",
            search: true,
          }
        ],
        artifacts: [
        ]
      },
      {
        title: "Publish as a Library to Crate Registry",
        lessons: [
          { 
            id: "vid24", 
            title: "Publish to Github Repo and Export the Cargo Project", 
            duration: "15:30", 
            dyntubeId: "8VbYLnyb8kSy75eT4HPIA",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/24.txt",
            search: true,
          },
          { 
            id: "vid25", 
            title: "Cargo Package testing", 
            duration: "15:30", 
            dyntubeId: "5ZX1zdGfOEaDpB8hJUN7Yw",
            subtitleFile: "https://fiqghoqztrzyahzlvmhb.supabase.co/storage/v1/object/public/course/Time-Rust/25.txt",
            search: true,
          }
        ],
        artifacts: [
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


  const handleLessonSelect = async (lesson) => {
    setCurrentVideo(lesson);
    if (lesson.subtitleFile) {
      const res = await axios.get(lesson.subtitleFile);
      setSubtitleContent(res.data);   // plain text from the .txt file
    } else {
      setSubtitleContent('');
    }
  };

  // Function to handle chat submission
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !subtitleContent || isProcessing) return;

    const userMessage = {
      type: 'user',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const response = await axios.post('https://evalentumapi.com/chat-with-subtitle', {
        query: chatInput,
        context: subtitleContent,        // subtitle text already loaded
        videoTitle: currentVideo.title
      });

      setChatMessages(prev => [...prev, {
        type: 'bot',
        content: response.data.answer,   // matches ChatResponse field
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (error) {
      console.error("Error getting response:", error);
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
              Exam Paper Academy
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
            <h1 style={{fontSize: 20, fontWeight: 600}}><Layers2 color='#15173D' size={20} style={{marginTop: -5}} />&nbsp; {currentVideo.title}</h1>
            <p className={styles.instructorName}><User2 color='#15173D' size={15} style={{marginTop: -5}} />&nbsp; Instructor: {courseData.instructor}</p>
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
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
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
                  <SendHorizonal size={16} style={{marginTop: -3}} />
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
                            {artifact.type === 'PDF' && <Paperclip color='#15173D' size={15} style={{marginTop: -25}} />}
                            {artifact.type === 'DOC' && <NotebookTabs color='#15173D' size={15} style={{marginTop: -25}} />}
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
                              <Eye size={16} color='#15173D' />
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
                                : <span className={styles.videoIcon}><Video color='#15173D' size={20} /></span>
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
                              {selectedArtifact.type === 'PDF' && <Paperclip color='#15173D' size={17} style={{marginTop: -5}} />}
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