
"use client";
import React, { useState, useEffect } from 'react';
import styles from '../public/InsuranceMarket.module.css';
import { Airplay, ArrowRight, Book, Disc, Disc2, Dot, Eye, Filter, Focus, Languages, Layers, Notebook, NotebookText, Plus, Rocket, Search, Send, ShoppingCart, Star, StepForward, User, X, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-toastify';
import axios from 'axios';

const CourseMarket = () => {
  // Sample insurance products data
  const initialProducts = [
    { 
      id: 1, 
      name: 'Learn Time Series Analysis using Rust', 
      image: 'https://fdryfwxmkllviwqmynme.supabase.co/storage/v1/object/public/exampaper/1_2.png', 
      tags: ["Time Series", "ML", "Rust"], 
      price: 'Company Calculator', 
      link: '/micro-courses/time-series-analysis-using-rust',
      courseId: 'rust_time_series_001'  // Added course ID
    },
    { 
      id: 2, 
      name: 'Transformer Architecture from Scratch', 
      image: 'https://fdryfwxmkllviwqmynme.supabase.co/storage/v1/object/public/exampaper/2_2.png', 
      tags: ["Deep Learning", "Python"], 
      price: 'Company Calculator', 
      link: '/micro-courses/transformers-from-scratch-core-of-gpt-google-translate',
      courseId: 'transformers_from_scratch_002'  // Added course ID
    },
    { 
      id: 3, 
      name: 'Vision Informed Transformer-Bilberrydb', 
      image: 'https://fdryfwxmkllviwqmynme.supabase.co/storage/v1/object/public/exampaper/3_2.png', 
      tags: ["Deep Learning", "Python", "JS"], 
      price: 'Company Calculator', 
      link: '/micro-courses/transformers-from-scratch-core-of-gpt-google-translate',
      courseId: 'transformers_from_scratch_002'  // Added course ID
    }
  ];

  const router = useRouter();

  const [userEmail, setUserEmail] = useState('');
  const [paidCourses, setPaidCourses] = useState([]);
  
  // Initialize Supabase client
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Update the useEffect to fetch user's paid courses from Supabase
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // router.push('/');
      return;
    }

    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const decodedEmail = tokenData.email;
      setUserEmail(decodedEmail);
      
      // Fetch user's course data from Supabase
      const fetchUserCourses = async () => {
        try {
          const { data, error } = await supabase
            .from('courses')
            .select('courses')
            .eq('email', decodedEmail)
            .single();
            
          if (error) {
            if (error.code !== 'PGRST116') { // PGRST116 is "not found" error
              console.error('Error fetching user courses:', error);
            }
            // If no data or error, set empty array for paid courses
            setPaidCourses([]);
          } else if (data && data.courses) {
            // Extract IDs of paid courses
            const paidCourseIds = data.courses
              .filter(course => course.Paid === true)
              .map(course => course.ID);
            setPaidCourses(paidCourseIds);
          }
        } catch (err) {
          console.error('Error in fetching courses:', err);
          setPaidCourses([]);
        }
      };
      
      fetchUserCourses();
    } catch (err) {
      console.error('Error decoding token:', err);
      // router.push('/');
    }
  }, []);

  // Create a function to check if a course is paid for
  const isCoursePaid = (courseId) => {
    return paidCourses.includes(courseId);
  };

  const courseData = [{
    title: "Build an Open-Source Time Series Lib from Scratch in Rust",
    description: "Learn to build an open-source time-series library in Rust from scratch.",
    instructor: "Ravinthiran Partheepan",
    modules: [
      {
        title: "Introduction",
        lessons: [
          { 
            id: "vid1", 
            title: "Getting Started with Codebase", 
            duration: "8:25", 
            dyntubeId: "jRM7NIwjEWLeVwZwrSnGQ", 
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
  }, {
    title: "Deep Learning: Build Transformers From Scratch",
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
  }];
  
    // State for products, search input, and active tag
    const [products, setProducts] = useState(initialProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTag, setActiveTag] = useState('');
    const [allTags, setAllTags] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProductLink, setSelectedProductLink] = useState('');
    const [isAcknowledged, setIsAcknowledged] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
    // Function to update subscription status in Supabase
    const updateSubscriptionStatus = async (email, courseId) => {
      try {
        // Check if user already has a record in the courses table
        const { data: existingData, error: fetchError } = await supabase
          .from('courses')
          .select('*')
          .eq('email', email)
          .single();
        
        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching user courses:', fetchError);
          throw new Error('Failed to fetch user data');
        }
        
        if (existingData) {
          // User exists, update their courses array
          const updatedCourses = existingData.courses || [];
          
          // Check if course already exists in array
          const courseIndex = updatedCourses.findIndex(course => course.ID === courseId);
          
          if (courseIndex >= 0) {
            // Update existing course to paid
            updatedCourses[courseIndex].Paid = true;
          } else {
            // Add new course
            updatedCourses.push({ ID: courseId, Paid: true });
          }
          
          // Update the record
          const { error: updateError } = await supabase
            .from('courses')
            .update({ courses: updatedCourses })
            .eq('email', email);
            
          if (updateError) {
            console.error('Error updating courses:', updateError);
            throw new Error('Failed to update course access');
          }
        } else {
          // User does not exist, create new record
          const { error: insertError } = await supabase
            .from('courses')
            .insert([{ 
              email: email, 
              courses: [{ ID: courseId, Paid: true }]
            }]);
            
          if (insertError) {
            console.error('Error inserting courses:', insertError);
            throw new Error('Failed to create course access');
          }
        }
        
        return true;
      } catch (error) {
        console.error('Error in updateSubscriptionStatus:', error);
        throw error;
      }
    };


    // Razorpay payment handling with dynamic currency pricing
    // Helper functions for location-based currency
    const CURRENCY_MAPPING = {
      'EU': 'EUR', // Europe: Euro
      'IN': 'INR', // India: Rupee
      'US': 'USD', // United States: Dollar
      'GB': 'GBP', // United Kingdom: Pound
      'DEFAULT': 'INR' // Default fallback
    };

    // Map of countries to their currency regions
    const COUNTRY_TO_REGION = {
      // Europe (Euro)
      'DE': 'EU', 'FR': 'EU', 'IT': 'EU', 'ES': 'EU', 'NL': 'EU',
      'BE': 'EU', 'AT': 'EU', 'GR': 'EU', 'PT': 'EU', 'IE': 'EU',
      'FI': 'EU', 'SK': 'EU', 'LT': 'EU', 'SI': 'EU', 'LV': 'EU',
      'EE': 'EU', 'CY': 'EU', 'MT': 'EU', 'LU': 'EU',
      
      // India
      'IN': 'IN',
      
      // United States
      'US': 'US',
      
      // United Kingdom
      'GB': 'GB',
      
      // Add more country mappings as needed
    };

    // Define base price and conversion rates for each currency
    // These prices represent the amount in the smallest currency unit (e.g., cents, paise)
    const PRICING = {
      'USD': {
        basePrice: 1999, // $49.99 USD
        symbol: '$'
      },
      'EUR': {
        basePrice: 1499, // €44.99 EUR
        symbol: '€'
      },
      'INR': {
        basePrice: 39990, // ₹3,999 INR
        symbol: '₹'
      },
      'GBP': {
        basePrice: 1599, // £39.99 GBP
        symbol: '£'
      }
    };

    // Modified handlePayment function with location detection and dynamic pricing
    const handlePayment = async () => {
      setIsProcessingPayment(true);
      
      // Get user's location and determine currency
      let currencyCode = CURRENCY_MAPPING.DEFAULT; // Default to INR
      
      try {
        // Get user's country code using IP geolocation
        const locationResponse = await fetch('https://ipapi.co/json/');
        const locationData = await locationResponse.json();
        const countryCode = locationData.country_code;
        
        // Determine currency based on country code
        if (countryCode) {
          const region = COUNTRY_TO_REGION[countryCode] || 'DEFAULT';
          currencyCode = CURRENCY_MAPPING[region] || CURRENCY_MAPPING.DEFAULT;
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
        // Continue with default currency
      }
      
      // Get the appropriate price for the detected currency
      const price = PRICING[currencyCode] ? PRICING[currencyCode].basePrice : PRICING['INR'].basePrice;
      const currencySymbol = PRICING[currencyCode] ? PRICING[currencyCode].symbol : PRICING['INR'].symbol;
      
      // Format price for display (e.g., convert 4999 to "$49.99")
      const formattedPrice = formatPriceForDisplay(price, currencyCode);
      
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        // Find the course ID from the selected product
        const selectedProduct = initialProducts.find(product => product.link === selectedProductLink);
        const courseId = selectedProduct ? selectedProduct.courseId : 'default_course_id';

        const options = {
          key: process.env.RAZOR_TEST,
          amount: price.toString(), // Dynamic price based on currency
          currency: currencyCode, // Use location-based currency
          name: "Arkhamm AI Private Limited",
          description: `${courseData.title} Course Access (${currencySymbol}${formattedPrice})`,
          handler: async function(response) {
            if (response.razorpay_payment_id) {
              try {
                // Update subscription status with the course ID
                await updateSubscriptionStatus(userEmail, courseId);
                
                toast.success(`Payment of ${currencySymbol}${formattedPrice} successful!`);
                // Navigate to the course after successful payment
                setTimeout(() => {
                  router.push(selectedProductLink);
                }, 2000);
              } catch (error) {
                console.error('Payment processing error:', error);
                toast.error('An error occurred. Please contact support.');
              } finally {
                setIsProcessingPayment(false);
                setShowModal(false);
              }
            }
          },
          prefill: {
            name: "Customer Name",
            email: userEmail || "customer@example.com",
            contact: ""
          },
          theme: {
            color: "#0097b2"
          },
          modal: {
            ondismiss: function() {
              setIsProcessingPayment(false);
            }
          }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      };
      
      script.onerror = () => {
        toast.error('Failed to load payment gateway. Please try again.');
        setIsProcessingPayment(false);
      };
    };

    // Helper function to format price for display
    const formatPriceForDisplay = (price, currencyCode) => {
      switch(currencyCode) {
        case 'USD':
        case 'EUR':
        case 'GBP':
          // Convert cents to dollars/euros/pounds with 2 decimal places
          return (price / 100).toFixed(2);
        case 'INR':
          // Convert paise to rupees with no decimal places
          return (price / 100).toLocaleString('en-IN');
        default:
          return (price / 100).toString();
      }
    };

    // Function to display the price on the UI (can be used before payment)
    const displayPriceInUI = () => {
      let currencyCode = CURRENCY_MAPPING.DEFAULT;
      
      // You can detect currency here or use a state variable if already detected
      // For simplicity, I'm showing how to use the PRICING object
      
      const priceData = PRICING[currencyCode];
      const formattedPrice = formatPriceForDisplay(priceData.basePrice, currencyCode);
      
      return `${priceData.symbol}${formattedPrice}`;
    };


      // Extract all unique tags from products
      useEffect(() => {
        const tagsSet = new Set();
        initialProducts.forEach(product => {
          product.tags.forEach(tag => tagsSet.add(tag));
        });
        setAllTags(Array.from(tagsSet).sort());
      }, []);

    // Add a function to find the correct course based on the selected product link
    const findCourseByLink = (link) => {
      try {
        // Handle empty or undefined link
        if (!link) {
          return courseData[0]; // Default to first course
        }
        
        // Extract the course ID from the selected link
        const selectedProduct = initialProducts.find(product => product.link === link);
        if (!selectedProduct) {
          return courseData[0]; // Default to first course if not found
        }
        
        const courseId = selectedProduct.courseId;
        if (!courseId) {
          return courseData[0]; // Default to first course if courseId is missing
        }
        
        // Find the matching course in courseData
        const matchingCourse = courseData.find(course => course.courseId === courseId);
        if (!matchingCourse) {
          return courseData[0]; // Return first course as fallback
        }
        
        return matchingCourse;
      } catch (error) {
        return courseData[0]; // Return first course on any error
      }
    };

    // Handle product start button click
    const handleStartExam = (link, courseId) => {
      // If the course is already paid for, navigate directly to the course
      if (isCoursePaid(courseId)) {
        router.push(link);
      } else {
        // Otherwise show the payment modal with the correct course
        setSelectedProductLink(link);
        // Set the selected course directly based on the link
        setShowModal(true);
      }
    };

    // Function to confirm and navigate to exam
    const confirmAndNavigate = () => {
      if (isAcknowledged) {
        handlePayment();
      }
    };

  
    // Add this after you set the paidCourses state
const [showPaidOnly, setShowPaidOnly] = useState(false);

// Update the useEffect that extracts tags to include the Paid tag if applicable
useEffect(() => {
  const tagsSet = new Set();
  initialProducts.forEach(product => {
    product.tags.forEach(tag => tagsSet.add(tag));
  });
  
  // Add "Paid" to the available tags if user has any paid courses
  if (paidCourses && paidCourses.length > 0) {
    tagsSet.add("Paid");
  }
  
  setAllTags(Array.from(tagsSet).sort());
}, [paidCourses]); // Add paidCourses as a dependency

  // Update the filterProducts function to handle the "Paid" filter
  const filterProducts = () => {
    let filteredProducts = initialProducts;
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by active tag
    if (activeTag !== '') {
      if (activeTag === "Paid") {
        // Special handling for "Paid" tag
        filteredProducts = filteredProducts.filter(product => 
          paidCourses.includes(product.courseId)
        );
      } else {
        // Filter by normal tag
        filteredProducts = filteredProducts.filter(product => 
          product.tags.includes(activeTag)
        );
      }
    }
    
    setProducts(filteredProducts);
  };
  
    // Handle search input change
    const handleSearchChange = (e) => {
      const term = e.target.value.toLowerCase();
      setSearchTerm(term);
    };
  
    // Handle tag selection
    const handleTagClick = (tag) => {
      // If tag is already active, deselect it, otherwise select it
      setActiveTag(activeTag === tag ? '' : tag);
    };
  
    // Apply filters whenever search term or active tag changes
    useEffect(() => {
      filterProducts();
    }, [searchTerm, activeTag]);
  

  return (
    <div style={{backgroundColor: 'white'}} className={styles.container}>
      <div className="hero-section">
          <div className="hero-content">
              <h1 style={{color: '#15173D'}} className="hs-title-8">Micro Learning Modules</h1>
              <p style={{color: '#15173D'}} className='hs-title'>Self-Paced Video Lectures with Q&A Engine</p>
              <div className="upload-sections">
                  <div className="file-upload">
                      <label className="upload-btn">
                          <StepForward style={{width: 15, color: '#15173D'}} />
                          <span>Apply for</span>
                          <button 
                              onClick={() => router.push("https://forms.office.com/r/8DFMQGJypx")} 
                              className="evaluate-btn"
                          >
                              Business English Programme
                          </button>
                      </label>
                  </div>
              </div>
          </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2><Airplay size={18} style={{marginTop: -3}} /> Course Details: {findCourseByLink(selectedProductLink).title}</h2>            
            </div>
            
            {/* Preview Video Section */}
            <div className="preview-video-container">
              <iframe 
                className="preview-video-player"
                webkitallowfullscreen="true"
                mozallowfullscreen="true"
                allowFullScreen={true}            
                src={`https://videos.dyntube.com/iframes/${findCourseByLink(selectedProductLink).modules[0].lessons[0].dyntubeId}`}
                title="Preview Video"
                onContextMenu={(e) => e.preventDefault()}
              />
              <div className="preview-badge">
                <Focus style={{marginTop: -2}} size={14} /> FREE PREVIEW
              </div>
            </div>

            <div className="info-container">
              <div className="info-box">
                <p><User size={15} style={{marginTop: 2}} /> <strong>Instructor:</strong> {findCourseByLink(selectedProductLink).instructor}</p>
                <p><Disc size={15} style={{marginTop: 2}} /> <strong>Total Modules:</strong> {findCourseByLink(selectedProductLink).modules.length}</p>
                <p><Disc size={15} style={{marginTop: 2}} /> <strong>Total Lessons:</strong> {findCourseByLink(selectedProductLink).modules.reduce((total, module) => total + module.lessons.length, 0)}</p>
              </div>
              <div className="info-box">
                <p><Focus size={15} style={{marginTop: 2}} /> <strong>Key Topics:</strong> 
                { (() => {
                    const selectedCourse = findCourseByLink(selectedProductLink);
                    if (!selectedCourse || !selectedCourse.courseId) {
                      return 'Various programming and data science topics';
                    }
                    return selectedCourse.courseId.includes('rust_time') ? 
                      'ARIMA, Exponential Smoothing, Rust' : 
                      'Transformers, Attention Mechanism, Python';
                  })()}
                </p>
                <p><Book size={15} style={{marginTop: 2}} /> <strong>Mode:</strong> Self-paced with video lessons</p>
                <p><Languages size={15} style={{marginTop: 2}} /> <strong>Language:</strong> English</p>
              </div>
            </div>

            <div className="benefits-container">
              <div className="benefit-box">
                <h3><Disc2 size={14} style={{marginTop: -3}} /> Why Take This Course?</h3>
                <p><Dot /> Hands-on project: build models without external libraries</p>
                <p><Dot /> Boost your skills in 
                  {
                    (() => {
                      const selectedCourse = findCourseByLink(selectedProductLink);
                      if (!selectedCourse || !selectedCourse.courseId) return 'programming';
                      return selectedCourse.courseId.includes('rust_time') ? ' Rust' : ' Python, ML, and';
                    })()
                  } and {
                    (() => {
                      const selectedCourse = findCourseByLink(selectedProductLink);
                      if (!selectedCourse || !selectedCourse.courseId) return 'data analysis';
                      return selectedCourse.courseId.includes('rust_time') ? 'time-series analysis' : 'deep learning';
                    })()
                  }
                </p>
                <p><Dot /> Learn to Create models from scratch.</p>
              </div>

              <div className="benefit-box">
                <h3><Disc2 size={14} style={{marginTop: -3}} /> Who This Course Is For</h3>
                <p><Dot /> Engineers building high-performance AI tools</p>
                <p><Dot /> Data scientists and analysts exploring 
                  {
                    (() => {
                      const selectedCourse = findCourseByLink(selectedProductLink);
                      if (!selectedCourse || !selectedCourse.courseId) return 'new technologies';
                      return selectedCourse.courseId.includes('rust_time') ? 'Rust' : 'ML, and Deep Learning';
                    })()
                  }
                </p>
                <p><Dot /> Anyone interested in Data Science, ML, and Deep Learning</p>
              </div>
                
              <div className="benefit-box">
                <h3><Disc2 size={14} style={{marginTop: -3}} /> Prerequisites</h3>
                <p><Dot /> Basic knowledge of 
                  {
                    (() => {
                      const selectedCourse = findCourseByLink(selectedProductLink);
                      if (!selectedCourse || !selectedCourse.courseId) return ' programming';
                      return selectedCourse.courseId.includes('rust_time') ? ' Rust' : ' Python';
                    })()
                  } recommended</p>
                  <p><Dot /> No prior{
                    (() => {
                      const selectedCourse = findCourseByLink(selectedProductLink);
                      if (!selectedCourse || !selectedCourse.courseId) return 'advanced';
                      return selectedCourse.courseId.includes('rust_time') ? 'Rust knowledge recommended' : ' Transformer knowledge recommended';
                    })()
                  }
                  </p>
                <p><Dot /> No prior 
                  {
                    (() => {
                      const selectedCourse = findCourseByLink(selectedProductLink);
                      if (!selectedCourse || !selectedCourse.courseId) return 'advanced';
                      return selectedCourse.courseId.includes('rust_time') ? 'Rust' : 'Transformer architecture';
                    })()
                  }
                &nbsp;knowledge required</p>
              </div>
            </div>

            <h3 className="section-title">
              <NotebookText size={16} style={{marginTop: -3}} /> Free Preview Lessons:
            </h3>
            
            
            <div className="lessons-container">
              <div className="lessons-grid">
                {(() => {
                  // Create a flat array of all lessons with their module index
                  const allLessons = findCourseByLink(selectedProductLink).modules.slice(0, 3).flatMap((module, moduleIndex) => 
                    module.lessons.map((lesson, lessonIndex) => ({
                      lesson,
                      moduleIndex,
                      lessonIndex
                    }))
                  );
                  
                  // Only show the first 5 lessons
                  const visibleLessons = allLessons.slice(0, 5);
                  const remainingCount = allLessons.length - 5;
                  
                  return (
                    <>
                      {/* Display first 5 lessons */}
                      {visibleLessons.map(({lesson, moduleIndex, lessonIndex}) => (
                        <div 
                          key={`${moduleIndex}-${lessonIndex}`} 
                          className={`lesson-card ${lessonIndex === 0 ? 'lesson-free' : ''}`}
                          onClick={() => {
                            // Here you could add functionality to change the preview video
                          }}
                        >
                          <div className="lesson-header">
                            <span className="lesson-number">{moduleIndex + 1}.{lessonIndex + 1}</span>
                            {lessonIndex === 0 ? (
                              <span className="badge free">FREE</span>
                            ) : (
                              <span className="badge premium">PREMIUM</span>
                            )}
                          </div>
                          <div className="lesson-body">
                            <p className="lesson-title">{lesson.title}</p>
                            <div className="lesson-meta">
                              <span>{lesson.duration}</span>
                              <StepForward size={12} style={{marginTop: -1}} />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Show "more" card if there are additional lessons */}
                      {remainingCount > 0 && (
                        <div className="lesson-card more-lessons-card">
                          <div className="lesson-body more-lessons-body">
                            <p className="lesson-title more-lessons-title">
                              <Plus size={14} style={{marginRight: 5}} />
                              {remainingCount} more {remainingCount === 1 ? 'lesson' : 'lessons'}
                            </p>
                            <div className="lesson-meta">
                              <span>Get full access</span>
                              <ArrowRight size={12} style={{marginTop: -1}} />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
            
            <div className="modal-acknowledgement">
              <div className="custom-checkbox-wrapper">
                <input 
                  type="checkbox" 
                  id="acknowledge" 
                  className="custom-checkbox-input"
                  checked={isAcknowledged}
                  onChange={() => setIsAcknowledged(!isAcknowledged)}
                />
                <label className="custom-checkbox-label" htmlFor="acknowledge">
                  <span className="custom-checkbox-box"></span>
                  <span className="custom-checkbox-text">I understand this course requires
                    I understand this course requires {
                      (() => {
                        const selectedCourse = findCourseByLink(selectedProductLink);
                        if (!selectedCourse || !selectedCourse.courseId) return 'programming';
                        return selectedCourse.courseId.includes('rust_time') ? 'basic programming' : 'basic programming';
                      })()
                    } knowledge and includes both free and premium content.
                  </span>
                </label>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                onClick={() => setShowModal(false)}
                className="modal-cancel"
              >
                <X size={15} style={{marginTop: -3}} /> Cancel
              </button>
              {userEmail ? (
                <button 
                  onClick={confirmAndNavigate}
                  className="modal-confirm"
                  disabled={!isAcknowledged || isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <ShoppingCart size={14} style={{marginTop: -1}} /> Buy Now (₹399)
                    </>
                  )}
                </button>
              ) : (
                <button 
                  onClick={() => router.push('/')}
                  className="modal-confirm"
                >
                  Login / Register
                </button>
              )}
            </div>
            
            {/* Script for DynTube Player */}
            <Script src="https://embed.dyntube.com/v2/player/player.js" />
          </div>
        </div>
      )}
      
      <div className="search-container">
        <div className="search-icon-wrapper">
          <Search size={20} className="search-icon" />
        </div>
        <input
          type="text"
          placeholder="Search by name or tag..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="tag-filter-container">
        <h3><Layers size={15} style={{marginTop: -5, color: '#15173D'}} /> Filter by tag:</h3>
          <div className="all-tags">
            {allTags.map((tag, index) => (
              <span 
                key={index} 
                className={`filter-tag ${activeTag === tag ? 'active-tag' : ''} ${tag === 'Paid' ? styles.paidFilterTag : ''}`}
                onClick={() => handleTagClick(tag)}
              >
                {tag === 'Paid' ? (
                  <ShoppingCart size={12} style={{marginTop: -3}} />
                ) : (
                  <Notebook size={12} style={{marginTop: -3}} />
                )}
                {' '}{tag}
              </span>
            ))}
          </div>
          {activeTag && (
            <button className="clear-filter" onClick={() => setActiveTag('')}>
              Clear filter
            </button>
          )}
      </div>
      
      <div className={styles.results}>
        <p className={styles.resultCount}>
          Showing {products.length} {products.length === 1 ? 'result' : 'results'}
          {activeTag && <span> for tag: <strong>{activeTag}</strong></span>}
        </p>
      </div>
      
      <div className={styles.cardGrid}>
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="product-card">
              <div className="card-image-container">
                <img src={product.image} alt={product.name} className="card-image" />
              </div>
              <div className="card-content">
                {/* <h4 className="card-title"><Focus size={18} style={{marginTop: -5}} /> {product.name}</h4> */}
                <div className="card-tag-container">
                  {product.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className={`card-tag ${tag === activeTag ? 'active-card-tag' : ''}`}
                      onClick={() => handleTagClick(tag)}
                    >
                      <Zap size={12} style={{marginTop: -3}} /> {tag}
                    </span>
                  ))}
                  {isCoursePaid(product.courseId) && (
                    <span className={`card-tag`}>
                      Paid
                    </span>
                  )}
                </div>
                <button 
                  className="view-details-button"
                  onClick={() => handleStartExam(product.link, product.courseId)}
                >
                  <NotebookText size={18} style={{marginTop: -3}} /> {isCoursePaid(product.courseId) ? ' Start Learning' : ' Explore Catalog'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noResults}>
            <p>No language modules found matching {searchTerm ? `"${searchTerm}"` : ""} 
              {activeTag && searchTerm ? " and " : ""}
              {activeTag ? `tag "${activeTag}"` : ""}
            </p>
          </div>
        )}
      </div>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Lustria&family=DM+Sans:ital,opsz,wght@0,9..40,100..900;1,9..40,100..900&display=swap');
        .hero-section {
            text-align: center;
            margin-bottom: 40px;
            margin-top: -100px;
            background-image: url('./texture/audio.jpg');
            background-size: cover;
            background-position: center;
            background-blend-mode: overlay;
            padding: 40px;
            border-radius: 40px;
            position: relative;
            box-shadow: 0 10px 30px rgba(227, 207, 250, 0.5),
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
            box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
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
            font-family: "Lustria", serif;
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
          color: white;
          border: none;
          border-radius: 40px;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          cursor: pointer;
          margin-left: 1rem;
        }


        /* Modal Base Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 10px;
          box-sizing: border-box;
        }

        .modal-content {
          background-color: white;
          border-radius: 0px !important;
          overflow: hidden;
          max-height: 90vh;
          overflow-y: auto;
          width: 100%;
          max-width: 1100px;
          position: relative;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          padding: 4px;
        }

        /* Header Styles */
        .modal-header {
          background-color: #f1f5f9;
          padding: 12px 15px;
          border-radius: 8px 8px 0 0;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .modal-header h2 {
          font-size: 16px;
          color: #15173D;
          font-weight: 500;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        /* Video Section */
        .preview-video-player {
          width: 100%;
          height: 50vh;
          border: none;
          display: block;
        }

        .preview-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background-color: aqua;
          box-shadow: 0 10px 30px rgba(221, 196, 254, 0.5);
          inset: 0 1px 0 rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(3px);
          color: #15173D;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Info Boxes */
        .info-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin: 12px;
          position: relative;
          z-index: 2;
        }

        .info-box {
          flex: 1;
          border: 0.5px dotted lightBlue;
          padding: 10px;
          border-radius: 12px;
          text-align: left;
          background-color: rgba(255, 255, 255, 0.95);
        }

        .info-box p {
          font-size: 13px;
          margin: 6px 0;
          display: flex;
          align-items: flex-start;
          gap: 5px;
          word-break: break-word;
        }

        /* Benefits Section */
        .benefits-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin: 12px;
        }

        .benefit-box {
          border: 0.5px dotted lightBlue;
          border-radius: 16px;
          padding: 14px;
        }

        .benefit-box h3 {
          font-size: 14px;
          margin-bottom: 6px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .benefit-box p {
          font-size: 13px;
          margin: 5px 0;
          line-height: 1.4;
        }

        /* Lessons Section */
        .section-title {
          font-size: 18px !important;
          font-weight: 600;
          margin: 18px 0 8px 12px;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .lessons-container {
          max-height: 300px;
          padding: 20px 12px;
        }

        .lessons-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .lesson-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .lesson-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .lesson-free {
          background-color: #f0f9ff;
        }

        .lesson-header {
          padding: 8px 10px;
          border-bottom: 1px solid #eee;
          background-color: #f8f9fa;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .lesson-free .lesson-header {
          background-color: white;
        }

        .lesson-number {
          font-weight: 500;
          font-size: 13px;
        }

        .badge {
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: bold;
        }

        .badge.free {
          background-color: aqua;
          color: #15173D;
        }

        .badge.premium {
          background-color: #9ca3af;
          color: white;
        }

        .lesson-body {
          padding: 10px;
        }

        .lesson-title {
          font-size: 13px;
          font-weight: 500;
          margin: 0 0 5px 0;
        }

        .lesson-meta {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #666;
        }

        /* Checkbox */
        .modal-acknowledgement {
            margin: 50px 12px;
          }

        .custom-checkbox-wrapper {
          display: flex;
          align-items: flex-start;
        }

        .custom-checkbox-input {
          position: absolute;
          opacity: 0;
        }

        .custom-checkbox-label {
          display: flex;
          align-items: flex-start;
          cursor: pointer;
          padding: 2px 0;
        }

        .custom-checkbox-box {
          width: 18px;
          height: 18px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-right: 10px;
          position: relative;
          flex-shrink: 0;
        }

        .custom-checkbox-input:checked + .custom-checkbox-label .custom-checkbox-box {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }

        .custom-checkbox-input:checked + .custom-checkbox-label .custom-checkbox-box::after {
          content: '✓';
          color: white;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
        }

        .custom-checkbox-text {
          font-size: 13px;
          line-height: 1.4;
        }

        /* Buttons */
        .modal-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 15px 12px;
        }

        .modal-cancel,
        .modal-confirm {
          padding: 12px 15px;
          border-radius: 8px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          transition: background-color 0.2s;
          font-size: 14px;
          width: 100%;
          touch-action: manipulation;
        }

        .modal-cancel {
          background-color: white;
          border: 1px solid #ddd;
          color: #333;
        }

        .modal-cancel:hover, 
        .modal-cancel:active {
          background-color: aqua;
        }

        .modal-confirm {
          background-color: #f1f5f9;
          border: none;
          color: #15173D;
        }

        .modal-confirm:hover:not(:disabled),
        .modal-confirm:active:not(:disabled) {
          background-color: aqua;
        }

        .modal-confirm:disabled {
          background-color: lightBlue;
          cursor: not-allowed;
          color: grey;
        }

        /* Media Queries for Responsive Design */
        @media (min-width: 480px) {
          .modal-overlay {
            padding: 15px;
          }
          
          .modal-content {
            border-radius: 12px;
          }
          
          .modal-header {
            padding: 15px;
          }
          
          .modal-header h2 {
            font-size: 18px;
          }
          
          .info-box p,
          .benefit-box p,
          .custom-checkbox-text {
            font-size: 14px;
          }
        }

        @media (min-width: 640px) {
          .info-container {
            flex-direction: row;
          }
          
          .benefits-container {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .lessons-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .modal-actions {
            flex-direction: row;
            justify-content: flex-end;
          }
          
          .modal-cancel,
          .modal-confirm {
            width: auto;
          }
        }

        @media (min-width: 768px) {
          .section-title {
            font-size: 20px !important;
          }
          
          .lessons-container {
            max-height: 250px;
          }
        }

        @media (min-width: 1024px) {
          .benefits-container {
            grid-template-columns: repeat(3, 1fr);
          }
          
          .lessons-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
        }

        /* Touch device optimizations */
        @media (hover: none) {
          .lesson-card:hover {
            transform: none;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          }
          
          .modal-cancel,
          .modal-confirm {
            padding: 14px 15px; /* Larger tap targets */
          }
        }


        /* New Search Container with Icon */
        .search-container {
          position: relative;
          display: flex;
          align-items: center;
          max-width: 600px;
          margin: 0 auto;
          border-radius: 50px;
          border: 1px solid #e0e0e0;
          background-color: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition: box-shadow 0.3s ease;
        }

        .search-container:focus-within {
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          border-color: blue;
        }

        .search-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 0.75rem;
        }

        .search-icon {
          color: #666;
        }

        .search-input {
          flex: 1;
          border: none;
          padding: 0.75rem 1rem 0.75rem 0;
          font-size: 1rem;
          outline: none;
          background: transparent;
        }

        .search-input::placeholder {
          color: #999;
        }

        .tag-filter-container {
          margin: 1.5rem 0;
        }

        .tag-filter-container h3 {
          margin-bottom: 0.5rem;
          color: #333;
          font-size: 1rem;
        }

        .all-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .filter-tag {
          background: aqua;
          color: #15173D;
          padding: 0.3rem 0.6rem;
          border-radius: 50px;
          font-size: 0.8rem;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }

        .filter-tag:hover {
          background: white;
        }

        .active-tag {
          background: blue;
          color: white;
          border: 1px solid blue;
        }

        .clear-filter {
          background: transparent;
          color: #666;
          border: 1px solid #ddd;
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-filter:hover {
          background: #f5f5f5;
          color: #333;
        }

        /* New Card Design Styles */
        .product-card {
          display: flex;
          flex-direction: column;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(3px);   
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: white;
          height: 100%;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .card-image-container {
          width: 100%;
          height: 180px;
          overflow: hidden;  
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .product-card:hover .card-image {
          transform: scale(1.05);
        }

        .card-content {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .card-title {
          font-size: 1rem;
          font-weight: 400;
          margin-bottom: 0.75rem;
          color: #333;
        }

        .card-tag-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .card-tag {
          background-color: #bff2f7;
          color: #15173D;
          font-size: 0.75rem;
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .card-tag:hover {
          background-color: #e3fcfc;
        }

        .active-card-tag {
          background-color: blue !important;
          color: white !important;
        }

        .view-details-button {
          margin-top: auto;
          background-color: #bff2f7;
          color: #15173D;
          border: none;
          border-radius: 40px;
          padding: 0.6rem 1rem;
          font-weight: 400;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .view-details-button:hover {
          background-color:  #e3fcfc;
          color: #15173D;
        }

        /* Ensure the card grid has proper spacing */
        ${styles.cardGrid ? '' : `
          .${styles.cardGrid} {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
          }
        `}
      `}</style>
    </div>
  );
};

export default CourseMarket;