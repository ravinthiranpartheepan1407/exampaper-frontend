"use client";
import React, { useState, useEffect } from 'react';
import styles from '../public/InsuranceMarket.module.css';
import { Airplay, Disc, Dot, Filter, Focus, Layers, Notebook, NotebookText, Rocket, Search, Send, StepForward, X, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ExamMarket = () => {
  // Sample insurance products data
  const initialProducts = [
    { id: 1, name: 'NEET Vol.1 - Biology | Chemistry', image: 'https://fdryfwxmkllviwqmynme.supabase.co/storage/v1/object/public/exampaper/math-1.png', tags: ['NEET', "Physics", "Biology", "Chemistry"], price: 'Company Calculator', link: '/mock-exams/neet-vol-1' },
    { id: 2, name: 'JEE Main Mock Exam - Vol.1', image: 'https://fdryfwxmkllviwqmynme.supabase.co/storage/v1/object/public/exampaper/math-1.png', tags: ['JEE Main', "Math", "Physics", "Chemistry"], price: 'Company Calculator', link: '/mock-exams/jee-main-vol-1' },
    { id: 3, name: 'UPSC Preliminary Vol.1', image: 'https://fdryfwxmkllviwqmynme.supabase.co/storage/v1/object/public/exampaper/math-1.png', tags: ['UPSC', "History", "Geography", "Economy", "International Relations"], price: 'Company Calculator', link: '/mock-exams/upsc-preliminary-vol-1' },
    // { id: 4, name: 'IC 01 - Insurance Principles', image: 'https://zdmueezfheensjrefapy.supabase.co/storage/v1/object/sign/rust-timers/IC%2001.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJydXN0LXRpbWVycy9JQyAwMS5wbmciLCJpYXQiOjE3NDMxNDA4MTcsImV4cCI6MzMxOTk0MDgxN30.rzV7WmOdIgR_Sjw8zIHaY-49QeqiTL11K7fcAN89wLM', tags: ['Licentiate', "III", "IRDAI", "General Insurance"], price: 'Company Calculator', link: '/mock-exams/insurance-principles' },
    // { id: 5, name: 'IC 02 - Life Insurance Practices', image: 'https://zdmueezfheensjrefapy.supabase.co/storage/v1/object/sign/rust-timers/IC%2002.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJydXN0LXRpbWVycy9JQyAwMi5wbmciLCJpYXQiOjE3NDMyMzEwMjYsImV4cCI6MzMyMDAzMTAyNn0.XjSLofgCWTK2zrFPtHi1pj1HJVLwPpzip1ZNEtDKjAQ', tags: ['Licentiate', "III", "IRDAI", "Life Insurance"], price: 'Company Calculator', link: '/mock-exams/ic-02' },
    { id: 4, name: 'IC 11 - Practice of General Insurance', image: 'https://fdryfwxmkllviwqmynme.supabase.co/storage/v1/object/public/exampaper/math-1.png', tags: ['Licentiate', "III", "IRDAI", "General Insurance"], price: 'Company Calculator', link: '/mock-exams/ic-11' },
    { id: 5, name: 'AWS Cloud Practitioner', image: 'https://fdryfwxmkllviwqmynme.supabase.co/storage/v1/object/public/exampaper/math-1.png', tags: ['AWS', "Cloud Platform", "Certification", "Dev"], price: 'Company Calculator', link: '/mock-exams/aws-clf-c02' },
    { id: 6, name: 'Microsoft Certified: Azure Fundamentals', image: 'https://fdryfwxmkllviwqmynme.supabase.co/storage/v1/object/public/exampaper/math-1.png', tags: ['Microsoft Azure', "Cloud Platform", "Certification", "Dev"], price: 'Company Calculator', link: '/mock-exams/az-900' },

  ];

  const router = useRouter();

  // State for products, search input, and active tag
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductLink, setSelectedProductLink] = useState('');
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Extract all unique tags from products
  useEffect(() => {
    const tagsSet = new Set();
    initialProducts.forEach(product => {
      product.tags.forEach(tag => tagsSet.add(tag));
    });
    setAllTags(Array.from(tagsSet).sort());
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      setUserEmail(tokenData.email);
    } catch (err) {
      console.error('Error decoding token:', err);
    }
  }, []);

  // Function to handle product start button click
  const handleStartExam = (link) => {
    setSelectedProductLink(link);
    setShowModal(true);
  };

  // Function to confirm and navigate to exam
  const confirmAndNavigate = () => {
    if (isAcknowledged) {
      router.push(selectedProductLink);
      setShowModal(false);
      setIsAcknowledged(false);
    }
  };

  // Function to filter products based on search term and active tag
  const filterProducts = () => {
    let filteredProducts = initialProducts;
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by active tag
    if (activeTag !== '') {
      filteredProducts = filteredProducts.filter(product => 
        product.tags.includes(activeTag)
      );
    }
    
    setProducts(filteredProducts);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };

  // Handle tag selection
  const handleTagClick = (tag) => {
    // If tag is already active, deselect it, otherwise select it
    setActiveTag(activeTag === tag ? '' : tag);
  };

  // Apply filters whenever search term or active tag changes
  useEffect(() => {
    filterProducts();
  }, [searchTerm, activeTag]);

  return (
    <div style={{backgroundColor: 'white'}} className={styles.container}>
      <div className="hero-section">
          <div className="hero-content">
              <h1 className="hs-title-8">Test Your Learnings</h1>
              <p style={{color: 'white'}} className='hs-title'>Prepare for your exams with our Knowble mock tests.</p>
              <div className="upload-sections">
                  <div className="file-upload">
                      <label className="upload-btn">
                          <StepForward style={{width: 15, color: '#15173D'}} />
                          <span>Apply for</span>
                          <button 
                              onClick={() => router.push("https://forms.office.com/r/8DFMQGJypx")} 
                              className="evaluate-btn"
                          >
                              Business English Programme
                          </button>
                      </label>
                  </div>
              </div>
          </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{backgroundColor: '#bff2f7', padding: 15, borderRadius: 16}}>
            <h2 style={{fontSize: 18, fontWeight: 600, marginTop: 12}}><Airplay size={20} style={{marginTop: -2}} /> Instructor Information</h2>
            </div>
            <div style={{textAlign: 'left', marginTop: 15}}>
              {/* <p><Disc size={15} style={{marginTop: -4}} /> The access code to the test is valid only for 72 hours.</p>
              <p><Disc size={15} style={{marginTop: -4}} /> Keep the access code safely. If you lose it, you'll have to buy a new one.</p>
              <p><Disc size={15} style={{marginTop: -4}} /> Make sure to save progress of test. There is no auto-save feature.</p> */}
              {/* <p><Disc size={15} style={{marginTop: -4}} /> You can view saved answers to questions in the dashboard by clicking the "View Saved Answers" button.</p> */}
              <p><Disc size={15} style={{marginTop: -4}} /> You can use our AI Research assistant built for this exam module unlimited times.</p>
              <p><Disc size={15} style={{marginTop: -4}} /> Mock test engine to help you learn. Questions may vary.</p>

            </div>

            
            <div className="modal-acknowledgement">
              <div className="custom-checkbox-wrapper">
                <input 
                  type="checkbox" 
                  id="acknowledge" 
                  className="custom-checkbox-input"
                  checked={isAcknowledged}
                  onChange={() => setIsAcknowledged(!isAcknowledged)}
                />
                <label className="custom-checkbox-label" htmlFor="acknowledge">
                  <span className="custom-checkbox-box"></span>
                  <span className="custom-checkbox-text">I have read and understood the above information</span>
                </label>
              </div>
            </div>

            <div style={{ marginTop: 10 }} className="modal-actions">
              <button onClick={() => setShowModal(false)} className="modal-cancel">
                <X size={15} style={{ marginTop: -3 }} /> Cancel
              </button>
              <button
                onClick={userEmail ? confirmAndNavigate : () => router.push('/get-started')}
                className="modal-confirm"
                disabled={!isAcknowledged}
              >
                <Send size={15} style={{ marginTop: -3 }} /> {userEmail ? 'Get Started' : 'Login / Register'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="search-container">
        <div className="search-icon-wrapper">
          <Search size={20} className="search-icon" />
        </div>
        <input
          type="text"
          placeholder="Search by name or tag..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="tag-filter-container">
        <h3><Layers size={18} style={{marginTop: -5}} /> Filter by tag:</h3>
        <div className="all-tags">
          {allTags.map((tag, index) => (
            <span 
              key={index} 
              className={`filter-tag ${activeTag === tag ? 'active-tag' : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              <Dot size={12} style={{marginTop: -3}} /> {tag}
            </span>
          ))}
        </div>
        {activeTag && (
          <button className="clear-filter" onClick={() => setActiveTag('')}>
            Clear filter
          </button>
        )}
      </div>
      
      <div className={styles.results}>
        <p className={styles.resultCount}>
          Showing {products.length} {products.length === 1 ? 'result' : 'results'}
          {activeTag && <span> for tag: <strong>{activeTag}</strong></span>}
        </p>
      </div>
      
      <div className={styles.cardGrid}>
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="product-card">
              <div className="card-image-container">
                <img src={product.image} alt={product.name} className="card-image" />
              </div>
              <div className="card-content">
                <h4 className="card-title"><Focus size={18} style={{marginTop: -5}} /> {product.name}</h4>
                <div className="card-tag-container">
                  {product.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className={`card-tag ${tag === activeTag ? 'active-card-tag' : ''}`}
                      onClick={() => handleTagClick(tag)}
                    >
                      <Zap size={12} style={{marginTop: -3}} /> {tag}
                    </span>
                  ))}
                </div>
                <button 
                  className="view-details-button"
                  onClick={() => handleStartExam(product.link)}
                >
                  <NotebookText size={18} style={{marginTop: -3}} /> Get Started
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noResults}>
            <p>No insurance products found matching {searchTerm ? `"${searchTerm}"` : ""} 
              {activeTag && searchTerm ? " and " : ""}
              {activeTag ? `tag "${activeTag}"` : ""}
            </p>
          </div>
        )}
      </div>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Lustria&family=DM+Sans:ital,opsz,wght@0,9..40,100..900;1,9..40,100..900&display=swap');
        .hero-section {
            text-align: center;
            margin-bottom: 40px;
            margin-top: -100px;
            background-image: url('./texture/audio.jpg');
            background-size: cover;
            background-position: center;
            background-blend-mode: overlay;
            padding: 40px;
            border-radius: 10px;
            position: relative;
            box-shadow: 0 10px 30px rgba(227, 207, 250, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(1px);   
        }

        .hero-section::before {
             content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 10px;
            background-color: rgba(147, 81, 255, 0.16); /* Darkens the background image */
            border: 1px solid rgba(255, 255, 255, 0.05);     
            box-shadow: 0 10px 30px rgba(208, 172, 255, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(2px);       
            z-index: 1;
        }

        .hero-content {
            position: relative;
            z-index: 2;
        }

        .hero-section h1 {
            font-size: 3rem;
            margin-bottom: 1.5rem;
            color: #FFFFFF;
            font-weight: 700;
            letter-spacing: -0.5px;
            font-family: "Lustria", serif;
        }

        .upload-sections {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1.5rem;
            margin-top: 2rem;
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
          background-color: #15173D;
          color: #fff;
          border: none;
          border-radius: 40px;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          cursor: pointer;
          margin-left: 1rem;
        }


        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          box-shadow: 0 10px 30px rgba(221, 196, 254, 0.5),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px); 
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 30px;
          max-width: 700px;
          width: 90%;
          box-shadow: 0 10px 30px rgba(221, 196, 254, 0.5),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(3px); 
          text-align: left;
        }

        .modal-content h2 {
          margin-bottom: 1rem;
          color: #333;
          text-align: left;
        }

        .modal-content ul {
          list-style-type: none;
          padding: 0;
          margin-bottom: 1rem;
          text-align: left;
          color: #15173D;
        }

        .modal-content li {
          margin-bottom: 0.75rem;
          position: relative;
          text-align: left;
          color: #15173D;
        }

        .modal-content li::before {
          position: absolute;
          left: 0;
          text-align: left;
          color: #15173D;
        }

        .modal-acknowledgement {
          display: flex;
          align-items: left;
          margin-bottom: 1rem;
        }

        .modal-acknowledgement input {
          margin-right: 0.5rem;
        }

        .modal-actions {
          display: flex;
          justify-content: space-between;
        }

        .modal-cancel, .modal-confirm {
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .modal-cancel {
          background-color: white;
          border: 1px solid #ddd;
          color: #333;
          border-radius: 40px;
          font-size: 13px;
        }

        .modal-confirm {
          background-color: blue;
          color: white;
          border: none;
           border-radius: 40px;
          font-size: 13px;
        }

        .modal-confirm:disabled {
          background-color: #bff2f7;
          cursor: not-allowed;
           border-radius: 40px;
          font-size: 13px;
          color: grey;
        }

        .custom-checkbox-wrapper {
          display: flex;
          align-items: center;
        }

        .custom-checkbox-input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .custom-checkbox-label {
          display: flex;
          align-items: center;
          position: relative;
          cursor: pointer;
          font-weight: 600;
          user-select: none;
        }

        .custom-checkbox-box {
          display: inline-block;
          position: relative;
          width: 22px;
          height: 22px;
          margin-right: 10px;
          border: 2px solid blue;
          border-radius: 7px;
          transition: all 0.2s ease;
        }

        .custom-checkbox-input:checked + .custom-checkbox-label .custom-checkbox-box {
          background-color: blue;
          border-color: blue;
        }

        .custom-checkbox-box::after {
          content: '';
          position: absolute;
          display: none;
        }

        .custom-checkbox-input:checked + .custom-checkbox-label .custom-checkbox-box::after {
          display: block;
          left: 7px;
          top: 3px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .custom-checkbox-text {
          color: #333;
          transition: color 0.2s ease;
        }

        .custom-checkbox-input:checked + .custom-checkbox-label .custom-checkbox-text {
          color: blue;
        }


        /* New Search Container with Icon */
        .search-container {
          position: relative;
          display: flex;
          align-items: center;
          max-width: 600px;
          margin: 0 auto;
          border-radius: 50px;
          border: 1px solid #e0e0e0;
          background-color: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition: box-shadow 0.3s ease;
        }

        .search-container:focus-within {
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          border-color: blue;
        }

        .search-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 0.75rem;
        }

        .search-icon {
          color: #666;
        }

        .search-input {
          flex: 1;
          border: none;
          padding: 0.75rem 1rem 0.75rem 0;
          font-size: 1rem;
          outline: none;
          background: transparent;
        }

        .search-input::placeholder {
          color: #999;
        }

        .tag-filter-container {
          margin: 1.5rem 0;
        }

        .tag-filter-container h3 {
          margin-bottom: 0.5rem;
          color: #333;
          font-size: 1rem;
        }

        .all-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .filter-tag {
          background: #bff2f7;
          color: #15173D;
          padding: 0.3rem 0.6rem;
          border-radius: 50px;
          font-size: 0.8rem;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }

        .filter-tag:hover {
          background: white;
        }

        .active-tag {
          background: blue;
          color: white;
          border: 1px solid blue;
        }

        .clear-filter {
          background: transparent;
          color: #666;
          border: 1px solid #ddd;
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-filter:hover {
          background: #f5f5f5;
          color: #333;
        }

        /* New Card Design Styles */
        .product-card {
          display: flex;
          flex-direction: column;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(164, 148, 255, 0.4);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: white;
          height: 100%;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .card-image-container {
          width: 100%;
          height: 180px;
          overflow: hidden;  
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .product-card:hover .card-image {
          transform: scale(1.05);
        }

        .card-content {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .card-title {
          font-size: 1rem;
          font-weight: 400;
          margin-bottom: 0.75rem;
          color: #333;
        }

        .card-tag-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .card-tag {
          background-color: #bff2f7;
          color: #15173D;
          font-size: 0.75rem;
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .card-tag:hover {
          background-color: #e3fcfc;
        }

        .active-card-tag {
          background-color: blue !important;
          color: white !important;
        }

        .view-details-button {
          margin-top: auto;
          background-color: #bff2f7;
          color: #15173D;
          border: none;
          border-radius: 40px;
          padding: 0.6rem 1rem;
          font-weight: 400;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .view-details-button:hover {
          background-color:  #e3fcfc;
          color: #15173D;
        }

        /* Ensure the card grid has proper spacing */
        ${styles.cardGrid ? '' : `
          .${styles.cardGrid} {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
          }
        `}
      `}</style>
    </div>
  );
};

export default ExamMarket;