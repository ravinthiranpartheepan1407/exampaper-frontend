"use client";
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../../../public/KnowbleIC88.module.css';
import { Disc, Disc2, Dot, Info, Layers, Book, Bookmark, X, GitGraph, Notebook, ScanSearch } from 'lucide-react';
import axios from 'axios';
// Import the react-pdf components
import { pdfjs, Document, Page } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function KnowblePsychologyOfSelling() {
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('https://zdmueezfheensjrefapy.supabase.co/storage/v1/object/sign/rust-timers/IC-01.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2RlNzVhZmFiLWVkZTEtNGY1MC04YzdiLWY0YmYwNjQ5NmJlZiJ9.eyJ1cmwiOiJydXN0LXRpbWVycy9JQy0wMS5wZGYiLCJpYXQiOjE3NDQ1MjA0MzUsImV4cCI6MzMyMTMyMDQzNX0.Ibc1pBfQXR-x8jYM1A64zN6DG4jfcKulHFnGsDczvbQ');
  
  // New PDF viewer states
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const pdfContainerRef = useRef(null);

  const togglePdf = () => {
    setShowPdf(!showPdf);
  };
  
  const [question, setQuestion] = useState('');
  const [kValue, setKValue] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [processedInfo, setProcessedInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [retrievedDocs, setRetrievedDocs] = useState([]);
  const [expandedChunks, setExpandedChunks] = useState({});
  const [bookHeadings, setBookHeadings] = useState([]);
  const [expandedHeadings, setExpandedHeadings] = useState({});
  const [activeTab, setActiveTab] = useState('context'); // 'context' or 'headings'
  const messagesEndRef = useRef(null);
  const [selectedHeading, setSelectedHeading] = useState(null);
  const [showHeadingPopup, setShowHeadingPopup] = useState(false);
  
  const API_BASE_URL = 'https://edevalentum.com';

  // Process PDF automatically on page load
  useEffect(() => {
    handleProcessPdf();
  }, []);

  // Auto-scroll to bottom of chat when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Prevent right-click and keyboard shortcuts in PDF viewer
  useEffect(() => {
    const handleContextMenu = (e) => {
      if (showPdf) {
        e.preventDefault();
        return false;
      }
    };

    const handleKeyDown = (e) => {
      if (showPdf) {
        // Prevent common keyboard shortcuts like Ctrl+P, Ctrl+S, etc.
        if ((e.ctrlKey || e.metaKey) && 
            (e.key === 'p' || e.key === 's' || e.key === 'c' || 
             e.key === 'v' || e.key === 'a')) {
          e.preventDefault();
          return false;
        }
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showPdf]);

  // Fetch headings after processing PDF
  const fetchHeadings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-headings`);
      setBookHeadings(response.data.headings);
    } catch (error) {
      console.error('Error fetching headings:', error);
    }
  };

  const handleProcessPdf = async () => {
    setIsProcessing(true);
    setProcessedInfo(null);
    setMessages([
      {
        type: 'system',
        content: 'Processing Resources, please wait...'
      }
    ]);
    setRetrievedDocs([]);
    setBookHeadings([]);

    try {
      const response = await axios.post(`${API_BASE_URL}/process-pdf-url`, 
        { url: pdfUrl },
        { 
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      setProcessedInfo(response.data);
      setMessages([
        {
          type: 'system',
          content: `Resources Loaded successfully! I have analyzed ${response.data.chunk_count} segments of content and identified ${response.data.heading_count || 0} headings. What would you like to know about this module?`
        }
      ]);
      
      // Fetch headings after successful processing
      await fetchHeadings();
      
    } catch (error) {
      console.error('Error processing PDF:', error);
      let errorMessage = 'Error processing PDF. Please try again or check the URL.';
      
      if (error.response) {
        errorMessage = `Error ${error.response.status}: ${error.response.data.detail || 'Unknown error'}`;
      } else if (error.request) {
        errorMessage = 'No response received from server. Please check your connection or CORS configuration.';
      } else {
        errorMessage = error.message;
      }
      
      setMessages([
        {
          type: 'system',
          content: errorMessage
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // PDF functions
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(1, newPageNumber), numPages);
    });
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function zoomIn() {
    setScale(prevScale => Math.min(prevScale + 0.2, 2.5));
  }

  function zoomOut() {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  }

  function resetZoom() {
    setScale(1.0);
  }

  const handleQuery = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      return;
    }

    const userQuestion = question;
    setQuestion('');
    setIsQuerying(true);
    
    // Add user message to chat
    setMessages(prev => [
      ...prev, 
      { type: 'user', content: userQuestion }
    ]);
    
    // Add loading message
    setMessages(prev => [
      ...prev, 
      { type: 'assistant', content: '...', isLoading: true }
    ]);

    try {
      const response = await axios.post(`${API_BASE_URL}/query`, 
        {
          query: userQuestion,
          k_value: kValue,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      // Replace loading message with actual response
      setMessages(prev => prev.map((msg, index) => 
        index === prev.length - 1 && msg.isLoading 
          ? { type: 'assistant', content: response.data.answer }
          : msg
      ));
      
      setRetrievedDocs(response.data.retrieved_documents);
    } catch (error) {
      console.error('Error getting answer:', error);
      
      let errorMessage = 'Error getting answer. Please try again.';
      
      if (error.response) {
        errorMessage = `Error ${error.response.status}: ${error.response.data.detail || 'Unknown error'}`;
      } else if (error.request) {
        errorMessage = 'No response received from server. Please check your connection or CORS configuration.';
      } else {
        errorMessage = error.message;
      }
      
      // Replace loading message with error
      setMessages(prev => prev.map((msg, index) => 
        index === prev.length - 1 && msg.isLoading 
          ? { type: 'system', content: errorMessage }
          : msg
      ));
    } finally {
      setIsQuerying(false);
    }
  };

  const toggleChunk = (index) => {
    setExpandedChunks({
      ...expandedChunks,
      [index]: !expandedChunks[index],
    });
  };

  const toggleHeading = (index) => {
    setExpandedHeadings({
      ...expandedHeadings,
      [index]: !expandedHeadings[index],
    });
  };
  
  const openHeadingPopup = (heading) => {
    setSelectedHeading(heading);
    setShowHeadingPopup(true);
  };
  
  const closeHeadingPopup = () => {
    setShowHeadingPopup(false);
    setSelectedHeading(null);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <h1 style={{color: 'Black', fontSize: 16, fontWeight: 500}}><Disc size={16} style={{marginTop: -5}} /> Psychology of Selling</h1>
            {processedInfo && (
              <div className={styles.pdfInfo}>
                <span><Layers size={14} style={{marginTop: -2}} /> Sources Ingested • {processedInfo.chunk_count} sources analyzed</span>
                {isProcessing && <div className={styles.processingIndicator}></div>}
              </div>
            )}
          </div>

          <div className={styles.messagesContainer}>
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`${styles.messageWrapper} ${styles[message.type]}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.messageBubble}>
                    {message.isLoading ? (
                      <div className={styles.typingIndicator}>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    ) : (
                      message.content.split('\n').map((paragraph, pIndex) => (
                        <p key={pIndex}> {paragraph}</p>
                      ))
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>

          <form onSubmit={handleQuery} className={styles.inputForm}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about this module..."
              disabled={!processedInfo}
              className={styles.chatInput}
              style={{}}
            />
            <motion.button
              type="submit"
              disabled={isQuerying || isProcessing || !processedInfo || !question.trim()}
              className={styles.sendButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </motion.button>
          </form>
          
          <div className={styles.settingsBar}>
            <div className={styles.kValueSelector}>
              <label htmlFor="kValue"><Disc2 size={10} style={{marginTop: -2}} /> Context Segments: {kValue}</label>
              <input
                type="range"
                id="kValue"
                min="1"
                max="5"
                value={kValue}
                onChange={(e) => setKValue(parseInt(e.target.value))}
                className={styles.slider}
              />
            </div>
            <button 
              onClick={togglePdf}
              className={styles.reloadButtons}
              disabled={isProcessing}
            >
              <ScanSearch size={14} />
              <span>{showPdf ? 'Close Catalog' : 'Show Catalog'}</span>
            </button>
            <button 
              onClick={handleProcessPdf} 
              className={styles.reloadButton}
              disabled={isProcessing}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
              </svg>
              <span>Reload Engine</span>
            </button>
          </div>
        </div>

        {showPdf && (
          <div className="pdf-overlay">
            <div className="pdf-container">
              <div className="pdf-header">
                <h3 style={{fontSize: 16}}><Notebook size={16} style={{marginTop: -3}} /> Catalog Viewer</h3>
                <div className="pdf-controls">
                  <button onClick={previousPage} disabled={pageNumber <= 1}>
                    Prev
                  </button>
                  <span>{pageNumber} of {numPages}</span>
                  <button onClick={nextPage} disabled={pageNumber >= numPages}>
                    Next
                  </button>
                  <button onClick={zoomOut}>-</button>
                  <button onClick={resetZoom}>Reset</button>
                  <button onClick={zoomIn}>+</button>
                </div>
                <button 
                  className="close-button" 
                  onClick={togglePdf}
                >
                  &times;
                </button>
              </div>
              <div className="pdf-content" ref={pdfContainerRef}>
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onContextMenu={(e) => e.preventDefault()}
                  className="pdf-document"
                  loading={<div className="pdf-loading">Loading PDF...</div>}
                  error={<div className="pdf-error">Error loading PDF!</div>}
                >
                  <Page 
                    pageNumber={pageNumber} 
                    scale={scale}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
              </div>
            </div>
            <style jsx>{`
              .title {
                margin: 0;
                line-height: 1.15;
                font-size: 3rem;
                text-align: center;
              }

              .button-container {
                margin-top: 2rem;
              }

              .catalog-button {
                background-color: #0070f3;
                color: white;
                border: none;
                border-radius: 5px;
                padding: 10px 20px;
                font-size: 1rem;
                cursor: pointer;
                transition: background-color 0.3s;
              }

              .catalog-button:hover {
                background-color: #0051b3;
              }

              .pdf-overlay {
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
                user-select: none;
              }

              .pdf-container {
                background-color: white;
                width: 90%;
                max-width: 1000px;
                height: 90vh;
                border-radius: 8px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
              }

              .pdf-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 20px;
                background-color: #f1f1f1;
                border-bottom: 1px solid #ddd;
              }

              .pdf-header h3 {
                margin: 0;
              }

              .pdf-controls {
                display: flex;
                align-items: center;
                gap: 10px;
              }

              .pdf-controls button {
                background-color: #e0e0e0;
                border: none;
                border-radius: 4px;
                padding: 5px 10px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s;
                color: black;
              }

              .pdf-controls button:hover:not(:disabled) {
                background-color: #d0d0d0;
              }

              .pdf-controls button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
              }

              .close-button {
                background-color: transparent;
                color: black;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0 5px;
              }

              .pdf-content {
                flex: 1;
                overflow: auto;
                text-align: center;
                background-color: #f5f5f5;
              }

              .pdf-document {
                display: inline-block;
              }

              .pdf-loading {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                font-size: 1.2rem;
                color: #666;
              }

              .pdf-error {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                font-size: 1.2rem;
                color: #ff0000;
              }

              /* Global styles to disable text selection in PDF */
              :global(.react-pdf__Page) {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
              }
            `}</style>
          </div>
        )}

        <AnimatePresence>
            <motion.div 
              className={styles.contextPanel}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.contextHeader}>
                <h2 style={{color: 'black'}}>
                  <div className={styles.tabsContainer}>
                    <div 
                      className={`${styles.tab} ${activeTab === 'context' ? styles.activeTab : ''}`}
                      onClick={() => setActiveTab('context')}
                      style={{fontSize: 13, fontWeight: 500}}
                    >
                      <Layers size={14} /> Context Segments
                    </div>
                    <div 
                      className={`${styles.tab} ${activeTab === 'headings' ? styles.activeTab : ''}`}
                      onClick={() => setActiveTab('headings')}
                      style={{fontSize: 13, fontWeight: 500}}
                    >
                      <GitGraph size={14} /> Context Graph
                    </div>
                  </div>
                </h2>
                
                {activeTab === 'context' && (
                  <p style={{color: 'grey'}}><Disc2 size={13} style={{marginTop: -1}} /> Showing {retrievedDocs.length} relevant segments according to your prompt from the analysed sources.</p>
                )}
                
                {activeTab === 'headings' && (
                  <p style={{color: 'grey'}}><Bookmark size={13} style={{marginTop: -1}} /> Showing {bookHeadings.length} headings extracted from the document.</p>
                )}
              </div>
              
              {/* Context Segments Tab */}
              {activeTab === 'context' && retrievedDocs.map((doc, index) => (
                <motion.div 
                  key={index} 
                  className={styles.chunk}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 * index }}
                >
                  <motion.div 
                    className={styles.chunkHeader} 
                    onClick={() => toggleChunk(index)}
                    whileHover={{ backgroundColor: '#e6f7ff' }}
                  >
                    <span className={styles.chunkLabel}><Layers size={13} style={{marginTop: -3}} /> Segment {index + 1} • Page {doc.page}</span>
                    <span className={expandedChunks[index] ? styles.arrowDown : styles.arrowRight}></span>
                  </motion.div>
                  <AnimatePresence>
                    {expandedChunks[index] && (
                      <motion.div 
                        className={styles.chunkContent}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {doc.content.split('\n').map((paragraph, pIndex) => (
                          <p key={pIndex}>{paragraph}</p>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
              
              {/* Book Headings Tab - Updated with responsive grid */}
              {activeTab === 'headings' && (
                <div className={styles.headingsGrid}>
                  {bookHeadings.map((heading, index) => (
                    <motion.div 
                      key={index} 
                      className={styles.headingCard}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.05 * index }}
                      onClick={() => openHeadingPopup(heading)}
                      whileHover={{ scale: 1.02, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                    >
                      <h3><Bookmark size={14} style={{marginTop: -3}} /> {heading.heading}</h3>
                      <span className={styles.pageIndicator}>Page {heading.page}</span>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {activeTab === 'headings' && bookHeadings.length === 0 && (
                <div className={styles.noContentMessage}>
                  <Info size={24} />
                  <p>No headings found in the document or document hasn't been processed yet.</p>
                </div>
              )}
            </motion.div>
        </AnimatePresence>

        {/* Heading Content Popup */}
        <AnimatePresence>
          {showHeadingPopup && selectedHeading && (
            <motion.div 
              className={styles.popupOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeHeadingPopup}
            >
              <motion.div 
                className={styles.popupContent}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <div className={styles.popupHeader}>
                  <h2><Bookmark size={18} /> {selectedHeading.heading}</h2>
                  <span className={styles.pageIndicator}>Page {selectedHeading.page}</span>
                  <button className={styles.closeButton} onClick={closeHeadingPopup}>
                    <X size={20} />
                  </button>
                </div>
                <div className={styles.popupBody}>
                  {selectedHeading.content.split('\n').map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}