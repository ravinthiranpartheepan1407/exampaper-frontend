"use client";
import { useState, useEffect, useRef } from 'react';
import styles from '../public/KnowbleIC88.module.css';
import styless from '../public/ResearchDesign.module.css';
import { Disc, Disc2, Dot, Info, Layers, Book, Bookmark, X, GitGraph, Search, FileText, ScanSearch, Notebook, NotebookTabs } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function KnowbleResearch() {
  const [pdfUrl, setPdfUrl] = useState('');
  const [question, setQuestion] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [kValue, setKValue] = useState(3);
  const [maxResults, setMaxResults] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [processedInfo, setProcessedInfo] = useState(null);
  const [messages, setMessages] = useState([{
    type: 'system',
    content: 'Welcome to S24 Research Engine! Enter a search query to find papers or ask questions about processed papers.'
  }]);
  const [retrievedDocs, setRetrievedDocs] = useState([]);
  const [expandedChunks, setExpandedChunks] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [expandedHeadings, setExpandedHeadings] = useState({});
  const [activeTab, setActiveTab] = useState('context'); // 'context' or 'headings'
  const messagesEndRef = useRef(null);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedHeading, setSelectedHeading] = useState(null);
  const [showHeadingPopup, setShowHeadingPopup] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(true);

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [subscription, setSubscription] = useState(null);

  // Determine max values based on subscription status
  const maxKValue = subscription === 'premium' ? 10 : 3;
  const maxResultsValue = subscription === 'premium' ? 50 : 5;

  // Get user email from token
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
  }, [router]);

  // Fetch subscription status from Supabase
  useEffect(() => {
    async function fetchSubscriptionStatus() {
      if (!userEmail) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('subscription')
          .eq('email', userEmail)
          .single();

        if (error) {
          console.error('Error fetching subscription status:', error);
        } else {
          setSubscription(data?.subscription);
          
          // Reset values if they exceed the new limits
          if (data?.subscription !== 'premium') {
            setKValue(prev => Math.min(prev, 3));
            setMaxResults(prev => Math.min(prev, 5));
          }
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscriptionStatus();
  }, [userEmail]);

  // Handle slider changes with restrictions
  const handleKValueChange = (e) => {
    const value = parseInt(e.target.value);
    setKValue(Math.min(value, maxKValue));
  };

  const handleMaxResultsChange = (e) => {
    const value = parseInt(e.target.value);
    setMaxResults(Math.min(value, maxResultsValue));
  };  

  const [showPdfPopup, setShowPdfPopup] = useState(false);
    const [pdfToShow, setPdfToShow] = useState('');

    // Function to open PDF popup
    const openPdfPopup = (pdfUrl) => {
    setPdfToShow(pdfUrl);
    setShowPdfPopup(true);
    };

    // Function to close PDF popup
    const closePdfPopup = () => {
    setShowPdfPopup(false);
    setPdfToShow('');
    };

  
  const API_BASE_URL = 'https://edevalentum.com'; // Change this to your FastAPI server URL

  // Auto-scroll to bottom of chat when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Update the handleSearchPapers function to hide the search input after submission
const handleSearchPapers = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }
  
    setIsSearching(true);
    
    // Add user message to chat
    setMessages(prev => [
      ...prev, 
      { type: 'user', content: `Search for papers about: ${searchQuery}` }
    ]);
    
    // Add loading message
    setMessages(prev => [
      ...prev, 
      { type: 'system', content: 'Searching arXiv...', isLoading: true }
    ]);
  
    try {
      const response = await axios.post(`${API_BASE_URL}/search_papers`, 
        {
          query: searchQuery,
          max_results: maxResults,
          sort_by: "Relevance"
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
  
      setSearchResults(response.data);
      
      // Replace loading message with results
      setMessages(prev => prev.map((msg, index) => 
        index === prev.length - 1 && msg.isLoading 
          ? { type: 'system', content: `Found ${response.data.length} papers about "${searchQuery}". You can view them in the Context Graph tab.` }
          : msg
      ));
      
      // Switch to headings tab to show results
      setActiveTab('headings');
  
      // Hide the search input after successful search
      setShowSearchInput(false);
      
    } catch (error) {
      console.error('Error searching papers:', error);
      
      let errorMessage = 'Error searching for papers. Please try again.';
      
      if (error.response) {
        errorMessage = `Error ${error.response.status}: ${error.response.data.detail || 'Unknown error'}`;
      } else if (error.request) {
        errorMessage = 'No response received from server. Please check your connection.';
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
      setIsSearching(false);
      setSearchQuery('');
    }
  };

  // Function to toggle search input visibility
    const toggleSearchInput = () => {
    setShowSearchInput(prev => !prev);
  };
  

  const handleProcessPaper = async (paper) => {
    setIsProcessing(true);
    setProcessedInfo(null);
    setSelectedPaper(paper);
    setPdfUrl(paper.pdf_url);
    
    setMessages(prev => [
      ...prev,
      {
        type: 'system',
        content: `Processing paper: "${paper.title}", please wait...`
      }
    ]);
    
    setRetrievedDocs([]);

    try {
      const response = await axios.post(`${API_BASE_URL}/process_paper`, 
        { paper_info: paper },
        { 
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      setProcessedInfo({
        chunk_count: response.data.chunks_count,
        pdf_path: response.data.pdf_path
      });
      
      setMessages(prev => [
        ...prev,
        {
          type: 'system',
          content: `Paper loaded successfully! I have analyzed ${response.data.chunks_count} segments of content. What would you like to know about this paper?`
        }
      ]);
      
      // Switch to context tab
      setActiveTab('context');
      
    } catch (error) {
      console.error('Error processing paper:', error);
      let errorMessage = 'Error processing paper. Please try again.';
      
      if (error.response) {
        errorMessage = `Error ${error.response.status}: ${error.response.data.detail || 'Unknown error'}`;
      } else if (error.request) {
        errorMessage = 'No response received from server. Please check your connection.';
      } else {
        errorMessage = error.message;
      }
      
      setMessages(prev => [
        ...prev,
        {
          type: 'system',
          content: errorMessage
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuery = async (e) => {
    e.preventDefault();
    
    if (!question.trim() || !processedInfo) {
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
      const response = await axios.post(`${API_BASE_URL}/get_answer`, 
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
      setActiveTab('context');
    } catch (error) {
      console.error('Error getting answer:', error);
      
      let errorMessage = 'Error getting answer. Please try again.';
      
      if (error.response) {
        errorMessage = `Error ${error.response.status}: ${error.response.data.detail || 'Unknown error'}`;
      } else if (error.request) {
        errorMessage = 'No response received from server. Please check your connection.';
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

  // Function to truncate text
  const truncateText = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <h1 style={{color: 'Black', fontSize: 16, fontWeight: 500}}><Disc size={16} style={{marginTop: -5}} /> S24&apos;s Research Engine</h1>
            {processedInfo && selectedPaper && (
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
                        <p key={pIndex}>{paragraph}</p>
                      ))
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>

          {/* Search form */}
          {showSearchInput && (
            <form onSubmit={handleSearchPapers} className={styles.inputForm}>
                <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter the domain of the research paper..."
                disabled={isSearching}
                className={styles.chatInput}
                />
                <motion.button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className={styles.sendButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                >
                <Search size={16} />
                </motion.button>
            </form>
            )}

          {/* Question form - only show when a paper is processed */}
          {processedInfo && !showSearchInput && (
            <form onSubmit={handleQuery} className={styles.inputForm}>
                <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about this paper..."
                disabled={isQuerying || !processedInfo}
                className={styles.chatInput}
                />
                <motion.button
                type="submit"
                disabled={isQuerying || !processedInfo || !question.trim()}
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
            )}
          
          <div className={styles.settingsBar}>
            <div className={styles.kValueSelector}>
              <label htmlFor="kValue">
                <Disc2 size={10} style={{ marginTop: -2 }} /> Context Segments: {kValue}
                {subscription !== 'premium' && kValue >= maxKValue && (
                  <span className={styles.upgradeHint}> (Upgrade for more)</span>
                )}
              </label>
              <input
                type="range"
                id="kValue"
                min="1"
                max={subscription === 'premium' ? 10 : 3}
                value={kValue}
                onChange={handleKValueChange}
                className={styles.slider}
              />
            </div> &nbsp;
            <div className={styles.kValueSelector}>
              <label htmlFor="maxResults">
                <FileText size={10} style={{ marginTop: -2 }} /> Max Results: {maxResults}
                {subscription !== 'premium' && maxResults >= maxResultsValue && (
                  <span className={styles.upgradeHint}> (Upgrade for more)</span>
                )}
              </label>
              <input
                type="range"
                id="maxResults"
                min="1"
                max={subscription === 'premium' ? 50 : 5}
                value={maxResults}
                onChange={handleMaxResultsChange}
                className={styles.slider}
              />
            </div>&nbsp;
            {/* {subscription !== 'premium' && (
              <div className={styles.upgradeBanner}>
                <a href="/upgrade" className={styles.upgradeLink}>
                  Upgrade to Premium for more context and results
                </a>
              </div>
            )} */}
          </div>
            <div className={styless.toggleContainer}>
                <label className={styless.toggleSwitch}>
                    <input 
                    type="checkbox" 
                    checked={showSearchInput}
                    onChange={toggleSearchInput}
                    />
                    <span className={styless.slider}></span>
                </label>
                <span className={styless.toggleLabel}>
                    {showSearchInput ? "Hide Search" : "Show Search"}
                </span>
            </div>
        </div>
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
                  <p style={{color: 'grey'}}><Bookmark size={13} style={{marginTop: -1}} /> Showing {searchResults.length} papers found from your search.</p>
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
              
              {/* Search Results Tab (Previously Book Headings) */}
              {activeTab === 'headings' && (
                <div className={styles.headingsGrid}>
                  {searchResults.map((paper, index) => (
                    <motion.div 
                      key={index} 
                      className={styles.headingCard}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.05 * index }}
                      onClick={() => openHeadingPopup(paper)}
                      whileHover={{ scale: 1.02, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                    >
                      <h3><Bookmark size={14} style={{marginTop: -3}} /> {truncateText(paper.title, 60)}</h3>
                      <span className={styles.pageIndicator}>{paper.published} • {paper.authors[0]}{paper.authors.length > 1 ? ' et al.' : ''}</span>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {activeTab === 'headings' && searchResults.length === 0 && (
                <div className={styles.noContentMessage}>
                  <Info size={24} />
                  <p style={{fontSize: 14}}>No papers found yet. Try searching for a topic.</p>
                </div>
              )}
            </motion.div>
        </AnimatePresence>

        {/* Paper Content Popup */}
        <AnimatePresence>
          {showHeadingPopup && selectedHeading && (
            <motion.div 
              className={styless.popupOverlay}
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
                <div className={styless.popupHeader}>
                  <h2><Bookmark size={18} /> {selectedHeading.title}</h2>
                  <span className={styless.pageIndicator}>
                    Published: {selectedHeading.published} • 
                    Authors: {selectedHeading.authors.join(', ')}
                  </span>
                  <div className={styless.popupActions}>
                    <button 
                      className={styless.processButton} 
                      onClick={() => {
                        handleProcessPaper(selectedHeading);
                        closeHeadingPopup();
                      }}
                      disabled={isProcessing}
                    >
                      <ScanSearch size={15} style={{marginTop: -3}} />&nbsp; {isProcessing ? 'Processing...' : 'Process Paper'}
                    </button>
                    <button style={{backgroundColor: 'aqua', color: 'grey', borderRadius: 10, padding: 10, marginLeft: 20, fontSize: 14}} onClick={closeHeadingPopup}>
                      <X color='grey' size={16} style={{marginTop: -3}} /> Close
                    </button>
                  </div>
                </div>
                <div className={styless.popupBody}>
                  <h3><NotebookTabs size={15} style={{marginTop: -1}} /> Summary:</h3>
                  <p>{selectedHeading.summary}</p>
                  {selectedHeading.doi && (
                    <p><strong><Disc2 size={15} style={{marginTop: -1}} /> DOI:</strong> {selectedHeading.doi}</p>
                  )}
                  {/* <p><strong>arXiv ID:</strong> {selectedHeading.arxiv_id}</p> */}
                  <p>
                    <button 
                        className={styless.processButtons} 
                        onClick={() => openPdfPopup(selectedHeading.pdf_url)}
                    >
                        <ScanSearch size={15} style={{marginTop: -2}} /> View PDF
                    </button>
                    </p>                
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
            {showPdfPopup && pdfToShow && selectedHeading && (
                <motion.div 
                className={styless.popupOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closePdfPopup}
                >
                <motion.div 
                    className={styless.pdfPopupContent}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                >
                    <div className={styless.popupHeaders}>
                        <h2 style={{fontSize: 26}}><Bookmark style={{marginTop: -5}} size={24} /> {selectedHeading.title}</h2>
                        <span className={styless.pageIndicator}>
                            Published: {selectedHeading.published} • 
                            Authors: {selectedHeading.authors.join(', ')}
                        </span>
                        <button 
                            style={{backgroundColor: 'white', color: 'black', borderRadius: 10, padding: 10, fontSize: 14}} 
                            onClick={closePdfPopup}
                        >
                            <X color='black' size={16} style={{marginTop: -3}} /> Close
                        </button>
                    </div>
                    <div className={styless.pdfContainer}>
                    <iframe
                        src={pdfToShow}
                        width="100%"
                        height="100%"
                        style={{ border: 'none' }}
                        title="PDF Viewer"
                    />
                    </div>
                </motion.div>
                </motion.div>
            )}
            </AnimatePresence>
        
      </main>
    </div>
  );
}