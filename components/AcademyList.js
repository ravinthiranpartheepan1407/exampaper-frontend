"use client"
import { BookOpen, BookOpenCheck, Building2, Contact, Rocket, Send, Snowflake, Sun, Target, Timer, Zap, Code, Database, Layers, ScanIcon, ScanEye, Medal, SendHorizonal, Contact2, Box, Dot, View, Eye, Lock, CircleDot, Gift, Code2, Users, Mail, User, Pickaxe, Ticket, Package, Check, PackageOpen, GraduationCap, Award, Linkedin, Languages } from 'lucide-react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default function AcademyList() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [courseCategory, setCourseCategory] = useState('ai'); // 'ai' or 'fullstack'
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    camp: ''
  });

  const aiCourses = [
    {
      "id": 1,
      "title": "Introduction to Machine Learning",
      "season": "Summer",
      "duration": "2 weeks",
      "description": "Learn the fundamentals of machine learning algorithms and their applications.",
      "curriculum": [
        "Introduction to Machine Learning",
        "Supervised Learning: Regression and Classification",
        "Unsupervised Learning: Clustering Techniques",
        "Feature Scaling and Feature Selection",
        "Performance Evaluation Metrics: Precision, Recall, and F1-Score"
      ],
      "miniProject": "House Price Prediction using Regression Analysis"
    },
    {
      "id": 3,
      "title": "Advanced Data Science Techniques",
      "season": "Summer",
      "duration": "2 weeks",
      "description": "Learn to perform data analysis, visualization, and predictive modeling techniques.",
      "curriculum": [
        "Exploratory Data Analysis with Pandas and Matplotlib",
        "Statistical Inference and Hypothesis Testing",
        "Feature Engineering and Dimensionality Reduction",
        "Model Evaluation and Cross-Validation",
        "Model Deployment with Flask and FastAPI"
      ],
      "miniProject": "Customer Churn Prediction System using Machine Learning"
    },
    {
      "id": 2,
      "title": "Build Neural Networks From Scratch",
      "season": "Summer",
      "duration": "2 weeks",
      "description": "Learn to build neural networks and deep learning architectures from scratch.",
      "curriculum": [
        "Neural Network Basics and Perceptron",
        "Backpropagation and Gradient Descent",
        "Convolutional Neural Networks for Image Classification",
        "Recurrent Neural Networks for Time Series Data",
        "Regularization Techniques (Dropout, Batch Normalization)"
      ],
      "miniProject": "Image Classification with Convolutional Neural Networks (Cats vs Dogs)"
    },
    {
      "id": 4,
      "title": "Natural Language Processing",
      "season": "Summer",
      "duration": "2 weeks",
      "description": "Learn to process and analyze text data using modern NLP techniques.",
      "curriculum": [
        "Text Preprocessing and Tokenization",
        "Word Embeddings (Word2Vec, GloVe)",
        "Sequence Models for Text Classification",
        "Transformer-Based Models (BERT, GPT)",
        "Sentiment Analysis and Named Entity Recognition"
      ],
      "miniProject": "Sentiment Analysis on Product Reviews using BERT"
    },
    {
      "id": 5,
      "title": "Computer Vision using Deep Learning",
      "season": "Summer",
      "duration": "2 weeks",
      "description": "Learn to build computer vision model from scratch and understand how machines interpret and process visual information.",
      "curriculum": [
        "Image Processing with OpenCV",
        "Object Detection using YOLO and SSD",
        "Image Segmentation Techniques",
        "Face Recognition Systems",
        "Generative Models (GANs)"
      ],
      "miniProject": "Object Detection System for Retail Inventory Automation"
    },
    {
      "id": 6,
      "title": "Large Language Models (LLM) & RAG Systems",
      "season": "Summer",
      "duration": "4 weeks",
      "description": "Learn how to build and fine-tune Large Language Models with Retrieval-Augmented Generation Systems.",
      "curriculum": [
        "Transformer Architecture From Scratch",
        "Pre-training vs Fine-tuning",
        "Retrieval-Augmented Generation (RAG) Concepts",
        "Fine-tuning GPT-3, Llama, Gemini, and Grok",
        "Deploying LLMs with API Integration"
      ],
      "miniProject": "Chatbot with LLM and RAG for FAQ Automation"
    },
    {
      "id": 7,
      "title": "Machine Learning Operations (MLOps)",
      "season": "Summer",
      "duration": "2 weeks",
      "description": "Learn to deploy, monitor, and maintain machine learning models in production.",
      "curriculum": [
        "ML Lifecycle Management with MLflow",
        "Model Versioning and Monitoring",
        "Scalable ML Infrastructure with Docker and Kubernetes",
        "Automated Retraining Pipelines",
        "CI/CD for Machine Learning Projects"
      ],
      "miniProject": "End-to-End ML Model Deployment with CI/CD for Loan Approval System"
    },

    {
      "id": 8,
      "title": "Final Assessment (Real world Project)",
      "season": "Summer",
      "duration": "2 weeks",
      "description": "Comprehensive assessment to evaluate skills acquired throughout the AI program.",
      "curriculum": [
        "Capstone Project Development",
        "Code Review and Evaluation",
        "Presentation and Report Submission"
      ],
      "miniProject": "Real world Deep Learning Project Showcase"
    },


    {
      "id": 1,
      "title": "Introduction to Machine Learning",
      "season": "Winter",
      "duration": "2 weeks",
      "description": "Learn the fundamentals of machine learning algorithms and their applications.",
      "curriculum": [
        "Introduction to Machine Learning",
        "Supervised Learning: Regression and Classification",
        "Unsupervised Learning: Clustering Techniques",
        "Feature Scaling and Feature Selection",
        "Performance Evaluation Metrics: Precision, Recall, and F1-Score"
      ],
      "miniProject": "House Price Prediction using Regression Analysis"
    },
    {
      "id": 3,
      "title": "Advanced Data Science Techniques",
      "season": "Winter",
      "duration": "2 weeks",
      "description": "Learn to perform data analysis, visualization, and predictive modeling techniques.",
      "curriculum": [
        "Exploratory Data Analysis with Pandas and Matplotlib",
        "Statistical Inference and Hypothesis Testing",
        "Feature Engineering and Dimensionality Reduction",
        "Model Evaluation and Cross-Validation",
        "Model Deployment with Flask and FastAPI"
      ],
      "miniProject": "Customer Churn Prediction System using Machine Learning"
    },
    {
      "id": 2,
      "title": "Build Neural Networks From Scratch",
      "season": "Winter",
      "duration": "2 weeks",
      "description": "Learn to build neural networks and deep learning architectures from scratch.",
      "curriculum": [
        "Neural Network Basics and Perceptron",
        "Backpropagation and Gradient Descent",
        "Convolutional Neural Networks for Image Classification",
        "Recurrent Neural Networks for Time Series Data",
        "Regularization Techniques (Dropout, Batch Normalization)"
      ],
      "miniProject": "Image Classification with Convolutional Neural Networks (Cats vs Dogs)"
    },
    {
      "id": 4,
      "title": "Natural Language Processing",
      "season": "Winter",
      "duration": "2 weeks",
      "description": "Learn to process and analyze text data using modern NLP techniques.",
      "curriculum": [
        "Text Preprocessing and Tokenization",
        "Word Embeddings (Word2Vec, GloVe)",
        "Sequence Models for Text Classification",
        "Transformer-Based Models (BERT, GPT)",
        "Sentiment Analysis and Named Entity Recognition"
      ],
      "miniProject": "Sentiment Analysis on Product Reviews using BERT"
    },
    {
      "id": 5,
      "title": "Computer Vision using Deep Learning",
      "season": "Winter",
      "duration": "2 weeks",
      "description": "Learn to build computer vision model from scratch and understand how machines interpret and process visual information.",
      "curriculum": [
        "Image Processing with OpenCV",
        "Object Detection using YOLO and SSD",
        "Image Segmentation Techniques",
        "Face Recognition Systems",
        "Generative Models (GANs)"
      ],
      "miniProject": "Object Detection System for Retail Inventory Automation"
    },
    {
      "id": 6,
      "title": "Large Language Models (LLM) & RAG Systems",
      "season": "Winter",
      "duration": "4 weeks",
      "description": "Learn how to build and fine-tune Large Language Models with Retrieval-Augmented Generation Systems.",
      "curriculum": [
        "Transformer Architecture From Scratch",
        "Pre-training vs Fine-tuning",
        "Retrieval-Augmented Generation (RAG) Concepts",
        "Fine-tuning GPT-3, Llama, Gemini, and Grok",
        "Deploying LLMs with API Integration"
      ],
      "miniProject": "Chatbot with LLM and RAG for FAQ Automation"
    },
    {
      "id": 7,
      "title": "Machine Learning Operations (MLOps)",
      "season": "Winter",
      "duration": "2 weeks",
      "description": "Learn to deploy, monitor, and maintain machine learning models in production.",
      "curriculum": [
        "ML Lifecycle Management with MLflow",
        "Model Versioning and Monitoring",
        "Scalable ML Infrastructure with Docker and Kubernetes",
        "Automated Retraining Pipelines",
        "CI/CD for Machine Learning Projects"
      ],
      "miniProject": "End-to-End ML Model Deployment with CI/CD for Loan Approval System"
    },

    {
      "id": 8,
      "title": "Final Assessment (Real world Project)",
      "season": "Winter",
      "duration": "2 weeks",
      "description": "Comprehensive assessment to evaluate skills acquired throughout the Deep Learning program.",
      "curriculum": [
        "Capstone Project Development",
        "Code Review and Evaluation",
        "Presentation and Report Submission"
      ],
      "miniProject": "Real world Deep Learning Project Showcase"
    },
  ]
  
  const fullstackCourses = [
    {
      id: 201,
      title: 'Modern JavaScript & TypeScript Fundamentals',
      season: 'Summer',
      duration: '2 weeks',
      description: 'Master JavaScript and TypeScript fundamentals, including modern ES6+ features.',
      curriculum: [
        'JavaScript Core Concepts & ES6+',
        'TypeScript Basics & Typing System',
        'Asynchronous JavaScript & Promises',
        'Data Structures & Algorithms in JS'
      ],
      miniProject: 'Weather App using TypeScript'
    },
    {
      id: 202,
      title: 'Frontend Development with Next.js',
      season: 'Summer',
      duration: '4 weeks',
      description: 'Learn Next.js for building dynamic, server-side rendered React applications.',
      curriculum: [
        'Next.js Basics & Pages Routing',
        'API Routes & SSR/SSG',
        'State Management with React Context',
        'Authentication with JWT & NextAuth.js'
      ],
      miniProject: 'Blogging App with SSR'
    },
    {
      id: 203,
      title: 'Frontend Development with Vue.js',
      season: 'Summer',
      duration: '4 weeks',
      description: 'Master Vue.js for building modern, reactive web applications.',
      curriculum: [
        'Vue.js Basics & Composition API',
        'Vuex State Management',
        'Routing with Vue Router',
        'Unit Testing with Vitest & Jest'
      ],
      miniProject: 'Task Management App'
    },
    {
      id: 204,
      title: 'Backend Development with Node.js & Python',
      season: 'Summer',
      duration: '4 weeks',
      description: 'Create RESTful and Microservices APIs using Node.js and Python FastAPI.',
      curriculum: [
        'Node.js with Express.js',
        'Python FastAPI',
        'Database Integration (MongoDB & PostgreSQL)',
        'Authentication & JWT Implementation'
      ],
      miniProject: 'User Authentication System with FastAPI & Node.js'
    },
    {
      id: 205,
      title: 'Microservices & Microfrontend Architecture',
      season: 'Summer',
      duration: '2 weeks',
      description: 'Design and implement microservices and microfrontend architecture.',
      curriculum: [
        'Microservices Fundamentals',
        'API Gateway & Service Discovery',
        'Microfrontend Design with Module Federation',
        'Inter-service Communication (gRPC & Kafka)'
      ],
      miniProject: 'E-Commerce Microservice App'
    },
    {
      id: 206,
      title: 'Testing in Modern Web Development',
      season: 'Summer',
      duration: '2 weeks',
      description: 'Implement unit, integration, and end-to-end testing strategies.',
      curriculum: [
        'Unit Testing with Jest & Vitest',
        'API Testing with Postman & Supertest',
        'End-to-End Testing with Cypress',
        'Mocking & Test Coverage'
      ],
      miniProject: 'Test Suite for E-Commerce API'
    },
    {
      id: 207,
      title: 'AWS Deployment & CI/CD Pipelines',
      season: 'Summer',
      duration: '4 weeks',
      description: 'Deploy applications on AWS using Docker, Terraform, and CI/CD pipelines.',
      curriculum: [
        'AWS EC2 & S3 Bucket Deployment',
        'Docker & Docker Compose',
        'CI/CD with GitHub Actions & AWS CodePipeline',
        'Infrastructure as Code with Terraform'
      ],
      miniProject: 'E-Commerce App with AWS Deployment'
    },
    {
      id: 208,
      title: 'Capstone Project: Real World Full Stack Application',
      season: 'Summer',
      duration: '4 weeks',
      description: 'Build a production-ready SaaS product integrating frontend, backend, and deployment pipelines.',
      curriculum: [
        'System Design & Architecture',
        'Frontend & Backend Integration',
        'Performance Optimization',
        'Production Deployment & Monitoring'
      ],
      miniProject: 'Project Management SaaS Platform'
    },



    {
      id: 201,
      title: 'Modern JavaScript & TypeScript Fundamentals',
      season: 'Winter',
      duration: '2 weeks',
      description: 'Master JavaScript and TypeScript fundamentals, including modern ES6+ features.',
      curriculum: [
        'JavaScript Core Concepts & ES6+',
        'TypeScript Basics & Typing System',
        'Asynchronous JavaScript & Promises',
        'Data Structures & Algorithms in JS'
      ],
      miniProject: 'Weather App using TypeScript'
    },
    {
      id: 202,
      title: 'Frontend Development with Next.js',
      season: 'Winter',
      duration: '4 weeks',
      description: 'Learn Next.js for building dynamic, server-side rendered React applications.',
      curriculum: [
        'Next.js Basics & Pages Routing',
        'API Routes & SSR/SSG',
        'State Management with React Context',
        'Authentication with JWT & NextAuth.js'
      ],
      miniProject: 'Blogging App with SSR'
    },
    {
      id: 203,
      title: 'Frontend Development with Vue.js',
      season: 'Winter',
      duration: '4 weeks',
      description: 'Master Vue.js for building modern, reactive web applications.',
      curriculum: [
        'Vue.js Basics & Composition API',
        'Vuex State Management',
        'Routing with Vue Router',
        'Unit Testing with Vitest & Jest'
      ],
      miniProject: 'Task Management App'
    },
    {
      id: 204,
      title: 'Backend Development with Node.js & Python',
      season: 'Winter',
      duration: '4 weeks',
      description: 'Create RESTful and Microservices APIs using Node.js and Python FastAPI.',
      curriculum: [
        'Node.js with Express.js',
        'Python FastAPI',
        'Database Integration (MongoDB & PostgreSQL)',
        'Authentication & JWT Implementation'
      ],
      miniProject: 'User Authentication System with FastAPI & Node.js'
    },
    {
      id: 205,
      title: 'Microservices & Microfrontend Architecture',
      season: 'Winter',
      duration: '2 weeks',
      description: 'Design and implement microservices and microfrontend architecture.',
      curriculum: [
        'Microservices Fundamentals',
        'API Gateway & Service Discovery',
        'Microfrontend Design with Module Federation',
        'Inter-service Communication (gRPC & Kafka)'
      ],
      miniProject: 'E-Commerce Microservice App'
    },
    {
      id: 206,
      title: 'Testing in Modern Web Development',
      season: 'Winter',
      duration: '2 weeks',
      description: 'Implement unit, integration, and end-to-end testing strategies.',
      curriculum: [
        'Unit Testing with Jest & Vitest',
        'API Testing with Postman & Supertest',
        'End-to-End Testing with Cypress',
        'Mocking & Test Coverage'
      ],
      miniProject: 'Test Suite for E-Commerce API'
    },
    {
      id: 207,
      title: 'AWS Deployment & CI/CD Pipelines',
      season: 'Winter',
      duration: '4 weeks',
      description: 'Deploy applications on AWS using Docker, Terraform, and CI/CD pipelines.',
      curriculum: [
        'AWS EC2 & S3 Bucket Deployment',
        'Docker & Docker Compose',
        'CI/CD with GitHub Actions & AWS CodePipeline',
        'Infrastructure as Code with Terraform'
      ],
      miniProject: 'E-Commerce App with AWS Deployment'
    },
    {
      id: 208,
      title: 'Capstone Project: Real World Full Stack Application',
      season: 'Winter',
      duration: '4 weeks',
      description: 'Build a production-ready SaaS product integrating frontend, backend, and deployment pipelines.',
      curriculum: [
        'System Design & Architecture',
        'Frontend & Backend Integration',
        'Performance Optimization',
        'Production Deployment & Monitoring'
      ],
      miniProject: 'Project Management SaaS Platform'
    }
];
  
  const finalPresentation = {
    month: 4,
    description: 'Students will present their intermediate mini project and final projects. Evaluated based on innovation, code quality, and presentation skills.',
    rewards: ['LinkedIn Recommendation', 'Certification']
  };


  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError('');

    try {
      // Check for duplicates first
      const { data: existingEntries, error: fetchError } = await supabase
        .from('academy')
        .select('*')
        .eq('Email', formData.email)
        .eq('Course', formData.course)
        .eq('Camp', formData.camp);

      if (fetchError) throw fetchError;
      
      // If we found matching records, show error and prevent submission
      if (existingEntries && existingEntries.length > 0) {
        toast.info('You have already applied for this course in this camp timeline');
        setFormSubmitting(false);
        return;
      }
      
      // No duplicates found, proceed with insert
      const { data, error } = await supabase
        .from('academy')
        .insert([
          { 
            FullName: formData.name,
            Email: formData.email,
            Course: formData.course,
            Camp: formData.camp
          }
        ]);

      if (error) throw error;
      
      // Reset form and show success message
      setFormData({
        name: '',
        email: '',
        course: '',
        camp: ''
      });
      setFormSubmitted(true);

      toast.success('Enrollment Form Successfully Submitted!');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormSubmitted(false);
      }, 10000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError('Failed to submit form. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const openCourseModal = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const closeCourseModal = () => {
    setModalOpen(false);
    setSelectedCourse(null);
  };

  const toggleCourseCategory = (category) => {
    setCourseCategory(category);
  };

  // Get the appropriate courses based on selected category
  const getFilteredCourses = (season) => {
    const coursesToFilter = courseCategory === 'ai' ? aiCourses : fullstackCourses;
    return coursesToFilter.filter(course => course.season === season);
  };

  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

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
          } catch (err) {
            console.error('Error decoding token:', err);
            router.push('/');
          }
    }, []);

  return (
    <div className="container">
      <header>
        <div className="logo">
          <h1 style={{fontSize: 16}}><Zap size={16} style={{marginTop: -2}} /> Builder Academy</h1>
        </div>
        <nav>
          <ul>
            <li><a href="#" onClick={() => setActiveTab('overview')}><Target size={16} style={{marginTop: -2}} /> Home</a></li>
            <li><a href="#" onClick={() => setActiveTab('summer')}><Sun size={16} style={{marginTop: -2}} /> Dev Summer</a></li>
            <li><a href="#" onClick={() => setActiveTab('winter')}><Snowflake size={16} style={{marginTop: -2}} /> Dev Winter</a></li>
            <li><a href="#" onClick={() => setActiveTab('english')}><Snowflake size={16} style={{marginTop: -2}} /> Learn English</a></li>
            <li><a href="#" onClick={() => setActiveTab('about')}><Building2 size={16} style={{marginTop: -2}} /> About</a></li>
            <li><a href="#" onClick={() => setActiveTab('contact')}><Contact size={16} style={{marginTop: -4}} /> Registration</a></li>
          </ul>
        </nav>
        <div className="cta-button">
          <button onClick={() => {
                  setActiveTab('contact');
                  closeCourseModal();
                }} ><Send size={16} style={{fontSize: 16, marginTop: -2}} /> Enroll Now</button>
        </div>
      </header>

      <main>
        {activeTab === 'overview' && (
          <section className="hero">
            <div className="hero-content">
              <h2><BookOpenCheck size={38} style={{marginTop: -2}} /> Builder Masterclass</h2>
              <p>Learn AI, Data Science, Machine Learning, Deep Learning, and Full Stack Development in our 4-month Builder Masterclass. Guided by experts, you will gain hands-on experience, build real projects, and become ready for jobs or your own startup. Choose between Summer or Winter Camp to start your journey.</p>

              <div className="season-info">
                <div className="season">
                  <h3 style={{fontSize: 18}}><Sun size={26} style={{marginTop: -2}} /> Summer Camp</h3>
                  <p style={{fontSize: 14}}><Timer size={16} style={{marginTop: -4}} /> March - July</p>
                  <p style={{fontSize: 14}}>Learn AI, Data Science, Machine Learning, Deep Learning, and Full Stack Development in our 4-month Summer Builder Masterclass.</p>
                  <button onClick={() => setActiveTab('summer')}><BookOpen size={16} /> View Courses</button>
                </div>
                <div className="season">
                  <h3 style={{fontSize: 18}}><Snowflake size={26} style={{marginTop: -2}} /> Winter Camp</h3>
                  <p style={{fontSize: 14}}><Timer size={16} style={{marginTop: -4}} /> August - December</p>
                  <p style={{fontSize: 14}}>Learn AI, Data Science, Machine Learning, Deep Learning, and Full Stack Development in our 4-month Winter Season Builder Masterclass.</p>
                  <button onClick={() => setActiveTab('winter')}><BookOpen size={16} /> View Courses</button>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <div className="image-placeholder">
                <img src="https://zdmueezfheensjrefapy.supabase.co/storage/v1/object/sign/rust-timers/Builder%20Class.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJydXN0LXRpbWVycy9CdWlsZGVyIENsYXNzLnBuZyIsImlhdCI6MTc0MzcwMjkwNSwiZXhwIjozMzIwNTAyOTA1fQ.mXTy33oQDgfg0P-7rOwxQhUTROJKgOJQiwL-YaNghrE" />
              </div>
            </div>
          </section>
        )}

        {(activeTab === 'summer' || activeTab === 'winter') && (
          <section className="courses">
            <h2>{activeTab === 'summer' ? 'Summer' : 'Winter'} Courses ({activeTab === 'summer' ? 'March - July' : 'August - December'})</h2>

            <p className='course-description'>
              We believe in learning by doing. Every course includes real-world projects where students apply what they learn to solve problems. Personalized mentorship from experts guides students throughout their journey, ensuring they build confidence and industry-ready skills.
            </p>
            
            <div className="course-toggle">
              <button 
                className={`toggle-button ${courseCategory === 'ai' ? 'active' : ''}`} 
                onClick={() => toggleCourseCategory('ai')}
              >
                <Database size={16} /> ML & Data Science
              </button>
              <button 
                className={`toggle-button ${courseCategory === 'fullstack' ? 'active' : ''}`} 
                onClick={() => toggleCourseCategory('fullstack')}
              >
                <Code size={16} /> Full Stack Development
              </button>
            </div>
            
            <div className="course-grid">
              {getFilteredCourses(activeTab === 'summer' ? 'Summer' : 'Winter')
                .map(course => (
                  <div className="course-card" key={course.id}>
                    <h3><BookOpen style={{marginTop: -3}} /> {course.title}</h3>
                    <p style={{marginTop: 10, color: '#2a2a2a'}} className="duration"><Timer size={16} style={{marginTop: -4}} /> Duration: {course.duration}</p>
                    <p style={{marginTop: -5, color: '#2a2a2a'}}>{course.description}</p>
                    <button onClick={() => openCourseModal(course)}><Send size={16} style={{marginTop: -3}} /> Learn More</button>
                  </div>
                ))}
            </div>
          </section>
        )}

        {activeTab === 'english' && (
          <section className="about">
            <h2 className='hs-title-10' style={{textAlign: 'left'}}><CircleDot style={{marginTop: -8}} /> About SP24&apos;s Learn English</h2>
            <div className="about-content">
              <div className="about-text">
                <p style={{color: 'black', fontSize: 16}}>
                  StudyPoints24 Learn English helps people of all ages—kids, students, and professionals—improve their English skills in a fun and easy way. Our lessons are simple and interactive so that anyone can start speaking, reading, and writing better English.
                </p>
                <p style={{color: 'black', fontSize: 16}}>
                  The course includes real-life conversations, short stories, and small tasks to help you practice daily. We focus on grammar, vocabulary, pronunciation, and confidence building. Whether you’re just starting or want to get better at English for school, work, or travel, we’ve got you covered.
                </p>
                <p style={{color: 'black', fontSize: 16}}>
                  Our course works for kids in school, university students, and even employees looking to improve communication at work. With helpful support, certificates, and step-by-step progress, StudyPoints24 makes learning English easy and fun for everyone.
                </p>
              </div>
              <div className="values">
                <div className="value-item">
                  <h3 style={{color: 'black', fontSize: 16}}><Users style={{marginTop: -7}} /> For All Learners</h3>
                  <p style={{color: '#2a2a2a', fontSize: 16}}>
                    Designed for kids, school and college students, and working professionals. Whether you are a beginner or want to improve, this course fits your level.
                  </p>
                </div>
                <div className="value-item">
                  <h3 style={{color: 'black', fontSize: 16}}><Languages style={{marginTop: -7}} /> Learn by Doing</h3>
                  <p style={{color: '#2a2a2a', fontSize: 16}}>
                    Practice English with short stories, real-life examples, voice based tasks, and fun conversations.
                  </p>
                </div>
                <div className="value-item">
                  <h3 style={{color: 'black', fontSize: 16}}><Gift style={{marginTop: -7}} /> Simple and Fun</h3>
                  <p style={{color: '#2a2a2a', fontSize: 16}}>
                    Lessons use clear words, emojis, and visuals to make learning engaging and easy to understand.
                  </p>
                </div>
                <div className="value-item">
                  <h3 style={{color: 'black', fontSize: 16}}><Rocket style={{marginTop: -7}} /> Guided Support</h3>
                  <p style={{color: '#2a2a2a', fontSize: 16}}>
                    Get help from friendly mentors and support tools. Track your progress and earn certificates to show your skills.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'about' && (
          <section className="about">
          <h2 className='hs-title-10' style={{textAlign: 'left'}}><CircleDot style={{marginTop: -8}} /> About Builder Academy</h2>
          <div className="about-content">
          <div className="about-text">
            <p style={{color: 'black', fontSize: 16}}>
              Builder Academy helps students learn Artificial Intelligence, Machine Learning, Data Science, and Full Stack Development. Our courses are designed by experienced professionals and researchers to provide both theoretical knowledge and hands-on experience. Through interactive lessons, students gain practical skills that are essential for today's tech industry.
            </p>
            <p style={{color: 'black', fontSize: 16}}>
              We believe in learning by doing. Every course includes real-world projects where students apply what they learn to solve problems. Personalized mentorship from experts guides students throughout their journey, ensuring they build confidence and industry-ready skills.
            </p>
            <p style={{color: 'black', fontSize: 16}}>
              Our supportive community connects learners with peers, mentors, and alumni, creating a collaborative environment for growth. With certifications, career preparation, and project portfolios, Builder Academy empowers students to step into the tech world with confidence.
            </p>
          </div>
            <div className="values">
              <div className="value-item">
                <h3 style={{color: 'black', fontSize: 16}}><Gift style={{marginTop: -7}} /> Expert Guidance</h3>
                <p style={{color: '#2a2a2a', fontSize: 16}}>Learn from experienced professionals and researchers.</p>
              </div>
              <div className="value-item">
                <h3 style={{color: 'black', fontSize: 16}}><Code2 style={{marginTop: -7}} /> Hands-On Learning</h3>
                <p style={{color: '#2a2a2a', fontSize: 16}}>Work on real projects to sharpen your skills.</p>
              </div>
              <div className="value-item">
                <h3 style={{color: 'black', fontSize: 16}}><Users style={{marginTop: -7}} /> Community Support</h3>
                <p style={{color: '#2a2a2a', fontSize: 16}}>Connect with other learners and mentors.</p>
              </div>
              <div className="value-item">
                <h3 style={{color: 'black', fontSize: 16}}><Rocket style={{marginTop: -7}} /> Career Preparation</h3>
                <p style={{color: '#2a2a2a', fontSize: 16}}>Get ready for jobs with practical experience and certifications.</p>
              </div>
            </div>
          </div>
        </section>
        )}

        {activeTab === 'contact' && (
          <section className="contact">
            <h2 className='hs-title-10' style={{textAlign: 'left'}}><Contact size={40} style={{marginTop: -8}} /> Enrollment Form</h2>
            <p style={{color: 'black', fontSize: 16, marginTop: -20, marginBottom: 10}}>
              Builder Academy helps students learn Artificial Intelligence, Machine Learning, Data Science, and Full Stack Development. Our courses are designed by experienced professionals and researchers to provide both theoretical knowledge and hands-on experience. Through interactive lessons, students gain practical skills that are essential for today's tech industry.
            </p>
            <br />
            <div className="contact-container">
              <div className="contact-form">
                {formSubmitted ? (
                  <div className="success-message">
                    <h3 style={{color: 'black'}}><Check style={{marginTop: -2}} size={24} /> Registration Successful!</h3>
                    <br />
                    <p>Thank you for enrolling. We will contact you shortly with further details.</p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                      <label htmlFor="name"><User size={16} style={{marginTop: -3}} /> Full Name</label>
                      <input 
                        placeholder='Enter your full name' 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email"><Mail size={16} style={{marginTop: -3}} /> Email</label>
                      <input 
                        placeholder='Enter your email address' 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="course"><CircleDot size={16} style={{marginTop: -3}} /> Select a Course</label>
                      <select 
                        id="course" 
                        name="course" 
                        value={formData.course}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Choose a course</option>
                        <option value="Learn English">Learn English</option>
                        <option value="Machine Learning">Machine Learning</option>
                        <option value="Full Stack Development">Full Stack Development</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="camp"><Pickaxe size={16} style={{marginTop: -3}} /> Select a Builder Camp</label>
                      <select 
                        id="camp" 
                        name="camp" 
                        value={formData.camp}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Choose a camp</option>
                        <option value="Summer">Summer</option>
                        <option value="Winter">Winter</option>
                      </select>
                    </div>
                    {formError && <div className="error-message">{formError}</div>}
                    <button 
                      type="submit" 
                      disabled={formSubmitting}
                    >
                      {formSubmitting ? (
                        'Submitting...'
                      ) : (
                        <><Send size={16} style={{marginTop: -3}} /> Submit Enrollment Form</>
                      )}
                    </button>
                  </form>
                )}
              </div>
              <div className="contact-info">
                {/* <div className="info-itemz">
                  <h3 className='hs-title-10' style={{color: '#4B164C'}}><Award size={46} style={{marginTop: -10}} /> Price: </h3>
                  <p className='hs-title-10' style={{color: '#4B164C', fontSize: 12}}>₹500 x 4 Months </p>
                </div> */}
                <div className="info-item">
                  <h3 style={{color: '#4B164C', fontWeight: 600}}><Timer size={24} style={{marginTop: -5}} /> Working Hours</h3>
                  <p style={{color: '#4B164C', fontSize: 16}}><Check size={16} style={{marginTop: -5}} /> Monday: 9am - 5pm<br /><Check size={16} style={{marginTop: -5}} /> Tuesday: 9am - 5pm<br /><Check size={16} style={{marginTop: -5}} /> Wednesday: 9am - 5pm<br /><Check size={16} style={{marginTop: -5}} /> Thursday: 9am - 5pm<br /><Check size={16} style={{marginTop: -5}} /> Friday: 9am - 5pm<br /><Check size={16} style={{marginTop: -5}} /> Saturday: 9am - 5pm</p>
                </div>
                <div className="info-item">
                  <h3 style={{color: '#4B164C', fontWeight: 600}}><Mail size={16} style={{marginTop: -4}} /> Email</h3>
                  <p style={{color: '#4B164C', fontSize: 16}}>hello@studypoints24.com</p>
                </div>
                <div className="info-item">
                  <h3 style={{color: '#4B164C', fontWeight: 600}}><Ticket size={16} style={{marginTop: -2}} /> Support Ticket</h3>
                  <p style={{color: '#4B164C', fontSize: 16}}>support@studypoints24.com</p>
                </div>
                <div className="info-item">
                  <h3 style={{color: '#4B164C', fontWeight: 600}}><Linkedin size={16} style={{marginTop: -4}} /> Follow us on</h3>
                  <a href="https://www.linkedin.com/company/studypoints24/"><p style={{color: '#4B164C', fontSize: 16}}>@Studypoints24.com</p></a>
                </div>
              </div>
            </div>
          </section>
        )}

        {modalOpen && selectedCourse && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-button" onClick={closeCourseModal}>&times;</span>
              <h2><BookOpen /> {selectedCourse.title}</h2>
              <p className="course-description">Objective: {selectedCourse.description}</p>
              <p className="season-duration">
                {selectedCourse.season === 'Summer' ? <Sun size={18} style={{marginTop: -3}} /> : <Snowflake />}&nbsp; 
                Camp: {selectedCourse.season} Program | <Timer size={18} style={{marginTop: -3}} /> Duration: {selectedCourse.duration} | <Eye size={18} style={{marginTop: -3}} /> Mode: Online
              </p>
              <div className="">
              <button 
                onClick={() => {
                  setActiveTab('contact');
                  closeCourseModal();
                }} 
                className="enroll-button"
              >
                <SendHorizonal size={18} style={{marginTop: -3}} /> Enroll Now
              </button> &nbsp;               
                <button onClick={() => {
                  setActiveTab('contact');
                  closeCourseModal();
                }}  className="enroll-button"><Contact2 size={18} style={{marginTop: -3}} /> Contact us</button>
              </div>
              <br />
              <div className="curriculum">
                <h3 style={{fontSize: 16}}><Layers size={16} /> Course Curriculum</h3>
                <ul style={{fontSize: 14}}>
                  {selectedCourse.curriculum.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="curriculum">
              <h3 style={{marginTop: 0, fontSize: 16}}><Box size={16} style={{marginTop: -3}} /> Real World Project </h3>
              <p style={{marginBottom: 0, fontSize: 14}} className="course-description"><Dot /> {selectedCourse.miniProject}</p>
              </div>
              <div className="course-details">
                <div className="detail-item">
                  <h4><Target size={18} style={{marginTop: -3}} /> Format</h4>
                  <p>Live online sessions with hands-on projects</p>
                </div>
                <div className="detail-item">
                  <h4><ScanEye size={18} style={{marginTop: -3}} /> Prerequisites</h4>
                  <p>Basic programming knowledge, mathematics fundamentals</p>
                </div>
                <div className="detail-item">
                  <h4><Medal size={18} style={{marginTop: -3}} /> Certificate</h4>
                  <p>Earn a certificate upon successful completion</p>
                </div>
              </div>
              <div className="enroll-section">
                <button onClick={() => {
                  setActiveTab('contact');
                  closeCourseModal();
                }}  className="enroll-button"><SendHorizonal size={18} style={{marginTop: -3}} /> Enroll Now</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        /* Global Styles */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        html {
          font-size: 16px;
          scroll-behavior: smooth;
        }
        
        body {
          line-height: 1.6;
          color: #333;
        }
        
        .container {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
        }
        
        a {
          text-decoration: none;
          color: black;
        }
        
        button {
          cursor: pointer;
          background-color: aqua;
          color: black;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          font-weight: 500;
          transition: background-color 0.3s ease;
          font-size: 14px;
        }
        
        button:hover {
          background-color:rgba(186, 205, 255, 0.6)
        }

        .course-toggle {
          display: flex;
          justify-content: center;
          margin: 20px 0;
          gap: 10px;
        }
        
        .toggle-button {
          padding: 10px 20px;
          background-color: white;
          border-radius: 40px;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        
        .toggle-button.active {
          background-color: blue;
          color: white;
          border-color: #4a90e2;
          border-radius: 40px;
        }
        
        .toggle-button:hover:not(.active) {
          background-color: white;
          border-radius: 40px;
        }
        
        
        /* Header Styles */
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 40px;
          background-color: white;
          box-shadow: 0 10px 30px rgba(221, 196, 254, 0.5),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(3px);    
          top: 0;
          z-index: 100;
        }
        
        .logo h1 {
          font-size: 1.8rem;
          color: black;
          font-weight: 700;
        }
        
        nav ul {
          display: flex;
          list-style: none;
        }
        
        nav ul li {
          margin: 0 15px;
        }
        
        nav ul li a {
          color: black;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        
        nav ul li a:hover {
          color: blue;
        }
        
        /* Hero Section */
        .hero {
          display: flex;
          min-height: 500px;
          padding: 60px 40px;
          background: aqua;
        }
        
        .hero-content {
          flex: 1;
          max-width: 600px;
        }
        
        .hero-content h2 {
          font-size: 2.8rem;
          margin-bottom: 20px;
          color: black;
        }
        
        .hero-content p {
          font-size: 1.0rem;
          margin-bottom: 40px;
          color: black;
        }
        
        .season-info {
          display: flex;
          gap: 30px;
          margin-top: 40px;
        }
        
        .season {
          background-color: white;
          padding: 25px;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(194, 156, 245, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(3px);
          flex: 1;
        }
        
        .season h3 {
          font-size: 1.4rem;
          margin-bottom: 10px;
          color: black;
        }
        
        .season p {
          font-size: 1rem;
          margin-bottom: 20px;
          color: black;
        }
        
        .hero-image {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .image-placeholder {
          width: 100%;
          max-width: 360px;
          height: 500px;
          background-color: #dbeafe;
          border-radius: 10px;
           box-shadow: 0 10px 30px rgba(222, 196, 255, 0.5),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(3px);   
          position: relative;
          overflow: hidden;
        }
        
        .image-placeholder::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        /* Course Section */
        .courses {
          padding: 40px 20px; /* Reduced padding for mobile */
          background: aqua;
          margin: 0 auto;
          overflow: hidden; /* Prevent content from extending beyond container */
        }

        .courses h2 {
          font-size: 2.2rem;
          margin-bottom: 30px;
          color: black;
          text-align: center;
        }

        .courses p {
          color: black;
          font-size: 16px;
          text-align: center;
          max-width: 90%; /* Using percentage instead of fixed width */
          margin: -15px auto 25px; /* Simplified margin */
        }

        .course-toggle {
          display: flex;
          justify-content: center;
          flex-wrap: wrap; /* Allow buttons to wrap on small screens */
          gap: 10px;
          margin-bottom: 20px;
        }

        .toggle-button {
          padding: 8px 15px;
          border-radius: 40px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .course-grid {
          padding: 10px;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* Smaller minimum width */
          gap: 20px;
        }

        .course-card {
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(221, 196, 254, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(3px);
          padding: 25px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          width: 100%; /* Ensure cards take full width of their grid cell */
        }

        .course-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }

        .course-card h3 {
          font-size: 1.3rem;
          margin-bottom: 10px;
          color: black;
          word-wrap: break-word; /* Ensure long titles wrap properly */
        }

        .course-card .duration {
          font-size: 0.9rem;
          color: #64748b;
          margin-bottom: 15px;
          text-align: left;
        }

        .course-card p {
          margin-bottom: 20px;
          color: #475569;
          max-width: 100%; /* Reset max-width for card paragraphs */
          text-align: left;
        }

        /* Media Queries for better responsiveness */
        @media (max-width: 768px) {
          .courses h2 {
            font-size: 1.8rem;
          }
          
          .course-grid {
            grid-template-columns: 1fr; /* Single column on very small screens */
            padding: 5px;
          }
          
          .course-card {
            padding: 20px;
          }
        }
        
        /* About Section */
        .about {
          padding: 60px 40px;
          background-color: aqua;
        }
        
        .about h2 {
          font-size: 2.2rem;
          margin-bottom: 40px;
          color: black;
          text-align: center;
        }
        
        .about-content {
          display: flex;
          flex-direction: column;
          gap: 50px;
        }
        
        .about-text p {
          font-size: 1.1rem;
          margin-bottom: 20px;
          color: #475569;
        }
        
        .values {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 30px;
          margin-top: -20px;
        }
        
        .value-item {
          background-color: white;
          padding: 25px;
          border-radius: 12px;
            box-shadow: 0 10px 30px rgba(208, 173, 255, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(8px);   
        }
        
        .value-item h3 {
          font-size: 1.3rem;
          margin-bottom: 15px;
          color: black;
        }
        
        .value-item p {
          color: #475569;
        }
        
        /* Contact Section */
        .contact {
          padding: 60px 40px;
        }
        
        .contact h2 {
          font-size: 2.2rem;
          margin-bottom: 40px;
          color: black;
          text-align: center;
        }
        
        .contact-container {
          display: flex;
          gap: 50px;
        }
        
        .contact-form {
          flex: 1;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: black;
        }
        
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-family: inherit;
          font-size: 1rem;
          background: #bcf2f6;

        }
        
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }
        
        .contact-form button {
          width: 100%;
          padding: 12px;
          font-size: 1rem;
        }
        
        .contact-info {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 30px;
        }
        
        .info-item {
          background-color: #f4f6ff;
          padding: 20px;
          border-radius: 8px;
        }
        
        .info-item h3 {
          font-size: 1.2rem;
          margin-bottom: 10px;
          color: black;
        }
        
        .info-item p {
          color: #475569;
        }

        .info-itemz {
          background-color: aqua;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(198, 173, 255, 0.3),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(2px);  
        }
        
        .info-itemz h3 {
          font-size: 1.2rem;
          margin-bottom: 10px;
          color: black;
        }
        
        .info-itemz p {
          color: #475569;
        }
        
        /* Modal */
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(3px);    
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal-content {
          background-color: white;
          width: 90%;
          max-width: 800px;
          border-radius: 10px;
          padding: 30px;
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
          background-color: rgb(255, 255, 255); /* Darkens the background image */
            box-shadow: 0 10px 30px rgba(200, 161, 252, 0.7),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(3px);     
        }
        
        .close-button {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 24px;
          cursor: pointer;
          color: black;
        }
        
        .modal-content h2 {
          font-size: 1.8rem;
          margin-bottom: 10px;
          color: black;
        }
        
        .season-duration {
          font-size: 1rem;
          color: #2a2a2a;
          margin-bottom: 20px;
        }
        
        .course-description {
          font-size: 1.1rem;
          margin-bottom: 25px;
          color: black;
        }
        
        .curriculum {
          margin-bottom: 20px;
           background-color: white; /* Darkens the background image */
            box-shadow: 0 10px 30px rgba(231, 208, 255, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(3px); 
            padding: 15px;    
            border-radius: 16px;
        }
        
        .curriculum h3 {
          font-size: 1.4rem;
          margin-bottom: 15px;
          color: black;
        }
        
        .curriculum ul {
          list-style-type: disc;
          padding-left: 20px;
        }
        
        .curriculum li {
          margin-bottom: 10px;
          color: #475569;
        }
        
        .course-details {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .detail-item {
          background-color: #F4F6FF;
          padding: 15px;
          border-radius: 16px;
        }
        
        .detail-item h4 {
          font-size: 1.1rem;
          margin-bottom: 8px;
          color: black;
        }
        
        .detail-item p {
          color: #475569;
          font-size: 0.95rem;
        }
        
        .enroll-section {
          text-align: center;
          margin-top: 10px;
        }
        
        .enroll-button {
          padding: 12px 40px;
          font-size: 1.1rem;
          border-radius: 10px;
          width: 100%;
          background: #F4F6FF;
        }
        
        /* Footer */
        footer {
          background-color: #1e293b;
          color: white;
          padding: 60px 40px 20px;
        }
        
        .footer-content {
          display: flex;
          flex-wrap: wrap;
          gap: 50px;
          margin-bottom: 40px;
        }
        
        .footer-logo h2 {
          font-size: 2rem;
          margin-bottom: 10px;
          color: #f0f9ff;
        }
        
        .footer-logo p {
          color: #cbd5e1;
        }
        
        .footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 40px;
        }
        
        .link-column h3 {
          font-size: 1.2rem;
          margin-bottom: 20px;
          color: #f0f9ff;
        }
        
        .link-column ul {
          list-style: none;
        }
        
        .link-column ul li {
          margin-bottom: 10px;
        }
        
        .link-column ul li a {
          color: #cbd5e1;
          transition: color 0.3s ease;
        }
        
        .link-column ul li a:hover {
          color: #f0f9ff;
        }
        
        .footer-newsletter {
          flex: 1;
          min-width: 300px;
        }
        
        .footer-newsletter h3 {
          font-size: 1.2rem;
          margin-bottom: 15px;
          color: #f0f9ff;
        }
        
        .footer-newsletter p {
          margin-bottom: 15px;
          color: #cbd5e1;
        }
        
        .newsletter-form {
          display: flex;
        }
        
        .newsletter-form input {
          flex: 1;
          padding: 10px 15px;
          border: none;
          border-radius: 4px 0 0 4px;
          font-size: 0.95rem;
        }
        
        .newsletter-form button {
          border-radius: 0 4px 4px 0;
          background-color: #2563eb;
        }
        
        .footer-bottom {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #334155;
        }
        
        .footer-bottom p {
          color: #94a3b8;
          font-size: 0.9rem;
        }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero {
            flex-direction: column;
            gap: 40px;
          }
          
          .contact-container {
            flex-direction: column;
          }
          
          .hero-content {
            max-width: 100%;
          }
        }
        
        @media (max-width: 768px) {
          header {
            flex-direction: column;
            padding: 20px;
          }
          
          .logo {
            margin-bottom: 15px;
          }
          
          nav {
            width: 100%;
            margin: 15px 0;
          }
          
          nav ul {
            justify-content: center;
            flex-wrap: wrap;
          }
          
          nav ul li {
            margin: 5px 10px;
          }
          
          .season-info {
            flex-direction: column;
          }
          
          .course-details {
            grid-template-columns: 1fr;
          }
          
          .footer-content {
            flex-direction: column;
            gap: 30px;
          }
          
          .footer-links {
            flex-direction: column;
            gap: 20px;
          }
        }
        
        @media (max-width: 480px) {
          .hero-content h2 {
            font-size: 2rem;
          }
          
          .hero-content p {
            font-size: 1rem;
          }
          
          .courses h2, .about h2, .contact h2 {
            font-size: 1.8rem;
          }
          
          .modal-content {
            padding: 20px;
          }
          
          .newsletter-form {
            flex-direction: column;
          }
          
          .newsletter-form input {
            border-radius: 4px;
            margin-bottom: 10px;
          }
          
          .newsletter-form button {
            border-radius: 4px;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}