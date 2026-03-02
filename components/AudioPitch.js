"use client";

import React, { useState, useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
  BarElement,
  ScatterController,
} from 'chart.js';
import { Line, PolarArea, Bar, Scatter } from 'react-chartjs-2';
import { Unplug, Upload, Play, Pause } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
  ScatterController,
);

export default function AudioPitch() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emotionCounts, setEmotionCounts] = useState({});
  const [confidenceData, setConfidenceData] = useState([]);
  const [timeLabels, setTimeLabels] = useState([]);
  const [emotionTimeData, setEmotionTimeData] = useState({});
  const [emotionConfidenceData, setEmotionConfidenceData] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Add this helper function to format time
  const formatTime = (time) => {
    if (!isFinite(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // WaveSurfer refs
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  // Initialize WaveSurfer
  useEffect(() => {
    if (file && waveformRef.current) {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
  
      const gradient = document.createElement('canvas').getContext('2d');
      const gradientStroke = gradient.createLinearGradient(0, 0, 0, 70);
      gradientStroke.addColorStop(0, '#0052CC');  // Deep blue
      gradientStroke.addColorStop(0.5, '#2684FF'); // Medium blue
      gradientStroke.addColorStop(1, '#7AB2FF');   // Light blue

      const progressGradient = document.createElement('canvas').getContext('2d');
      const progressStroke = progressGradient.createLinearGradient(0, 0, 0, 80);
      progressStroke.addColorStop(0, '#2684FF');   // Medium blue
      progressStroke.addColorStop(0.5, '#7AB2FF');  // Light blue
      progressStroke.addColorStop(1, 'purple');    // Deep blue
  
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: gradientStroke,
        progressColor: progressStroke,
        cursorColor: '#ffffff',
        cursorWidth: 2,
        barWidth: 3,
        barGap: 2,
        barRadius: 3,
        height: 80,
        responsive: true,
        normalize: true,
        partialRender: true,
        pixelRatio: 1,
      });
  
      const audioUrl = URL.createObjectURL(file);
      wavesurfer.current.load(audioUrl);
  
      // Add event listeners for time updates
      wavesurfer.current.on('ready', () => {
        setDuration(wavesurfer.current.getDuration());
      });
  
      wavesurfer.current.on('audioprocess', () => {
        setCurrentTime(wavesurfer.current.getCurrentTime());
      });
  
      wavesurfer.current.on('seek', () => {
        setCurrentTime(wavesurfer.current.getCurrentTime());
      });
  
      wavesurfer.current.on('finish', () => {
        setIsPlaying(false);
        setCurrentTime(duration);
      });
  
      return () => {
        URL.revokeObjectURL(audioUrl);
        wavesurfer.current.destroy();
      };
    }
  }, [file]);

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith('.wav')) {
        setError('Please upload a WAV file');
        setFile(null);
        return;
      }
      const maxSize = 200 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setError('File is too large. Maximum size is 50MB');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const processEmotionData = (detailedEmotions) => {
    const counts = {};
    const confidences = [];
    const times = [];
    const emotionTime = {};
    const emotionConfidence = {};

    detailedEmotions.forEach((segment) => {
      const cleanEmotion = segment.emotion
        .replace(/^(OAF_|YAF_)/, '')
        .toLowerCase()
        .replace(/_/g, ' ');
      
      // Mapping original emotions to pitch deck related emotions
      const pitchDeckEmotion = {
        'pleasant surprised': 'Curiosity',
        'happy': 'Engaging',
        'neutral': 'Balance',
        'disgust': 'Skeptical',
        'sad': 'Disappointed',
        'fear': 'Hesitation',
        'angry': 'Frustrated'
      }[cleanEmotion] || cleanEmotion;
      
      counts[pitchDeckEmotion] = (counts[pitchDeckEmotion] || 0) + 1;
      confidences.push(segment.confidence * 100);
      times.push(`${segment.start_time}s-${segment.end_time}s`);

      if (!emotionTime[pitchDeckEmotion]) {
        emotionTime[pitchDeckEmotion] = [];
      }
      emotionTime[pitchDeckEmotion].push(segment.start_time);

      if (!emotionConfidence[pitchDeckEmotion]) {
        emotionConfidence[pitchDeckEmotion] = [];
      }
      emotionConfidence[pitchDeckEmotion].push(segment.confidence * 100);
    });

    setEmotionCounts(counts);
    setConfidenceData(confidences);
    setTimeLabels(times);
    setEmotionTimeData(emotionTime);
    setEmotionConfidenceData(emotionConfidence);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a WAV file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await axios.post(
        'https://evalentumapi.com/analyze-emotion',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      setAnalysis(response.data);
      processEmotionData(response.data.emotion_analysis.detailed_emotions);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'An unexpected error occurred';
      setError(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const confidenceChartData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Confidence Score',
        data: confidenceData,
        borderColor: '#22577E',
        backgroundColor: '#22577E',
        tension: 0.4,
      },
    ],
  };

  const polarChartData = {
    labels: Object.keys(emotionCounts).map(emotion => 
      emotion.charAt(0).toUpperCase() + emotion.slice(1)
    ),
    datasets: [
      {
        data: Object.values(emotionCounts),
        backgroundColor: [
          'purple',
          'rgba(54, 162, 235, 0.5)',
          '#22577E',
          'orange',
          'rgba(153, 102, 255, 0.5)',
          '#22577E',
          'A6AEBF',
        ],
        borderWidth: 1,
      },
    ],
  };

  const emotionTimeChartData = {
    datasets: Object.entries(emotionTimeData).map(([emotion, times], index) => ({
      label: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      data: times.map(time => ({
        x: time,
        y: index + 1 // Using index+1 for y-axis position to separate emotions
      })),
      borderColor: [
        'purple',
        'rgba(54, 162, 235, 0.5)',
        '#22577E',
        'orange',
        'rgba(153, 102, 255, 0.5)',
        '#22577E',
      ][index % 6],
      backgroundColor: [
        'purple',
        'rgba(54, 162, 235, 0.5)',
        '#22577E',
        'orange',
        'rgba(153, 102, 255, 0.5)',
        '#22577E',
      ][index % 6],
      pointRadius: 6,
      pointHoverRadius: 8,
    })),
  };

  const emotionConfidenceChartData = {
    labels: Object.keys(emotionConfidenceData).map(
      emotion => emotion.charAt(0).toUpperCase() + emotion.slice(1)
    ),
    datasets: [{
      label: 'Average Confidence by Emotion',
      data: Object.values(emotionConfidenceData).map(
        confidences => confidences.reduce((a, b) => a + b, 0) / confidences.length
      ),
      backgroundColor: [
        'purple',
        'rgba(54, 162, 235, 0.5)',
        '#22577E',
        'orange',
        'rgba(153, 102, 255, 0.5)',
        '#22577E',
      ],
      borderColor: [
        'purple',
        'rgba(54, 162, 235, 0.5)',
        '#22577E',
        'orange',
        'rgba(153, 102, 255, 0.5)',
        '#22577E',
      ],
      borderWidth: 1,
    }],
  };

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#000',
          font: {
            size: 12
          }
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#000',
          font: {
            size: 12
          }
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#000',
          font: {
            size: 12
          }
        },
      },
    },
  };

  const confidenceChartOptions = {
    ...commonChartOptions,
    plugins: {
      ...commonChartOptions.plugins,
      title: {
        display: true,
        text: 'Confidence Score Timeline',
        color: '#000',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
  };

  const polarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#000',
          font: {
            size: 12
          }
        },
      },
      title: {
        display: true,
        text: 'Emotion Distribution',
        color: '#000',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      r: {
        ticks: {
          color: '#000',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  // Update the emotionTimeChartOptions
const emotionTimeChartOptions = {
    ...commonChartOptions,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#000',
          font: {
            size: 12
          },
          callback: function(value) {
            const emotions = Object.keys(emotionTimeData);
            return emotions[value - 1] ? emotions[value - 1].charAt(0).toUpperCase() + emotions[value - 1].slice(1) : '';
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#000',
          font: {
            size: 12
          }
        },
        title: {
          display: true,
          text: 'Time (seconds)',
          color: '#000',
        }
      },
    },
    plugins: {
      ...commonChartOptions.plugins,
      title: {
        display: true,
        text: 'Emotions Over Time',
        color: '#000',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
  };

  const emotionConfidenceChartOptions = {
    ...commonChartOptions,
    plugins: {
      ...commonChartOptions.plugins,
      title: {
        display: true,
        text: 'Average Confidence by Emotion',
        color: '#000',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
  };

  return (
    <div className="theme-main">
    <div className="dark-mode">
    <div className="page bg-dark-1" id="top"></div>
    <div className="dashboard">
      <header className="dashboard-header">
        {/* <h1>Pitch Deck Analysis Dashboard</h1> */}

        <div className="hero-section">
        <div className="hero-content">
          <h1 className='hs-title-8'>Smart Speech Review</h1>
          <p className='hs-title'>Candidate interview speech analysis with emotion-based insights.</p>
          
          <form onSubmit={handleSubmit} className="upload-section">
            <div className="file-upload">
              <label className="upload-btn">
                <Upload style={{width: 15, color: 'black'}} />
                <span>{file ? file.name : 'Upload Speech in .wav format'}</span>
                <input
                  type="file" accept=".wav" onChange={handleFileChange}
                />
                <button 
                  type="submit" 
                  className="evaluate-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Analyzing...' : 'Get Call Insights'}
                </button>
              </label>
              {error && <p className="error-message">{error}</p>}
            </div>
          </form>
        </div>
      </div>
        
        {/* <form onSubmit={handleSubmit} className="upload-form">
          <div className="file-input-wrapper">
            <input type="file" accept=".wav" onChange={handleFileChange} className="file-input" />
            <button type="submit" disabled={isLoading} className="submit-button">
              {isLoading ? 'Analyzing...' : 'Analyze Pitch'}
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </form> */}
      </header>

      {file && (
        <div className="waveform-section">
          <div className="waveform-container">
            <div ref={waveformRef} className="waveform-display" />
            <div className="timer">
                <span className="current-time">{formatTime(currentTime)}</span>
                <span className="duration">{formatTime(duration)}</span>
              </div>
            <div className="playback-controls">
              <button 
                onClick={handlePlayPause} 
                className="playback-button"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="control-icon" />
                ) : (
                  <Play className="control-icon" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {analysis && (
        <div className="dashboard-content">
          <div className="charts-container">
            <div className="chart-row">
              <div className="chart-wrapper">
                <Scatter data={emotionTimeChartData} options={emotionTimeChartOptions} />
              </div>
              <div className="chart-wrapper">
                <PolarArea data={polarChartData} options={polarChartOptions} />
              </div>
            </div>
            <div className="chart-row">
              <div className="chart-wrapper">
                <Line data={confidenceChartData} options={confidenceChartOptions} />
              </div>
              <div className="chart-wrapper">
                <Bar data={emotionConfidenceChartData} options={emotionConfidenceChartOptions} />
              </div>
            </div>
          </div>

          <div className="table-section">
            <h2>Pitch Statistics</h2>
            <div className="table-wrapper">
              <table className="analysis-table">
                <thead>
                  <tr>
                    <th>Time Range</th>
                    <th>Emotion</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                {analysis.emotion_analysis.detailed_emotions.map((segment, index) => {
                  const cleanEmotion = segment.emotion
                    .replace(/^(OAF_|YAF_)/, '')
                    .toLowerCase()
                    .replace(/_/g, ' ');
                  
                  const pitchDeckEmotion = {
                    'pleasant surprised': 'Curiosity',
                    'happy': 'Engaging',
                    'neutral': 'Balance',
                    'disgust': 'Skeptical',
                    'sad': 'Disappointed',
                    'fear': 'Hesitation',
                    'angry': 'Frustrated'
                  }[cleanEmotion] || cleanEmotion;

                  return (
                    <tr key={index}>
                      <td>{`${segment.start_time.toFixed(2)}s - ${segment.end_time.toFixed(2)}s`}</td>
                      <td>{pitchDeckEmotion}</td>
                      <td>{`${(segment.confidence * 100).toFixed(2)}%`}</td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!analysis && (
              <div>
                <p className='hs-title' style={{textAlign: 'center', color: '#2a2a2a', marginTop: 80}}>No Data to show <Unplug /><br />Please upload your voice recording of your startup pitch for evaluation.</p>
              </div>
      )}

      <style jsx>{`
        .dashboard {
          background-color: 'black';
          color: #ffffff;
          padding: 20px;
        }

        .dashboard-header {
          margin-bottom: 30px;
          text-align: center;
        }

        .dashboard-header h1 {
          font-size: 2.5rem;
          margin-bottom: 20px;
          color: #ffffff;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 40px;
          background-image: url('./texture/audio.jpg');
          background-size: cover;
          background-position: center;
          background-blend-mode: overlay;
          padding: 40px;
          border-radius: 10px;
          position: relative;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
           background-color: rgba(106, 44, 231, 0.10); /* Darkens the background image */
            box-shadow: 0 10px 30px rgba(116, 37, 221, 0.4),
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

        .upload-section {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin-top: 30px;
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
          background-color: #000;
          color: #fff;
          border: none;
          border-radius: 40px;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          cursor: pointer;
          margin-left: 1rem;
        }

        .evaluate-btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .error-message {
          color: #dc3545;
          margin-top: 0.5rem;
        }

        .dashboard-content {
          background: #E6EFF2;
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .charts-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 30px;
        }

        .chart-row {
          display: flex;
          gap: 20px;
          width: 100%;
          min-height: 400px;
        }

        .chart-wrapper {
          flex: 1;
          background: white;
          border-radius: 24px;
          padding: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .table-section {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-top: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .table-section h2 {
          color: #000;
          margin-bottom: 20px;
          font-size: 1.5rem;
        }

        .table-wrapper {
          overflow-x: auto;
          max-height: 400px;
          overflow-y: auto;
        }

        .analysis-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
        }

        .analysis-table th,
        .analysis-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #444;
        }

        .analysis-table th {
          background: #fff;
          color: #000;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 0.9rem;
        }

        .analysis-table tr:hover {
          background: #E6EFF2;
        }

        .analysis-table td {
          color: #000;
        }

        @media (max-width: 1024px) {
          .chart-row {
            flex-direction: column;
            min-height: unset;
          }

          .chart-wrapper {
            height: 400px;
          }

          .dashboard-header h1 {
            font-size: 2rem;
          }

          .file-input-wrapper {
            flex-direction: column;
          }

          .submit-button {
            width: 100%;
          }
        }

        @media (max-width: 600px) {
          .dashboard {
            padding: 10px;
          }

          .dashboard-header h1 {
            font-size: 1.5rem;
          }

          .chart-wrapper {
            height: 300px;
          }

          .table-section {
            padding: 15px;
          }

          .analysis-table th,
          .analysis-table td {
            padding: 8px 10px;
            font-size: 0.9rem;
          }
        }
        .waveform-section {
          margin: 2.5rem auto;
          width: 100%;
          padding: 0 1rem;
        }

        .waveform-container {
          background: #E6EFF2;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .waveform-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
        }

        .waveform-display {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
          position: relative;
        }

        .waveform-display::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 16px;
          background: linear-gradient(
            180deg,
            rgba(71, 118, 230, 0.05),
            rgba(142, 84, 233, 0.05),
            rgba(255, 75, 129, 0.05)
          );
          pointer-events: none;
        }

        .playback-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          padding-top: 0.5rem;
          margin-top: -35px;
        }

        .playback-button {
          background: linear-gradient(145deg, #4776E6, #8E54E9);
          border: none;
          border-radius: 50%;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(142, 84, 233, 0.3),
                      inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .playback-button:hover {
          transform: translateY(-2px);
          background: linear-gradient(145deg, #5886f0, #9b65f5);
          box-shadow: 0 6px 20px rgba(142, 84, 233, 0.4),
                      inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .playback-button:active {
          transform: translateY(1px);
          background: linear-gradient(145deg, #4776E6, #8E54E9);
          box-shadow: 0 2px 10px rgba(142, 84, 233, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .control-icon {
          width: 1.5rem;
          height: 1.5rem;
          color: white;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
          background-color: white;
        }

        @media (max-width: 768px) {
          .waveform-container {
            padding: 1.5rem;
          }
          
          .waveform-display {
            padding: 1rem;
          }
          
          .playback-button {
            width: 3rem;
            height: 3rem;
          }
          
          .control-icon {
            width: 1.25rem;
            height: 1.25rem;
            background-color: white;
          }
        }
        .timer {
          display: flex;
          align-items: center;
          color: #000;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
          opacity: 0.9;
        }

        .current-time {
          margin-right: 8px;
        }

        .duration {
          margin-left: 8px;
        }

        .duration::before {
          content: '/';
          margin-right: 8px;
          opacity: 0.5;
        }
      `}</style>
    </div>
    </div>
    </div>
  );
}