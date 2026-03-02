"use client";
import React, { useState, useEffect } from 'react';
import styles from "../../public/KidGame.module.css";
import { Disc, Disc2, Heart, Languages, Layers, ScanSearch, SkipForward, Star, Trophy, Wand, Wand2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function KidGame1() {
    // Game state
    const [activeLevel, setActiveLevel] = useState(0);
    const [selectedCells, setSelectedCells] = useState([]);
    const [foundWords, setFoundWords] = useState([]);
    const [gridState, setGridState] = useState([]);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [showStory, setShowStory] = useState(true);
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState('');
  
    // Game content
    const gameLevels = [
      {
        title: "🐶 The Missing Pet",
        story: "Detective Sam looked around the park. 'Hmm, a missing puppy,' Sam thought. There were footprints in the mud, a chewed toy, and distant barking. Near the pond, Sam spotted a blue collar. Someone mentioned seeing a small dog running toward the playground.",
        grid: [
          ['P', 'U', 'P', 'P', 'A', 'R', 'K', 'S'],
          ['L', 'U', 'A', 'B', 'C', 'D', 'E', 'F'],
          ['A', 'U', 'P', 'T', 'O', 'Y', 'G', 'H'],
          ['Y', 'D', 'K', 'P', 'L', 'P', 'R', 'I'],
          ['G', 'P', 'A', 'R', 'Y', 'Q', 'S', 'J'],
          ['R', 'B', 'A', 'R', 'K', 'T', 'U', 'K'],
          ['O', 'V', 'W', 'X', 'C', 'Y', 'Z', 'L'],
          ['U', 'N', 'M', 'O', 'O', 'Q', 'R', 'M'],
          ['N', 'C', 'O', 'L', 'L', 'A', 'R', 'N'],
          ['D', 'M', 'U', 'D', 'B', 'C', 'D', 'O']
        ],
        words: [
          {word: "PUPPY", clue: "The animal that's missing"},
          {word: "PARK", clue: "Where the detective is searching"},
          {word: "TOY", clue: "Something chewed by the missing animal"},
          {word: "BARK", clue: "A sound heard in the distance"},
          {word: "MUD", clue: "Where footprints were found"},
          {word: "COLLAR", clue: "Blue item found near the pond"},
          {word: "PLAYGROUND", clue: "Where someone saw the dog running"}
        ],
        hints: "Look for words that are important to finding the missing pet.",
        solution: "The puppy was last seen at the playground, left footprints in the mud, was heard barking, and lost its collar while playing with a toy in the park!"
      },
    ];
  
    // Initialize grid state when level changes
    useEffect(() => {
      initializeGrid();
      setSelectedCells([]);
      setFoundWords([]);
      setGameCompleted(false);
      setShowHint(false);
      setShowStory(true);
      setMessage('');
    }, [activeLevel]);
  
    // Initialize grid with letter highlighting status
    const initializeGrid = () => {
      const currentLevel = gameLevels[activeLevel];
      const initialGrid = currentLevel.grid.map(row => 
        row.map(cell => ({
          letter: cell,
          isSelected: false,
          isFound: false
        }))
      );
      setGridState(initialGrid);
    };
  
    // Handle cell selection
    const handleCellClick = (rowIndex, colIndex) => {
      if (gameCompleted) return;
      
      const clickedCell = { row: rowIndex, col: colIndex };
      
      // If this is the first cell or adjacent to the last selected cell
      if (selectedCells.length === 0 || isAdjacent(selectedCells[selectedCells.length - 1], clickedCell)) {
        // Check if cell is already selected
        const isCellAlreadySelected = selectedCells.some(
          cell => cell.row === rowIndex && cell.col === colIndex
        );
  
        if (isCellAlreadySelected) {
          // If clicking the last selected cell, remove it
          if (selectedCells.length > 1 && 
              selectedCells[selectedCells.length - 1].row === rowIndex && 
              selectedCells[selectedCells.length - 1].col === colIndex) {
            
            const newSelectedCells = [...selectedCells];
            newSelectedCells.pop();
            setSelectedCells(newSelectedCells);
            
            // Update grid state
            const newGridState = [...gridState];
            newGridState[rowIndex][colIndex].isSelected = false;
            setGridState(newGridState);
          }
        } else {
          // Add the cell to selected cells
          const newSelectedCells = [...selectedCells, clickedCell];
          setSelectedCells(newSelectedCells);
          
          // Update grid state
          const newGridState = [...gridState];
          newGridState[rowIndex][colIndex].isSelected = true;
          setGridState(newGridState);
          
          // Check if a word is formed
          checkForWord(newSelectedCells);
        }
      }
    };
  
    // Check if two cells are adjacent
    const isAdjacent = (cell1, cell2) => {
      const rowDiff = Math.abs(cell1.row - cell2.row);
      const colDiff = Math.abs(cell1.col - cell2.col);
      
      // Adjacent horizontally, vertically or diagonally
      return (rowDiff <= 1 && colDiff <= 1) && !(rowDiff === 0 && colDiff === 0);
    };
  
    // Check if selected cells form a word
    const checkForWord = (cells) => {
      const word = cells.map(cell => gridState[cell.row][cell.col].letter).join('');
      const currentLevel = gameLevels[activeLevel];
      
      // Check if the word matches any of the target words
      const foundWord = currentLevel.words.find(w => w.word === word);
      
      if (foundWord && !foundWords.includes(word)) {
        // Word found!
        setFoundWords([...foundWords, word]);
        setScore(score + word.length * 5);
        
        // Mark cells as found
        const newGridState = [...gridState];
        cells.forEach(cell => {
          newGridState[cell.row][cell.col].isFound = true;
          newGridState[cell.row][cell.col].isSelected = false;
        });
        setGridState(newGridState);
        
        // Clear selected cells
        setSelectedCells([]);
        
        // Show success message
        setMessage(`Found "${word}" - ${foundWord.clue}!`);
        setTimeout(() => setMessage(''), 2000);
        
        // Check if all words are found
        if (foundWords.length + 1 === currentLevel.words.length) {
          setGameCompleted(true);
          setScore(score + 50); // Bonus for completing level
        }
      } else if (word.length >= 3) {
        // Check if this is a substring of a valid word
        const isPotentialWord = currentLevel.words.some(w => 
          w.word.startsWith(word) && !foundWords.includes(w.word)
        );
        
        if (!isPotentialWord) {
          // Not a valid word path - clear selection
          const newGridState = [...gridState];
          cells.forEach(cell => {
            newGridState[cell.row][cell.col].isSelected = false;
          });
          setGridState(newGridState);
          setSelectedCells([]);
          setMessage("Not a valid word path. Try again!");
          setTimeout(() => setMessage(''), 1500);
        }
      }
    };
  
    // Move to next level
    // const handleNextLevel = () => {
    //   if (activeLevel < gameLevels.length - 1) {
    //     setActiveLevel(activeLevel + 1);
    //   } else {
    //     // Game completely finished
    //     toast.info("You have cracked it! Great Job!", {
    //         autoClose: 3000, // 3 seconds
    //         onClose: () => {
    //           window.location.reload();
    //         }
    //       });
          
    //     setActiveLevel(0); // Restart game
    //   }

    // };

    const router = useRouter();
  
    // Toggle hint visibility
    const toggleHint = () => {
      setShowHint(!showHint);
    };
  
    // Toggle story visibility
    const toggleStory = () => {
      setShowStory(!showStory);
    };
  
    const currentLevel = gameLevels[activeLevel];
  
    return (
      <div className={styles.gameContainer}>
        <header className={styles.header}>
          <h1><Languages style={{marginTop: -5}} /> Riddle Detective</h1>
          <div className={styles.scoreBoard}><Heart color='white' fill='lightBlue' size={16} style={{marginTop: -2}} /> Score: {score}</div>
        </header>
  
        <section className={styles.levelInfo}>
          <h2>{currentLevel.title}</h2>          
          {showStory && (
            <div className={styles.storyContainer}>
              <p className={styles.story}>{currentLevel.story}</p>
            </div>
          )}
            <div className={styles.storyControls}>
                <button onClick={toggleStory} className={styles.hintButton}>
                    <Disc size={14} style={{marginTop: -3}} /> {showStory ? "Hide Story" : "Show Story"}
                </button> &nbsp; &nbsp;
                <button onClick={toggleHint} className={styles.hintButtons}>
                    <Wand size={14} style={{marginTop: -3}} /> {showHint ? "Hide Clues" : "Show Clues"}
                </button>
            </div>
            <p style={{color: 'black', fontSize: 14, textAlign: 'center'}}><Layers size={14} style={{marginTop: -3}} /> Find the hidden words to solve the mystery! Drag your finger or mouse across adjacent letters.</p>

            
        </section>
  
        <section className={styles.gameInstructions}>

          
          {showHint && (
            <div className={styles.cluesContainer}>
              <h3 style={{color: 'black', fontSize: 16}}><Wand2 size={16} style={{marginTop: -4}} /> Word Clues:</h3>
              <ul className={styles.cluesList}>
                {currentLevel.words.map((wordObj, index) => (
                  <li key={index} className={`${styles.clueItem} ${foundWords.includes(wordObj.word) ? styles.foundClue : ''}`}>
                    <Disc2 size={14} style={{marginTop: -3}} /> {wordObj.clue} {foundWords.includes(wordObj.word) ? `(${wordObj.word})` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
  
        {message && <div className={styles.messageBar}>{message}</div>}
  
        <section className={styles.gameBoard}>
          <div className={styles.gridContainer}>
            {gridState.map((row, rowIndex) => (
              <div key={rowIndex} className={styles.gridRow}>
                {row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      ${styles.gridCell}
                      ${cell.isSelected ? styles.selectedCell : ''}
                      ${cell.isFound ? styles.foundCell : ''}
                    `}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {cell.letter}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
  
        <div className={styles.wordsFoundContainer}>
          <h3 style={{fontSize: 16}}><Heart color='white' fill='lightBlue' size={20} style={{marginTop: -3}} /> Words Found: {foundWords.length}/{currentLevel.words.length}</h3>
          <div className={styles.foundWordsList}>
            {foundWords.map((word, index) => (
              <span key={index} className={styles.foundWord}><Heart color='white' fill='lightBlue' size={14} style={{marginTop: -3}} /> {word}</span>
            ))}
          </div>
        </div>
  
        {gameCompleted && (
          <div className={styles.solutionContainer}>
            <h3><Star color='lightBlue' fill='lightBlue' size={20} style={{marginTop: -3}} /> Mystery Solved!</h3>
            <p className={styles.solution}>{currentLevel.solution}</p>
            <button onClick={() => router.push("/games/the-birthday-surprise")} className={styles.nextButton}>
                <SkipForward color='lightBlue' fill='lightBlue' size={20} style={{marginTop: -3}} /> Next Game
            </button>
          </div>
        )}

      </div>
    );
  }