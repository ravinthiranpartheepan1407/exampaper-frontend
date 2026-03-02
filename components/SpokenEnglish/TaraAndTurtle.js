// KidEnglish.js
"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function TaraAndTurtle() {
  // Game state
  const [currentScene, setCurrentScene] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [animation, setAnimation] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Reference to the speech synthesis
  const speechSynthesisRef = useRef(null);

  // Stories/lessons with scenes
  const stories = [
    {
      title: "Tara and the Time-Traveling Turtle",
      scenes: [
        {
          type: "narrative",
          text: "Tara 🧒 finds a shiny golden shell on the beach 🌊. As she touches it, a magical turtle 🐢 appears!",
          character: "tara_turtle",
          emotion: "surprised"
        },
        {
          type: "question",
          text: "What does Tara do when the turtle appears?",
          options: ["🏃‍♀️ Run away", "👋 Say hello", "📷 Take a picture"],
          correctAnswer: "👋 Say hello",
          feedback: "That's brave! Tara says hello to the magical turtle."
        },
        {
          type: "narrative",
          text: "The turtle blinks twice and a portal 🌌 opens! They step in and WHOOSH — they land in a jungle full of talking animals! 🐘🦜🦁",
          character: "tara_turtle",
          emotion: "excited"
        },
        {
          type: "question",
          text: "What kind of animal do they hear talking first?",
          options: ["🦜 Parrot", "🦁 Lion", "🐍 Snake"],
          correctAnswer: "🦜 Parrot",
          feedback: "Right! Parrots love to talk. This one says, 'Welcome to the Jungle of Chatter!'"
        },
        {
          type: "narrative",
          text: "They follow the parrot who leads them to a giant tree 🌳 with sparkling leaves and a door!",
          character: "parrot",
          emotion: "mysterious"
        },
        {
          type: "question",
          text: "What do you think is behind the door?",
          options: ["🍭 A candy room", "📚 A library", "🐉 A dragon"],
          correctAnswer: "📚 A library",
          feedback: "Yes! It's a magical jungle library where books talk! 📖🗣️"
        },
        {
          type: "narrative",
          text: "A talking book tells Tara: 'Find the puzzle pieces to return home!' 🧩",
          character: "book",
          emotion: "wise"
        },
        {
          type: "question",
          text: "Where should they start searching?",
          options: ["🌊 Back at the beach", "🌋 Near the volcano", "🌸 In the flower garden"],
          correctAnswer: "🌸 In the flower garden",
          feedback: "Good thinking! The first puzzle piece is hidden under a glowing sunflower! 🌻"
        },
        {
          type: "narrative",
          text: "They find the piece but a mischievous monkey 🐵 steals it and runs into a maze! 🌀",
          character: "monkey",
          emotion: "playful"
        },
        {
          type: "question",
          text: "How should Tara catch the monkey?",
          options: ["🏃‍♀️ Chase it", "🍌 Offer a banana", "📣 Call for help"],
          correctAnswer: "🍌 Offer a banana",
          feedback: "Smart! The monkey can't resist a banana and gives the puzzle piece back 🍌🧩"
        },
        {
          type: "narrative",
          text: "Now they need two more pieces. One is in the sky, and one is underwater. 🌥️🌊",
          character: "tara_turtle",
          emotion: "determined"
        },
        {
          type: "question",
          text: "Which one should they go to first?",
          options: ["🌥️ Sky", "🌊 Water"],
          correctAnswer: "🌥️ Sky",
          feedback: "Up we go! The turtle gives Tara wings for the sky adventure! 🐢🪽"
        },
        {
          type: "narrative",
          text: "Flying high, they meet a cloud dragon 🐉 guarding a rainbow puzzle piece 🌈🧩",
          character: "dragon",
          emotion: "serious"
        },
        {
          type: "question",
          text: "To earn the piece, Tara must answer: What comes after Tuesday?",
          options: ["📅 Monday", "📅 Wednesday", "📅 Sunday"],
          correctAnswer: "📅 Wednesday",
          feedback: "You're right! The dragon smiles and hands over the rainbow piece 🧩"
        },
        {
          type: "narrative",
          text: "Now it's time to dive deep 🌊 to get the last piece from a sleepy octopus 🐙",
          character: "octopus",
          emotion: "sleepy"
        },
        {
          type: "question",
          text: "How do they wake up the octopus?",
          options: ["🔔 Ring a bell", "🎶 Sing a song", "💦 Splash water"],
          correctAnswer: "🎶 Sing a song",
          feedback: "Correct! Tara sings a gentle song and the octopus smiles and gives the piece 🎵🧩"
        },
        {
          type: "narrative",
          text: "With all 3 pieces collected, they place them in the golden shell — and ZOOM! 💫 Back to the beach they go.",
          character: "tara_turtle",
          emotion: "relieved"
        },
        {
          type: "ending",
          text: "Tara thanks the turtle for the wild adventure. 🌍🧒🐢 She smiles, knowing one day… they might travel again!",
          character: "tara",
          emotion: "happy"
        }
      ]
    }
  ];
  
  const currentStory = stories[0];
  const currentSceneData = currentStory.scenes[currentScene];

  // Check if speech synthesis is supported
  const isSpeechSynthesisSupported = () => {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  };

  // Text-to-speech function with better error handling
  const speakText = (text) => {
    if (!isSpeechSynthesisSupported()) {
      console.error('Speech synthesis is not supported in this browser');
      return;
    }

    try {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create a new speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set properties for a child-friendly voice
      utterance.rate = 0.9; // Slightly slower
      utterance.pitch = 1.2; // Slightly higher pitch
      
      // Get available voices
      let voices = window.speechSynthesis.getVoices();
      
      // If voices array is empty, we might need to wait for voices to load
      if (voices.length === 0 && !voicesLoaded) {
        console.log('No voices available yet, using default voice');
      } else {
        // Try to use a friendly voice if available
        const preferredVoices = voices.filter(voice => 
          (voice.name.includes('Female') || 
          voice.name.includes('Girl') || 
          voice.name.includes('Kids')) &&
          !voice.name.includes('Male')
        );
        
        if (preferredVoices.length > 0) {
          utterance.voice = preferredVoices[0];
          console.log('Using voice:', preferredVoices[0].name);
        } else {
          console.log('No preferred voice found, using default');
        }
      }
      
      // Add event listeners to track when speech starts and ends
      utterance.onstart = () => {
        console.log('Speech started');
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        console.log('Speech ended');
        setIsSpeaking(false);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech error:', event.error);
        setIsSpeaking(false);
      };
      
      // Speak the text
      window.speechSynthesis.speak(utterance);
      speechSynthesisRef.current = utterance;
      
      // Workaround for Chrome issue where speech may stop after ~15 seconds
      const intervalId = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } else {
          clearInterval(intervalId);
        }
      }, 10000);
      
    } catch (error) {
      console.error('Error with speech synthesis:', error);
      setIsSpeaking(false);
    }
  };

  // Auto-speak when scene changes with delay to ensure proper initialization
  useEffect(() => {
    if (currentSceneData && currentSceneData.text) {
      // Short delay to ensure the component is fully rendered
      const timer = setTimeout(() => {
        speakText(currentSceneData.text);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [currentScene]);

  // Handle option selection
  const handleSelectOption = (option) => {
    if (isCorrect !== null) return; // Prevent multiple selections
    
    setSelectedAnswer(option);
    
    if (currentSceneData.type === "question") {
      const correct = option === currentSceneData.correctAnswer;
      setIsCorrect(correct);
      
      if (correct) {
        setScore(score + 10);
        setAnimation('correct');
        // Short delay before speaking feedback
        setTimeout(() => {
          speakText(currentSceneData.feedback);
        }, 500);
      } else {
        setLives(lives - 1);
        setAnimation('wrong');
        // Short delay before speaking feedback
        setTimeout(() => {
          speakText("Oops! Try again next time.");
        }, 500);
        
        if (lives <= 1) {
          setGameOver(true);
        }
      }
    }
  };

  // Move to next scene
  const handleNextScene = () => {
    // Cancel any ongoing speech when moving to the next scene
    if (isSpeechSynthesisSupported() && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    setAnimation('');
    setSelectedAnswer(null);
    setIsCorrect(null);
    
    if (currentScene < currentStory.scenes.length - 1) {
      setCurrentScene(currentScene + 1);
    } else {
      setGameCompleted(true);
      // Short delay before speaking completion message
      setTimeout(() => {
        speakText("Great job! You finished the story!");
      }, 500);
    }
  };

  // Restart game
  const handleRestart = () => {
    // Cancel any ongoing speech when restarting
    if (isSpeechSynthesisSupported() && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    setCurrentScene(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameCompleted(false);
    setAnimation('');
  };

  // Manual replay of current text
  const handleReplayText = () => {
    if (currentSceneData && currentSceneData.text) {
      speakText(currentSceneData.text);
    }
  };

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (isSpeechSynthesisSupported() && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Initialize speech synthesis voices with better handling
  useEffect(() => {
    if (isSpeechSynthesisSupported()) {
      // Get voices immediately (might work in Firefox)
      let voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
        console.log('Voices loaded immediately:', voices.length);
      }

      // Set up event for Chrome and other browsers that load voices asynchronously
      const handleVoicesChanged = () => {
        const newVoices = window.speechSynthesis.getVoices();
        setVoicesLoaded(true);
        console.log('Voices loaded asynchronously:', newVoices.length);
      };
      
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      };
    } else {
      console.warn('Speech synthesis not supported in this browser');
    }
  }, []);

  // Clear animation after it plays
  useEffect(() => {
    if (animation) {
      const timer = setTimeout(() => {
        setAnimation('');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [animation]);

  const characters = {
    tara: "🧒",
    turtle: "🐢",
    tara_turtle: "🧒 🐢",
    parrot: "🦜",
    book: "📖",
    monkey: "🐵",
    dragon: "🐉",
    octopus: "🐙"
  };
  
  const emotions = {
    happy: "😊",
    excited: "😄",
    surprised: "😲",
    mysterious: "🕵️‍♀️",
    wise: "🧠",
    playful: "😋",
    sleepy: "😴",
    serious: "😐",
    determined: "💪",
    relieved: "😌"
  };

  // Game UI rendering
  return (
    <div className="game-container">
      {/* Game header */}
      <div className="game-header">
        <h1>Penny&apos;s Park Adventure</h1>
        <div className="game-stats">
          <div className="lives">
            {"❤️".repeat(lives)}
            {"🖤".repeat(3 - lives)}
          </div>
          <div className="score">Score: {score}</div>
        </div>
      </div>

      {/* Main game content */}
      <div className={`game-content ${animation}`}>
        {gameOver ? (
          <div className="game-end">
            <h2>Game Over</h2>
            <p>You ran out of lives!</p>
            <p>Final Score: {score}</p>
            <button className="restart-button" onClick={handleRestart}>Play Again</button>
          </div>
        ) : gameCompleted ? (
          <div className="game-end">
            <h2>Story Complete!</h2>
            <p>Great job! You finished the story!</p>
            <p>Final Score: {score}</p>
            <button className="restart-button" onClick={handleRestart}>Play Again</button>
          </div>
        ) : (
          <>
            <div className="story-title">{currentStory.title}</div>
            
            <div className="scene">
              <div className="character">
                <span className="character-emoji">{characters[currentSceneData.character]}</span>
                <span className="emotion-emoji">{emotions[currentSceneData.emotion]}</span>
              </div>
              <div className="scene-text">{currentSceneData.text}</div>
            </div>

            {currentSceneData.type === "question" && (
              <div className="options">
                {currentSceneData.options.map((option, index) => (
                  <button 
                    key={index}
                    className={`option ${selectedAnswer === option ? (isCorrect ? 'correct' : 'wrong') : ''}`}
                    onClick={() => handleSelectOption(option)}
                    disabled={isCorrect !== null}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {(currentSceneData.type !== "question" || isCorrect !== null) && (
              <div className="feedback">
                {currentSceneData.type === "question" && isCorrect !== null && (
                  <p className={isCorrect ? "correct-text" : "wrong-text"}>
                    {isCorrect ? currentSceneData.feedback : `Oops! Try again next time.`}
                  </p>
                )}
                <button className="next-button" onClick={handleNextScene}>
                  {currentScene < currentStory.scenes.length - 1 ? "Next" : "Finish"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .game-container {     
          max-width: 1000px;
          margin-top: 20px !important;
          margin-bottom: 20px !important;
          margin: 0 auto;
          background-color: #FFEDFA;
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          background-color: #58cc02;
          padding: 10px 20px;
          border-radius: 15px;
          color: white;
        }

        h1 {
          margin: 0;
          font-size: 28px;
          color: white;
        }

        .game-stats {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .lives {
          font-size: 24px;
        }

        .score {
          font-size: 20px;
          font-weight: bold;
          background-color: #ffc800;
          padding: 8px 12px;
          border-radius: 10px;
          color: #7b4900;
        }

        .game-content {
          background-color: white;
          padding: 20px;
          border-radius: 15px;
          transition: all 0.3s ease;
        }

        .game-content.correct {
          background-color: #fbfbfb;
        }

        .game-content.wrong {
          background-color: rgba(255, 120, 120, 0.3);
        }

        .story-title {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 20px;
          color: #4b4b4b;
        }

        .scene {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 30px;
        }

        .character {
          font-size: 60px;
          margin-bottom: 20px;
          position: relative;
        }

        .character-emoji {
          display: inline-block;
        }

        .emotion-emoji {
          position: absolute;
          font-size: 30px;
          right: -20px;
          bottom: -10px;
        }

        .scene-text {
          font-size: 22px;
          line-height: 1.4;
          text-align: center;
          background-color: #f0f0f0;
          padding: 15px;
          border-radius: 15px;
          max-width: 90%;
        }

        .options {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 30px;
        }

        .option {
          padding: 15px;
          font-size: 20px;
          border: 3px solid #ddd;
          border-radius: 15px;
          background-color: white;
          cursor: pointer;
          color: black;
          transition: all 0.2s;
        }

        .option:hover {
          background-color: #f5f5f5;
          transform: translateY(-3px);
        }

        .option.correct {
          background-color: aqua;
          border-color: lightBlue;
        }

        .option.wrong {
          background-color: #ff7878;
          border-color: #ff4747;
        }

        .feedback {
          text-align: center;
        }

        .correct-text {
          color: black;
          font-weight: bold;
          font-size: 20px;
        }

        .wrong-text {
          color: #ff4747;
          font-weight: bold;
          font-size: 20px;
        }

        .next-button, .restart-button {
          background-color: #58cc02;
          color: white;
          font-size: 22px;
          padding: 12px 30px;
          border: none;
          border-radius: 15px;
          cursor: pointer;
          margin-top: 15px;
          transition: all 0.2s;
        }

        .next-button:hover, .restart-button:hover {
          background-color: #46a302;
          transform: scale(1.05);
        }

        .game-end {
          text-align: center;
        }

        .game-end h2 {
          font-size: 32px;
          color: #4b4b4b;
          margin-bottom: 20px;
        }

        .game-end p {
          font-size: 22px;
          margin-bottom: 15px;
        }

        @media (max-width: 600px) {
          .game-container {
            padding: 10px;
          }
          
          .character {
            font-size: 50px;
          }
          
          .scene-text {
            font-size: 18px;
          }
          
          .option {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
}