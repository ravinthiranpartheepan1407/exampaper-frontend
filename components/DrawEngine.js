"use client";
import React, { useState, useRef, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from '../public/DrawEngine.module.css';

// Main drawing board component
// ItemTypes for drag and drop
const ItemTypes = {
  BOARD: 'board',
  STICKY: 'sticky',
  SHAPE: 'shape',
  LINE: 'line',
  IMAGE: 'image' // Add this line
};

// Main Component
const DrawEngine = () => {
  const [tool, setTool] = useState('pointer'); // pointer, hand, pen, sticky, rectangle, circle, line
  const [items, setItems] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [boardPosition, setBoardPosition] = useState({ x: 0, y: 0 });
  const [boardScale, setBoardScale] = useState(1);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isDraggingBoard, setIsDraggingBoard] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false); // Track if user is editing text
  const boardRef = useRef(null);
  const nextId = useRef(1);

  // Handle tool selection
  const handleToolSelect = (selectedTool) => {
    setTool(selectedTool);
    setSelectedItem(null);
  };

  useEffect(() => {
    const handlePaste = (e) => {
      if (!boardRef.current) return;
      
      // Check if there are any items in the clipboard
      if (e.clipboardData && e.clipboardData.items) {
        const items = e.clipboardData.items;
        
        // Look for an image in the clipboard
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            // Get the image as a Blob
            const blob = items[i].getAsFile();
            
            // Create a URL for the blob
            const imageUrl = URL.createObjectURL(blob);
            
            // Get the current cursor position relative to the board
            const boardRect = boardRef.current.getBoundingClientRect();
            const pos = clientToBoard(e.clientX || boardRect.left + 100, e.clientY || boardRect.top + 100);
            
            // Create a new image item
            const newImage = {
              id: nextId.current++,
              type: 'image',
              x: pos.x,
              y: pos.y,
              width: 300, // Default width
              height: 200, // Default height
              url: imageUrl,
            };
            
            // Add the image to the items array
            setItems([...items, newImage]);
            setSelectedItem(newImage.id);
            
            break; // Only handle the first image
          }
        }
      }
    };
    
    // Add the paste event listener to the window
    window.addEventListener('paste', handlePaste);
    
    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [items]); // Re-add listener if items change
  

  // Convert client coordinates to board coordinates
  const clientToBoard = (clientX, clientY) => {
    const boardRect = boardRef.current.getBoundingClientRect();
    return {
      x: (clientX - boardRect.left - boardPosition.x) / boardScale,
      y: (clientY - boardRect.top - boardPosition.y) / boardScale
    };
  };

  // Handle mouse down on the board
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    
    const { clientX, clientY } = e;
    const pos = clientToBoard(clientX, clientY);
    
    if (tool === 'hand') {
      setIsDraggingBoard(true);
      setStartPos({ x: clientX, y: clientY });
      return;
    }

    // Check if clicking on an existing item
    const clickedItemIndex = items.findIndex(item => isPointInItem(pos, item));
    
    if (clickedItemIndex !== -1) {
      setSelectedItem(items[clickedItemIndex].id);
      
      // Handle text input for sticky note
      if (items[clickedItemIndex].type === 'sticky' && tool === 'pointer') {
        const updatedItems = [...items];
        if (e.target.className.includes('sticky-content')) {
          // Allow editing
          return;
        }
      }
      
      return;
    }
    
    // Create new items based on selected tool
    if (tool === 'pen') {
      setDrawing(true);
      setCurrentPath([pos]);
    } else if (tool === 'sticky') {
      const newSticky = {
        id: nextId.current++,
        type: 'sticky',
        x: pos.x,
        y: pos.y,
        width: 250,
        height: 250,
        content: 'New note',
        color: '#FFEB3B'
      };
      setItems([...items, newSticky]);
      setSelectedItem(newSticky.id);
    } else if (tool === 'rectangle') {
      const newRect = {
        id: nextId.current++,
        type: 'rectangle',
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        color: '#2196F3',
        isDrawing: true
      };
      setItems([...items, newRect]);
      setSelectedItem(newRect.id);
      setDrawing(true);
    } else if (tool === 'circle') {
      const newCircle = {
        id: nextId.current++,
        type: 'circle',
        x: pos.x,
        y: pos.y,
        radius: 0,
        color: '#4CAF50',
        isDrawing: true
      };
      setItems([...items, newCircle]);
      setSelectedItem(newCircle.id);
      setDrawing(true);
    } else if (tool === 'line') {
      const newLine = {
        id: nextId.current++,
        type: 'line',
        x1: pos.x,
        y1: pos.y,
        x2: pos.x,
        y2: pos.y,
        color: '#000000',
        isDrawing: true
      };
      setItems([...items, newLine]);
      setSelectedItem(newLine.id);
      setDrawing(true);
    }
  };

  // Check if a point is inside an item
  const isPointInItem = (point, item) => {
    if (item.type === 'sticky' || item.type === 'rectangle') {
      return (
        point.x >= item.x &&
        point.x <= item.x + item.width &&
        point.y >= item.y &&
        point.y <= item.y + item.height
      );
    } else if (item.type === 'circle') {
      const dx = point.x - item.x;
      const dy = point.y - item.y;
      return Math.sqrt(dx * dx + dy * dy) <= item.radius;
    } else if (item.type === 'line') {
      // For lines, check if point is close to the line
      const lineThickness = 10;
      const distance = distanceToLine(point, item);
      return distance <= lineThickness;
    } else if (item.type === 'drawing') {
      // For freehand drawings, check if point is close to any point in the path
      return item.path.some((pathPoint, i) => {
        if (i === 0) return false;
        const prevPoint = item.path[i - 1];
        return distanceToLine(point, { x1: prevPoint.x, y1: prevPoint.y, x2: pathPoint.x, y2: pathPoint.y }) <= 5;
      });
    }
    return false;
  };

  // Calculate distance from point to line
  const distanceToLine = (point, line) => {
    const { x1, y1, x2, y2 } = line;
    const a = point.x - x1;
    const b = point.y - y1;
    const c = x2 - x1;
    const d = y2 - y1;
    
    const dot = a * c + b * d;
    const lenSq = c * c + d * d;
    let param = -1;
    
    if (lenSq !== 0) {
      param = dot / lenSq;
    }
    
    let xx, yy;
    
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * c;
      yy = y1 + param * d;
    }
    
    const dx = point.x - xx;
    const dy = point.y - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Handle mouse move on the board
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const pos = clientToBoard(clientX, clientY);
    
    if (isDraggingBoard) {
      const deltaX = clientX - startPos.x;
      const deltaY = clientY - startPos.y;
      setBoardPosition({
        x: boardPosition.x + deltaX,
        y: boardPosition.y + deltaY
      });
      setStartPos({ x: clientX, y: clientY });
      return;
    }
    
    if (!drawing) return;
    
    if (tool === 'pen') {
      setCurrentPath([...currentPath, pos]);
    } else {
      const updatedItems = items.map(item => {
        if (item.id === selectedItem && item.isDrawing) {
          if (item.type === 'rectangle') {
            return {
              ...item,
              width: pos.x - item.x,
              height: pos.y - item.y
            };
          } else if (item.type === 'circle') {
            const dx = pos.x - item.x;
            const dy = pos.y - item.y;
            return {
              ...item,
              radius: Math.sqrt(dx * dx + dy * dy)
            };
          } else if (item.type === 'line') {
            return {
              ...item,
              x2: pos.x,
              y2: pos.y
            };
          }
        }
        return item;
      });
      setItems(updatedItems);
    }
  };

  // Handle mouse up on the board
  const handleMouseUp = () => {
    if (isDraggingBoard) {
      setIsDraggingBoard(false);
      return;
    }
    
    if (!drawing) return;
    
    setDrawing(false);
    
    if (tool === 'pen' && currentPath.length > 1) {
      const newDrawing = {
        id: nextId.current++,
        type: 'drawing',
        path: currentPath,
        color: '#000000'
      };
      setItems([...items, newDrawing]);
      setCurrentPath([]);
    } else {
      const updatedItems = items.map(item => {
        if (item.id === selectedItem) {
          return { ...item, isDrawing: false };
        }
        return item;
      });
      setItems(updatedItems);
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only delete the item if we're not editing text in a sticky note
      if (e.key === 'Delete' && selectedItem !== null && !isEditingText) {
        setItems(items.filter(item => item.id !== selectedItem));
        setSelectedItem(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [items, selectedItem, isEditingText]);

  // Handle zooming
  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(0.1, Math.min(5, boardScale * delta));
      setBoardScale(newScale);
    }
  };

  // Improved handleStickyContentChange function with better performance
  const handleStickyContentChange = (id, newContent) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, content: newContent } : item
      )
    );
  };

  // Draggable Item Component
  const DraggableItem = ({ item }) => {
    const isSelected = selectedItem === item.id;
    
    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes[item.type.toUpperCase()] || ItemTypes.STICKY,
      item: { id: item.id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      canDrag: tool === 'pointer',
    }));
    
    const handleDrop = (delta) => {
      const updatedItems = items.map(i => {
        if (i.id === item.id) {
          if (i.type === 'sticky' || i.type === 'rectangle' || i.type === 'circle') {
            return { ...i, x: i.x + delta.x / boardScale, y: i.y + delta.y / boardScale };
          } else if (i.type === 'line') {
            return { 
              ...i, 
              x1: i.x1 + delta.x / boardScale, 
              y1: i.y1 + delta.y / boardScale,
              x2: i.x2 + delta.x / boardScale,
              y2: i.y2 + delta.y / boardScale 
            };
          } else if (i.type === 'drawing') {
            return {
              ...i,
              path: i.path.map(point => ({ 
                x: point.x + delta.x / boardScale, 
                y: point.y + delta.y / boardScale 
              }))
            };
          }
        }
        return i;
      });
      setItems(updatedItems);
    };
    
    const handleClick = (e) => {
      e.stopPropagation();
      setSelectedItem(item.id);
    };
    
    // Fixed sticky note rendering to enable continuous typing
    // Fixed sticky note rendering to enable continuous typing
    if (item.type === 'sticky') {
      // Using a dedicated textarea component for sticky notes
      const StickyNote = () => {
        // Reference to textarea element
        const textareaRef = useRef(null);
        
        // Focus the textarea when selected and in pointer mode
        useEffect(() => {
          if (isSelected && textareaRef.current && tool === 'pointer') {
            textareaRef.current.focus();
            // Place cursor at the end of text
            textareaRef.current.selectionStart = textareaRef.current.value.length;
            textareaRef.current.selectionEnd = textareaRef.current.value.length;
          }
        }, [isSelected]);
        
        // Handle text change with controlled component approach
        const handleTextChange = (e) => {
          e.preventDefault();
          const newContent = e.target.value;
          handleStickyContentChange(item.id, newContent);
        };
        
        return (
          <textarea
            ref={textareaRef}
            className={styles.stickyContent}
            value={item.content || ''}
            onChange={handleTextChange}
            onFocus={() => {
              setSelectedItem(item.id);
              setIsEditingText(true);
            }}
            onBlur={() => {
              setIsEditingText(false);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              resize: 'none',
              padding: '8px',
              boxSizing: 'border-box',
              fontFamily: 'Arial, sans-serif',
              fontSize: '14px',
              cursor: 'text',
              outline: 'none',
              pointerEvents: tool === 'pointer' ? 'auto' : 'none',
              direction: 'ltr' // Ensure text direction is left-to-right
            }}
          />
        );
      };
      
      return (
        <div
          ref={drag}
          className={`${styles.stickyNote} ${isSelected ? styles.selected : ''}`}
          style={{
            left: item.x,
            top: item.y,
            width: item.width,
            height: item.height,
            backgroundColor: item.color,
            opacity: isDragging ? 0.5 : 1,
            transform: `scale(${boardScale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            cursor: tool === 'pointer' ? 'move' : 'default',
            padding: '0',
            overflow: 'hidden',
            boxShadow: isSelected ? '0 0 0 2px #2196F3' : '0 2px 4px rgba(0,0,0,0.2)'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedItem(item.id);
            }
          }}
          onDragEnd={(e) => {
            if (tool === 'pointer') {
              const delta = { x: e.clientX - e.currentTarget._startPos.x, y: e.clientY - e.currentTarget._startPos.y };
              handleDrop(delta);
            }
          }}
          onDragStart={(e) => {
            if (tool === 'pointer') {
              e.currentTarget._startPos = { x: e.clientX, y: e.clientY };
            } else {
              e.preventDefault();
            }
          }}
          draggable={tool === 'pointer'}
        >
          <StickyNote />
        </div>
      );
    } else if (item.type === 'rectangle') {
      return (
        <div
          ref={drag}
          className={`${styles.shape} ${isSelected ? styles.selected : ''}`}
          style={{
            left: item.x,
            top: item.y,
            width: Math.abs(item.width),
            height: Math.abs(item.height),
            backgroundColor: item.color,
            opacity: isDragging ? 0.5 : 1,
            transform: `scale(${boardScale}) ${item.width < 0 ? 'translateX(-100%)' : ''} ${item.height < 0 ? 'translateY(-100%)' : ''}`,
            transformOrigin: 'top left',
            position: 'absolute'
          }}
          onClick={handleClick}
          onDragEnd={(e) => {
            if (tool === 'pointer') {
              const delta = { x: e.clientX - e.currentTarget._startPos.x, y: e.clientY - e.currentTarget._startPos.y };
              handleDrop(delta);
            }
          }}
          onDragStart={(e) => {
            e.currentTarget._startPos = { x: e.clientX, y: e.clientY };
          }}
          draggable={tool === 'pointer'}
        />
      );
    } else if (item.type === 'circle') {
      return (
        <div
          ref={drag}
          className={`${styles.circle} ${isSelected ? styles.selected : ''}`}
          style={{
            left: item.x - item.radius,
            top: item.y - item.radius,
            width: item.radius * 2,
            height: item.radius * 2,
            backgroundColor: item.color,
            opacity: isDragging ? 0.5 : 1,
            transform: `scale(${boardScale})`,
            transformOrigin: 'center',
            borderRadius: '50%',
            position: 'absolute'
          }}
          onClick={handleClick}
          onDragEnd={(e) => {
            if (tool === 'pointer') {
              const delta = { x: e.clientX - e.currentTarget._startPos.x, y: e.clientY - e.currentTarget._startPos.y };
              handleDrop(delta);
            }
          }}
          onDragStart={(e) => {
            e.currentTarget._startPos = { x: e.clientX, y: e.clientY };
          }}
          draggable={tool === 'pointer'}
        />
      );
    } else if (item.type === 'line') {
      return (
        <svg
          className={`${styles.lineContainer} ${isSelected ? styles.selected : ''}`}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
          onClick={handleClick}
        >
          <line
            x1={item.x1}
            y1={item.y1}
            x2={item.x2}
            y2={item.y2}
            stroke={item.color}
            strokeWidth={2 / boardScale}
            style={{ pointerEvents: 'stroke' }}
            transform={`scale(${boardScale})`}
          />
        </svg>
      );
    } else if (item.type === 'drawing') {
      let pathData = '';
      if (item.path && item.path.length > 0) {
        pathData = `M ${item.path[0].x} ${item.path[0].y}`;
        for (let i = 1; i < item.path.length; i++) {
          pathData += ` L ${item.path[i].x} ${item.path[i].y}`;
        }
      }
      
      return (
        <svg
          className={`${styles.drawingContainer} ${isSelected ? styles.selected : ''}`}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
          onClick={handleClick}
        >
          <path
            d={pathData}
            stroke={item.color}
            strokeWidth={2 / boardScale}
            fill="none"
            style={{ pointerEvents: 'stroke' }}
            transform={`scale(${boardScale})`}
          />
        </svg>
      );
    } else if (item.type === 'image') {
      return (
        <div
          ref={drag}
          className={`${styles.image} ${isSelected ? styles.selected : ''}`}
          style={{
            left: item.x,
            top: item.y,
            width: item.width,
            height: item.height,
            opacity: isDragging ? 0.5 : 1,
            transform: `scale(${boardScale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            cursor: tool === 'pointer' ? 'move' : 'default',
            boxShadow: isSelected ? '0 0 0 2px #2196F3' : 'none'
          }}
          onClick={handleClick}
          onDragEnd={(e) => {
            if (tool === 'pointer') {
              const delta = { x: e.clientX - e.currentTarget._startPos.x, y: e.clientY - e.currentTarget._startPos.y };
              handleDrop(delta);
            }
          }}
          onDragStart={(e) => {
            e.currentTarget._startPos = { x: e.clientX, y: e.clientY };
          }}
          draggable={tool === 'pointer'}
        >
          <img
            src={item.url}
            alt="Pasted image"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
      );
    }
    
    return null;
  };

  // Board component with drag and drop capability
  const Board = () => {
    const [, drop] = useDrop(() => ({
      accept: [ItemTypes.STICKY, ItemTypes.SHAPE, ItemTypes.LINE],
      drop: (item, monitor) => {
        const delta = monitor.getDifferenceFromInitialOffset();
        if (delta) {
          const updatedItems = items.map(i => {
            if (i.id === item.id) {
              if (i.type === 'sticky' || i.type === 'rectangle' || i.type === 'circle') {
                return { ...i, x: i.x + delta.x / boardScale, y: i.y + delta.y / boardScale };
              } else if (i.type === 'line') {
                return { 
                  ...i, 
                  x1: i.x1 + delta.x / boardScale, 
                  y1: i.y1 + delta.y / boardScale,
                  x2: i.x2 + delta.x / boardScale,
                  y2: i.y2 + delta.y / boardScale 
                };
              } else if (i.type === 'drawing') {
                return {
                  ...i,
                  path: i.path.map(point => ({ 
                    x: point.x + delta.x / boardScale, 
                    y: point.y + delta.y / boardScale 
                  }))
                };
              }
            }
            return i;
          });
          setItems(updatedItems);
        }
      },
    }), [items, boardScale]);

    return (
      <div
        ref={(node) => {
          drop(node);
          boardRef.current = node;
        }}
        className={styles.board}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          cursor: tool === 'hand' ? 'grab' : (isDraggingBoard ? 'grabbing' : 'default'),
          position: 'relative',
          flex: 1,
          overflow: 'hidden',
          backgroundColor: '#f5f5f5'
        }}
      >
        <div
          className={styles.boardContent}
          style={{
            transform: `translate(${boardPosition.x}px, ${boardPosition.y}px)`,
            position: 'absolute',
            width: '100%',
            height: '100%'
          }}
        >
          {items.map(item => (
            <DraggableItem key={item.id} item={item} />
          ))}
          
          {drawing && tool === 'pen' && currentPath.length > 1 && (
            <svg
              className={styles.drawingContainer}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            >
              <path
                d={`M ${currentPath[0].x} ${currentPath[0].y} ${currentPath.slice(1).map(point => `L ${point.x} ${point.y}`).join(' ')}`}
                stroke="#000000"
                strokeWidth={4 / boardScale}
                fill="none"
                transform={`scale(${boardScale})`}
              />
            </svg>
          )}
        </div>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.container} style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div className={styles.toolbar} style={{ display: 'flex', padding: '10px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ddd' }}>
          <button 
            className={`${styles.toolButton} ${tool === 'pointer' ? styles.active : ''}`}
            onClick={() => handleToolSelect('pointer')}
            title="Pointer"
            style={{ margin: '0 5px', padding: '5px 10px', cursor: 'pointer' }}
          >
            👆
          </button>
          <button 
            className={`${styles.toolButton} ${tool === 'hand' ? styles.active : ''}`}
            onClick={() => handleToolSelect('hand')}
            title="Hand (Move Board)"
            style={{ margin: '0 5px', padding: '5px 10px', cursor: 'pointer' }}
          >
            ✋
          </button>
          <button 
            className={`${styles.toolButton} ${tool === 'pen' ? styles.active : ''}`}
            onClick={() => handleToolSelect('pen')}
            title="Pen"
            style={{ margin: '0 5px', padding: '5px 10px', cursor: 'pointer' }}
          >
            ✏️
          </button>
          <button 
            className={`${styles.toolButton} ${tool === 'sticky' ? styles.active : ''}`}
            onClick={() => handleToolSelect('sticky')}
            title="Sticky Note"
            style={{ margin: '0 5px', padding: '5px 10px', cursor: 'pointer' }}
          >
            📝
          </button>
          <button 
            className={`${styles.toolButton} ${tool === 'rectangle' ? styles.active : ''}`}
            onClick={() => handleToolSelect('rectangle')}
            title="Rectangle"
            style={{ margin: '0 5px', padding: '5px 10px', cursor: 'pointer' }}
          >
            □
          </button>
          <button 
            className={`${styles.toolButton} ${tool === 'circle' ? styles.active : ''}`}
            onClick={() => handleToolSelect('circle')}
            title="Circle"
            style={{ margin: '0 5px', padding: '5px 10px', cursor: 'pointer' }}
          >
            ○
          </button>
          <button 
            className={`${styles.toolButton} ${tool === 'line' ? styles.active : ''}`}
            onClick={() => handleToolSelect('line')}
            title="Line"
            style={{ margin: '0 5px', padding: '5px 10px', cursor: 'pointer' }}
          >
            ⁄
          </button>
        </div>
        
        <Board />
        
        <div className={styles.statusBar} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f0f0f0', borderTop: '1px solid #ddd' }}>
          {selectedItem !== null && (
            <div className={styles.itemControls}>
              <button 
                className={styles.deleteButton}
                onClick={() => {
                  setItems(items.filter(item => item.id !== selectedItem));
                  setSelectedItem(null);
                }}
                style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          )}
          <div className={styles.zoomControls} style={{ display: 'flex', alignItems: 'center' }}>
            <button 
              className={styles.zoomButton}
              onClick={() => setBoardScale(Math.max(0.1, boardScale - 0.1))}
              style={{ padding: '2px 8px', margin: '0 5px', cursor: 'pointer' }}
            >
              -
            </button>
            <span>{Math.round(boardScale * 100)}%</span>
            <button 
              className={styles.zoomButton}
              onClick={() => setBoardScale(Math.min(5, boardScale + 0.1))}
              style={{ padding: '2px 8px', margin: '0 5px', cursor: 'pointer' }}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default DrawEngine;