'use client';

import { Activity, AlarmClockPlus, Apple, BarChart2, BedDouble, Book, Brain, BrainCog, Calendar, CalendarClock, Clock, Disc2, Edit, Focus, GlassWater, Heart, Home, Info, Layers, MonitorSmartphone, Moon, Music, Music2, Notebook, NotebookPen, NotebookTabs, Pause, Phone, Play, PlusCircle, RotateCcw, Save, Search, Send, SendHorizonal, Settings2, SkipBack, SkipForward, SquareArrowOutUpRight, StepBack, TabletSmartphone, Target, Trash2, Users, Volume2, X, Zap } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

// Main app component
export default function MindTrack() {
  // State management
  const [currentView, setCurrentView] = useState('dashboard');
  const [mood, setMood] = useState(3); // 1-5 scale
  const [stress, setStress] = useState(3); // 1-5 scale
  const [energy, setEnergy] = useState(3); // 1-5 scale
  const [journal, setJournal] = useState('');
  const [studyTime, setStudyTime] = useState(0);
  const [isStudying, setIsStudying] = useState(false);
  const [studyTimer, setStudyTimer] = useState(null);
  const [breakDue, setBreakDue] = useState(false);
  const [entries, setEntries] = useState([]);
  const [insights, setInsights] = useState(null);
  
  // New state variables for additional features
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', dueDate: '', priority: 'medium', completed: false });
  const [assessments, setAssessments] = useState([]);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [assessmentResults, setAssessmentResults] = useState([]);
  const [studyGoals, setStudyGoals] = useState({ daily: 120, weekly: 840 });
  const [studyNotes, setStudyNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ title: '', content: '', tags: [] });
  const [focusMode, setFocusMode] = useState(false);
  const [settings, setSettings] = useState({
    theme: 'light',
    notificationsEnabled: true,
    studySessionLength: 25,
    breakLength: 5
  });

  const [waterIntake, setWaterIntake] = useState(0);
  const maxWaterIntake = 12; // 8 glasses as recommended daily intake

  useEffect(() => {
    const savedIntake = localStorage.getItem('waterIntake');
    if (savedIntake) {
      setWaterIntake(parseInt(savedIntake, 10));
    }
  }, []);
  
  // Save water intake to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('waterIntake', waterIntake.toString());
  }, [waterIntake]);
  
  const addWater = () => {
    if (waterIntake < maxWaterIntake) {
      setWaterIntake(prevIntake => prevIntake + 1);
    }
  };
  
  const resetWater = () => {
    setWaterIntake(0);
  };
  
  const getProgressColor = () => {
    if (waterIntake <= 4) return '#F7CFD8'; // orange for low intake
    if (waterIntake <= 8) return '#60B5FF'; // blue for medium intake
    return '#54a0ff'; // green for good intake
  };
  
  const getHydrationStatus = () => {
    if (waterIntake <= 2) return 'Low hydration';
    if (waterIntake <= 5) return 'Moderate hydration';
    if (waterIntake < 8) return 'Good hydration';
    return 'Excellent hydration!';
  };

  const [logs, setLogs] = useState([]);
  const [currentLog, setCurrentLog] = useState({
    date: new Date().toISOString().substr(0, 10),
    screenTime: '',
    socialTime: '',
    sleepTime: '',
    activities: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({
    avgScreenTime: 0,
    avgSocialTime: 0,
    avgSleepTime: 0,
    optimalScreen: '4 hours',
    optimalSocial: '2 hours',
    optimalSleep: '8 hours',
  });

  useEffect(() => {
    // Load saved logs from localStorage
    const savedLogs = localStorage.getItem('screenTimeLogs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  useEffect(() => {
    // Calculate statistics whenever logs change
    if (logs.length > 0) {
      calculateStats();
    }
    // Save to localStorage
    localStorage.setItem('screenTimeLogs', JSON.stringify(logs));
  }, [logs]);

  const calculateStats = () => {
    const screenTimes = logs.map(log => parseFloat(log.screenTime) || 0);
    const socialTimes = logs.map(log => parseFloat(log.socialTime) || 0);
    const sleepTimes = logs.map(log => parseFloat(log.sleepTime) || 0);

    const avgScreen = screenTimes.reduce((a, b) => a + b, 0) / screenTimes.length;
    const avgSocial = socialTimes.reduce((a, b) => a + b, 0) / socialTimes.length;
    const avgSleep = sleepTimes.reduce((a, b) => a + b, 0) / sleepTimes.length;

    setStats({
      avgScreenTime: avgScreen.toFixed(1),
      avgSocialTime: avgSocial.toFixed(1),
      avgSleepTime: avgSleep.toFixed(1),
      optimalScreen: avgScreen > 6 ? 'Reduce to 4-5 hours' : 'Maintain 4-6 hours',
      optimalSocial: avgSocial < 2 ? 'Increase to 2-3 hours' : 'Good balance',
      optimalSleep: avgSleep < 7 ? 'Increase to 7-8 hours' : 'Good sleep pattern',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLog({
      ...currentLog,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLog = {
      id: Date.now(),
      ...currentLog,
    };
    setLogs([...logs, newLog]);
    setCurrentLog({
      date: new Date().toISOString().substr(0, 10),
      screenTime: '',
      socialTime: '',
      sleepTime: '',
      activities: '',
    });
    setShowForm(false);
  };

  const deleteLog = (id) => {
    setLogs(logs.filter(log => log.id !== id));
  };

  const [musicLibrary, setMusicLibrary] = useState([
    {
      id: 1,
      title: "Daydreams",
      artist: "Purple Cat - Happy Place",
      duration: "3:27",
      soundCloudUrl: "https://zdmueezfheensjrefapy.supabase.co/storage/v1/object/sign/rust-timers/1.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2RlNzVhZmFiLWVkZTEtNGY1MC04YzdiLWY0YmYwNjQ5NmJlZiJ9.eyJ1cmwiOiJydXN0LXRpbWVycy8xLm1wMyIsImlhdCI6MTc0NDgwNzIxNSwiZXhwIjozMzIxNjA3MjE1fQ.IdrCyRYu5LOZ4LLz4u-EqJJB1a8X60N_yV5A0DQpos0",
      isFavorite: false,
      albumArt: "/api/placeholder/60/60"
    },
    {
      id: 2,
      title: "Sonder",
      artist: "Purple Cat - City Nights 2",
      duration: "3:09",
      soundCloudUrl: "https://zdmueezfheensjrefapy.supabase.co/storage/v1/object/sign/rust-timers/2.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2RlNzVhZmFiLWVkZTEtNGY1MC04YzdiLWY0YmYwNjQ5NmJlZiJ9.eyJ1cmwiOiJydXN0LXRpbWVycy8yLm1wMyIsImlhdCI6MTc0NDgwNzU5NiwiZXhwIjozMzIxNjA3NTk2fQ.A_i2-3v_DAo0txRqjBiEfhPczthkjdfVnB3BBOwqXHk",
      isFavorite: false,
      albumArt: "/api/placeholder/60/60"
    },
  ]);

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [searchQuery, setSearchQuery] = useState("");
  
  const audioRef = useRef(null);
  
  // Filter music based on search query
  const filteredMusic = musicLibrary.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle play/pause
  const togglePlay = (track) => {
    if (currentTrack && currentTrack.id === track.id) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      
      if (audioRef.current) {
        audioRef.current.src = track.soundCloudUrl;
        audioRef.current.load();
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error);
        });
        setDuration(convertTimeStringToSeconds(track.duration));
      }
    }
  };

  // Handle favoriting a track
  const toggleFavorite = (id) => {
    setMusicLibrary(prevLibrary => 
      prevLibrary.map(track => 
        track.id === id ? {...track, isFavorite: !track.isFavorite} : track
      )
    );
  };

  // Helper function to convert time string to seconds
  const convertTimeStringToSeconds = (timeString) => {
    const [minutes, seconds] = timeString.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  // Format seconds to mm:ss
  const formatTimes = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle audio events 
  useEffect(() => {
    if (audioRef.current) {
      // Update time
      const updateTime = () => {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
      };
      
      // Handle audio ended event
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      audioRef.current.addEventListener('timeupdate', updateTime);
      audioRef.current.addEventListener('ended', handleEnded);
      
      // Clean up event listeners
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', updateTime);
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, [audioRef.current]);

  // Effect to handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);


  // Assessment types
  const assessmentTemplates = [
    {
      id: 'stress',
      title: 'Stress Assessment',
      description: 'Evaluate your current stress levels and coping mechanisms',
      questions: [
        { id: 1, text: 'How often do you feel overwhelmed by your workload?', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
        { id: 2, text: 'Do you have trouble sleeping due to academic stress?', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
        { id: 3, text: 'How often do you feel physically tense (e.g., headaches, muscle tension)?', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
        { id: 4, text: 'Do you have effective strategies to manage stress?', options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'] },
        { id: 5, text: 'How often do you take breaks during study sessions?', options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'] }
      ]
    },
    {
      id: 'productivity',
      title: 'Productivity Assessment',
      description: 'Analyze your study habits and productivity patterns',
      questions: [
        { id: 1, text: 'How often do you create a study plan before starting work?', options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'] },
        { id: 2, text: 'Do you eliminate distractions while studying?', options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'] },
        { id: 3, text: 'How frequently do you procrastinate on assignments?', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] },
        { id: 4, text: 'Do you use specific techniques to stay focused?', options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'] },
        { id: 5, text: 'How often do you review and reflect on your productivity?', options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'] }
      ]
    },
    {
      id: 'learning',
      title: 'Learning Style Assessment',
      description: 'Discover your preferred learning methods',
      questions: [
        { id: 1, text: 'I learn best when I can see diagrams and visual aids', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
        { id: 2, text: 'I prefer listening to lectures rather than reading materials', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
        { id: 3, text: 'I understand concepts better when I can apply them hands-on', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
        { id: 4, text: 'I enjoy group discussions and collaborative learning', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
        { id: 5, text: 'I prefer to read and take detailed notes', options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] }
      ]
    }
  ];

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('mindtrack-entries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    
    // Generate insights based on saved entries
    if (savedEntries && JSON.parse(savedEntries).length > 0) {
      generateInsights(JSON.parse(savedEntries));
    }
    
    // Load tasks
    const savedTasks = localStorage.getItem('mindtrack-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    
    // Load assessment results
    const savedResults = localStorage.getItem('mindtrack-assessment-results');
    if (savedResults) {
      setAssessmentResults(JSON.parse(savedResults));
    }
    
    // Load study notes
    const savedNotes = localStorage.getItem('mindtrack-notes');
    if (savedNotes) {
      setStudyNotes(JSON.parse(savedNotes));
    }
    
    // Load settings
    const savedSettings = localStorage.getItem('mindtrack-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    // Load study goals
    const savedGoals = localStorage.getItem('mindtrack-goals');
    if (savedGoals) {
      setStudyGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('mindtrack-entries', JSON.stringify(entries));
    }
    
    if (tasks.length > 0) {
      localStorage.setItem('mindtrack-tasks', JSON.stringify(tasks));
    }
    
    if (assessmentResults.length > 0) {
      localStorage.setItem('mindtrack-assessment-results', JSON.stringify(assessmentResults));
    }
    
    if (studyNotes.length > 0) {
      localStorage.setItem('mindtrack-notes', JSON.stringify(studyNotes));
    }
    
    localStorage.setItem('mindtrack-settings', JSON.stringify(settings));
    localStorage.setItem('mindtrack-goals', JSON.stringify(studyGoals));
  }, [entries, tasks, assessmentResults, studyNotes, settings, studyGoals]);

  // Handle study timer
  useEffect(() => {
    if (isStudying) {
      const timer = setInterval(() => {
        setStudyTime(prev => {
          // Check for break time using the user-defined session length (default: 25 min)
          const sessionLengthInSeconds = settings.studySessionLength * 60;
          if ((prev + 1) % sessionLengthInSeconds === 0 && !breakDue) {
            setBreakDue(true);
            showNotification('Time for a break!', `Taking a ${settings.breakLength}-minute break improves focus and productivity.`);
          }
          return prev + 1;
        });
      }, 1000);
      setStudyTimer(timer);
      return () => clearInterval(timer);
    } else if (studyTimer) {
      clearInterval(studyTimer);
      setStudyTimer(null);
    }
  }, [isStudying, settings.studySessionLength, settings.breakLength]);

  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Generate AI insights based on entries
  const generateInsights = (data) => {
    if (!data || data.length < 3) return null;
    
    // Calculate averages
    const lastWeek = data.slice(-7);
    const avgMood = lastWeek.reduce((sum, entry) => sum + entry.mood, 0) / lastWeek.length;
    const avgStress = lastWeek.reduce((sum, entry) => sum + entry.stress, 0) / lastWeek.length;
    const avgEnergy = lastWeek.reduce((sum, entry) => sum + entry.energy, 0) / lastWeek.length;
    const totalStudyTime = lastWeek.reduce((sum, entry) => sum + entry.studyTime, 0);
    
    // Generate personalized insights
    let insight = {
      overallStatus: avgMood > 3 ? 'positive' : 'needs-attention',
      message: '',
      recommendations: []
    };
    
    if (avgMood < 3) {
      insight.message = "Your mood has been lower than usual lately.";
      insight.recommendations.push("Consider reaching out to a friend or counselor.");
    } else if (avgStress > 4) {
      insight.message = "Your stress levels are high this week.";
      insight.recommendations.push("Try some mindfulness exercises between study sessions.");
    } else if (avgEnergy < 2.5) {
      insight.message = "Your energy levels are quite low.";
      insight.recommendations.push("Check your sleep schedule and consider more short breaks.");
    } else {
      insight.message = "You're doing well overall! Keep up the good work.";
      insight.recommendations.push("Try to maintain your current balance of work and rest.");
    }
    
    // Add study time insight
    if (totalStudyTime > 25 * 3600) { // More than 25 hours per week
      insight.recommendations.push("You're studying a lot - make sure to take enough breaks!");
    } else if (totalStudyTime < 10 * 3600) { // Less than 10 hours per week
      insight.recommendations.push("Consider increasing your study time gradually.");
    }
    
    // New: Add insights from assessment results if available
    if (assessmentResults.length > 0) {
      const latestStressResult = assessmentResults.find(r => r.type === 'stress');
      if (latestStressResult && latestStressResult.score > 15) {
        insight.recommendations.push("Your stress assessment indicates high stress levels. Try implementing relaxation techniques like deep breathing or meditation.");
      }
      
      const latestProductivityResult = assessmentResults.find(r => r.type === 'productivity');
      if (latestProductivityResult && latestProductivityResult.score < 10) {
        insight.recommendations.push("Consider using time-blocking techniques to improve your productivity based on your assessment results.");
      }
    }
    
    // New: Add insights based on task completion rates
    if (tasks.length > 0) {
      const completedTasks = tasks.filter(task => task.completed).length;
      const completionRate = completedTasks / tasks.length;
      
      if (completionRate < 0.5) {
        insight.recommendations.push("Try breaking down your tasks into smaller, more manageable steps to improve completion rate.");
      }
    }
    
    setInsights(insight);
  };

  // Save daily entry
  const saveEntry = () => {
    const newEntry = {
      date: new Date().toISOString(),
      mood,
      stress,
      energy,
      journal,
      studyTime
    };
    
    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    generateInsights(updatedEntries);
    
    // Reset form
    setJournal('');
    setStudyTime(0);
    
    // Show confirmation and return to dashboard
    showNotification('Entry saved!', 'Your daily reflection has been recorded.');
    setCurrentView('dashboard');
  };

  // Toggle study mode
  const toggleStudyMode = () => {
    if (isStudying) {
      setIsStudying(false);
      setBreakDue(false);
    } else {
      setIsStudying(true);
      if (focusMode) {
        enableFocusMode();
      }
      showNotification('Study mode activated', 'Focus time begins now. We\'ll remind you to take breaks.');
    }
  };

  // Reset timer
  const resetTimer = () => {
    setStudyTime(0);
    setIsStudying(false);
    setBreakDue(false);
  };

  // Show notification
  const showNotification = (title, message) => {
    if (!settings.notificationsEnabled) return;
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body: message });
        }
      });
    }
    
    // Fallback for browsers without notification support
    const notificationArea = document.getElementById('notification-area');
    if (notificationArea) {
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.innerHTML = `<h6>${title}</h6><p>${message}</p>`;
      notificationArea.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
      }, 5000);
    }
  };

  // Navigation handler
  const navigate = (view) => {
    setCurrentView(view);
    if (focusMode && view !== 'study') {
      disableFocusMode();
    }
  };

  // Task management functions
  const addTask = () => {
    if (!newTask.title) return;
    const taskToAdd = { ...newTask, id: Date.now() };
    setTasks([...tasks, taskToAdd]);
    setNewTask({ title: '', dueDate: '', priority: 'medium', completed: false });
    showNotification('Task added', 'New task has been added to your list.');
  };

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
  };

  // Assessment functions
  const startAssessment = (assessmentId) => {
    const assessment = assessmentTemplates.find(a => a.id === assessmentId);
    setCurrentAssessment({
      ...assessment,
      answers: assessment.questions.map(() => null)
    });
    setCurrentView('take-assessment');
  };

  const updateAssessmentAnswer = (questionIndex, answerIndex) => {
    if (!currentAssessment) return;
    
    const updatedAnswers = [...currentAssessment.answers];
    updatedAnswers[questionIndex] = answerIndex;
    
    setCurrentAssessment({
      ...currentAssessment,
      answers: updatedAnswers
    });
  };

  const completeAssessment = () => {
    if (!currentAssessment) return;
    
    // Calculate score (higher score = more concerning results)
    const score = currentAssessment.answers.reduce((total, answer, index) => {
      // If answer is null, count as middle value
      const value = answer === null ? 2 : answer;
      return total + value;
    }, 0);
    
    // Generate feedback based on score
    let feedback = '';
    if (currentAssessment.id === 'stress') {
      if (score < 10) feedback = "Your stress levels appear to be well-managed.";
      else if (score < 15) feedback = "You're experiencing moderate stress. Consider adding more stress management techniques.";
      else feedback = "Your stress levels are high. Consider speaking with a wellness professional.";
    } else if (currentAssessment.id === 'productivity') {
      if (score < 10) feedback = "You have strong productivity habits!";
      else if (score < 15) feedback = "Your productivity could use some improvement. Try implementing a structured study plan.";
      else feedback = "Consider adopting new productivity techniques to improve your study efficiency.";
    } else if (currentAssessment.id === 'learning') {
      const styles = [
        { name: 'Visual', score: 5 - currentAssessment.answers[0] },
        { name: 'Auditory', score: 5 - currentAssessment.answers[1] },
        { name: 'Kinesthetic', score: 5 - currentAssessment.answers[2] },
        { name: 'Social', score: 5 - currentAssessment.answers[3] },
        { name: 'Solitary', score: 5 - currentAssessment.answers[4] }
      ];
      
      const dominantStyle = styles.sort((a, b) => b.score - a.score)[0];
      feedback = `Your dominant learning style appears to be ${dominantStyle.name}. Consider incorporating more ${dominantStyle.name.toLowerCase()} learning techniques.`;
    }
    
    // Save result
    const result = {
      id: Date.now(),
      date: new Date().toISOString(),
      type: currentAssessment.id,
      score,
      feedback
    };
    
    setAssessmentResults([...assessmentResults, result]);
    setCurrentAssessment(null);
    showNotification('Assessment completed', 'Your results have been saved.');
    setCurrentView('assessments'); 
  };

  // Study notes functions
  const saveNote = () => {
    if (!currentNote.title) return;
    
    const noteToSave = { 
      ...currentNote, 
      id: currentNote.id || Date.now(),
      lastUpdated: new Date().toISOString()
    };
    
    if (currentNote.id) {
      // Update existing note
      const updatedNotes = studyNotes.map(note => 
        note.id === currentNote.id ? noteToSave : note
      );
      setStudyNotes(updatedNotes);
    } else {
      // Add new note
      setStudyNotes([...studyNotes, noteToSave]);
    }
    
    setCurrentNote({ title: '', content: '', tags: [] });
    showNotification('Note saved', 'Your study note has been saved.');
    setCurrentView('notes');
  };

  const editNote = (noteId) => {
    const noteToEdit = studyNotes.find(note => note.id === noteId);
    if (noteToEdit) {
      setCurrentNote(noteToEdit);
      setCurrentView('edit-note');
    }
  };

  const deleteNote = (noteId) => {
    const updatedNotes = studyNotes.filter(note => note.id !== noteId);
    setStudyNotes(updatedNotes);
  };
  
  // Focus mode functions
  const enableFocusMode = () => {
    setFocusMode(true);
    // Could add more actions like disabling notifications, fullscreen, etc.
    document.body.classList.add('focus-mode');
  };
  
  const disableFocusMode = () => {
    setFocusMode(false);
    document.body.classList.remove('focus-mode');
  };
  
  // Update settings
  const updateSettings = (newSettings) => {
    setSettings({ ...settings, ...newSettings });
    showNotification('Settings updated', 'Your preferences have been saved.');
  };
  
  // Update study goals
  const updateStudyGoals = (newGoals) => {
    setStudyGoals({ ...studyGoals, ...newGoals });
    showNotification('Goals updated', 'Your study goals have been updated.');
  };

  // Render current view
  const renderView = () => {
    switch(currentView) {
      case 'check-in':
        return (
          <div className="view check-in-view">
            <h2><Heart style={{marginTop: -4}} fill='lightBlue' color='lightBlue' /> Daily Check-In</h2>
            <div className="mood-tracker">
              <div className="tracker-item">
                <label><Brain size={18} style={{marginTop: -3}} /> Mood</label>
                <div className="slider-container">
                  <span>😞</span>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    value={mood}
                    step="0.1" 
                    onChange={e => setMood(parseFloat(e.target.value))} 
                  />
                  <span>😀</span>
                </div>
              </div>
              
              <div className="tracker-item">
                <label><Activity size={18} style={{marginTop: -3}} /> Stress</label>
                <div className="slider-container">
                  <span>😌</span>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    value={stress} 
                    step="0.1"
                    onChange={e => setStress(parseFloat(e.target.value))} 
                  />
                  <span>😰</span>
                </div>
              </div>
              
              <div className="tracker-item">
                <label><Zap size={18} style={{marginTop: -3}} /> Energy</label>
                <div className="slider-container">
                  <span>😴</span>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    value={energy} 
                    step="0.1"
                    onChange={e => setEnergy(parseFloat(e.target.value))} 
                  />
                  <span>💪</span>
                </div>
              </div>
            </div>
            
            <div className="journal-area">
              <label><Disc2 size={16} style={{marginTop: -2}} /> How are you feeling today?</label>
              <textarea 
                placeholder="How are your studies going, and how have you been feeling emotionally?" 
                value={journal} 
                onChange={e => setJournal(e.target.value)} 
              />
            </div>
            
            <div className="action-buttons">
              <button onClick={() => navigate('dashboard')}><X size={16} style={{marginTop: -2}} /> Cancel</button>
              <button className="primary" onClick={saveEntry}><Save size={16} style={{marginTop: -2}} /> Save Entry</button>
            </div>
            <style jsx>{`
              /* General Styles */

              .view {
                max-width: 950px;
                padding: 25px;
                background-color: #ffffff;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px); 
              }

              h2 {
                color: black;
                margin-bottom: 25px;
                font-weight: 600;
                font-size: 24px;
                border-bottom: 2px solid #ebf0f5;
                padding-bottom: 12px;
              }

              /* Mood Tracker Styles */
              .mood-tracker {
                margin-bottom: 28px;
              }

              .tracker-item {
                margin-bottom: 20px;
                background-color: aqua;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 5px rgba(140, 128, 255, 0.03);
              }

              .tracker-item label {
                display: block;
                margin-bottom: 10px;
                color: #a6264c;
                font-weight: 500;
                font-size: 16px;
              }

              .slider-container {
                display: flex;
                align-items: center;
                gap: 15px;
              }

              .slider-container span {
                font-size: 18px;
              }

              /* Improved Range Input Styling */
              input[type="range"] {
                flex: 1;
                height: 6px;
                appearance: none;
                background: linear-gradient(to right, #4facfe, #00f2fe);
                border-radius: 10px;
                outline: none;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                margin: 0 10px;
              }

              /* Thumb styles - the draggable button */
              input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                background: white;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
                border: 2px solid #4facfe;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
              }

              input[type="range"]::-moz-range-thumb {
                width: 18px;
                height: 18px;
                background: white;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
                border: 2px solid #4facfe;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
              }

              /* Hover state */
              input[type="range"]::-webkit-slider-thumb:hover {
                transform: scale(1.15);
                box-shadow: 0 0 8px rgba(79, 172, 254, 0.5);
              }

              input[type="range"]::-moz-range-thumb:hover {
                transform: scale(1.15);
                box-shadow: 0 0 8px rgba(79, 172, 254, 0.5);
              }

              /* Active state */
              input[type="range"]::-webkit-slider-thumb:active {
                transform: scale(1.1);
                background: #f0f9ff;
              }

              input[type="range"]::-moz-range-thumb:active {
                transform: scale(1.1);
                background: #f0f9ff;
              }

              /* Focus state */
              input[type="range"]:focus {
                box-shadow: 0 0 0 2px rgba(79, 172, 254, 0.2);
              }

              /* Track color for different mood types */
              input[type="range"].mood-slider {
                background: linear-gradient(to right, #ff6b6b, #ffdd59, #1dd1a1);
              }

              input[type="range"].stress-slider {
                background: linear-gradient(to right, #1dd1a1, #feca57, #ff6b6b);
              }

              input[type="range"].energy-slider {
                background: linear-gradient(to right, #ff9ff3, #feca57, #48dbfb);
              }

              /* Custom track styling for Firefox */
              input[type="range"]::-moz-range-track {
                height: 6px;
                border-radius: 10px;
              }

              /* Journal Area Styles */
              .journal-area {
                margin-bottom: 25px;
              }

              .journal-area label {
                display: block;
                margin-bottom: 10px;
                color: #a6264c;
                font-weight: 500;
                font-size: 16px;
              }

              textarea {
                width: 100%;
                min-height: 180px;
                padding: 15px;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                resize: vertical;
                font-size: 15px;
                color: #a6264c;
                transition: border-color 0.3s ease, box-shadow 0.3s ease;
              }

              textarea:focus {
                border-color: #4299e1;
                box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
                outline: none;
              }

              textarea::placeholder {
                color: #a0aec0;
              }

              /* Button Styles */
              .action-buttons {
                display: flex;
                justify-content: flex-end;
                gap: 15px;
              }

              button {
                padding: 10px 20px;
                border-radius: 6px;
                font-size: 15px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                border: none;
              }

              button:first-child {
                background-color: white;
                color: #a6264c;
              }

              button:first-child:hover {
                background-color: #cbd5e0;
              }

              button.primary {
                background-color: aqua;
                color: black;
              }

              button.primary:hover {
                background-color: #a6264c;
                color: white;
                transform: translateY(-1px);
              }

              button:active {
                transform: translateY(1px);
              }

              /* Responsive Design */
              @media (max-width: 768px) {
                .view {
                  margin: 10px;
                  padding: 20px;
                }
                
                .action-buttons {
                  flex-direction: column;
                }
                
                button {
                  width: 100%;
                }
              }
            `}</style>
          </div>
        );
      
      case 'study':
        return (
          <div className="view study-view">
            <h2><Book style={{marginTop: -4}} fill='aqua' /> Study Session</h2>
            <div className="timer-display">
              <div className="time">{formatTime(studyTime)}</div>
              <div className="status">{isStudying ? 'Studying' : 'Paused'}</div>
              {breakDue && <div className="break-alert">Break time! Stand up and stretch for {settings.breakLength} minutes.</div>}
            </div>
            
            <div className="action-buttons">
              <button onClick={toggleStudyMode} className={isStudying ? 'secondary' : 'primary'}>
                {isStudying ? <Pause />  : <Play />}
              </button>
              <button onClick={resetTimer} className="secondary">Reset Timer</button>
              {/* <button onClick={() => setFocusMode(!focusMode)} className={focusMode ? 'active' : 'secondary'}>
                {focusMode ? 'Exit Focus Mode' : 'Enable Focus Mode'}
              </button> */}
            </div>
            
            <div className="study-progress">
              <h3><Calendar size={16} style={{marginTop: -2}} /> Today's Progress</h3>
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{width: `${Math.min((studyTime / 60) / studyGoals.daily * 100, 100)}%`}}
                ></div>
              </div>
              <div className="progress-text">
                {Math.floor(studyTime / 60)} / {studyGoals.daily} minutes
              </div>
            </div>
            
            <div className="focus-panel">
              <h3><Disc2 size={16} style={{marginTop: -2}} /> Focus Tips</h3>
              <ul>
                <li>Study for {settings.studySessionLength} minutes, then take a {settings.breakLength}-minute break</li>
                <li>Put your phone in another room</li>
                <li>Try the "SMART" goal method for assignments</li>
                <li>Create a distraction-free environment</li>
              </ul>
            </div>
            <style jsx>{`
              /* Base styles */
              .view.study-view {
                max-width: 950px;
                padding: 20px;
                background-color: white;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px);     
              }

              h2 {
                color: #a6264c;
                margin-bottom: 25px;
                font-weight: 600;
                font-size: 24px;
                border-bottom: 2px solid #ebf0f5;
                padding-bottom: 12px;
              }

              h3 {
                color: #475569;
                font-size: 18px;
                margin-bottom: 12px;
                font-weight: 500;
              }

              /* Timer display */
              .timer-display {
                background-color: aqua;
                border-radius: 8px;
                padding: 24px;
                margin-bottom: 24px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                text-align: center;
                transition: all 0.3s ease;
              }

              .timer-display .time {
                font-size: 48px;
                font-weight: 700;
                color: #a6264c;
                margin-bottom: 8px;
              }

              .timer-display .status {
                font-size: 18px;
                color: #a6264c;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 1px;
              }

              .break-alert {
                background-color: #dbeafe;
                color: #1e40af;
                border-radius: 6px;
                padding: 12px;
                margin-top: 16px;
                font-weight: 500;
                animation: pulse 2s infinite;
              }

              @keyframes pulse {
                0% { opacity: 0.8; }
                50% { opacity: 1; }
                100% { opacity: 0.8; }
              }

              /* Action buttons */
              .action-buttons {
                display: flex;
                gap: 12px;
                margin-bottom: 24px;
              }

              button {
                padding: 12px 20px;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                border: none;
                font-size: 15px;
              }

              button.primary {
                background-color: aqua;
                color: black;
                border-radius: 6px;
              }

              button.primary:hover {
                background-color: #fbfbfb;
              }

              button.secondary {
                background-color: #f1f5f9;
                color: #475569;
                border: 1px solid #e2e8f0;
              }

              button.secondary:hover {
                background-color: #e2e8f0;
              }

              button.active {
                background-color: #166534;
                color: white;
              }

              button.active:hover {
                background-color: #14532d;
              }

              /* Progress section */
              .study-progress {
                background-color: aqua;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 24px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
              }

              .progress-bar {
                height: 12px;
                background-color: white;
                border-radius: 6px;
                overflow: hidden;
                margin-bottom: 8px;
              }

              .progress {
                height: 100%;
                background-color: #3b82f6;
                transition: width 0.8s ease-in-out;
              }

              .progress-text {
                font-size: 14px;
                color: #64748b;
                text-align: right;
              }

              /* Focus panel */
              .focus-panel {
                background-color: aqua;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
              }

              .focus-panel ul {
                list-style-type: none;
                padding: 0;
                margin: 0;
              }

              .focus-panel li {
                padding: 8px 0;
                color: #475569;
                border-bottom: 1px solid #f1f5f9;
                position: relative;
                padding-left: 24px;
              }

              .focus-panel li:last-child {
                border-bottom: none;
              }

              .focus-panel li:before {
                content: "•";
                color: #3b82f6;
                font-weight: bold;
                position: absolute;
                left: 0;
              }

              /* Responsive adjustments */
              @media (max-width: 768px) {
                .action-buttons {
                  flex-direction: column;
                }
                
                .timer-display .time {
                  font-size: 36px;
                }
              }
            `}</style>
          </div>
        );
      
      case 'insights':
        return (
          <div className="view insights-view">
            <h2><Activity style={{marginTop: -2}} /> Weekly Insights</h2>
            
            {entries.length < 3 ? (
              <div className="no-data">
                <p>Not enough data yet! Add at least 3 daily entries to see insights.</p>
              </div>
            ) : (
              <div className="insights-container">
                <div className={`insight-card ${insights?.overallStatus}`}>
                  <h3><Calendar size={16} style={{marginTop: -4}} /> Weekly Summary</h3>
                  <h4><Brain size={16} style={{marginTop: -4}} /> Recommendations:</h4>
                  <ul>
                    {insights?.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                  <br />
                  <h4><BrainCog size={16} style={{marginTop: -4}} /> Cognitive Insights:</h4>
                  <p>{insights?.message}</p>
                  
                </div>
                
                <div className="charts-container">
                  <div className="chart-card">
                    <h4><Brain size={16} style={{marginTop: -2}} /> Mood Trends</h4>
                    <div className="chart-visual">
                      <div className="bar-chart">
                        {entries.slice(-7).map((entry, i) => (
                          <div key={i} className="bar-container">
                            <div 
                              className="bar" 
                              style={{height: `${entry.mood * 20}%`}}
                              title={`Day ${i+1}: ${entry.mood}/5`}
                            />
                            <div className="bar-label">{i+1}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="chart-card">
                    <h4><AlarmClockPlus size={16} style={{marginTop: -2}} /> Study Time (Past Week)</h4>
                    <div className="chart-visual">
                      <div className="bar-chart">
                        {entries.slice(-7).map((entry, i) => (
                          <div key={i} className="bar-container">
                            <div 
                              className="bar study-bar" 
                              style={{height: `${Math.min(entry.studyTime / 3600 * 10, 100)}%`}}
                              title={`Day ${i+1}: ${Math.floor(entry.studyTime / 3600)}h ${Math.floor((entry.studyTime % 3600) / 60)}m`}
                            />
                            <div className="bar-label">{i+1}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {assessmentResults.length > 0 && (
                  <div className="assessment-insights">
                    <h3 style={{color: '#a6264c'}}><Brain size={16} style={{marginTop: -3}} /> Assessment Insights</h3>
                    <div className="assessment-cards">
                      {assessmentResults.slice(-3).map((result, index) => (
                        <div key={index} className="assessment-result-card">
                          <h4 style={{color: '#a6264c'}}><Disc2 size={16} style={{marginTop: -3}} /> {assessmentTemplates.find(a => a.id === result.type)?.title}</h4>
                          <p className="result-date"><Calendar size={16} style={{marginTop: -3}} /> {new Date(result.date).toLocaleDateString()}</p>
                          <p>{result.feedback}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="action-buttons">
              <button onClick={() => navigate('dashboard')} className="secondary"><StepBack size={16} style={{marginTop: -4}} /> Back to Dashboard</button>
            </div>
            <style jsx>{`
              .view {
                max-width: 950px;
                padding: 20px;
                background-color: #fbfbfb;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px); 
              }

              h2 {
                color: black;
                margin-bottom: 25px;
                font-weight: 600;
                font-size: 24px;
                border-bottom: 2px dotted aqua;
                padding-bottom: 12px;
              }

              h3 {
                color: black;
                font-size: 18px;
                margin-bottom: 12px;
                font-weight: 500;
              }

              h4 {
                color: #34495e;
                margin-bottom: 0.8rem;
                font-size: 1.1rem;
              }

              p {
                margin-bottom: 1rem;
                color: #555;
              }

              /* No Data Message */
              .no-data {
                background-color: #fff;
                border-radius: 8px;
                padding: 2rem;
                text-align: center;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px); 
                margin: 2rem 0;
              }

              .no-data p {
                color: #7f8c8d;
                font-size: 1.1rem;
              }

              /* Insights Container */
              .insights-container {
                display: grid;
                grid-template-columns: 1fr;
                gap: 1.5rem;
              }

              /* Insight Card */
              .insight-card {
                background-color: #fff;
                border-radius: 8px;
                padding: 1.5rem;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px); 
                transition: transform 0.3s ease, box-shadow 0.3s ease;
              }

              .insight-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px); 
              }

              .insight-card h3 {
                border-bottom: 1px solid #eee;
                padding-bottom: 0.8rem;
                margin-bottom: 1rem;
              }

              .insight-card ul {
                list-style-position: inside;
                margin-bottom: 1rem;
              }

              .insight-card li {
                margin-bottom: 0.5rem;
                color: #555;
              }

              /* Status Colors */
              .insight-card.good {
                border-left: 30px solid #27ae60;
              }

              .insight-card.average {
                border-left: 30px solid #f39c12;
              }

              .insight-card.poor {
                border-left: 30px solid #e74c3c;
              }

              /* Charts Container */
              .charts-container {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1.5rem;
                margin-bottom: 1.5rem;
              }

              .chart-card {
                background-color: #fff;
                border-radius: 8px;
                padding: 1.5rem;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px); 
                transition: transform 0.3s ease;
              }

              .chart-card:hover {
                transform: translateY(-3px);
              }

              /* Chart Visuals */
              .chart-visual {
                height: 200px;
                margin-top: 1rem;
              }

              .bar-chart {
                display: flex;
                align-items: flex-end;
                justify-content: space-around;
                height: 100%;
                padding-bottom: 1.5rem;
              }

              .bar-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 12%;
              }

              .bar {
                width: 100%;
                background-color: #3498db;
                border-radius: 3px 3px 0 0;
                transition: height 0.5s ease;
              }

              .study-bar {
                background-color: #9b59b6;
              }

              .bar-label {
                margin-top: 0.5rem;
                font-size: 0.8rem;
                color: #7f8c8d;
              }

              /* Assessment Insights */
              .assessment-insights {
                background-color: #fff;
                border-radius: 8px;
                padding: 1.5rem;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
                margin-top: 1rem;
              }

              .assessment-cards {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
                margin-top: 1rem;
              }

              .assessment-result-card {
                background-color: white;
                border-radius: 6px;
                padding: 1rem;
                border-left: 30px solid aqua;
                transition: transform 0.3s ease;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px);
              }

              .assessment-result-card:hover {
                transform: translateY(-3px);
              }

              .result-date {
                font-size: 0.8rem;
                color: #a6264c;
                margin-bottom: 0.8rem;
              }

              /* Action Buttons */
              .action-buttons {
                margin-top: 2rem;
                display: flex;
                justify-content: flex-end;
              }

              button {
                padding: 0.6rem 1.2rem;
                border-radius: 6px;
                border: none;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.3s ease, transform 0.2s ease;
              }

              button:hover {
                transform: translateY(-2px);
              }

              button.secondary {
                background-color: aqua;
                color: black;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px);    
              }

              button.secondary:hover {
                background-color: lightBlue;
              }

              /* Responsive Design */
              @media (max-width: 768px) {
                .charts-container {
                  grid-template-columns: 1fr;
                }
                
                .assessment-cards {
                  grid-template-columns: 1fr;
                }
                
                .view {
                  padding: 1rem;
                }
              }

              @media (max-width: 480px) {
                .bar-container {
                  width: 10%;
                }
              }
            `}</style>
          </div>
        );
      
      case 'tasks':
        return (
          <div className="view tasks-view">
            <h2><Layers style={{marginTop: -2}} /> Task Manager</h2>
            
            <div className="tasks-container">
              <div className="add-task-form">
                <input 
                  type="text" 
                  placeholder="Task title" 
                  value={newTask.title} 
                  onChange={e => setNewTask({...newTask, title: e.target.value})} 
                />
                <input 
                  type="date" 
                  value={newTask.dueDate} 
                  onChange={e => setNewTask({...newTask, dueDate: e.target.value})} 
                />
                <select 
                  value={newTask.priority} 
                  onChange={e => setNewTask({...newTask, priority: e.target.value})}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <button onClick={addTask} className="primary"><PlusCircle size={20} /></button>
              </div>
              
              <div className="task-list">
                <h3>Your Tasks</h3>
                
                {tasks.length === 0 ? (
                  <div className="no-tasks">
                    <p>No tasks yet. Add some tasks to stay organized!</p>
                  </div>
                ) : (
                  <>
                    <div className="task-group">
                      <h4>To Do</h4>
                      {tasks.filter(task => !task.completed).map(task => (
                        <div key={task.id} className={`task-item priority-${task.priority}`}>
                          <div className="task-checkbox">
                            <input 
                              type="checkbox" 
                              checked={task.completed} 
                              onChange={() => toggleTaskCompletion(task.id)} 
                            />
                          </div>
                          <div className="task-content">
                            <div className="task-title">{task.title}</div>
                            {task.dueDate && (
                              <div className="task-due-date">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                            )}
                          </div>
                          <button className="delete-task" onClick={() => deleteTask(task.id)}>×</button>
                        </div>
                      ))}
                    </div>
                    
                    {tasks.some(task => task.completed) && (
                      <div className="task-group completed">
                        <h4>Completed</h4>
                        <div className="completed-tasks">
                          {tasks.filter(task => task.completed).map(task => (
                            <div key={task.id} className="task-item completed">
                              <div className="task-checkbox">
                                <input 
                                  type="checkbox" 
                                  checked={task.completed} 
                                  onChange={() => toggleTaskCompletion(task.id)} 
                                />
                              </div>
                              <div className="task-content">
                                <div className="task-title">{task.title}</div>
                              </div>
                              <button className="delete-task" onClick={() => deleteTask(task.id)}>×</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <div className="action-buttons">
              <button onClick={() => navigate('dashboard')} className="secondary"><StepBack size={16} style={{marginTop: -2}} /> Back to Dashboard</button>
            </div>
            <style jsx>{`
              /* General Layout */
              .view.tasks-view {
                max-width: 950px;
                padding: 24px;
                color: #333;
                background-color: white;           
              }

              .tasks-view h2 {
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 24px;
                color: black;
                border-bottom: 2px solid aqua;
                padding-bottom: 12px;
              }

              .tasks-container {
                display: flex;
                flex-direction: column;
                gap: 24px;
              }

              /* Add Task Form */
              .add-task-form {
                display: flex;
                gap: 12px;
                padding: 16px;
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px);       
                margin-bottom: 16px;
                flex-wrap: wrap;
              }

              .add-task-form input, 
              .add-task-form select {
                flex: 1;
                padding: 10px 12px;
                border: 1px solid #dce1e8;
                border-radius: 4px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s ease, box-shadow 0.2s ease;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px);       
              }

              .add-task-form input:focus, 
              .add-task-form select:focus {
                border-color: #5b9bd5;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px);       
              }

              .add-task-form input[type="date"] {
                min-width: 140px;
              }

              .add-task-form select {
                cursor: pointer;
                min-width: 140px;
              }

              /* Buttons */
              button {
                cursor: pointer;
                font-weight: 500;
                border-radius: 4px;
                transition: background-color 0.2s ease, transform 0.1s ease;
                white-space: nowrap;
              }

              button:active {
                transform: translateY(1px);
              }

              button.primary {
                background-color: aqua;
                color: black;
                border: none;
                padding: 9px 16px;
              }

              button.primary:hover {
                background-color: #4a8cc5;
              }

              button.secondary {
                background-color: white;
                color: #456;
                border: 1px solid #dce1e8;
                border-radius: 20px;
                padding: 8px 16px;
              }

              button.secondary:hover {
                background-color: #e4ebf2;
              }

              /* Task List */
              .task-list {
                background-color: #fff;
                border-radius: 6px;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px);       
                overflow: hidden;
              }

              .task-list h3 {
                padding: 16px;
                margin: 0;
                background-color: #f8fafd;
                border-bottom: 1px solid #e1e8f0;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px);       
                font-size: 18px;
                font-weight: 600;
                color: #a6264c;
              }

              .task-group {
                padding: 16px;
              }

              .task-group h4 {
                color: #5b6b7c;
                font-size: 16px;
                font-weight: 500;
                margin-bottom: 12px;
                margin-top: 0;
              }

              .no-tasks {
                padding: 32px 16px;
                text-align: center;
                color: #7a8899;
                font-style: italic;
              }

              /* Task Items */
              .task-item {
                display: flex;
                align-items: center;
                padding: 12px;
                border-radius: 4px;
                margin-bottom: 8px;
                background-color: aqua;
                transition: background-color 0.2s ease, transform 0.1s ease;
              }

              .task-item:hover {
                background-color: aqua;
                transform: translateX(2px);
              }

              .task-checkbox {
                margin-right: 12px;
                display: inline-block;
              }

              .task-checkbox input[type="checkbox"] {
                appearance: none;
                -webkit-appearance: none;
                width: 18px;
                height: 18px;
                cursor: pointer;
                border: 2px solid #e2e8f0;
                border-radius: 4px;
                background-color: white;
                vertical-align: middle;
                position: relative;
                transition: all 0.2s ease;
                outline: none;
              }

              /* Hover state */
              .task-checkbox input[type="checkbox"]:hover {
                border-color: #4facfe;
                box-shadow: 0 0 0 2px rgba(79, 172, 254, 0.1);
              }

              /* Focus state for accessibility */
              .task-checkbox input[type="checkbox"]:focus {
                border-color: #4facfe;
                box-shadow: 0 0 0 2px rgba(79, 172, 254, 0.2);
              }

              /* Checked state */
              .task-checkbox input[type="checkbox"]:checked {
                background-color: #4facfe;
                border-color: #4facfe;
              }

              /* Creating the checkmark */
              .task-checkbox input[type="checkbox"]:checked::after {
                content: '';
                position: absolute;
                left: 5px;
                top: 1px;
                width: 5px;
                height: 10px;
                border: solid white;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
              }

              /* Animation for checking */
              .task-checkbox input[type="checkbox"]:checked {
                animation: checkbox-pop 0.3s;
              }

              @keyframes checkbox-pop {
                0% {
                  transform: scale(0.8);
                }
                50% {
                  transform: scale(1.1);
                }
                100% {
                  transform: scale(1);
                }
              }

              /* For Firefox */
              .task-checkbox input[type="checkbox"]::-moz-focus-inner {
                border: 0;
              }

              .task-content {
                flex: 1;
              }

              .task-title {
                font-weight: 500;
                margin-bottom: 4px;
              }

              .task-due-date {
                font-size: 12px;
                color: #7a8899;
              }

              .delete-task {
                background: none;
                border: none;
                color: black;
                font-size: 20px;
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
              }

              .delete-task:hover {
                background-color: #feeaea;
                color: #e05252;
              }

              /* Priority Colors */
              .priority-high {
                border-left: 30px solid #B2A5FF;
              }

              .priority-medium {
                border-left: 30px solid #A1E3F9;
              }

              .priority-low {
                border-left: 30px solid #5bc0de;
              }

              /* Completed Tasks */
              .task-group.completed {
                border-top: 1px solid #e1e8f0;
                margin-top: 16px;
                padding-top: 16px;
              }

              .task-item.completed {
                opacity: 0.7;
                background-color: #f8fafd;
              }

              .task-item.completed .task-title {
                text-decoration: line-through;
                color: #7a8899;
              }

              /* Action Buttons */
              .action-buttons {
                margin-top: 24px;
                display: flex;
                justify-content: flex-end;
              }

              /* Responsive Design */
              @media (max-width: 768px) {
                .add-task-form {
                  flex-direction: column;
                }

                .add-task-form input,
                .add-task-form select,
                .add-task-form button {
                  width: 100%;
                }
                
                .task-item {
                  flex-wrap: wrap;
                }
              }
            `}</style>
          </div>
        );
      
      case 'assessments':
        return (
          <div className="view assessments-view">
            <h2 style={{color: '#a6264c'}}><Brain style={{marginTop: -2}} /> Assessments</h2>
            
            <div className="assessments-list">
              {assessmentTemplates.map(assessment => (
                <div key={assessment.id} className="assessment-card">
                  <h3><Disc2 size={16} style={{marginTop: -3}} /> {assessment.title}</h3>
                  <p>{assessment.description}</p>
                  <p className="question-count">{assessment.questions.length} questions</p>
                  <button onClick={() => startAssessment(assessment.id)} className="primary"><BrainCog size={16} style={{marginTop: -2}} /> Take Assessment</button>
                </div>
              ))}
            </div>
            
            {assessmentResults.length > 0 && (
              <div className="assessment-history">
                <h3>Your Assessment History</h3>
                <div className="results-list">
                  {assessmentResults.slice().reverse().map((result, index) => (
                    <div key={index} className="result-item">
                      <div className="result-title">
                        {assessmentTemplates.find(a => a.id === result.type)?.title}
                      </div>
                      <div className="result-date">
                        {new Date(result.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="action-buttons">
              <button onClick={() => navigate('dashboard')} className="secondary"><StepBack size={16} style={{marginTop: -2}} /> Back to Dashboard</button>
            </div>
            <style jsx>{`
                .view.assessments-view {
                  max-width: 950px;
                  background-color: white;
                  padding: 24px;
                }

                /* Typography */
                h2 {
                  color: #a6264c;
                  margin-bottom: 24px;
                  font-size: 28px;
                  font-weight: 500;
                }

                h3 {
                  color: #a6264c;
                  font-size: 20px;
                  margin-bottom: 12px;
                  font-weight: 500;
                }

                p {
                  color: #a6264c;
                  margin-bottom: 12px;
                }

                .question-count {
                  color: #7f8c8d;
                  font-size: 14px;
                }

                /* Assessment cards */
                .assessments-list {
                  display: grid;
                  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
                  gap: 24px;
                  margin-bottom: 32px;
                }

                .assessment-card {
                  background-color: #fbfbfb;
                  border-radius: 10px;
                  padding: 24px;
                  border: 1px dotted lightBlue; 
                  transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .assessment-card:hover {
                  transform: translateY(-4px);
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
                }

                /* Assessment history */
                .assessment-history {
                  background-color: #ffffff;
                  border-radius: 8px;
                  padding: 24px;
                  margin-bottom: 32px;
                  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
                }

                .results-list {
                  margin-top: 16px;
                }

                .result-item {
                  display: flex;
                  justify-content: space-between;
                  padding: 16px 0;
                  border-bottom: 1px solid #ecf0f1;
                }

                .result-item:last-child {
                  border-bottom: none;
                }

                .result-title {
                  font-weight: 500;
                  color: #a6264c;
                }

                .result-date {
                  color: #7f8c8d;
                }

                /* Buttons */
                button {
                  padding: 10px 16px;
                  border-radius: 20px;
                  font-size: 14px;
                  font-weight: 500;
                  cursor: pointer;
                  transition: background-color 0.2s ease, transform 0.1s ease;
                  border: none;
                  display: inline-flex;
                  align-items: center;
                  gap: 8px;
                }

                button.primary {
                  background-color: white;
                  color: black;
                  margin-top: 16px;
                  box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1);
                  backdrop-filter: blur(6px);             
                }

                button.primary:hover {
                  background-color: lightBlue;
                }

                button.secondary {
                  background-color: aqua;
                  color: #34495e;
                }

                button.secondary:hover {
                  background-color: lightBlue;
                }

                button:active {
                  transform: scale(0.98);
                }

                .action-buttons {
                  display: flex;
                  justify-content: flex-start;
                }

                /* Responsive adjustments */
                @media (max-width: 768px) {
                  .assessments-list {
                    grid-template-columns: 1fr;
                  }
                  
                  .view.assessments-view {
                    padding: 16px;
                  }
                }
            `}</style>
          </div>
        );
      
      case 'take-assessment':
        return (
          <div className="view take-assessment-view">
            <h2><Brain style={{marginTop: -3}} /> {currentAssessment?.title}</h2>
            <p className="assessment-description">{currentAssessment?.description}</p>
            
            <div className="questions-list">
              {currentAssessment?.questions.map((question, qIndex) => (
                <div key={question.id} className="question-item">
                  <div className="question-text"><Disc2 size={16} style={{marginTop: -2}} />  {question.text}</div>
                  <div className="options-list">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="option-item">
                        <input 
                          type="radio" 
                          id={`q${qIndex}_o${oIndex}`}
                          name={`question_${qIndex}`}
                          checked={currentAssessment.answers[qIndex] === oIndex}
                          onChange={() => updateAssessmentAnswer(qIndex, oIndex)}
                        />
                        <label htmlFor={`q${qIndex}_o${oIndex}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="action-buttons">
              <button onClick={() => setCurrentAssessment(null)} className="secondary"><X size={16} style={{marginTop: -3}} /> Cancel</button>
              <button 
                className="primary" 
                onClick={completeAssessment}
                disabled={currentAssessment?.answers.some(answer => answer === null)}
              >
                <SendHorizonal size={16} style={{marginTop: -3}} /> Complete Assessment
              </button>
            </div>
            <style jsx>{`
              /* General Styles */
              .view {
                max-width: 950px;
                padding: 2rem;
                background-color: white;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px); 
              }

              .take-assessment-view {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
              }

              /* Header Styles */
              h2 {
                color: #a6264c;
                margin-bottom: 0.5rem;
                font-weight: 600;
                font-size: 24px;
              }

              .assessment-description {
                color: #a6264c;
                margin-bottom: 1.5rem;
                font-size: 1rem;
                max-width: 800px;
              }

              /* Questions List */
              .questions-list {
                display: flex;
                flex-direction: column;
                gap: 2rem;
              }

              .question-item {
                background-color: white;
                border-radius: 20px;
                padding: 1.5rem;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px); 
                transition: box-shadow 0.3s ease;
              }

              .question-item:hover {
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px); 
              }

              .question-text {
                font-weight: 500;
                font-size: 1.1rem;
                color: #a6264c;
                margin-bottom: 1rem;
              }

              /* Options List */
              .options-list {
                display: flex;
                flex-direction: column;
                gap: 0.8rem;
                margin-left: 0.5rem;
              }

              .option-item {
                display: flex;
                align-items: center;
                padding: 0.7rem;
                border-radius: 4px;
                transition: background-color 0.2s ease;
              }

              .option-item:hover {
                background-color: #f0f5ff;
                border-radius: 20px;
              }

              /* Custom Radio Buttons */
              .option-item input[type="radio"] {
                appearance: none;
                width: 20px;
                height: 20px;
                border: 2px solid #c0d0e4;
                border-radius: 50%;
                margin-right: 12px;
                position: relative;
                transition: all 0.2s ease;
              }

              .option-item input[type="radio"]:checked {
                border-color: #3b82f6;
                background-color: #fff;
              }

              .option-item input[type="radio"]:checked::after {
                content: "";
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #3b82f6;
              }

              .option-item label {
                font-size: 1rem;
                color: #a6264c;
                cursor: pointer;
                transition: color 0.2s ease;
              }

              .option-item:hover label {
                color: #2d3748;
              }

              /* Action Buttons */
              .action-buttons {
                display: flex;
                justify-content: flex-end;
                margin-top: 2rem;
                gap: 1rem;
              }

              button {
                padding: 0.7rem 1.5rem;
                font-size: 1rem;
                border-radius: 40px;
                cursor: pointer;
                transition: all 0.2s ease;
                font-weight: 500;
                border: none;
              }

              button.primary {
                background-color: #fbfbfb;
                color: black;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px);  
              }

              button.primary:hover {
                background-color: white;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px); 
              }

              button.primary:disabled {
                background-color: #FFEDFA;
                color: silver;
                cursor: not-allowed;
              }

              button.secondary {
                background-color: lightBlue;
                color: #4b5563;
                border: 1px solid #e5e7eb;
              }

              button.secondary:hover {
                background-color: #f3f4f6;
              }

              /* Responsive Adjustments */
              @media (max-width: 768px) {
                .view {
                  padding: 1.5rem;
                }
                
                .question-item {
                  padding: 1.2rem;
                }
                
                .action-buttons {
                  flex-direction: column-reverse;
                  width: 100%;
                }
                
                button {
                  width: 100%;
                }
              }
            `}</style>
          </div>
        );
      
      case 'notes':
        return (
          <div className="view notes-view">
            <h2><Notebook style={{marginTop: -4}} /> Study Notes</h2>
            
            <div className="action-buttons top-buttons">
              <button className="primary" onClick={() => {
                setCurrentNote({ title: '', content: '', tags: [] });
                setCurrentView('edit-note');
              }}>
                <PlusCircle size={16} style={{marginTop: -2}} /> Create New Note
              </button>

              <div className="">
                <button onClick={() => navigate('dashboard')} className="secondary"><StepBack size={16} style={{marginTop: -2}} /> Back to Dashboard</button>
              </div>
            </div>
            
            
            {studyNotes.length === 0 ? (
              <div className="no-notes">
                <p>No study notes yet. Create your first note to start organizing your learning!</p>
              </div>
            ) : (
              <div className="notes-grid">
                {studyNotes.map(note => (
                  <div key={note.id} className="note-card">
                    <div className="note-header">
                      <h3>{note.title}</h3>
                      <div className="note-actions">
                        <button onClick={() => editNote(note.id)}><Edit size={16} style={{marginTop: -2}} /></button>
                        <button onClick={() => deleteNote(note.id)}><Trash2 size={16} style={{marginTop: -2}} /></button>
                      </div>
                    </div>
                    <div className="note-preview">
                      {note.content.length > 150 ? note.content.substring(0, 150) + '...' : note.content}
                    </div>
                    {note.tags.length > 0 && (
                      <div className="note-tags">
                        {note.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="note-date">
                      Last updated: {new Date(note.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* <div className="action-buttons">
              <button onClick={() => navigate('dashboard')} className="secondary"><StepBack size={16} style={{marginTop: -2}} /> Back to Dashboard</button>
            </div> */}

            <style jsx>{`
                /* Main view styling */
              .view.notes-view {
                max-width: 950px;
                padding: 20px;
                background-color: white;
                min-height: 100vh;
              }

              /* Header styling */
              .notes-view h2 {
                color: black;
                margin-bottom: 24px;
                font-size: 24px;
                font-weight: 600;
                border-bottom: 2px solid aqua;
                padding-bottom: 10px;
              }

              /* Action buttons */
              .action-buttons {
                display: flex;
                margin: 20px 0;
                justify-content: flex-end;
              }

              .top-buttons {
                justify-content: flex-start;
                margin-bottom: 30px;
              }

              .action-buttons button {
                padding: 10px 18px;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.25s ease;
                margin-left: 12px;
                border: none;
                font-size: 14px;
              }

              .action-buttons button.primary {
                background-color: aqua;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px);  
                color: black;
              }

              .action-buttons button.primary:hover {
                background-color: #fbfbfb;
                color: black;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px);  
              }

              .action-buttons button.secondary {
                background-color: aqua;
                color: black;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px); 

              }

              .action-buttons button.secondary:hover {
                background-color: lightBlue;
              }

              /* Empty state */
              .no-notes {
                text-align: center;
                margin: 50px 0;
                padding: 40px;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px); 
              }

              .no-notes p {
                color: #7f8c8d;
                font-size: 16px;
              }

              /* Notes grid */
              .notes-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: 24px;
                margin-top: 20px;
              }

              /* Note card styling */
              .note-card {
                background-color: white;
                border-radius: 20px;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px); 
                padding: 20px;
                display: flex;
                flex-direction: column;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
              }

              .note-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
              }

              .note-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 12px;
              }

              .note-header h3 {
                color: #a6264c;
                margin: 0;
                font-size: 18px;
                flex-grow: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .note-actions {
                display: flex;
                gap: 8px;
              }

              .note-actions button {
                background: none;
                border: none;
                font-size: 13px;
                color: #7f8c8d;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                transition: background-color 0.2s ease, color 0.2s ease;
              }

              .note-actions button:hover {
                background-color: #f0f0f0;
                color: #a6264c;
              }

              .note-preview {
                color: #34495e;
                font-size: 14px;
                line-height: 1.6;
                margin-bottom: 15px;
                flex-grow: 1;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
              }

              /* Tags styling */
              .note-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 12px;
              }

              .tag {
                background-color: #e8f4fc;
                color: #3498db;
                font-size: 12px;
                padding: 4px 10px;
                border-radius: 16px;
                display: inline-block;
                transition: background-color 0.2s ease;
              }

              .tag:hover {
                background-color: #d6eaf8;
              }

              /* Date styling */
              .note-date {
                font-size: 12px;
                color: #95a5a6;
                margin-top: auto;
                padding-top: 8px;
                border-top: 1px solid #ecf0f1;
              }

              /* Responsive adjustments */
              @media (max-width: 768px) {
                .notes-grid {
                  grid-template-columns: 1fr;
                }
                
                .note-header {
                  flex-direction: column;
                }
                
                .note-actions {
                  margin-top: 10px;
                }
                
                .action-buttons {
                  flex-direction: column;
                }
                
                .action-buttons button {
                  margin-left: 0;
                  margin-bottom: 10px;
                  width: 100%;
                }
              }
            `}</style>
          </div>
        );
      
      case 'edit-note':
        return (
          <div className="view edit-note-view">
            <h2><NotebookTabs style={{marginTop: -4}} /> {currentNote.id ? 'Edit Note' : 'Create Note'}</h2>
            
            <div className="note-form">
              <div className="form-group">
                <label><Notebook size={16} style={{marginTop: -2}} /> Title</label>
                <input 
                  type="text" 
                  value={currentNote.title}
                  onChange={e => setCurrentNote({...currentNote, title: e.target.value})}
                  placeholder="Note title"
                />
              </div>
              
              <div className="form-group">
                <label><Layers size={16} style={{marginTop: -2}} /> Content</label>
                <textarea 
                  value={currentNote.content}
                  onChange={e => setCurrentNote({...currentNote, content: e.target.value})}
                  placeholder="Write your study notes here..."
                  rows={10}
                />
              </div>
              
              <div className="form-group">
                <label><NotebookPen size={16} style={{marginTop: -2}} /> Tags (comma separated)</label>
                <input 
                  type="text" 
                  value={currentNote.tags.join(', ')}
                  onChange={e => setCurrentNote({
                    ...currentNote, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  })}
                  placeholder="math, biology, chapter 5"
                />
              </div>
            </div>
            
            <div className="action-buttons">
              <button onClick={() => navigate('notes')} className="secondary"><X size={16} style={{marginTop: -2}} /> Cancel</button>
              <button className="primary" onClick={saveNote}><Save size={16} style={{marginTop: -2}} /> Save Note</button>
            </div>
            <style jsx>{`
              /* Overall Layout */
              .view {
                max-width: 950px;
                padding: 24px;
                background-color: white;
     
                color: #333c4d;
              }

              .edit-note-view {
                display: flex;
                flex-direction: column;
                gap: 24px;
              }

              h2 {
                margin: 0 0 16px 0;
                font-size: 24px;
                font-weight: 600;
                color: #a6264c;
                border-bottom: 2px solid #e5e9f0;
                padding-bottom: 12px;
              }

              /* Form Elements */
              .note-form {
                display: flex;
                flex-direction: column;
                gap: 20px;
              }

              .form-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
              }

              label {
                font-size: 14px;
                font-weight: 500;
                color: #a6264c;
              }

              input, textarea {
                padding: 12px 16px;
                border: 1px solid #dfe3e8;
                border-radius: 20px;
                font-size: 15px;
                color: #333c4d;
                background-color: #fbfbfb;
                transition: border-color 0.2s ease, box-shadow 0.2s ease;
              }

              input:focus, textarea:focus {
                outline: none;
                border-color: #7b9ed8;
                box-shadow: 0 0 0 3px rgba(123, 158, 216, 0.2);
              }

              textarea {
                resize: vertical;
                min-height: 120px;
              }

              /* Button Styles */
              .action-buttons {
                display: flex;
                justify-content: flex-end;
                gap: 16px;
                margin-top: 8px;
              }

              button {
                padding: 10px 20px;
                border-radius: 40px;
                font-size: 15px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                border: none;
                min-width: 100px;
              }

              button.primary {
                background-color: aqua;
                color: black;

              }

              button.primary:hover {
                background-color: lightBlue;

              }

              button.secondary {
                background-color: #f5f7fa;
                color: #a6264c;
              }

              button.secondary:hover {
                background-color: #d8dee9;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }

              /* Responsive Design */
              @media (max-width: 768px) {
                .view {
                  padding: 16px;
                  border-radius: 6px;
                }
                
                h2 {
                  font-size: 20px;
                }
                
                .action-buttons {
                  flex-direction: column;
                }
                
                button {
                  width: 100%;
                }
              }
            `}</style>
          </div>
        );
      
      case 'settings':
        return (
          <div className="view settings-view">
            <h2>Settings</h2>
            
            <div className="settings-container">
              <div className="settings-section">
                <h3>Study Settings</h3>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Study Session Length (minutes)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="60" 
                      value={settings.studySessionLength}
                      onChange={e => updateSettings({studySessionLength: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Break Length (minutes)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="30" 
                      value={settings.breakLength}
                      onChange={e => updateSettings({breakLength: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="settings-section">
                <h3>App Settings</h3>
                <div className="settings-form">
                  <div className="form-group checkbox">
                    <input 
                      type="checkbox" 
                      id="notifications" 
                      checked={settings.notificationsEnabled}
                      onChange={e => updateSettings({notificationsEnabled: e.target.checked})}
                    />
                    <label htmlFor="notifications">Enable Notifications</label>
                  </div>
                  
                  <div className="form-group">
                    <label>Theme</label>
                    <select 
                      value={settings.theme}
                      onChange={e => updateSettings({theme: e.target.value})}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="settings-section">
                <h3>Study Goals</h3>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Daily Study Goal (minutes)</label>
                    <input 
                      type="number" 
                      min="10" 
                      value={studyGoals.daily}
                      onChange={e => updateStudyGoals({daily: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Weekly Study Goal (minutes)</label>
                    <input 
                      type="number" 
                      min="60" 
                      value={studyGoals.weekly}
                      onChange={e => updateStudyGoals({weekly: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="action-buttons">
              <button onClick={() => navigate('dashboard')} className="secondary">Back to Dashboard</button>
            </div>
          </div>
        );

        case 'food':
          return(
            <div className="food-intake-view">
              <h2><Apple color='red' style={{marginTop: -4}} /> Brain-Boosting Nutrition Guide</h2>

              <section className="food-category hydration">
                <div className="category-header">
                  <h3>Hydration Matters!</h3>
                </div>
                <div className="hydration-content">
                  <ul>
                    <li>Even mild dehydration reduces focus and memory.</li>
                    <li>Add <strong>lemon, mint, or cucumber</strong> to make water more refreshing.</li>
                  </ul>
                  
                  {/* Water intake tracker */}
                  <div className="water-tracker">
                    <h4>Today's Water Intake</h4>
                    <div className="tracker-container">
                      <div className="progress-stats">
                        <div className="glasses-count">
                          <span>{waterIntake}</span>/{maxWaterIntake} glasses
                        </div>
                        <div className="hydration-status" style={{ color: getProgressColor() }}>
                          {getHydrationStatus()}
                        </div>
                      </div>
                      
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar" 
                          style={{ 
                            width: `${(waterIntake / maxWaterIntake) * 100}%`,
                            backgroundColor: getProgressColor()
                          }}
                        ></div>
                      </div>
                      
                      <div className="water-actions">
                        <button 
                          className="add-water-btn" 
                          onClick={addWater}
                          disabled={waterIntake >= maxWaterIntake}
                        >
                          <GlassWater size={16} style={{marginTop: -4}} /> Add Glass of Water
                        </button>
                        <button 
                          className="reset-btn" 
                          onClick={resetWater}
                        >
                          <RotateCcw size={14} style={{marginTop: -4}} /> Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="food-category">
                <div className="category-header">
                  <h3 style={{fontWeight: 500}}> <BrainCog size={20} style={{marginTop: -2}} />&nbsp;For Stress & Anxiety Relief</h3>
                  <p className="category-description">These foods calm the nervous system and reduce cortisol levels (stress hormone).</p>
                </div>
                
                <div className="foods-grid">
                  <div className="food-card">
                    <h4>Chamomile Tea</h4>
                    <ul>
                      <li>Natural <strong>anti-anxiety</strong> herb that calms the nervous system.</li>
                    </ul>
                  </div>
                  
                  <div className="food-card">
                    <h4>Avocados</h4>
                    <ul>
                      <li>High in <strong>healthy fats and B-vitamins</strong>, which are crucial for neurotransmitter balance and anxiety control.</li>
                    </ul>
                  </div>
                  
                  <div className="food-card">
                    <h4>Oats</h4>
                    <ul>
                      <li>A complex carb that slowly releases glucose, keeping mood stable and reducing irritability.</li>
                    </ul>
                  </div>
                  
                  <div className="food-card">
                    <h4>Yogurt or Probiotics</h4>
                    <ul>
                      <li>Gut health = brain health. Probiotics reduce stress and increase GABA production (a calming neurotransmitter).</li>
                    </ul>
                  </div>
                  
                  <div className="food-card">
                    <h4>Bananas</h4>
                    <ul>
                      <li>Contains <strong>tryptophan</strong>, which helps produce serotonin (mood stabilizer).</li>
                      <li>Also provides quick energy and magnesium for relaxation.</li>
                    </ul>
                  </div>
                </div>
              </section>
              
              <section className="food-category">
                <div className="category-header">
                  <h3 style={{fontWeight: 500}}><Brain size={20} style={{marginTop: -2}} />&nbsp; For Focus & Concentration</h3>
                  <p className="category-description">These foods help improve attention span, memory, and cognitive clarity.</p>
                </div>
                
                <div className="foods-grid">
                  <div className="food-card">
                    <h4>Fatty Fish</h4>
                    <p className="examples">(Salmon, Sardines, Mackerel)</p>
                    <ul>
                      <li>High in <strong>Omega-3 fatty acids</strong>, essential for brain health.</li>
                      <li>Helps in building brain cell membranes and improving communication between neurons.</li>
                    </ul>
                  </div>
                  
                  <div className="food-card">
                    <h4>Eggs</h4>
                    <ul>
                      <li>Contains <strong>choline</strong>, which is key for memory and brain development.</li>
                      <li>Also packed with B vitamins for mental energy.</li>
                    </ul>
                  </div>
                  
                  <div className="food-card">
                    <h4>Blueberries</h4>
                    <ul>
                      <li>Rich in <strong>antioxidants</strong>, which protect the brain from oxidative stress.</li>
                      <li>Improve memory and concentration.</li>
                    </ul>
                  </div>
                  
                  <div className="food-card">
                    <h4>Dark Chocolate (70%+)</h4>
                    <ul>
                      <li>Boosts mood and mental energy with <strong>flavonoids and small amounts of caffeine</strong>.</li>
                    </ul>
                  </div>
                  
                  <div className="food-card">
                    <h4>Pumpkin Seeds</h4>
                    <ul>
                      <li>Loaded with <strong>magnesium, iron, zinc</strong>, and <strong>copper</strong> — all of which support better neural activity and mental sharpness.</li>
                    </ul>
                  </div>
                </div>
              </section>
              
              <section className="food-category">
                <div className="category-header">
                  <h3 style={{fontWeight: 500}}><Activity size={20} style={{marginTop: -2}} />&nbsp; For Depression or Low Mood</h3>
                  <p className="category-description">These support serotonin and dopamine levels—neurotransmitters that influence happiness.</p>
                </div>
                
                <div className="foods-grid">
                  <div className="food-card">
                    <h4>Leafy Greens</h4>
                    <p className="examples">(Spinach, Kale)</p>
                    <ul>
                      <li>High in <strong>folate</strong>, which supports dopamine production.</li>
                    </ul>
                  </div>
                  
                  <div className="food-card">
                    <h4>Nuts</h4>
                    <p className="examples">(especially Walnuts and Almonds)</p>
                    <ul>
                      <li>Good sources of <strong>omega-3s and selenium</strong> that boost brain function and mood.</li>
                    </ul>
                  </div>
                  
                  <div className="food-card">
                    <h4>Dark Berries</h4>
                    <p className="examples">(Strawberries, Blackberries)</p>
                    <ul>
                      <li>Their <strong>antioxidants</strong> reduce inflammation, which is linked to depression.</li>
                    </ul>
                  </div>
                  
                  <div className="food-card">
                    <h4>Turmeric</h4>
                    <p className="examples">(with black pepper)</p>
                    <ul>
                      <li>Contains <strong>curcumin</strong>, which has antidepressant effects and boosts serotonin.</li>
                    </ul>
                  </div>
                  
                  <div className="food-card">
                    <h4>Sweet Potatoes</h4>
                    <ul>
                      <li>Stabilizes blood sugar, preventing mood swings.</li>
                      <li>High in <strong>vitamin B6</strong>, important for neurotransmitter synthesis.</li>
                    </ul>
                  </div>
                </div>
              </section>
              

              <style jsx>{`
                .food-intake-view {
                  max-width: 950px;
                  padding: 30px;
                  background-color: white;
                  min-height: 100vh;
                }

                h2 {
                  color: #a6264c;
                  margin-bottom: 30px;
                  font-size: 24px;
                  font-weight: 600;
                  border-bottom: 2px dotted aqua;
                  padding-bottom: 12px;
                }

                .food-category {
                  margin-bottom: 40px;
                  background-color: aqua;
                  border-radius: 12px;
                  padding: 25px;
                  box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1);
                  backdrop-filter: blur(6px);   
                }

                .category-header {
                  margin-bottom: 20px;
                }

                .category-header h3 {
                  color: #2980b9;
                  font-size: 22px;
                  margin: 0 0 10px 0;
                  display: flex;
                  align-items: center;
                }

                .food-category:nth-child(3) .category-header h3 {
                  color: #3498db;
                }

                .food-category:nth-child(4) .category-header h3 {
                  color: #60B5FF;
                }

                .food-category:nth-child(5) .category-header h3 {
                  color: #2980b9;
                }

                .category-description {
                  color: #a6264c;
                  font-size: 14px;
                  margin: 0;
                }

                .foods-grid {
                  display: grid;
                  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                  gap: 20px;
                }

                .food-card {
                  background-color: white;
                  border-radius: 10px;
                  padding: 20px;
                  box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1);
                  backdrop-filter: blur(6px);   
                  transition: transform 0.2s ease, box-shadow 0.2s ease;
                  border-left: 20px solid #3498db;
                }

                .food-card:hover {
                  transform: translateY(-3px);
                  box-shadow: 0 6px 18px rgba(189, 195, 199, 0.5);
                }

                .food-category:nth-child(3) .food-card {
                  border-left-color: #3498db;
                }

                .food-category:nth-child(4) .food-card {
                  border-left-color: #60B5FF;
                }

                .food-category:nth-child(5) .food-card {
                  border-left-color: #2980b9;
                }

                .food-card h4 {
                  color: #34495e;
                  margin: 0 0 8px 0;
                  font-size: 18px;
                  font-weight: 600;
                }

                .examples {
                  color: #7f8c8d;
                  font-size: 14px;
                  font-style: italic;
                  margin: 0 0 10px 0;
                }

                ul {
                  padding-left: 20px;
                  margin: 10px 0 0 0;
                }

                li {
                  color: #a6264c;
                  margin-bottom: 6px;
                  line-height: 1.5;
                  font-size: 15px;
                }

                strong {
                  color: #2980b9;
                  font-weight: 600;
                }

                .hydration {
                  background-color: aqua;
                  box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1);
                  backdrop-filter: blur(6px);  
                }

                .hydration-content {
                  padding: 10px 20px;
                  background-color: white;
                  border-radius: 8px;
                  box-shadow: 0 4px 12px rgba(189, 195, 199, 0.3);
                }

                .hydration .category-header h3 {
                  display: flex;
                  align-items: center;
                }

                .hydration .category-header h3:before {
                  content: "💧";
                  margin-right: 10px;
                  font-size: 22px;
                }
                  
                /* Water tracker styles */
                .water-tracker {
                  margin-top: 25px;
                  border-top: 1px solid #e1e8ed;
                  padding-top: 20px;
                  margin-bottom: 20px;
                }
                
                .water-tracker h4 {
                  color: #2980b9;
                  margin: 0 0 15px 0;
                  font-size: 18px;
                  font-weight: 600;
                }
                
                .tracker-container {
                  background-color: aqua;
                  border-radius: 10px;
                  padding: 20px;
                  box-shadow: 0 4px 15px rgba(220, 227, 230, 0.5);
                }
                
                .progress-stats {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 12px;
                  align-items: center;
                }
                
                .glasses-count {
                  font-size: 16px;
                  color: #34495e;
                  font-weight: 500;
                }
                
                .glasses-count span {
                  font-size: 20px;
                  font-weight: 600;
                }
                
                .hydration-status {
                  font-size: 16px;
                  font-weight: 600;
                }
                
                .progress-bar-container {
                  height: 16px;
                  background-color: white;
                  border-radius: 8px;
                  overflow: hidden;
                  margin-bottom: 20px;
                }
                
                .progress-bar {
                  height: 100%;
                  border-radius: 8px;
                  transition: width 0.3s ease, background-color 0.3s ease;
                }
                
                .water-actions {
                  display: flex;
                  gap: 15px;
                  margin-top: 15px;
                }
                
                .water-actions button {
                  padding: 10px 18px;
                  border-radius: 8px;
                  font-weight: 500;
                  cursor: pointer;
                  transition: all 0.25s ease;
                  border: none;
                  font-size: 14px;
                }
                
                .add-water-btn {
                  background-color: #A1E3F9;
                  color: black;
                  flex-grow: 1;
                }
                
                .add-water-btn:hover {
                  background-color: white;
                }
                
                .add-water-btn:disabled {
                  background-color: lightBlue;
                  cursor: not-allowed;
                }
                
                .reset-btn {
                  background-color: lightBlue;
                  color: #7f8c8d;
                }
                
                .reset-btn:hover {
                  background-color: #dde4e6;
                  color: #34495e;
                }

                /* Responsive adjustments */
                @media (max-width: 768px) {
                  .food-intake-view {
                    padding: 20px;
                  }
                  
                  .foods-grid {
                    grid-template-columns: 1fr;
                  }
                  
                  h2 {
                    font-size: 24px;
                  }
                  
                  .category-header h3 {
                    font-size: 20px;
                  }
                  
                  .water-actions {
                    flex-direction: column;
                  }
                  
                  .progress-stats {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;
                  }
                }
                
              `}</style>
            </div>
        );

        case 'music':
          return(
            <div className="view music-library-view">
              <h2><Music size={20} className="icon" /> Study Music Library</h2>
              
              <div className="search-bar">
                {/* <Search size={18} className="search-icon" /> */}
                <input 
                  type="text" 
                  placeholder="Search by title or artist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="music-container">
                <div className="music-list">
                  <div className="list-header">
                    <span className="header-title">Title</span>
                    <span className="header-artist">Artist</span>
                    <span className="header-duration"><Clock size={16} /></span>
                    <span className="header-favorite"></span>
                  </div>
                  
                  {filteredMusic.map(track => (
                    <div 
                      key={track.id} 
                      className={`music-item ${currentTrack && currentTrack.id === track.id ? 'active' : ''}`}
                      onClick={() => togglePlay(track)}
                    >
                      <div className="item-play">
                        {currentTrack && currentTrack.id === track.id && isPlaying ? 
                          <Pause size={16} className="icon" /> : 
                          <Play size={16} className="icon" />
                        }
                      </div>
                      <div style={{fontSize:14}}><Music2 size={14} className="album-art" /> MP3</div>
                      <div className="item-title">{track.title}</div>
                      <div className="item-artist">{track.artist}</div>
                      <div className="item-duration">{track.duration}</div>
                      <div 
                        className="item-favorite" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(track.id);
                        }}
                      >
                        <Heart 
                          size={16} 
                          className={`icon ${track.isFavorite ? 'favorite' : ''}`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {currentTrack && (
                <div className="player-bar">
                  <div className="now-playing">
                    <img src={currentTrack.albumArt} alt="Album Art" className="playing-album-art" />
                    <div className="track-info">
                      <div className="playing-title">{currentTrack.title}</div>
                      <div className="playing-artist">{currentTrack.artist}</div>
                    </div>
                  </div>
                  
                  <div className="player-controls">
                    <div className="control-buttons">
                      <button 
                        className="control-button"
                        onClick={() => {
                          // Find the index of the current track
                          const currentIndex = musicLibrary.findIndex(track => track.id === currentTrack.id);
                          // Get previous track, or wrap to the end of the playlist
                          const prevIndex = currentIndex > 0 ? currentIndex - 1 : musicLibrary.length - 1;
                          // Play the previous track
                          togglePlay(musicLibrary[prevIndex]);
                        }}
                      >
                        <SkipBack size={20} className="icon" />
                      </button>
                      <button 
                      className="control-button play-button" 
                      onClick={() => {
                        if (isPlaying) {
                          audioRef.current.pause();
                        } else {
                          audioRef.current.play().catch(error => {
                            console.error("Audio playback failed:", error);
                          });
                        }
                        setIsPlaying(!isPlaying);
                      }}
                    >
                      {isPlaying ? <Pause size={20} className="icon" /> : <Play size={20} className="icon" />}
                    </button>
                    <button 
                      className="control-button"
                      onClick={() => {
                        // Find the index of the current track
                        const currentIndex = musicLibrary.findIndex(track => track.id === currentTrack.id);
                        // Get next track, or wrap to the beginning of the playlist
                        const nextIndex = currentIndex < musicLibrary.length - 1 ? currentIndex + 1 : 0;
                        // Play the next track
                        togglePlay(musicLibrary[nextIndex]);
                      }}
                    >
                      <SkipForward size={20} className="icon" />
                    </button>
                    </div>
                    
                    <div className="progress-container">
                      <span className="time current">{formatTimes(currentTime)}</span>
                      <div 
                        className="progress-bar"
                        onClick={(e) => {
                          // Calculate click position as percentage of the bar width
                          const progressBar = e.currentTarget;
                          const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
                          const percentageClicked = clickPosition / progressBar.offsetWidth;
                          
                          // Calculate the time to seek to based on percentage and duration
                          const seekTime = percentageClicked * duration;
                          
                          // Set the audio to that time
                          if (audioRef.current) {
                            audioRef.current.currentTime = seekTime;
                            setCurrentTime(seekTime);
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <div 
                          className="progress" 
                          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="time total">{currentTrack.duration}</span>
                    </div>
                  </div>
                  
                  <div className="volume-control">
                    <Volume2 size={18} className="icon" />
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={volume} 
                      onChange={(e) => setVolume(parseInt(e.target.value))}
                      className="volume-slider"
                    />
                  </div>
                </div>
              )}
              
              {/* Hidden audio element to handle actual playback */}
              <audio ref={audioRef} />
              
              <style jsx>{`
                /* Overall Layout */
                .view {
                  max-width: 950px;
                  padding: 24px;
                  background-color: white;
                  color: #333c4d;
                }

                .music-library-view {
                  display: flex;
                  flex-direction: column;
                  gap: 24px;
                }

                h2 {
                  margin: 0 0 16px 0;
                  font-size: 24px;
                  font-weight: 600;
                  color: #2c3e50;
                  border-bottom: 2px solid #e5e9f0;
                  padding-bottom: 12px;
                  display: flex;
                  align-items: center;
                  gap: 10px;
                }

                .icon {
                  vertical-align: middle;
                }

                /* Search Bar */
                .search-bar {
                  position: relative;
                  max-width: 500px;
                }

                .search-icon {
                  position: absolute;
                  left: 16px;
                  top: 50%;
                  transform: translateY(-50%);
                  color: #7b8a9a;
                }

                .search-bar input {
                  padding: 12px 16px 12px 44px;
                  border: 1px solid #dfe3e8;
                  border-radius: 40px;
                  font-size: 15px;
                  width: 100%;
                  color: #333c4d;
                  background-color: #f9fafc;
                }

                .search-bar input:focus {
                  outline: none;
                  border-color: #7b9ed8;
                  box-shadow: 0 0 0 3px rgba(123, 158, 216, 0.2);
                }

                /* Music List */
                .music-container {
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                  background-color: white;
                }

                .music-list {
                  width: 100%;
                }

                .list-header {
                  display: grid;
                  grid-template-columns: 40px 60px 3fr 2fr 1fr 40px;
                  padding: 12px 16px;
                  background-color: #f0f4f8;
                  color: #64748b;
                  font-weight: 500;
                  font-size: 14px;
                  border-bottom: 1px solid #e5e9f0;
                }

                .music-item {
                  display: grid;
                  grid-template-columns: 40px 60px 3fr 2fr 1fr 40px;
                  align-items: center;
                  padding: 12px 16px;
                  border-bottom: 1px solid #f0f4f8;
                  cursor: pointer;
                  transition: background-color 0.2s;
                }

                .music-item:hover {
                  background-color: #f9fafc;
                }

                .music-item.active {
                  background-color: #eef2ff;
                }

                .item-play {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  color: #64748b;
                }

                .album-art {
                  width: 40px;
                  height: 40px;
                  border-radius: 4px;
                  object-fit: cover;
                }

                .item-title {
                  font-weight: 500;
                  color: #334155;
                  padding-left: 16px;
                }

                .item-artist {
                  color: #64748b;
                }

                .item-duration {
                  color: #64748b;
                  text-align: center;
                }

                .item-favorite {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  color: #64748b;
                }

                .icon.favorite {
                  fill: #e11d48;
                  color: #e11d48;
                }

                /* Player Bar */
                .player-bar {
                  position: fixed;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  background-color: #f8fafc;
                  border-top: 1px solid #e2e8f0;
                  padding: 12px 24px;
                  display: grid;
                  grid-template-columns: 1fr 2fr 1fr;
                  align-items: center;
                  height: 100px;
                }

                .now-playing {
                  display: flex;
                  align-items: center;
                  gap: 16px;
                }

                .playing-album-art {
                  width: 56px;
                  height: 56px;
                  border-radius: 8px;
                  object-fit: cover;
                }

                .track-info {
                  display: flex;
                  flex-direction: column;
                  gap: 4px;
                }

                .playing-title {
                  font-weight: 500;
                  color: #334155;
                  font-size: 16px;
                }

                .playing-artist {
                  color: #64748b;
                  font-size: 14px;
                }

                .player-controls {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 8px;
                }

                .control-buttons {
                  display: flex;
                  align-items: center;
                  gap: 16px;
                }

                .control-button {
                  background: none;
                  border: none;
                  cursor: pointer;
                  color: #475569;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  transition: color 0.2s;
                }

                .control-button:hover {
                  color: #1e293b;
                }

                .play-button {
                  background-color: lightBlue;
                  color: black;
                  border-radius: 50%;
                  width: 40px;
                  height: 40px;
                }

                .play-button:hover {
                  background-color: #2563eb;
                  color: white;
                }

                .progress-container {
                  display: flex;
                  align-items: center;
                  width: 100%;
                  gap: 12px;
                }

                .time {
                  font-size: 12px;
                  color: #64748b;
                  width: 40px;
                }

                .time.current {
                  text-align: right;
                }

                .progress-bar {
                  flex-grow: 1;
                  height: 4px;
                  background-color: #e2e8f0;
                  border-radius: 2px;
                  overflow: hidden;
                }

                .progress {
                  height: 100%;
                  background-color: #3b82f6;
                }

                .volume-control {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  justify-content: flex-end;
                }

                .volume-slider {
                  width: 100px;
                  height: 4px;
                  -webkit-appearance: none;
                  appearance: none;
                  background-color: #e2e8f0;
                  border-radius: 2px;
                  outline: none;
                }

                .volume-slider::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  background-color: #3b82f6;
                  cursor: pointer;
                }

                /* Responsive Design */
                @media (max-width: 1024px) {
                  .player-bar {
                    grid-template-columns: 1fr;
                    height: auto;
                    gap: 16px;
                    padding: 16px;
                  }

                  .now-playing, .player-controls, .volume-control {
                    justify-content: center;
                  }

                  .volume-control {
                    display: none;
                  }
                }

                @media (max-width: 768px) {
                  .list-header {
                    grid-template-columns: 40px 60px 3fr 40px;
                  }
                  
                  .music-item {
                    grid-template-columns: 40px 60px 3fr 40px;
                  }
                  
                  .item-artist, .item-duration, .header-artist, .header-duration {
                    display: none;
                  }
                }
              `}</style>
            </div>
        )
        
      default: // dashboard
        return (
          <div className="view dashboard-view">
            
            
            <div className="dashboard-grid">
              <div className="dashboard-column main-column">
              <div style={{backgroundColor: 'aqua'}} className="dashboard-panel quick-check">
                  <h3 style={{color: 'black'}}>How are you feeling today?</h3>
                  <div className="quick-mood-buttons">
                    <button onClick={() => { setMood(1); navigate('check-in'); }}>😞</button>
                    <button onClick={() => { setMood(2); navigate('check-in'); }}>😔</button>
                    <button onClick={() => { setMood(3); navigate('check-in'); }}>😐</button>
                    <button onClick={() => { setMood(4); navigate('check-in'); }}>🙂</button>
                    <button onClick={() => { setMood(5); navigate('check-in'); }}>😀</button>
                  </div>
                </div>
                <div className="stat-cards">
                  <div style={{marginBottom: 23}} className="stat-card">
                    <div className="stat-title">Today's Mood: </div>
                    <div className="stat-value mood-emoji">
                      {entries.length > 0 ? ['😞', '😔', '😐', '🙂', '😀'][entries[entries.length - 1].mood - 1] : '—'}
                    </div>
                  </div>
                  
                  <div style={{marginBottom: 23}} className="stat-card">
                    <div className="stat-title">Study Time</div>
                    <div className="stat-value time-stat">
                      {entries.length > 0 ? 
                        Math.floor(entries[entries.length - 1].studyTime / 3600) + 'h ' + 
                        Math.floor((entries[entries.length - 1].studyTime % 3600) / 60) + 'm' : 
                        '0h 0m'}
                    </div>
                  </div>

                  <div style={{marginBottom: 24}} className="stat-card">
                    <div className="stat-title">Daily Goal</div>
                    <div className="study-goals-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress" 
                          style={{width: `${Math.min((studyTime / 60) / studyGoals.daily * 100, 100)}%`}}
                        ></div>
                      </div>
                      <div className="progress-text">
                        {Math.floor(studyTime / 60)} / {studyGoals.daily} min
                      </div>
                    </div>
                  </div>
                </div>

                <br />

                <section className="food-category hydration">
                <div className="category-header">
                  <h3>Hydration Matters!</h3>
                </div>
                <div className="hydration-content">
                  <ul>
                    <li>Even mild dehydration reduces focus and memory.</li>
                    <li>Add <strong>lemon, mint, or cucumber</strong> to make water more refreshing.</li>
                  </ul>
                  
                  {/* Water intake tracker */}
                  <div className="water-tracker">
                    <h4>Today's Water Intake</h4>
                    <div className="tracker-container">
                      <div className="progress-stats">
                        <div className="glasses-count">
                          <span>{waterIntake}</span>/{maxWaterIntake} glasses
                        </div>
                        <div className="hydration-status" style={{ color: getProgressColor() }}>
                          {getHydrationStatus()}
                        </div>
                      </div>
                      
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar" 
                          style={{ 
                            width: `${(waterIntake / maxWaterIntake) * 100}%`,
                            backgroundColor: getProgressColor()
                          }}
                        ></div>
                      </div>
                      
                      <div className="water-actions">
                        <button 
                          className="add-water-btn" 
                          onClick={addWater}
                          disabled={waterIntake >= maxWaterIntake}
                        >
                          <GlassWater size={16} style={{marginTop: -4}} /> Add Glass of Water
                        </button>
                        <button 
                          className="reset-btn" 
                          onClick={resetWater}
                        >
                          <RotateCcw size={14} style={{marginTop: -4}} /> Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="food-category hydration">
            <div className="screen-time-container">
              <h2 className="page-title"><TabletSmartphone style={{marginTop: -4}} /> Screen Time Analysis</h2>
              
              <div className="dashboard-summary">
                <div className="summary-card">
                  <div className="summary-icon"><Clock /></div>
                  <div className="summary-content">
                    <h3>Screen Time</h3>
                    <p className="summary-value">{stats.avgScreenTime} hours</p>
                    <p className="summary-recommendation">{stats.optimalScreen}</p>
                  </div>
                </div>
                
                <div className="summary-card">
                  <div className="summary-icon"><Users /></div>
                  <div className="summary-content">
                    <h3>Social Interaction</h3>
                    <p className="summary-value">{stats.avgSocialTime} hours</p>
                    <p className="summary-recommendation">{stats.optimalSocial}</p>
                  </div>
                </div>
                
                <div className="summary-card">
                  <div className="summary-icon"><Moon /></div>
                  <div className="summary-content">
                    <h3>Sleep Duration</h3>
                    <p className="summary-value">{stats.avgSleepTime} hours</p>
                    <p className="summary-recommendation">{stats.optimalSleep}</p>
                  </div>
                </div>
              </div>

              <div className="info-panel">
                <div className="info-icon"><Info size={20} /></div>
                <div className="info-content">
                  <p>Track your daily screen time and get personalized recommendations for maintaining digital wellness and healthy habits.</p>
                </div>
              </div>
              
              <div className="action-buttons">
                <button className="primary-button" onClick={() => setShowForm(true)}>
                  <PlusCircle size={16} style={{marginRight: '8px'}} />
                  Log Today's Screen Time
                </button>
              </div>
              
              {showForm && (
                <div className="log-form-container">
                  <h3><Phone size={16} />  New Screen Time Log</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <label>
                        <Calendar size={13} style={{marginTop: -2}} /> Date:
                        <input 
                          type="date" 
                          name="date" 
                          value={currentLog.date} 
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                    </div>
                    
                    <div className="form-row">
                      <label>
                        <MonitorSmartphone size={13} style={{marginTop: -2}} /> Screen Time (hours):
                        <input 
                          type="number" 
                          name="screenTime" 
                          min="0"
                          max="24"
                          step="0.5"
                          placeholder="5.5"
                          value={currentLog.screenTime} 
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                    </div>
                    
                    <div className="form-row">
                      <label>
                        <Users size={13} style={{marginTop: -2}} /> Social Interaction Time (hours):
                        <input 
                          type="number" 
                          name="socialTime" 
                          min="0"
                          max="24"
                          step="0.5"
                          placeholder="2.0"
                          value={currentLog.socialTime} 
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                    </div>
                    
                    <div className="form-row">
                      <label>
                        <BedDouble size={13} style={{marginTop: -2}} /> Sleep Duration (hours):
                        <input 
                          type="number" 
                          name="sleepTime" 
                          min="0"
                          max="24"
                          step="0.5"
                          placeholder="8.0"
                          value={currentLog.sleepTime} 
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                    </div>
                    
                    <div className="form-row">
                      <label>
                        <Focus size={13} style={{marginTop: -2}} /> Activities Done:
                        <textarea 
                          name="activities" 
                          placeholder="What digital activities did you engage in today?"
                          value={currentLog.activities} 
                          onChange={handleInputChange}
                        />
                      </label>
                    </div>
                    
                    <div className="form-actions">
                      <button type="submit" className="submit-button"><Save size={16} style={{marginTop:-3}} /> Save Log</button>
                      <button type="button" className="cancel-button" onClick={() => setShowForm(false)}><X size={16} style={{marginTop:-3}} /> Cancel</button>
                    </div>
                  </form>
                </div>
              )}
              
              <div className="section-header">
                <h3><BarChart2 size={18} style={{marginRight: '8px'}} /> Your Screen Time History</h3>
              </div>
              
              {logs.length === 0 ? (
                <div className="empty-state">
                  <p>No screen time logs yet. Start tracking your digital habits to receive personalized recommendations.</p>
                </div>
              ) : (
                <div className="logs-grid">
                  {logs.map(log => (
                    <div key={log.id} className="log-card">
                      <div className="log-header">
                        <span className="log-date">{new Date(log.date).toLocaleDateString()}</span>
                        <button onClick={() => deleteLog(log.id)} className="delete-button">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="log-metrics">
                        <div className="metric">
                          <Clock size={16} />
                          <span>{log.screenTime} hrs screen time</span>
                        </div>
                        <div className="metric">
                          <Users size={16} />
                          <span>{log.socialTime} hrs social</span>
                        </div>
                        <div className="metric">
                          <Moon size={16} />
                          <span>{log.sleepTime} hrs sleep</span>
                        </div>
                      </div>
                      
                      {log.activities && (
                        <div className="log-activities">
                          <p><strong>Activities:</strong> {log.activities}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              </div>
            </section>
                
                <div style={{marginTop: 0}} className="dashboard-panel">
                  <h3><Zap size={20} fill='#a6264c' style={{marginTop: -2}} /> Quick Actions</h3>
                  <div className="action-grid">
                    <div className="action-card" onClick={() => navigate('check-in')}>
                      {/* <div className="action-icon">📝 Daily Check-In</div> */}
                      <div className="action-text">
                        <h4><Disc2 size={16} style={{marginTop: -2}} /> Daily Check-In</h4>
                        <p>Record your mood and reflections</p>
                      </div>
                    </div>
                    
                    <div className="action-card" onClick={() => navigate('study')}>
                      {/* <div className="action-icon">⏱️</div> */}
                      <div className="action-text">
                        <h4><Disc2 size={16} style={{marginTop: -2}} /> Study Session</h4>
                        <p>Focus timer with break reminders</p>
                      </div>
                    </div>
                    
                    <div className="action-card" onClick={() => navigate('tasks')}>
                      {/* <div className="action-icon">📋</div> */}
                      <div className="action-text">
                        <h4><Disc2 size={16} style={{marginTop: -2}} /> Task Manager</h4>
                        <p>Organize assignments and deadlines</p>
                      </div>
                    </div>
                    
                    <div className="action-card" onClick={() => navigate('assessments')}>
                      {/* <div className="action-icon">📊</div> */}
                      <div className="action-text">
                        <h4><Disc2 size={16} style={{marginTop: -2}} /> Assessments</h4>
                        <p>Evaluate habits and wellness</p>
                      </div>
                    </div>
                    
                    <div className="action-card" onClick={() => navigate('notes')}>
                      {/* <div className="action-icon">📚</div> */}
                      <div className="action-text">
                        <h4><Disc2 size={16} style={{marginTop: -2}} /> Study Notes</h4>
                        <p>Organize your learning materials</p>
                      </div>
                    </div>
                    
                    <div className="action-card" onClick={() => navigate('insights')}>
                      {/* <div className="action-icon">📈</div> */}
                      <div className="action-text">
                        <h4><Disc2 size={16} style={{marginTop: -2}} /> Weekly Insights</h4>
                        <p>See patterns and get personalized tips</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>       
            </div>
        

            <div className="dashboard-column side-column">
                {tasks.length > 0 && (
                  <div className="dashboard-panel upcoming-tasks">
                    <h3><CalendarClock size={20} style={{marginTop: -6}} /> Upcoming Tasks</h3>
                    <div className="mini-task-list">
                      {tasks.filter(task => !task.completed).slice(0, 3).map(task => (
                        <div key={task.id} className={`mini-task priority-${task.priority}`}>
                          <div className="task-title">{task.title}</div>
                          {task.dueDate && (
                            <div className="task-due">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                          )}
                        </div>
                      ))}
                      {tasks.filter(task => !task.completed).length > 3 && (
                        <div className="more-tasks" onClick={() => navigate('tasks')}>
                          +{tasks.filter(task => !task.completed).length - 3} more tasks
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* <div style={{backgroundColor: 'white'}} className="dashboard-panel quick-check">
                  <h3>How are you feeling today?</h3>
                  <div className="quick-mood-buttons">
                    <button onClick={() => { setMood(1); navigate('check-in'); }}>😞</button>
                    <button onClick={() => { setMood(2); navigate('check-in'); }}>😔</button>
                    <button onClick={() => { setMood(3); navigate('check-in'); }}>😐</button>
                    <button onClick={() => { setMood(4); navigate('check-in'); }}>🙂</button>
                    <button onClick={() => { setMood(5); navigate('check-in'); }}>😀</button>
                  </div>
                </div> */}
              </div>
            
            <style jsx>{`
                /* MindTrack Dashboard CSS */

              /* Base styles */
              /* Dashboard container */
              .view.dashboard-view {
                max-width: 950px;
                padding: 16px;
              }

              .screen-time-container {
                max-width: 950px;
                padding: 6px;
                color: #333;
              }
              
              .page-title {
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 24px;
                color: #a6264c;
                border-bottom: 1px dotted #3498db;
                padding-bottom: 10px;
              }
              
              .dashboard-summary {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
              }
              
              .summary-card {
                background-color: #fff;
                border-radius: 16px;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px); 
                padding: 10px;
                display: flex;
                align-items: center;
                transition: transform 0.2s, box-shadow 0.2s;
              }
              
              .summary-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
              }
              
              .summary-icon {
                background-color: lightBlue;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 16px;
                color: white;
              }
              
              .summary-content {
                flex: 1;
              }
              
              .summary-content h3 {
                font-size: 16px;
                font-weight: 500;
                margin: 0 0 8px 0;
                color: #a6264c;
              }
              
              .summary-value {
                font-size: 24px;
                font-weight: 600;
                margin: 0 0 4px 0;
                color: #a6264c;
              }
              
              .summary-recommendation {
                font-size: 13px;
                margin: 0;
                color: #7f8c8d;
              }
              
              .info-panel {
                background-color: #E8F9FF;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 24px;
                display: flex;
                align-items: center;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px); 
              }
              
              .info-icon {
                color: #3498db;
                margin-right: 12px;
              }
              
              .info-content p {
                margin: 0;
                font-size: 14px;
                color: #a6264c;
              }
              
              .action-buttons {
                margin-bottom: 24px;
              }
              
              .primary-button {
                background-color: aqua;
                color: black;
                border: none;
                border-radius: 6px;
                padding: 10px 16px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                transition: background-color 0.2s;
                box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(6px);     
                
              }
              
              .primary-button:hover {
                background-color: #A1E3F9;
              }
              
              .log-form-container {
                background-color: white;
                border-radius: 20px;
                padding: 24px;
                margin-bottom: 24px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
              }
              
              .log-form-container h3 {
                margin-top: 0;
                font-size: 18px;
                font-weight: 500;
                margin-bottom: 20px;
                color: #a6264c;
              }
              
              .form-row {
                margin-bottom: 16px;
              }
              
              .form-row label {
                display: block;
                margin-bottom: 6px;
                font-weight: 500;
                font-size: 14px;
                color: #34495e;
              }
              
              .form-row input, .form-row textarea {
                width: 100%;
                padding: 10px;
                border: 1px solid #dcdfe6;
                border-radius: 4px;
                font-size: 14px;
                transition: border 0.2s;
              }
              
              .form-row input:focus, .form-row textarea:focus {
                outline: none;
                border-color: #3498db;
              }
              
              .form-row textarea {
                min-height: 80px;
                resize: vertical;
              }
              
              .form-actions {
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                margin-top: 20px;
              }
              
              .submit-button {
                background-color: aqua;
                color: black;
                border: none;
                border-radius: 20px;
                padding: 8px 16px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: background-color 0.2s;
              }
              
              .submit-button:hover {
                background-color: #A1E3F9;
              }
              
              .cancel-button {
                background-color: #ecf0f1;
                color: #7f8c8d;
                border: none;
                border-radius: 20px;
                padding: 8px 16px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: background-color 0.2s;
              }
              
              .cancel-button:hover {
                background-color: #bdc3c7;
              }
              
              .section-header {
                margin-bottom: 16px;
              }
              
              .section-header h3 {
                font-size: 18px;
                font-weight: 500;
                margin: 0;
                color: #a6264c;
                display: flex;
                align-items: center;
              }
              
              .empty-state {
                background-color: white;
                border-radius: 8px;
                padding: 32px;
                text-align: center;
                color: #7f8c8d;
              }
              
              .logs-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 20px;
              }
              
              .log-card {
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                padding: 16px;
                transition: transform 0.2s;
              }
              
              .log-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
              }
              
              .log-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid #ecf0f1;
              }
              
              .log-date {
                font-weight: 600;
                color: #a6264c;
              }
              
              .delete-button {
                background: none;
                border: none;
                color: #e74c3c;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: background-color 0.2s;
              }
              
              .delete-button:hover {
                background-color: #f8f9fa;
              }
              
              .log-metrics {
                margin-bottom: 12px;
              }
              
              .metric {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
                color: #34495e;
              }
              
              .log-activities {
                font-size: 13px;
                color: #7f8c8d;
                border-top: 1px solid #ecf0f1;
                padding-top: 10px;
              }
              
              .log-activities p {
                margin: 0;
              }
              
              @media (max-width: 768px) {
                .dashboard-summary,
                .logs-grid {
                  grid-template-columns: 1fr;
                }
                
                .form-actions {
                  flex-direction: column;
                }
                
                .form-actions button {
                  width: 100%;
                }
              }

              .food-category {
                  margin-bottom: 40px;
                  background-color: aqua;
                  border-radius: 12px;
                  padding: 25px;
                  box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1);
                  backdrop-filter: blur(6px);   
              }

              .category-header {
                  margin-bottom: 20px;
                }

              .category-header h3 {
                  color: #2980b9;
                  font-size: 22px;
                  margin: 0 0 10px 0;
                  display: flex;
                  align-items: center;
              }

              .hydration-content {
                  padding: 10px 20px;
                  background-color: white;
                  border-radius: 8px;
                  box-shadow: 0 4px 12px rgba(189, 195, 199, 0.3);
                }

                .hydration .category-header h3 {
                  display: flex;
                  align-items: center;
                }

                .hydration .category-header h3:before {
                  content: "💧";
                  margin-right: 10px;
                  font-size: 22px;
                }


              /* Welcome banner */
              .welcome-banner {
                max-width: 900px !important;
                background: white;
                color: #a6264c;
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 24px;
                  box-shadow: 0 10px 30px rgba(243, 216, 255, 0.5),
                            inset 0 1px 0 rgba(255, 255, 255, 0.5);
                          backdrop-filter: blur(6px); 
                transition: transform 0.3s ease;
              }

              .welcome-banner:hover {
                transform: translateY(-3px);
              }

              .welcome-banner h2 {
                margin: 0 0 8px 0;
                font-size: 1.6rem;
                font-weight: 600;
              }

              .welcome-banner p {
                margin: 0;
                font-size: 0.8rem;
                opacity: 0.9;
              }

              /* Dashboard grid layout */
              .dashboard-grid {
                display: flex;
                gap: 24px;
              }

              .dashboard-column.main-column {
                flex: 3;
              }

              .dashboard-column.side-column {
                flex: 1;
              }

              /* Dashboard panels */
              .dashboard-panel {
                background-color: white;
                border-radius: 12px;
                padding: 24px;
                  box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                            inset 0 1px 0 rgba(255, 255, 255, 0.1);
                          backdrop-filter: blur(6px); 
                margin-bottom: 24px;
                transition: box-shadow 0.3s ease;
              }

              .dashboard-panel:hover {
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
              }

              .dashboard-panel h3 {
                margin-top: 0;
                margin-bottom: 16px;
                font-size: 1.3rem;
                font-weight: 600;
                color: #a6264c;
              }

              /* Stat cards */
              .stat-cards {
                display: grid;
                flex-direction: column;
                gap: 8px;
                grid-template-columns: repeat(3, 1fr);
              }

              .stat-card {
                background-color: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 10px 30px rgba(235, 193, 255, 0.5),
                            inset 0 1px 0 rgba(255, 255, 255, 0.5);
                          backdrop-filter: blur(6px); 
                transition: transform 0.2s ease;
              }

              .stat-card:hover {
                transform: translateY(-2px);
              }

              .stat-title {
                font-size: 1rem;
                color: #a6264c;
                margin-bottom: 8px;
                font-weight: 600;
              }

              .stat-value {
                font-size: 1.5rem;
                font-weight: 600;
                color: #a6264c;
              }

              .mood-emoji {
                font-size: 2rem;
              }

              .time-stat {
                color: #3A59D1;
              }

              /* Progress bar */
              .study-goals-progress {
                margin-top: 8px;
              }

              .progress-bar {
                height: 10px;
                background-color: #e0e6f5;
                border-radius: 5px;
                overflow: hidden;
                margin-bottom: 8px;
              }

              .progress {
                height: 100%;
                background: linear-gradient(90deg, #6e8efb, #a777e3);
                border-radius: 5px;
                transition: width 0.5s ease;
              }

              .progress-text {
                font-size: 0.9rem;
                color: #a6264c;
                text-align: right;
              }

              /* Quick actions */
              .action-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
              }

              .action-card {
                background-color: aqua;
                border-radius: 10px;
                padding: 16px;
                cursor: pointer;
                border: 1px dotted #e0e6f5;
                transition: all 0.3s ease;
              }

              .action-card:hover {
                transform: translateY(-3px);
                background-color: white;
                border-color: #d0d8eb;
              }

              .action-text h4 {
                margin: 0 0 8px 0;
                font-size: 1.1rem;
                font-weight: 600;
                color: #a6264c;
              }

              .action-text p {
                margin: 0;
                font-size: 0.9rem;
                color: #a6264c;
              }

              /* Task list */
              .mini-task-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
              }

              .mini-task {
                background-color: aqua;
                border-left: 30px solid #ddd;
                padding: 12px;
                border-radius: 6px;
                transition: transform 0.2s ease;
              }

              .mini-task:hover {
                transform: translateX(2px);
              }

              .mini-task.priority-high {
                border-left-color: #3498db;
              }

              .mini-task.priority-medium {
                border-left-color: #60B5FF; 
              }

              .mini-task.priority-low {
                border-left-color: #2980b9;
              }

              .task-title {
                font-weight: 500;
                margin-bottom: 4px;
              }

              .task-due {
                font-size: 0.8rem;
                color: #888;
              }

              .more-tasks {
                text-align: center;
                padding: 8px;
                color: #6e8efb;
                font-size: 0.9rem;
                cursor: pointer;
                font-weight: 500;
                transition: color 0.2s ease;
              }

              .more-tasks:hover {
                color: #a777e3;
                text-decoration: underline;
              }

              /* Mood selector */
              .quick-check {
                text-align: center;
              }

              .quick-mood-buttons {
                display: flex;
                justify-content: space-between;
                margin-top: 16px;
              }

              .quick-mood-buttons button {
                background-color: white;
                border: 1px solid #e0e6f5;
                border-radius: 50%;
                width: 44px;
                height: 44px;
                font-size: 1.4rem;
                cursor: pointer;
                transition: all 0.2s ease;
                  box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
                            inset 0 1px 0 rgba(255, 255, 255, 0.1);
                          backdrop-filter: blur(6px); 
              }

              .quick-mood-buttons button:hover {
                transform: scale(1.15);
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                border-color: #d0d8eb;
              }

               /* Water tracker styles */
              .water-tracker {
                margin-top: 25px;
                border-top: 1px solid #e1e8ed;
                padding-top: 20px;
              }
              
              .water-tracker h4 {
                color: #2980b9;
                margin: 0 0 15px 0;
                font-size: 18px;
                font-weight: 600;
              }
              
              .tracker-container {
                background-color: aqua;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 4px 15px rgba(220, 227, 230, 0.5);
                margin-bottom: 20px;
              }
              
              .progress-stats {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                align-items: center;
              }
              
              .glasses-count {
                font-size: 16px;
                color: #34495e;
                font-weight: 500;
              }
              
              .glasses-count span {
                font-size: 20px;
                font-weight: 600;
              }
              
              .hydration-status {
                font-size: 16px;
                font-weight: 600;
              }
              
              .progress-bar-container {
                height: 16px;
                background-color: white;
                border-radius: 8px;
                overflow: hidden;
                margin-bottom: 20px;
              }
              
              .progress-bar {
                height: 100%;
                border-radius: 8px;
                transition: width 0.3s ease, background-color 0.3s ease;
              }
              
              .water-actions {
                display: flex;
                gap: 15px;
                margin-top: 15px;
              }
              
              .water-actions button {
                padding: 10px 18px;
                border-radius: 8px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.25s ease;
                border: none;
                font-size: 14px;
              }
              
              .add-water-btn {
                background-color:rgba(252, 198, 255, 0.25);
                color: black;
                flex-grow: 1;
              }
              
              .add-water-btn:hover {
                background-color: rgba(252, 198, 255, 0.45);
              }
              
              .add-water-btn:disabled {
                background-color: lightBlue;
                cursor: not-allowed;
              }
              
              .reset-btn {
                background-color: aqua;
                color: black;
              }
              
              .reset-btn:hover {
                background-color: #dde4e6;
                color: #34495e;
              }

              /* Responsive design */
              @media (max-width: 768px) {
                .dashboard-grid {
                  flex-direction: column;
                }
                
                .action-grid {
                  grid-template-columns: 1fr;
                }

                .water-actions {
                  flex-direction: column;
                }
                
                .progress-stats {
                  flex-direction: column;
                  align-items: flex-start;
                  gap: 8px;
                }
              }

              /* Mobile view CSS for stat cards */
              @media screen and (max-width: 768px) {
                .stat-cards {
                  display: flex;
                  flex-direction: column;
                  width: 100%;
                }

                .stat-card {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  width: 100%;
                  padding: 12px 16px;
                  background-color: #f5f5f5;
                  border-radius: 8px;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .stat-title {
                  font-weight: 500;
                  font-size: 14px;
                  color: #666;
                }

                .stat-value {
                  font-size: 16px;
                  font-weight: 600;
                }

                .mood-emoji {
                  font-size: 22px;
                }

                .time-stat {
                  font-size: 16px;
                }

                .study-goals-progress {
                  display: flex;
                  flex-direction: column;
                  width: 120px;
                }

                .progress-bar {
                  height: 6px;
                  background-color: #e0e0e0;
                  border-radius: 3px;
                  overflow: hidden;
                  margin-bottom: 4px;
                }

                .progress {
                  height: 100%;
                  background-color: #4caf50;
                }

                .progress-text {
                  font-size: 12px;
                  text-align: right;
                  color: #666;
                }
              }

            `}</style>

          </div>
        );
    }
  };

  return (
    <div className={`app-container`}>
      <div className="sidebar">
        <div className="logo">MindTrack</div>
        <nav className="nav-menu">
          <button 
            className={currentView === 'dashboard' ? 'active' : ''}
            onClick={() => navigate('dashboard')}
          >
            <Home size={16} style={{marginTop: -3}} /> Dashboard
          </button>
          <button 
            className={currentView === 'check-in' ? 'active' : ''}
            onClick={() => navigate('check-in')}
          >
            <Heart size={16} style={{marginTop: -3}} /> Check-In
          </button>
          <button 
            className={currentView === 'study' ? 'active' : ''}
            onClick={() => navigate('study')}
          >
            <Book size={16} style={{marginTop: -3}} /> Study
          </button>
          <button 
            className={currentView === 'tasks' ? 'active' : ''}
            onClick={() => navigate('tasks')}
          >
            <Layers size={16} style={{marginTop: -3}} /> Tasks
          </button>
          <button 
            className={currentView === 'notes' ? 'active' : ''}
            onClick={() => navigate('notes')}
          >
            <Notebook size={16} style={{marginTop: -3}} /> Notes
          </button>
          <button 
            className={currentView === 'insights' ? 'active' : ''}
            onClick={() => navigate('insights')}
          >
            <Activity size={16} style={{marginTop: -3}} /> Insights
          </button>
          <button 
            className={currentView === 'assessments' ? 'active' : ''}
            onClick={() => navigate('assessments')}
          >
            <Focus size={16} style={{marginTop: -3}} /> Assessments
          </button>
          <button 
            className={currentView === 'food' ? 'active' : ''}
            onClick={() => navigate('food')}
          >
            <Apple size={16} style={{marginTop: -3}} /> Food Intake
          </button>
          <button 
            className={currentView === 'music' ? 'active' : ''}
            onClick={() => navigate('music')}
          >
            <Music size={16} style={{marginTop: -3}} /> Lo-Fi Library
          </button>
          {/* <button 
            className={currentView === 'settings' ? 'active' : ''}
            onClick={() => navigate('settings')}
          >
            <Settings2 size={16} style={{marginTop: -3}} /> Settings
          </button> */}
        </nav>
      </div>
      
      <div className="main-content">
        <div className="content-wrapper">
          {renderView()}
        </div>
      </div>
      
      {/* <div id="notification-area" className="notification-area"></div> */}
      
      <style jsx>{`
        /* Reset and Base Styles */              
        /* Layout Styles */

        .app-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background-color: white;
        }
        
        .sidebar {
          width: 280px;
          background-color: white !important;
          border-right: 0.2px dotted silver;
          padding: 16px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        
        .logo {
          font-size: 24px;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 32px;
          text-align: left;
        }
        
        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .nav-menu button {
          background: aqua;
          border: none;
          padding: 12px 16px;
          text-align: left;
          border-radius: 40px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--text-secondary);
        }
        
        .nav-menu button:hover {
          background-color: rgba(252, 198, 255, 0.45);
          color: var(--primary-color);
        }
        
        .nav-menu button.active {
          background-color: lightBlue;
          color: var(--primary-color);
          font-weight: 600;
        }
        
        .main-content {
          flex: 1;
          overflow-y: auto;        
        }
        
        .content-wrapper {
          max-width: 1200px;        
        }
        
        /* View Styles - Dashboard */
        .dashboard-view {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .welcome-banner {
          background-color: aqua;
          border-radius: 40px;
          padding: 24px;
          color: black;
        }
        
        .welcome-banner h2 {
          margin-bottom: 8px;
        }
        
        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }
        
        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .stat-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .stat-card {
          background-color: aqua !important;
          border-radius: var(--border-radius);
          padding: 16px;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .stat-title {
          font-size: 14px;
          color: var(--text-secondary);
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: 700;
        }
        
        .mood-emoji {
          font-size: 32px;
        }
        
        .dashboard-panel {
          background-color: aqua !important;
          border-radius: var(--border-radius);
          padding: 24px;
          box-shadow: var(--shadow-sm);
          margin-bottom: 24px;
        }
        
        .dashboard-panel h3 {
          margin-bottom: 16px;
          font-size: 18px;
        }
        
        .action-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 12px;
        }
        
        .action-card {
          background-color: aqua !important;
          border-radius: var(--border-radius-sm);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          cursor: pointer;
          transition: var(--transition);
        }
        
        .action-card:hover {
          background-color: var(--primary-light);
          transform: translateY(-2px);
        }
        
        .action-icon {
          font-size: 24px;
        }
        
        .action-text h4 {
          font-size: 16px;
          margin-bottom: 4px;
        }
        
        .action-text p {
          font-size: 14px;
          color: var(--text-secondary);
        }
        
        .mini-task-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .mini-task {
          background-color: var(--background-color);
          border-radius: var(--border-radius-sm);
          padding: 12px;
          border-left: 4px solid var(--primary-color);
        }
        
        .mini-task.priority-high {
          border-left-color: #3498db;
        }
        
        .mini-task.priority-medium {
          border-left-color: #60B5FF;
        }
        
        .mini-task.priority-low {
          border-left-color: #2980b9;
        }
        
        .task-due {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 4px;
        }
        
        .more-tasks {
          text-align: center;
          color: var(--primary-color);
          font-size: 14px;
          cursor: pointer;
          padding: 8px;
        }
        
        .quick-mood-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 16px;
        }
        
        .quick-mood-buttons button {
          background: none;
          border: none;
          font-size: 32px;
          cursor: pointer;
          transition: var(--transition);
          transform: scale(1);
        }
        
        .quick-mood-buttons button:hover {
          transform: scale(1.2);
        }
        
        /* View Styles - Check-in */
        .check-in-view {
          background-color: var(--card-background);
          border-radius: var(--border-radius);
          padding: 24px;
          box-shadow: var(--shadow);
        }
        
        .mood-tracker {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin: 24px 0;
        }
        
        .tracker-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        

        
        .journal-area {
          margin-bottom: 24px;
        }
        
        .journal-area label {
          display: block;
          margin-bottom: 8px;
        }
        
        .journal-area textarea {
          width: 100%;
          height: 150px;
          padding: 12px;
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--border-color);
          resize: vertical;
        }
        
        /* View Styles - Study */
        .study-view {
          background-color: var(--card-background);
          border-radius: var(--border-radius);
          padding: 24px;
          box-shadow: var(--shadow);
        }
        
        .timer-display {
          margin: 32px 0;
          text-align: center;
        }
        
        .time {
          font-size: 72px;
          font-weight: 700;
        }
        
        .status {
          font-size: 18px;
          color: var(--text-secondary);
          margin-top: 8px;
        }
        
        .break-alert {
          background-color: var(--primary-light);
          color: var(--primary-dark);
          padding: 12px;
          border-radius: var(--border-radius-sm);
          margin-top: 16px;
          font-weight: 600;
        }
        
        .study-progress {
          margin-top: 32px;
        }
        
        .progress-bar {
          height: 8px;
          background-color: aqua !important;
          border-radius: 40px;
          overflow: hidden;
          margin: 8px 0;
        }
        
        .progress {
          height: 100%;
          background-color: aqua !important;
          border-radius: 4px;
        }
        
        .progress-text {
          font-size: 14px;
          color: var(--text-secondary);
        }
        
        .focus-panel {
          margin-top: 32px;
          background-color: var(--background-color);
          border-radius: var(--border-radius-sm);
          padding: 16px;
        }
        
        .focus-panel h3 {
          margin-bottom: 12px;
        }
        
        .focus-panel ul {
          padding-left: 20px;
        }
        
        .focus-panel li {
          margin-bottom: 8px;
        }
        
        /* View Styles - Tasks */
        .tasks-view {
          background-color: var(--card-background);
          border-radius: var(--border-radius);
          padding: 24px;
          box-shadow: var(--shadow);
        }
        
        .tasks-container {
          margin: 24px 0;
        }
        
        .add-task-form {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        
        .add-task-form input,
        .add-task-form select {
          padding: 10px 12px;
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--border-color);
          flex: 1;
          min-width: 140px;
        }
        
        .task-list {
          margin-top: 24px;
        }
        
        .task-group {
          margin-bottom: 24px;
        }
        
        .task-group h4 {
          margin-bottom: 12px;
          font-size: 16px;
          color: var(--text-secondary);
        }
        
        .task-item {
          display: flex;
          align-items: center;
          padding: 12px;
          border-radius: var(--border-radius-sm);
          background-color: var(--background-color);
          margin-bottom: 8px;
          border-left: 4px solid var(--primary-color);
        }
        
        .task-item.priority-high {
          border-left-color: #3498db;
        }
        
        .task-item.priority-medium {
          border-left-color: #60B5FF;
        }
        
        .task-item.priority-low {
          border-left-color: #2980b9;
        }
        
        .task-item.completed {
          opacity: 0.7;
          border-left-color: var(--text-secondary);
        }
        
        .task-item.completed .task-title {
          text-decoration: line-through;
        }
        
        .task-checkbox {
          margin-right: 12px;
        }
        
        .task-content {
          flex: 1;
        }
        
        .delete-task {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          opacity: 0.6;
          transition: var(--transition);
        }
        
        .delete-task:hover {
          opacity: 1;
          color: var(--danger-color);
        }
        
        /* View Styles - Notes */
        .notes-view,
        .edit-note-view {
          background-color: var(--card-background);
          border-radius: var(--border-radius);
          padding: 24px;
          box-shadow: var(--shadow);
        }
        
        .top-buttons {
          margin: 24px 0;
        }
        
        .notes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
          margin-top: 24px;
        }
        
        .note-card {
          background-color: var(--background-color);
          border-radius: var(--border-radius-sm);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: var(--shadow-sm);
        }
        
        .note-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        
        .note-actions {
          display: flex;
          gap: 8px;
        }
        
        .note-actions button {
          background: none;
          border: none;
          font-size: 14px;
          color: var(--primary-color);
          cursor: pointer;
        }
        
        .note-preview {
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.5;
          max-height: 120px;
          overflow: hidden;
        }
        
        .note-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        
        .tag {
          background-color: var(--primary-light);
          color: var(--primary-dark);
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 12px;
        }
        
        .note-date {
          font-size: 12px;
          color: var(--text-secondary);
        }
        
        .note-form {
          margin: 24px 0;
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
        }
        
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--border-color);
        }
        
        /* View Styles - Insights */
        .insights-view {
          background-color: var(--card-background);
          border-radius: var(--border-radius);
          padding: 24px;
          box-shadow: var(--shadow);
        }
        
        .insights-container {
          margin: 24px 0;
        }
        
        .insight-card {
          background-color: var(--background-color);
          border-radius: var(--border-radius-sm);
          padding: 24px;
          margin-bottom: 24px;
          border-left: 4px solid var(--primary-color);
        }
        
        .insight-card.positive {
          border-left-color: #3498db;
        }
        
        .insight-card.warning {
          border-left-color: #60B5FF;
        }
        
        .insight-card.negative {
          border-left-color: #2980b9;
        }
        
        .insight-card h4 {
          margin: 16px 0 8px;
        }
        
        .charts-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .chart-card {
          background-color: var(--background-color);
          border-radius: var(--border-radius-sm);
          padding: 16px;
        }
        
        .chart-card h4 {
          margin-bottom: 16px;
        }
        
        .chart-visual {
          height: 200px;
        }
        
        .bar-chart {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 100%;
        }
        
        .bar-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
        }
        
        .bar {
          width: 70%;
          background-color: var(--primary-color);
          border-radius: 4px 4px 0 0;
        }
        
        .bar-label {
          font-size: 12px;
          margin-top: 4px;
        }
        
        .bar.study-bar {
          background-color: var(--success-color);
        }
        
        .assessment-insights {
          margin-top: 24px;
        }
        
        .assessment-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }
        
        .assessment-result-card {
          background-color: var(--background-color);
          border-radius: var(--border-radius-sm);
          padding: 16px;
        }
        
        .result-date {
          font-size: 12px;
          color: var(--text-secondary);
          margin: 4px 0 8px;
        }
        
        /* View Styles - Assessments */
        .assessments-view {
          background-color: var(--card-background);
          border-radius: var(--border-radius);
          padding: 24px;
          box-shadow: var(--shadow);
        }
        
        .assessments-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
          margin: 24px 0;
        }
        
        .assessment-card {
          background-color: var(--background-color);
          border-radius: var(--border-radius-sm);
          padding: 20px;
          box-shadow: var(--shadow-sm);
        }
        
        .assessment-card h3 {
          margin-bottom: 12px;
        }
        
        .assessment-card p {
          margin-bottom: 16px;
          color: var(--text-secondary);
        }
        
        .question-count {
          font-size: 14px;
          margin-bottom: 16px;
        }
        
        .assessment-history {
          margin-top: 32px;
        }
        
        .results-list {
          margin-top: 16px;
        }
        
        .result-item {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          border-bottom: 1px solid var(--border-color);
        }
        
        /* View Styles - Take Assessment */
        .take-assessment-view {
          background-color: var(--card-background);
          border-radius: var(--border-radius);
          padding: 24px;
          box-shadow: var(--shadow);
        }
        
        .assessment-description {
          margin: 16px 0 24px;
          color: var(--text-secondary);
        }
        
        .questions-list {
          margin-bottom: 24px;
        }
        
        .question-item {
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .question-text {
          font-weight: 600;
          margin-bottom: 12px;
        }
        
        .options-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .option-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        /* View Styles - Settings */
        .settings-view {
          background-color: var(--card-background);
          border-radius: var(--border-radius);
          padding: 24px;
          box-shadow: var(--shadow);
        }
        
        .settings-container {
          margin: 24px 0;
        }
        
        .settings-section {
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .settings-section:last-child {
          border-bottom: none;
        }
        
        .settings-section h3 {
          margin-bottom: 16px;
        }
        
        .settings-form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }
        
        .form-group.checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .form-group.checkbox label {
          margin-bottom: 0;
        }
        
        /* Common Styles */
        h2 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .action-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        
        button {
          padding: 10px 16px;
          border-radius: var(--border-radius-sm);
          font-size: 16px;
          cursor: pointer;
          border: none;
          transition: var(--transition);
        }
        
        button.primary {
          background-color: var(--primary-color);
          color: white;
        }
        
        button.primary:hover {
          background-color: var(--primary-dark);
        }
        
        button.secondary {
          background-color: var(--background-color);
          color: var(--text-color);
        }
        
        button.secondary:hover {
          background-color: var(--border-color);
        }
        
        button.active {
          background-color: var(--primary-light);
          color: var(--primary-color);
        }
        
        .no-data,
        .no-tasks,
        .no-notes {
          text-align: center;
          padding: 48px 0;
          color: var(--text-secondary);
        }
        
        /* Dark Theme */
        .theme-dark {
          --primary-color: #4f7df9;
          --primary-light: #2a3754;
          --primary-dark: #7698ff;
          --text-color: #e4e6eb;
          --text-secondary: #b0b3b8;
          --text-light: #ffffff;
          --background-color: #18191a;
          --card-background: #242526;
          --border-color: #3a3b3c;
        }
        
        /* Notification Area */
        .notification-area {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          flex-direction: column;
          background: orange;
          color: white;
          border-radius: 6px;
          gap: 12px;
          z-index: 100;
        }
        
        .notification {
          background-color: var(--card-background);
          border-radius: var(--border-radius-sm);
          padding: 16px;
          box-shadow: var(--shadow);
          min-width: 280px;
          max-width: 320px;
          animation: slideIn 0.3s ease;
        }
        
        .notification.success {
          border-left: 4px solid var(--success-color);
        }
        
        .notification.warning {
          border-left: 4px solid var(--warning-color);
        }
        
        .notification.error {
          border-left: 4px solid var(--danger-color);
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        /* Responsive Styles */
        @media (max-width: 768px) {
          .app-container {
            flex-direction: column;
          }
          
          .sidebar {
            width: 100%;
            height: auto;
            border-right: none;
            border-bottom: 1px solid var(--border-color);
          }
          
          .nav-menu {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 8px;
          }
          
          .logo {
            margin-bottom: 16px;
          }
          
          .main-content {
            padding: 16px;
          }
          
          .charts-container,
          .assessment-cards {
            grid-template-columns: 1fr;
          }
          
          .add-task-form {
            flex-direction: column;
          }
        }
        
        
        /* Mobile Navigation Improvements */
        @media (max-width: 768px) {
          .app-container {
            flex-direction: column;
          }
          
          .sidebar {
            width: 100%;
            height: auto;
            border-right: none;
            border-bottom: 1px solid var(--border-color);
            padding: 12px 16px;
          }
          
          .logo {
            margin-bottom: 12px;
            text-align: center;
          }
          
          .nav-menu {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            overflow-x: visible;
          }
          
          .nav-menu button {
            padding: 8px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            font-size: 12px;
            border-radius: 8px;
          }
          
          .nav-menu button svg {
            margin-bottom: 4px;
            margin-top: 0 !important;
          }
          
          /* Adjust for very small screens */
          @media (max-width: 480px) {
            .nav-menu {
              grid-template-columns: repeat(3, 1fr);
            }
          }
          
          @media (max-width: 360px) {
            .nav-menu {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        }
      `}</style>
    </div>
  )
}