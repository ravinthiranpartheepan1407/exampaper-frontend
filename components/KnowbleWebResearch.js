"use client";
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import styles from "../public/KnowbleWebResearch.module.css";
import { Disc2, Focus, Loader2, ScanEye, ScanSearch, SendHorizonal, Settings, TrendingUp, ChevronLeft, ChevronRight, Settings2, ArrowUp, ArrowDown, CircleChevronUp, CircleChevronDown } from 'lucide-react';

export default function KnowbleWebResearch() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWebsiteLoaded, setIsWebsiteLoaded] = useState(false);
  const [websiteContent, setWebsiteContent] = useState('');
  const [websitePreview, setWebsitePreview] = useState('');
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [allowSelfSigned, setAllowSelfSigned] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(true);

  const [isValidUrl, setIsValidUrl] = useState(false);

  const chatContainerRef = useRef(null);

  // Scroll to bottom of chat when history changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    setIsValidUrl(url.trim().toLowerCase().startsWith('https://'));
  }, [url]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadWebsite = async () => {
    if (!url) {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://edevalentum.com/api/load-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          allow_self_signed: allowSelfSigned,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to load website');
      }

      const data = await response.json();
      setWebsiteContent(data.content);
      setWebsitePreview(data.preview);
      setIsWebsiteLoaded(true);
      setError('');
    } catch (err) {
      setError(err.message || 'An error occurred while loading the website');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    if (!isWebsiteLoaded) {
      setError('Please load a website first');
      return;
    }

    // Add user message to chat history
    const userMessage = { role: 'user', content: prompt };
    setChatHistory([...chatHistory, userMessage]);
    
    // Clear input
    setPrompt('');
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://edevalentum.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          prompt: userMessage.content,
          website_content: websiteContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get response');
      }

      const data = await response.json();
      
      // Add AI response to chat history
      setChatHistory(prevHistory => [
        ...prevHistory, 
        { role: 'assistant', content: data.response }
      ]);
    } catch (err) {
      setError(err.message || 'An error occurred during the chat');
      // Add error message to chat
      setChatHistory(prevHistory => [
        ...prevHistory, 
        { role: 'system', content: `Error: ${err.message || 'An error occurred'}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.contentLayout}>
          <div className={styles.sidebarToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronLeft size={24} /> : <Settings2 size={24} />}
          </div>
          
          {/* Sidebar with conditional class for mobile */}
          <aside className={`${styles.sidebar} ${!sidebarOpen ? styles.hidden : ''}`}>
            <h2 style={{fontSize: 20, fontWeight: 500}}><Settings size={20} style={{marginTop: -2}} /> Settings</h2>
            <hr style={{borderColor: 'black'}} />
            <p style={{fontSize: 15}}>Only use web URLs that begin with https for research purposes. URLs that do not have valid HTTPS certificates will be ignored and are not permitted for research.</p>
            
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="allowSelfSigned"
                checked
                onChange={(e) => setAllowSelfSigned(e.target.checked)}
              />
              <label style={{fontSize: 15}} htmlFor="allowSelfSigned">Allow Only HTTPS Certificates</label>
            </div>

            <button className={styles.loadButtons}>
              <TrendingUp size={16} style={{marginTop: -3}} /> Upgrade to Premium (Soon)
            </button>
            
            <hr className={styles.divider} />
            
            <h2 style={{fontSize: 20, fontWeight: 500}}><ScanSearch size={20} style={{marginTop: -2}} /> How to use? </h2>
            <hr style={{borderColor: 'black'}} />
            <p style={{fontSize: 15}}><Disc2 size={15} /> Input a website URL to analyze</p>
            <p style={{fontSize: 15}}><Disc2 size={15} /> Click "Load Website" to fetch the content</p>
            <p style={{fontSize: 15}}><Disc2 size={15} /> Being you research about the website contexts</p>
            <button className={styles.loadButtons}>
              <SendHorizonal size={16} style={{marginTop: -3}} /> Have any questions? (Soon)
            </button>
          </aside>

          {/* Main content area */}
          <div className={styles.content}>
            <h1 style={{fontSize: 16}}><ScanSearch style={{marginTop: -3}} size={16} /> Copy and Paste Web URL:</h1>
            
            <div className={styles.urlInputContainer}>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://studypoints24.com"
                className={styles.urlInput}
                disabled={isLoading}
              />
              <button 
                onClick={loadWebsite} 
                disabled={isLoading || !url || !isValidUrl}
                className={styles.loadButton}
              >
                <Disc2 size={16} style={{marginTop: -3}} /> {isLoading ? 'Loading...' : 'Load Website'}
              </button>
            </div>

            {url && !isValidUrl && 
              <div className={styles.error}>URL must start with https://</div>
            }
            
            {/* Preview container */}
            {isWebsiteLoaded && (
              <div className={`${styles.previewContainer} ${isPreviewExpanded ? styles.expanded : ''}`}>
                <h3 
                  onClick={() => setIsPreviewExpanded(!isPreviewExpanded)} 
                  className={styles.previewTitle}
                >
                  <ScanEye size={16} style={{marginTop: -3}} /> Context Preview 
                  {isPreviewExpanded ? 
                    <CircleChevronUp size={16} style={{marginLeft: '5px'}} /> : 
                    <CircleChevronDown size={16} style={{marginLeft: '5px'}} />
                  }
                </h3>
                {isPreviewExpanded && (
                  <div className={styles.preview}>
                    <textarea
                      value={websitePreview}
                      readOnly
                      className={styles.previewText}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Chat section */}
            <div className={styles.chatSection}>
              <h2><Focus size={18} style={{marginTop: -3}} /> Research Loaded Contexts</h2>
              
              <div className={styles.chatContainer} ref={chatContainerRef}>
                {chatHistory.length === 0 ? (
                  <div className={styles.emptyChatMessage}>
                    <Disc2 size={16} /> {isWebsiteLoaded 
                      ? 'Ask a question about the website content' 
                      : 'Load a website to start the research'}
                  </div>
                ) : (
                  chatHistory.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`${styles.message} ${
                        msg.role === 'user' 
                          ? styles.userMessage 
                          : msg.role === 'system' 
                            ? styles.systemMessage 
                            : styles.assistantMessage
                      }`}
                    >
                      <div className={styles.messageContent}>
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className={`${styles.message} ${styles.assistantMessage}`}>
                    <div className={styles.messageContent}>
                      <div className={styles.typingIndicator}>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <form onSubmit={handleChat} className={styles.inputForm}>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask about the website content..."
                  className={styles.chatInput}
                  disabled={isLoading || !isWebsiteLoaded}
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !isWebsiteLoaded || !prompt.trim()}
                  className={styles.sendButton}
                >
                  <Focus size={16} style={{marginTop: -3}} /> Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}