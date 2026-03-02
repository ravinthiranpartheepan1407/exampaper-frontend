
"use client";
import { BookCheck, BookDashed, Eye, Focus, Languages, Layers, Layers2, NotebookPen, NotepadText, Pen, RotateCcw, Route, ScanSearch, Settings2, Text, Wand } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const ParaphraseText = () => {
  // State management
  const [originalText, setOriginalText] = useState('');
  const [paraphrasedText, setParaphrasedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('result');
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);

  // Paraphrasing options
  const [style, setStyle] = useState('standard');
  const [strength, setStrength] = useState(0.5);
  const [preserveNamedEntities, setPreserveNamedEntities] = useState(true);
  const [maintainSentenceStructure, setMaintainSentenceStructure] = useState(false);
  const [useContextualSynonyms, setUseContextualSynonyms] = useState(true);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Refs for animation
  const resultContainerRef = useRef(null);

  // List of available styles
  const paraphrasingStyles = [
    { value: 'standard', label: 'Standard' },
    { value: 'formal', label: 'Formal' },
    { value: 'informal', label: 'Informal' },
    { value: 'academic', label: 'Academic' },
    { value: 'simple', label: 'Simple' },
    { value: 'technical', label: 'Technical' },
    { value: 'creative', label: 'Creative' }
  ];

  // Handle form submission
  const handleParaphrase = async (e) => {
    e.preventDefault();
    
    if (!originalText.trim()) {
      setError('Please enter text to paraphrase');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // API request to paraphrase - Modified to address CORS issues
      const response = await fetch('https://edevalentum.com//paraphrase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          text: originalText,
          style,
          strength,
          preserve_named_entities: preserveNamedEntities,
          maintain_sentence_structure: maintainSentenceStructure,
          use_contextual_synonyms: useContextualSynonyms,
        }),
        // Add mode credentials for CORS
        mode: 'cors',
        credentials: 'same-origin',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      setParaphrasedText(data.paraphrased_text);
      setAnalysisData({
        similarity: data.similarity,
        originalComplexity: data.original_complexity,
        paraphrasedComplexity: data.paraphrased_complexity,
        namedEntities: data.named_entities,
      });

      // Scroll to result
      if (resultContainerRef.current) {
        resultContainerRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message || 'Failed to paraphrase text. Please check if the API server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Add function to fetch available styles from API (optional)
  const fetchStyles = async () => {
    try {
      const response = await fetch('https://edevalentum.com//styles', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Available styles:", data.styles);
        // You could update paraphrasingStyles here if needed
      }
    } catch (err) {
      console.error("Failed to fetch styles:", err);
    }
  };

  // Fetch styles when component mounts (optional)
  useEffect(() => {
    fetchStyles();
  }, []);

  // Analysis function (for text-only analysis)
  const analyzeText = async (text) => {
    try {
      const params = new URLSearchParams({ text });
      const response = await fetch(`https://edevalentum.com//analyze?${params}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.complexity;
      }
      return null;
    } catch (err) {
      console.error("Analysis error:", err);
      return null;
    }
  };

  const handleReset = () => {
    setOriginalText('');
    setParaphrasedText('');
    setAnalysisData(null);
    setError(null);
    setStyle('standard');
    setStrength(0.5);
    setPreserveNamedEntities(true);
    setMaintainSentenceStructure(false);
    setUseContextualSynonyms(true);
  };

  // Format percentage for display
  const formatPercentage = (value) => {
    return (value * 100).toFixed(0) + '%';
  };

  // Copy to clipboard function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Optional: Show feedback that text was copied
        const copyButton = document.querySelector('.copy-button');
        if (copyButton) {
          copyButton.setAttribute('data-copied', 'true');
          setTimeout(() => {
            copyButton.removeAttribute('data-copied');
          }, 2000);
        }
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  // Display the correct readability color
  const getReadabilityColor = (readability) => {
    const readabilityMap = {
      'Very Simple': '#4caf50',
      'Simple': '#8bc34a',
      'Standard': '#2196f3',
      'Moderately Complex': '#ff9a00',
      'Complex': 'aqua'
    };
    
    return readabilityMap[readability] || '#2196f3';
  };

  return (
    <div className="paraphrase-container">
      
      <div className="input-section">
        <label htmlFor="originalText"><Text size={16} style={{marginTop: -3}} /> Original Text</label>
        <textarea
          id="originalText"
          value={originalText}
          onChange={(e) => setOriginalText(e.target.value)}
          placeholder="Enter text to paraphrase..."
          rows={6}
        />
      </div>
      
      <div className="options-section">
        <div className="options-row">
          <div className="option-group">
            <label htmlFor="style"><Layers size={16} style={{marginTop: -3}} /> Words Style</label>
            <select
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              {paraphrasingStyles.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="option-group slider-group">
            <label htmlFor="strength">
                <Route size={16} style={{marginTop: -3}} /> Words Masking Strength: {formatPercentage(strength)}
            </label>
            <input
              type="range"
              id="strength"
              min="0.1"
              max="1"
              step="0.1"
              value={strength}
              onChange={(e) => setStrength(parseFloat(e.target.value))}
            />
          </div>
        </div>
        
        <div className="advanced-options">
          <div className="advanced-header" onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
            <span><Settings2 size={16} style={{marginTop: -3}} /> Advanced Options</span>
            <span className={`arrow ${showAdvancedOptions ? 'open' : ''}`}>▼</span>
          </div>
          
          {showAdvancedOptions && (
            <div className="advanced-content">
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="preserveNamedEntities"
                  checked={preserveNamedEntities}
                  onChange={(e) => setPreserveNamedEntities(e.target.checked)}
                />
                <label htmlFor="preserveNamedEntities">Preserve Named Entities</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="maintainSentenceStructure"
                  checked={maintainSentenceStructure}
                  onChange={(e) => setMaintainSentenceStructure(e.target.checked)}
                />
                <label htmlFor="maintainSentenceStructure">Maintain Sentence Structure</label>
              </div>
              
              <div className="checkbox-option">
                <input
                  type="checkbox"
                  id="useContextualSynonyms"
                  checked={useContextualSynonyms}
                  onChange={(e) => setUseContextualSynonyms(e.target.checked)}
                />
                <label htmlFor="useContextualSynonyms">Use Contextual Synonyms</label>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="action-buttons">
        <button 
          className="paraphrase-button" 
          onClick={handleParaphrase}
          disabled={loading || !originalText.trim()}
        >
          <NotebookPen size={16} style={{marginTop: -2}} /> {loading ? 'Processing...' : 'Paraphrase Text'}
        </button>
        <button className="reset-button" onClick={handleReset}>
            <RotateCcw size={16} style={{marginTop: -3}} /> Reset
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {paraphrasedText && (
        <div className="result-container" ref={resultContainerRef}>
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'result' ? 'active' : ''}`}
              onClick={() => setActiveTab('result')}
            >
              <NotepadText size={16} style={{marginTop: -3}} /> Paraphrased Result
            </button>
            <button
              className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
              onClick={() => setActiveTab('analysis')}
            >
              <Wand size={16} style={{marginTop: -3}} /> Analysis
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'result' && (
              <div className="result-text">
                <div className="result-header">
                  <h3><Route size={16} style={{marginTop: -3}} /> Paraphrased Text</h3>
                  <button
                    className="copy-button"
                    onClick={() => copyToClipboard(paraphrasedText)}
                    title="Copy to clipboard"
                    data-copied="false"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.3333 6H7.33333C6.59695 6 6 6.59695 6 7.33333V13.3333C6 14.0697 6.59695 14.6667 7.33333 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V7.33333C14.6667 6.59695 14.0697 6 13.3333 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3.33333 10H2.66667C2.31305 10 1.97391 9.85952 1.72386 9.60948C1.47381 9.35943 1.33333 9.02029 1.33333 8.66667V2.66667C1.33333 2.31305 1.47381 1.97391 1.72386 1.72386C1.97391 1.47381 2.31305 1.33333 2.66667 1.33333H8.66667C9.02029 1.33333 9.35943 1.47381 9.60948 1.72386C9.85952 1.97391 10 2.31305 10 2.66667V3.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div className="text-content">
                  {paraphrasedText}
                </div>
              </div>
            )}
            
            {activeTab === 'analysis' && analysisData && (
              <div className="analysis-content">
                <div className="analysis-metric">
                  <div className="metric-label"><ScanSearch size={16} style={{marginTop: -3}} /> Similarity to Original</div>
                  <div className="metric-value">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${analysisData.similarity * 100}%` }}
                      ></div>
                    </div>
                    <div className="progress-value">{(analysisData.similarity * 100).toFixed(1)}%</div>
                  </div>
                </div>
                
                <div className="comparison-table">
                  <div className="comparison-header">
                    <div className="metric-name"><Focus size={14} style={{marginTop: -1}} /> Metric</div>
                    <div className="original-column"><NotebookPen size={14} style={{marginTop: -2}} /> Original</div>
                    <div className="paraphrased-column"><Route size={14} style={{marginTop: -1}} /> Paraphrased</div>
                  </div>
                  
                  <div className="comparison-row">
                    <div className="metric-name"><Languages size={14} style={{marginTop: -1}} /> Word Count</div>
                    <div className="original-column"> {analysisData.originalComplexity.word_count}</div>
                    <div className="paraphrased-column">{analysisData.paraphrasedComplexity.word_count}</div>
                  </div>
                  
                  <div className="comparison-row">
                    <div className="metric-name"><Pen size={14} style={{marginTop: -1}} /> Sentences</div>
                    <div className="original-column">{analysisData.originalComplexity.sentences}</div>
                    <div className="paraphrased-column">{analysisData.paraphrasedComplexity.sentences}</div>
                  </div>
                  
                  <div className="comparison-row">
                    <div className="metric-name"><BookCheck size={14} style={{marginTop: -1}} /> Avg. Word Length</div>
                    <div className="original-column">{analysisData.originalComplexity.avg_word_length}</div>
                    <div className="paraphrased-column">{analysisData.paraphrasedComplexity.avg_word_length}</div>
                  </div>
                  
                  <div className="comparison-row">
                    <div className="metric-name"><BookDashed size={14} style={{marginTop: -1}} /> Lexical Diversity</div>
                    <div className="original-column">{analysisData.originalComplexity.lexical_diversity}</div>
                    <div className="paraphrased-column">{analysisData.paraphrasedComplexity.lexical_diversity}</div>
                  </div>
                  
                  <div className="comparison-row">
                    <div className="metric-name"><Eye size={14} style={{marginTop: -1}} /> Readability</div>
                    <div className="original-column">
                      <span className="readability-badge" style={{
                        backgroundColor: getReadabilityColor(analysisData.originalComplexity.readability)
                      }}>
                        {analysisData.originalComplexity.readability}
                      </span>
                    </div>
                    <div className="paraphrased-column">
                      <span className="readability-badge" style={{
                        backgroundColor: getReadabilityColor(analysisData.paraphrasedComplexity.readability)
                      }}>
                        {analysisData.paraphrasedComplexity.readability}
                      </span>
                    </div>
                  </div>
                </div>
                
                {analysisData.namedEntities && analysisData.namedEntities.length > 0 && (
                  <div className="named-entities-section">
                    <h4><Layers2 size={14} style={{marginTop: -1}} /> Named Entities Preserved</h4>
                    <div className="entities-list">
                      {analysisData.namedEntities.map((entity, index) => (
                        <div key={index} className="entity-item">
                          <span className="entity-text">{entity.text}</span>
                          <span className="entity-type">{entity.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    <style jsx>{`
        .paraphrase-container {
        max-width: 1200px;
        margin: 2rem auto;
        padding: 2rem;
        background-color: aqua;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .paraphrase-container h1 {
        color: #334155;
        font-size: 1.8rem;
        margin-bottom: 1.5rem;
        text-align: center;
        font-weight: 600;
        }

        /* Input Section */
        .input-section {
        margin-bottom: 1.5rem;
        }

        .input-section label {
        display: block;
        font-size: 0.9rem;
        font-weight: 500;
        color: #475569;
        margin-bottom: 0.5rem;
        }

        .input-section textarea {
        width: 100%;
        min-height: 230px;
        padding: 1rem;
        border: 0px solid #cbd5e1;
        border-radius: 20px;
        font-size: 0.9rem;
        color: #a6264c;
        background-color: white;
        box-shadow: 0 10px 30px rgba(221, 196, 254, 0.5),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(3px);    
        resize: vertical;
        transition: border-color 0.2s ease;
        }

        .input-section textarea:focus {
        outline: none;
        border-color: #64748b;
        box-shadow: 0 0 0 2px rgba(100, 116, 139, 0.1);
        }

        /* Options Section */
        .options-section {
        background-color: #fff;
        border-radius: 20px;
        padding: 1.25rem;
        margin-bottom: 1.5rem;
        border: 1px solid #e2e8f0;
        }

        .options-row {
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;
        margin-bottom: 1rem;
        }

        .option-group {
        flex: 1;
        min-width: 200px;
        }

        .option-group label {
        display: block;
        font-size: 0.85rem;
        color: #475569;
        margin-bottom: 0.5rem;
        font-weight: 500;
        }

        .option-group select {
        width: 100%;
        padding: 0.6rem;
        font-size: 0.9rem;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        background-color: #fff;
        color: #334155;
        cursor: pointer;
        }

        .slider-group input[type="range"] {
        width: 100%;
        height: 6px;
        -webkit-appearance: none;
        height: 6px;
        border-radius: 4px;
        background: linear-gradient(to left, #4facfe, #00f2fe);
        border-radius: 3px;
        outline: none;
        }

        .slider-group input[type="range"]::-webkit-slider-thumb {
         -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: white;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
            border: 2px solid #4facfe;
        }

        .slider-group input[type="range"]::-webkit-slider-thumb:hover {
        background: #2563eb;
        }

        /* Advanced Options */
        .advanced-options {
        margin-top: 1rem;
        }

        .advanced-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        cursor: pointer;
        color: #64748b;
        font-size: 0.9rem;
        font-weight: 500;
        border-top: 1px solid #e2e8f0;
        }

        .advanced-header .arrow {
        font-size: 0.75rem;
        transition: transform 0.3s ease;
        }

        .advanced-header .arrow.open {
        transform: rotate(180deg);
        }

        .advanced-content {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
        padding: 0.75rem 0;
        }

        .checkbox-option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        }

        /* Hide the default checkbox */
        .checkbox-option input[type="checkbox"] {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border: 1px solid #cbd5e1;
        border-radius: 3px;
        outline: none;
        cursor: pointer;
        background-color: white;
        position: relative;
        }

        /* Style for the checked state */
        .checkbox-option input[type="checkbox"]:checked {
        background-color: #06b6d4; /* Aqua/cyan color */
        border-color: #06b6d4;
        }

        /* Create a checkmark using ::after pseudo-element */
        .checkbox-option input[type="checkbox"]:checked::after {
        content: '';
        position: absolute;
        left: 5px;
        top: 2px;
        width: 5px;
        height: 9px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
        }

        .checkbox-option label {
        font-size: 0.85rem;
        color: #475569;
        cursor: pointer;
        }

        /* Action Buttons */
        .action-buttons {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
        }

        .paraphrase-button {
        flex: 3;
        padding: 0.75rem 1.5rem;
        background: linear-gradient(to left,rgba(79, 172, 254, 0.32), #00f2fe);
        color: #a6264c;
        border: none;
        border-radius: 40px;
        font-size: 0.95rem;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s ease;
        border: 1px solid #cbd5e1;
        }

        .paraphrase-button:hover {
        background-color: aqua;
        border: 1px solid #cbd5e1;
        }

        .paraphrase-button:disabled {
        background: linear-gradient(to left,rgba(79, 172, 254, 0.42), #00f2fe);
        cursor: not-allowed;
        }

        .reset-button {
        flex: 1;
        padding: 0.75rem 1.5rem;
        background-color: white;
        color: #475569;
        border: 1px solid #cbd5e1;
        border-radius: 40px;
        font-size: 0.95rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        }

        .reset-button:hover {
        background-color: #e2e8f0;
        }

        /* Error Message */
        .error-message {
        background-color: #fee2e2;
        border-left: 4px solid #ef4444;
        color: #b91c1c;
        padding: 0.75rem 1rem;
        border-radius: 4px;
        margin-bottom: 1.5rem;
        font-size: 0.9rem;
        }

        /* Results Container */
        .result-container {
        margin-top: 2rem;
        background-color: #fff;
        border-radius: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        border: 1px solid #e2e8f0;
        overflow: hidden;
        animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
        }

        /* Tabs */
        .tabs {
        display: flex;
        border-bottom: 1px solid #e2e8f0;
        }

        .tab {
        flex: 1;
        padding: 0.8rem 1rem;
        background: none;
        border: none;
        font-size: 0.95rem;
        font-weight: 500;
        color: #64748b;
        cursor: pointer;
        transition: all 0.2s ease;
        }

        .tab:hover {
        color: #334155;
        }

        .tab.active {
        color: #a6264c;
        background: aqua;
        }

        .tab-content {
        padding: 1.5rem;
        }

        /* Result Text */
        .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        }

        .result-header h3 {
        font-size: 1.1rem;
        font-weight: 600;
        color: #334155;
        margin: 0;
        }

        .copy-button {
        background: none;
        border: none;
        color: #64748b;
        cursor: pointer;
        padding: 0.3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s ease;
        }

        .copy-button:hover {
        color: #3b82f6;
        background-color: #f1f5f9;
        }

        .copy-button[data-copied="true"]::after {
        content: "Copied!";
        position: absolute;
        font-size: 0.75rem;
        background-color: #334155;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        margin-top: -30px;
        opacity: 1;
        animation: fadeOut 2s ease;
        }

        @keyframes fadeOut {
        0% { opacity: 1; }
        70% { opacity: 1; }
        100% { opacity: 0; }
        }

        .text-content {
        background-color: white;


        border-radius: 6px;
        color: #334155;
        font-size: 0.9rem;
        line-height: 1.6;

        }

        /* Analysis Content */
        .analysis-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        }

        .analysis-metric {
        margin-bottom: 0.5rem;
        }

        .metric-label {
        font-size: 0.9rem;
        font-weight: 500;
        color: #475569;
        margin-bottom: 0.5rem;
        }

        .metric-value {
        display: flex;
        align-items: center;
        gap: 1rem;
        }

        .progress-bar {
        flex: 1;
        height: 8px;
        background-color: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
        }

        .progress-fill {
        height: 100%;
        background: linear-gradient(to left, #4facfe, #00f2fe);
        border-radius: 4px;
        transition: width 0.5s ease;
        }

        .progress-value {
        font-size: 0.85rem;
        font-weight: 600;
        color: #64748b;
        min-width: 48px;
        text-align: right;
        }

        /* Comparison Table */
        .comparison-table {
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        overflow: hidden;
        }

        .comparison-header, .comparison-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        border-bottom: 1px solid #e2e8f0;
        }

        .comparison-header {
        background-color: #f1f5f9;
        font-weight: 600;
        font-size: 0.85rem;
        color: #475569;
        }

        .comparison-header > div, .comparison-row > div {
        padding: 0.75rem 1rem;
        }

        .comparison-row:last-child {
        border-bottom: none;
        }

        .metric-name {
        color: #475569;
        font-size: 0.85rem;
        }

        .original-column, .paraphrased-column {
        color: #334155;
        font-size: 0.85rem;
        text-align: center;
        }

        /* Readability Badge */
        .readability-badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        color: black;
        font-size: 0.75rem;
        font-weight: 500;
        }

        /* Named Entities Section */
        .named-entities-section {
        margin-top: 1rem;
        }

        .named-entities-section h4 {
        font-size: 1rem;
        font-weight: 500;
        color: #334155;
        margin-bottom: 0.75rem;
        }

        .entities-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        }

        .entity-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.4rem 0.75rem;
        background-color: aqua;
        border-radius: 40px;
        border: 1px solid #e2e8f0;
        }

        .entity-text {
        font-size: 0.85rem;
        color: #334155;
        }

        .entity-type {
        font-size: 0.6rem;
        background-color: white;
        color: #475569;
        padding: 0.1rem 0.35rem;
        border-radius: 20px;
        font-weight: 500;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
        .paraphrase-container {
            padding: 1.5rem;
            margin: 1rem;
        }
        
        .options-row {
            flex-direction: column;
            gap: 1rem;
        }
        
        .comparison-header, .comparison-row {
            grid-template-columns: 1.5fr 1fr 1fr;
        }
        
        .advanced-content {
            grid-template-columns: 1fr;
        }
        
        .action-buttons {
            flex-direction: column;
        }
        }
    `}</style>
    </div>
  );
};

export default ParaphraseText;