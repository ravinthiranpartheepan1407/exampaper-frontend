"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from '../public/CodePlayground.module.css';
import { Play, RotateCcw, MessageSquare, Clock, Eye, EyeOff, Activity, ChevronRight, Disc2, Trophy, ArrowsUpFromLine, Disc, Timer, Layers, Focus, Code, X, Bot, Cookie, Crosshair, SendHorizonal, BadgeCheck } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// FlowChart components
// FlowChart components
// For the FlowChartItem component, replace the connector code to use a downward arrow
const FlowChartItem = ({ id, text, index, moveItem, items, successSteps }) => {
    const ref = useRef(null);
    const [showPopup, setShowPopup] = useState(false);
    
    const [{ isDragging }, drag] = useDrag({
      type: 'flowItem',
      item: { id, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
    
    const [, drop] = useDrop({
      accept: 'flowItem',
      hover(item, monitor) {
        if (!ref.current) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex = index;
        
        if (dragIndex === hoverIndex) {
          return;
        }
        
        moveItem(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });
    
    drag(drop(ref));
    
    const handleClick = () => {
      setShowPopup(!showPopup);
    };
    
    // Check if this step is in the success steps array
    const isSuccessStep = successSteps && successSteps.includes(id);
    
    return (
        <div className={styles.flowItemContainer}>
          <div 
            ref={ref} 
            className={`${styles.flowItem} ${isSuccessStep ? styles.flowItemSuccess : ''}`}
            style={{ opacity: isDragging ? 0.5 : 1, backgroundColor: isSuccessStep ? '#00FFFF' : '' }}
            onClick={handleClick}
          >
            <div className={styles.flowItemContent}>
              <div className={styles.flowItemNumber}>{index + 1}</div>
              <div className={styles.flowItemText}>{text}</div>
            </div>
          </div>
          
          {/* Connector line to next item - now points downward */}
          {index < items.length - 1 && (
            <div className={styles.flowConnector}>
              <div className={styles.flowConnectorLine}></div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.flowConnectorArrow}>
                <path d="M12 5v13M5 12l7 7 7-7"/>
              </svg>
            </div>
          )}
        
        {/* Popup explanation */}
        {showPopup && (
          <div className={styles.flowPopup}>
            <div className={styles.flowPopupContent}>
              <h4>Step {index + 1}</h4>
              <p>{text}</p>
              <p className={styles.flowPopupDescription}>
                {getStepExplanation(id, text)}
              </p>
              <button className={styles.flowPopupClose} onClick={() => setShowPopup(false)}>
                <X size={16} /> Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Helper function to generate explanations based on the step content
  const getStepExplanation = (id, text) => {
    // Detect what kind of step this is and provide an appropriate explanation
    if (id === 'start') {
      return "This is the beginning of your program's execution flow.";
    } else if (id === 'end') {
      return "This is where your function returns its result back to the caller.";
    } else if (id.startsWith('problem-')) {
      return "This is part of the problem definition that your code needs to solve.";
    } else if (text.toLowerCase().includes('loop') || text.includes('for') || text.includes('while')) {
      return "This step involves iteration through a collection of items or repeating actions until a condition is met.";
    } else if (text.toLowerCase().includes('if') || text.toLowerCase().includes('check') || text.toLowerCase().includes('condition')) {
      return "This step involves making a decision based on certain conditions.";
    } else if (text.toLowerCase().includes('return') || text.toLowerCase().includes('output')) {
      return "This step involves producing or returning a result.";
    } else if (text.toLowerCase().includes('initialize') || text.toLowerCase().includes('create')) {
      return "This step involves setting up initial values or creating new variables.";
    } else {
      return "This step is part of the algorithm to solve the current challenge.";
    }
  };
  
// Update the FlowChart component to pass the success steps
// Update the FlowChart component to pass the success steps
const FlowChart = ({ items, setItems, successSteps = [] }) => {
    const moveItem = (dragIndex, hoverIndex) => {
      const dragItem = items[dragIndex];
      const newItems = [...items];
      newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, dragItem);
      setItems(newItems);
    };
    
    // Ensure React can properly track each item
    const getItemKey = (item, index) => {
      return `${item.id}-${index}`;
    };
    
    return (
      <div className={styles.flowChart}>
        <h3><Code size={16} style={{marginTop: -3}} /> Code Flow Diagram</h3>
        <p className={styles.flowChartHelp}>Drag steps to rearrange the flow. Click on any step for details.</p>
        <div className={styles.flowChartContainer}>
          {items.map((item, index) => (
            <FlowChartItem 
              key={getItemKey(item, index)} 
              id={item.id} 
              text={item.text} 
              index={index} 
              moveItem={moveItem}
              items={items}
              successSteps={successSteps}
            />
          ))}
        </div>
      </div>
    );
  };

// Time complexity detector
const detectTimeComplexity = (code) => {
  // Simple pattern matching for common time complexity indicators
  const patterns = [
    { regex: /for\s*\([^)]*\)\s*{[^{]*for\s*\([^)]*\)/g, complexity: 'O(n²)' },
    { regex: /for\s*\([^)]*\)/g, complexity: 'O(n)' },
    { regex: /while\s*\([^)]*\)/g, complexity: 'O(n)' },
    { regex: /binary\s*search|log\(/g, complexity: 'O(log n)' },
    { regex: /sort\(\)/g, complexity: 'O(n log n)' },
    { regex: /map\[|set\[|{|}|\[|\]/g, complexity: 'O(1)' },
  ];
  
  for (const pattern of patterns) {
    if (pattern.regex.test(code)) {
      return pattern.complexity;
    }
  }
  
  return 'O(?)'; // Unknown complexity
};

const CodePlayground = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [story, setStory] = useState(null);
  const [currentScene, setCurrentScene] = useState(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [hints, setHints] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [storyComplete, setStoryComplete] = useState(false);
  const [characterName, setCharacterName] = useState('Coder');
  const [showIntro, setShowIntro] = useState(true);
  
  // New state variables for added features
  const [chatMode, setChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showSamples, setShowSamples] = useState(false);
  const [timeComplexity, setTimeComplexity] = useState('O(?)');
  const [flowItems, setFlowItems] = useState([]);
  const timerRef = useRef(null);

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    // { value: 'typescript', label: 'TypeScript' },
    // { value: 'python', label: 'Python' },
    // { value: 'csharp', label: 'C#' },
    // { value: 'java', label: 'Java' },
    // { value: 'rust', label: 'Rust' },
    // { value: 'golang', label: 'Go' },
  ];

  // Story adventures with coding challenges
  const storyAdventures = {
    javascript: {
      title: "Story Episode.1",
      description: "You are a brave coder who must solve puzzles to help a friendly robot get back home.",
      scenes: [
        {
          id: 'js_scene1',
          title: 'Meet Beep the Robot',
          narrative: "You meet Beep, a small lost robot who needs your help. Beep says, 'My memory chip is damaged! Can you help me fix it by writing some code?'",
          challenge: {
            description: "Help Beep check if a series of numbers follows a simple pattern where each number is the sum of the two before it.",
            template: "// Beep needs to check if these numbers follow a pattern\n// Write a function to check if each number is the sum of the two before it\n// Example: [1, 1, 2, 3, 5] follows the pattern because 1+1=2, 1+2=3, 2+3=5\n\nfunction checkPattern(numbers) {\n  // Your code here\n  \n}\n\n// Test cases\nconsole.log(checkPattern([1, 1, 2, 3, 5])); // Should show true\nconsole.log(checkPattern([2, 2, 4, 6, 10])); // Should show true\nconsole.log(checkPattern([1, 2, 4, 7, 11])); // Should show false",
            testCases: [
              { input: '[1, 1, 2, 3, 5]', expectedOutput: 'true' },
              { input: '[2, 2, 4, 6, 10]', expectedOutput: 'true' },
              { input: '[1, 2, 4, 7, 11]', expectedOutput: 'false' },
            ],
            hints: [
              "Start checking from the third number in the list",
              "For each number, check if it equals the sum of the two numbers before it",
            ],
            difficulty: 'easy',
            points: 10,
          },
          successMessage: "Beep's memory is working better! 'Thank you!' says Beep. 'Now I remember I need to find my way home. Let's go to the next town!'",
        },
        {
          id: 'js_scene2',
          title: 'The Secret Message',
          narrative: "You and Beep reach a town. A sign is there, but the letters are all mixed up! Beep says, 'Oh no! This is a coded message. We need to decode it to find the way forward.'",
          challenge: {
            description: "Write a function that can decode messages where each letter has been shifted in the alphabet.",
            template: "// The message has each letter shifted by a number\n// Write a function to shift each letter back\n// Example: 'Ifmmp' with shift 1 becomes 'Hello'\n\nfunction decodeMessage(codedMessage, shift) {\n  // Your code here\n  \n}\n\n// Test cases\nconsole.log(decodeMessage('Ifmmp', 1)); // Should show 'Hello'\nconsole.log(decodeMessage('Cqthsf', 2)); // Should show 'Aorfqd'",
            testCases: [
              { input: "'Ifmmp', 1", expectedOutput: 'Hello' },
              { input: "'Cqthsf', 2", expectedOutput: 'Aorfqd' },
            ],
            hints: [
              "Use string.charCodeAt() to get the code for each letter",
              "Add or subtract the shift value from the code",
              "Use String.fromCharCode() to convert back to a letter",
            ],
            difficulty: 'medium',
            points: 15,
          },
          successMessage: "The message is decoded! It says there's a key hidden in the forest that will help Beep get home. 'Let's go find that key!' Beep says excitedly.",
        },
        {
            id: 'js_scene3',
            title: 'Finding the Key',
            narrative: "In the forest, you find a tree with many colorful keys hanging on it. Beep says, 'My sensors show that only one key will work. We need to find the key with a special pattern.'",
            challenge: {
              description: "Write a function to find the key with a special pattern. The key is the longest sequence of numbers that keeps going up.",
              template: `// Find the special key - it's the longest sequence of numbers that keeps going up
                // Example: In [1, 3, 2, 5, 4, 7], the longest increasing sequence is [1, 3, 5, 7]
                
                function findSpecialKey(numbers) {
                    // Your code here
                }
                
                // Test cases
                console.log(findSpecialKey([1, 3, 2, 5, 4, 7])); // Expected output: [1, 3, 5, 7]
                console.log(findSpecialKey([5, 2, 8, 6, 3, 6, 9, 7])); // Expected output: [2, 3, 6, 9]`,
              testCases: [
                {
                  input: '[1, 3, 2, 5, 4, 7]',
                  expectedOutputChecker: output => {
                    try {
                      const result = JSON.parse(output);
                      // Ensure it's an array and the length matches expected
                      if (!Array.isArray(result) || result.length !== 4) return false;
                      // Check if it's a strictly increasing sequence
                      for (let i = 1; i < result.length; i++) {
                        if (result[i] <= result[i - 1]) return false;
                      }
                      return true;
                    } catch (e) {
                      return false;
                    }
                  }
                },
                {
                  input: '[5, 2, 8, 6, 3, 6, 9, 7]',
                  expectedOutputChecker: output => {
                    try {
                      const result = JSON.parse(output);
                      // Ensure it's an array and the length matches expected
                      if (!Array.isArray(result) || result.length !== 4) return false;
                      // Check if it's a strictly increasing sequence
                      for (let i = 1; i < result.length; i++) {
                        if (result[i] <= result[i - 1]) return false;
                      }
                      return true;
                    } catch (e) {
                      return false;
                    }
                  }
                }
              ],
              hints: [
                "Think about checking all possible paths through the numbers",
                "For each number, you can either include it or skip it",
                "Keep track of the longest sequence you've found so far"
              ],
              difficulty: 'hard',
              points: 25,
            },
            successMessage: "You found the special key! Beep is so happy! 'Now we just need to find the door home,' says Beep. 'My sensors show it's just ahead!'",
        },          
        {
            id: 'js_scene4',
            title: 'The Way Home',
            narrative: "You and Beep find a big door with a maze puzzle on it. Beep says, 'This is the door to my home! But we need to solve this maze to open it.'",
            challenge: {
              description: "Write a function that finds a path through the maze from start to finish.",
              template: "// Find a path through the maze from start to finish\n// 0 means an open path, 1 means a wall\n// Return the path as a list of positions [row, column]\n\nfunction solveMaze(maze, start, end) {\n  // Your code here\n  \n}\n\n// Test case\nconst maze = [\n  [0, 0, 1, 0, 0],\n  [1, 0, 1, 0, 1],\n  [0, 0, 0, 0, 0],\n  [0, 1, 1, 0, 0],\n  [0, 0, 0, 1, 0]\n];\nconst start = [0, 0];\nconst end = [4, 4];\n\nconsole.log(solveMaze(maze, start, end)); // Should show a valid path through the maze",
              testCases: [
                { input: 'maze, [0, 0], [4, 4]', expectedOutputChecker: output => {
                    try {
                      // Check if the output is a valid path through the maze
                      const path = eval(output);
                      if (!Array.isArray(path) || path.length === 0) return false;
                      
                      // Check start and end points
                      if (path[0][0] !== 0 || path[0][1] !== 0) return false;
                      if (path[path.length-1][0] !== 4 || path[path.length-1][1] !== 4) return false;
                      
                      // Check that each step is valid
                      const maze = [
                        [0, 0, 1, 0, 0],
                        [1, 0, 1, 0, 1],
                        [0, 0, 0, 0, 0],
                        [0, 1, 1, 0, 0],
                        [0, 0, 0, 1, 0]
                      ];
                      
                      for (let i = 1; i < path.length; i++) {
                        const prev = path[i-1];
                        const curr = path[i];
                        
                        // Check if move is to adjacent cell
                        const rowDiff = Math.abs(curr[0] - prev[0]);
                        const colDiff = Math.abs(curr[1] - prev[1]);
                        if ((rowDiff > 1) || (colDiff > 1) || (rowDiff + colDiff > 1)) return false;
                        
                        // Check if current cell is not a wall
                        if (maze[curr[0]][curr[1]] === 1) return false;
                      }
                      
                      return true;
                    } catch (e) {
                      return false;
                    }
                  }
                }
              ],
              hints: [
                "Try checking all possible paths - up, down, left, right",
                "Keep track of places you've already visited",
                "You can use a queue to check paths in order",
                "Remember to save the path as you go",
              ],
              difficulty: 'expert',
              points: 30,
            },
            successMessage: "The door opens! Beep jumps with joy! 'We did it! Thank you so much for helping me get home. You're the best coder friend ever!' You feel proud knowing you helped Beep return home safely.",
        }          
      ]
    }
    // More stories can be added for other languages
  };

 // Initialize the character name input if not already done
//  useEffect(() => {
//     if (!localStorage.getItem('codePlaygroundCharacterName')) {
//       setShowIntro(true);
//     } else {
//       setCharacterName(localStorage.getItem('codePlaygroundCharacterName'));
//       setShowIntro(false);
//     }
//   }, []);

  // Load story when language changes
  useEffect(() => {
    const selectedStory = storyAdventures[language];
    if (selectedStory) {
      setStory(selectedStory);
      setSceneIndex(0);
      setCurrentScene(selectedStory.scenes[0]);
      setCode(selectedStory.scenes[0].challenge.template);
      setHints(selectedStory.scenes[0].challenge.hints);
      
      // Initialize flow chart items based on challenge
      generateFlowItems(selectedStory.scenes[0].challenge.description, selectedStory.scenes[0].challenge.template);
    } else {
      setStory(null);
      setCurrentScene(null);
      setCode('// No story available for this language yet');
      setHints([]);
      setFlowItems([]);
    }
    
    setShowHint(false);
    setHintsUsed(0);
    setOutput('');
    setError('');
    setStoryComplete(false);
    setTimeSpent(0);
    setChatMessages([]);
  }, [language]);

  useEffect(() => {
    if (story && sceneIndex < story.scenes.length) {
      const scene = story.scenes[sceneIndex];
      setCurrentScene(scene);
      setCode(scene.challenge.template);
      setHints(scene.challenge.hints);
      setShowHint(false);
      setHintsUsed(0);
      setOutput('');
      setError('');
      setTimeSpent(0);
      
      // Generate flow chart items based on new challenge
      generateFlowItems(scene.challenge.description, scene.challenge.template);
      
      // Add a story progression message to the chat
      if (chatMode) {
        setChatMessages(prev => [
          ...prev,
          { sender: 'assistant', message: scene.narrative }
        ]);
      }
    } else if (story && sceneIndex >= story.scenes.length) {
      setStoryComplete(true);
    }
  }, [sceneIndex, story]);

  // Time complexity detection when code changes
  useEffect(() => {
    if (code) {
      const complexity = detectTimeComplexity(code);
      setTimeComplexity(complexity);
    }
  }, [code]);

  // Fix timer functionality
  useEffect(() => {
    if (timerActive) {
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Set up a new timer
      timerRef.current = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    } else {
      // Clear the timer when not active
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    
    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerActive]);

  const generateFlowItems = (description, codeTemplate) => {
    const items = [];
    
    // Add start item
    items.push({ id: 'start', text: 'Start' });
    
    // Parse problem description into steps
    const problemSteps = description
      .split('.')
      .filter(step => step.trim().length > 0)
      .map((step, index) => ({
        id: `problem-${index}`,
        text: step.trim()
      }));
    
    items.push(...problemSteps);
    
    // Parse code template to find likely algorithm steps
    const codeLines = codeTemplate.split('\n');
    const functionBodyLines = codeLines.filter(line => 
      !line.includes('function') && 
      !line.includes('console.log') && 
      !line.includes('// Test') &&
      !line.includes('//') && 
      line.trim().length > 0
    );
    
    // Extract algorithm steps from code comments
    const commentSteps = codeLines
      .filter(line => line.includes('//') && !line.includes('// Your code here'))
      .map(line => line.split('//')[1].trim())
      .filter(step => step.length > 0)
      .map((step, index) => ({
        id: `step-${index}`,
        text: step
      }));
    
    items.push(...commentSteps);
    
    // Add end item
    items.push({ id: 'end', text: 'Return result' });
    
    setFlowItems(items);
  };

  const handleStartAdventure = () => {
    localStorage.setItem('codePlaygroundCharacterName', characterName);
    setShowIntro(false);
    // Reset timer and start
    setTimeSpent(0);
    setTimerActive(true);
  };

  const [successSteps, setSuccessSteps] = useState([]);
  
  // Update handleRunCode to check for specific code logic and update successSteps
  const handleRunCode = () => {
    setIsRunning(true);
    setTimerActive(true);
    setOutput('');
    setError('');
    
    setTimeout(() => {
      try {
        let result = '';
        // For JavaScript, we can use Function constructor to evaluate code
        if (language === 'javascript' || language === 'typescript') {
          // Redirect console.log to our output
          const originalLog = console.log;
          const logs = [];
          
          console.log = (...args) => {
            logs.push(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' '));
          };
          
          // Execute the code
          try {
            new Function(code)();
            result = logs.join('\n');
          } catch (e) {
            throw e;
          } finally {
            // Restore original console.log
            console.log = originalLog;
          }
        } else if (language === 'python') {
          // For demo purposes, we'll just simulate Python execution
          result = "Python execution is simulated in this demo";
          
          // Check for common test cases in the currentScene
          if (currentScene && currentScene.challenge.testCases) {
            // Simple simulation for Python test cases
            const hasPrint = code.includes('print(');
            if (hasPrint) {
              result = currentScene.challenge.testCases.map(test => {
                if (test.expectedOutput) return test.expectedOutput;
                return '[simulated output]';
              }).join('\n');
            }
          }
        } else {
          result = `Execution for ${language} is simulated in this demo`;
        }
        
        setOutput(result);
        
        // Check if the solution passes the test cases
        checkSolution(result);
        
        // Update time complexity estimate
        setTimeComplexity(detectTimeComplexity(code));
        
      } catch (e) {
        setError(e.toString());
      } finally {
        setIsRunning(false);
      }
    }, 1000);
  };

  const checkSolution = (result) => {
    if (!currentScene || !currentScene.challenge.testCases) return;
    
    // Split the output by lines to match with test cases
    const outputLines = result.split('\n');
    
    let allPassed = true;
    let passedTests = 0;
    
    for (let i = 0; i < currentScene.challenge.testCases.length; i++) {
      const testCase = currentScene.challenge.testCases[i];
      const expectedOutput = testCase.expectedOutput;
      const output = outputLines[i] || '';
      
      // Check if this test case has a custom checker function
      if (testCase.expectedOutputChecker) {
        if (!testCase.expectedOutputChecker(output)) {
          allPassed = false;
        } else {
          passedTests++;
        }
      } else if (expectedOutput && output.trim() !== expectedOutput.trim()) {
        allPassed = false;
      } else {
        passedTests++;
      }
    }
    
    // If all tests passed, advance to the next scene
    if (allPassed && passedTests > 0) {
      // Award points based on challenge difficulty
      const pointsEarned = currentScene.challenge.points || 10;
      setPoints(prevPoints => prevPoints + pointsEarned);
      
      // Update streak
      setStreak(prevStreak => prevStreak + 1);
      
      // Add success message to chat
      addChatMessage(currentScene.successMessage, 'bot');
      
      // Mark flow chart steps as success
      const newSuccessSteps = [...successSteps];
      flowItems.forEach(item => {
        newSuccessSteps.push(item.id);
      });
      setSuccessSteps(newSuccessSteps);
      
      // Move to the next scene
      if (sceneIndex < story.scenes.length - 1) {
        setTimeout(() => {
          const nextIndex = sceneIndex + 1;
          setSceneIndex(nextIndex);
          setCurrentScene(story.scenes[nextIndex]);
          setCode(story.scenes[nextIndex].challenge.template);
          setHints(story.scenes[nextIndex].challenge.hints);
          generateFlowItems(
            story.scenes[nextIndex].challenge.description, 
            story.scenes[nextIndex].challenge.template
          );
          setShowHint(false);
          setOutput('');
          setError('');
        }, 2000);
      } else {
        // Story complete!
        setStoryComplete(true);
        setTimerActive(false);
        setChatMessages(prevMessages => [
          ...prevMessages,
          { 
            message: `Congratulations, ${characterName}! You've completed the ${story.title} adventure! Final score: ${points + pointsEarned} points.`, 
            sender: 'bot' 
          }
        ]);
      }
    }
  };


  const handleShowHint = () => {
    setShowHint(!showHint);
    if (!showHint && hintsUsed < hints.length) {
      setHintsUsed(prev => prev + 1);
      // Small points penalty for using hints
      setPoints(prev => Math.max(0, prev - 2));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Reset the current scene
  const resetScene = () => {
    if (currentScene) {
      setCode(currentScene.challenge.template);
      setOutput('');
      setError('');
      setShowHint(false);
    }
  };
  
  // Add a message to the chat
  const addChatMessage = (message, sender) => {
    setChatMessages(prevMessages => [
      ...prevMessages,
      { message, sender }
    ]);
  };

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      // Add user message to chat
      setChatMessages(prev => [
        ...prev,
        { sender: 'user', message: currentMessage }
      ]);
      
      // Simple AI responses based on keywords
      let response = "I'm not sure how to help with that. Try asking about the current challenge or for a hint.";
      
      const lowerMsg = currentMessage.toLowerCase();
      
      if (lowerMsg.includes('hint') || lowerMsg.includes('help')) {
        if (hints.length > 0) {
          response = `Here's a hint: ${hints[Math.min(hintsUsed, hints.length - 1)]}`;
          setHintsUsed(prev => prev + 1);
        } else {
          response = "I don't have any specific hints for this challenge.";
        }
      } else if (lowerMsg.includes('how') && lowerMsg.includes('start')) {
        response = "Read the challenge description carefully and break down the problem step by step. Look at the test cases to understand what the function should do.";
      } else if (lowerMsg.includes('stuck') || lowerMsg.includes('difficult')) {
        response = "Don't worry! Programming can be challenging. Try breaking the problem into smaller parts and solve each part separately.";
      } else if (lowerMsg.includes('thank') || lowerMsg.includes('thanks')) {
        response = "You're welcome! I'm glad I could help.";
      } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi ')) {
        response = `Hello ${characterName}! How can I help you with the coding challenge?`;
      }
      
      // Add assistant response after a short delay
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          { sender: 'assistant', message: response }
        ]);
      }, 500);
      
      setCurrentMessage('');
    }
  };

  // Introduction screen
  if (showIntro) {
    return (
    <div style={{backgroundColor: '#f0f8ff'}}>
      <div className={styles.introContainer}>
        <h1><Bot size={50} style={{marginTop: -10}} /> Meet Beep the Robot</h1>
        <p style={{fontSize: 16}}>Help characters by writing code. Learn new things and solve fun problems as you play!</p>
        
        <div className={styles.characterCreation}>
          <h2 style={{fontSize: 17}}><Cookie size={16} style={{marginTop: -3}} /> Create Your Character</h2>
          <div className={styles.formGroup}>
            <label ><Crosshair size={16} style={{marginTop: -3}} /> Character Name:</label>
            <input 
              type="text" 
              value={characterName} 
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="Enter your character name"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label><Disc2 size={16} style={{marginTop: -3}} /> Choose Programming Language:</label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languageOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            className={styles.startButton}
            onClick={handleStartAdventure}
            disabled={!characterName.trim()}
          >
            <Crosshair size={16} style={{marginTop: -3}} /> Jump to Codebranch!
          </button>
        </div>
      </div>
      </div>
    );
  }

  // Story complete screen
  if (storyComplete) {
    return (
    <div style={{backgroundColor: 'white'}}>
      <div className={styles.storyCompleteContainer}>
        {/* <h1>Adventure Complete!</h1> */}
        <div className={styles.completionStats}>
          <h2><Trophy size={30} style={{marginTop: -5}} /> Congratulations, {characterName}!</h2>
          <p>You've finished the entire adventure and helped save the day with your coding skills!</p>
          <div className={styles.statRow}>
            <div className={styles.statBox}>
              <h3><BadgeCheck size={16} style={{marginTop: -3}} /> Points Earned</h3>
              <div className={styles.statValue}>{points}</div>
            </div>
            <div className={styles.statBox}>
              <h3><Activity size={16} style={{marginTop: -3}} /> Highest Streak</h3>
              <div className={styles.statValue}>{streak}</div>
            </div>
            <div className={styles.statBox}>
              <h3><Focus size={16} style={{marginTop: -3}} /> Hints Used</h3>
              <div className={styles.statValue}>{hintsUsed}</div>
            </div>
          </div>
          <button 
            className={styles.newAdventureButton}
            onClick={() => {
              setLanguage(language === 'javascript' ? 'python' : 'javascript');
              setStoryComplete(false);
              setSceneIndex(0);
            }}
          >
            <Disc2 size={16} style={{marginTop: -3}} /> Start New Adventure
          </button>
        </div>
      </div>
    </div>
    );
  }

  // Chat UI components
const ChatMessage = ({ message, sender }) => {
    return (
      <div className={`${styles.chatMessage} ${sender === 'user' ? styles.userMessage : styles.botMessage}`}>
        <div className={styles.messageContent}>
          {message}
        </div>
        <div className={styles.messageSender}>
          {sender === 'user' ? characterName : 'Assistant'}
        </div>
      </div>
    );
  };

  const toggleChat = () => {
    setChatMode(!chatMode);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.codePlayground}>
        <div className={styles.header}>
          <h1><Disc2 size={16} style={{marginTop: -3}} /> Meet Beep the Robot</h1>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}><Trophy size={16} style={{marginTop: -3}} /> Points:</span>
              <span className={styles.statValue}>{points}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}><ArrowsUpFromLine size={16} style={{marginTop: -3}} /> Level:</span>
              <span className={styles.statValue}>{level}</span>
            </div>
            {/* <div className={styles.stat}>
              <span className={styles.statLabel}><Disc size={16} style={{marginTop: -3}} /> Streak:</span>
              <span className={styles.statValue}>{streak}</span>
            </div> */}
            <div className={styles.stat}>
              <span className={styles.statLabel}><Timer size={16} style={{marginTop: -3}} /> Time:</span>
              <span className={styles.statValue}>{formatTime(timeSpent)}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}><Layers size={16} style={{marginTop: -3}} /> Complexity:</span>
              <span className={styles.statValue}>{timeComplexity}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.mainContainer}>
          <div className={styles.leftPanel}>
            <div className={styles.storySection}>
              <h2><Focus size={16} style={{marginTop: -3}} /> Story Artifact</h2>
              <p>{currentScene?.narrative || ''}</p>
              <div className={styles.challengeDescription}>
                <h3>Challenge</h3>
                <p>{currentScene?.challenge?.description || ''}</p>
              </div>
              {hints.length > 0 && (
                <div className={styles.hintsSection}>
                  <button className={styles.hintButton} onClick={handleShowHint}>
                    {showHint ? <EyeOff size={16} /> : <Eye size={16} />} 
                    {showHint ? 'Hide Hint' : 'Show Hint'}
                  </button>
                  {showHint && (
                    <div className={styles.hints}>
                      {hints.slice(0, hintsUsed).map((hint, index) => (
                        <div key={index} className={styles.hint}>
                          <span className={styles.hintNumber}>{index + 1}</span>
                          <span className={styles.hintText}>{hint}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className={styles.chatToggle}>
                <label className={styles.toggleSwitch}>
                    <input 
                    type="checkbox" 
                    checked={chatMode}
                    onChange={toggleChat}
                    />
                    <span className={styles.slider}></span>
                </label>
                <label className={styles.toggleLabel} onClick={toggleChat}>
                    <span>{chatMode ? 'Hide Chat' : 'Ask Codebranch'}</span>
                </label>
            </div>
            
            {chatMode && (
              <div className={styles.chatInterface}>
                <div className={styles.chatMessages}>
                  {chatMessages.map((msg, index) => (
                    <ChatMessage key={index} message={msg.message} sender={msg.sender} />
                  ))}
                </div>
                <div className={styles.chatInput}>
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Ask for help or hints..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <button onClick={handleSendMessage}><SendHorizonal size={13} style={{marginTop: -3}} /> Send</button>
                </div>
              </div>
            )}
            
            <FlowChart items={flowItems} setItems={setFlowItems} successSteps={successSteps} />
          </div>
          
          <div className={styles.rightPanel}>
            <div className={styles.codeHeader}>
              <div className={styles.languageSelector}>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {languageOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.codeActions}>
                <button 
                  className={`${styles.actionButton} ${styles.resetButton}`}
                  onClick={() => setCode(currentScene?.challenge?.template || '')}
                >
                  <RotateCcw size={16} /> Reset
                </button>
                <button 
                  className={`${styles.actionButton} ${styles.runButton}`}
                  onClick={handleRunCode}
                  disabled={isRunning}
                >
                  <Play size={16} /> Run Code
                </button>
              </div>
            </div>
            
            <div className={styles.codeEditor}>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your code here..."
                spellCheck="false"
              />
            </div>
            
            <div className={styles.outputArea}>
              <div className={styles.outputHeader}>
                <h3>Output</h3>
                <div className={styles.outputStatus}>
                  {isRunning ? (
                    <span className={styles.statusRunning}>
                      <Activity size={16} /> Running...
                    </span>
                  ) : output ? (
                    <span className={styles.statusSuccess}>
                      Ready
                    </span>
                  ) : (
                    <span className={styles.statusWaiting}>
                      Waiting to run
                    </span>
                  )}
                </div>
              </div>
              
              <div className={styles.outputContent}>
                {error && (
                  <div className={styles.errorOutput}>{error}</div>
                )}
                {output && (
                  <pre className={styles.consoleOutput}>{output}</pre>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default CodePlayground;