"use client"
import React, { useState } from 'react'

export default function FAQ() {
  const [isActive, setIsActive] = useState({
    status: false,
    key: 1,
  });

  const handleToggle = (key) => {
    if (isActive.key === key) {
      setIsActive({
        status: false,
      });
    } else {
      setIsActive({
        status: true,
        key,
      });
    }
  };
  return (
    <>

      <div className="techwave_fn_accordion" data-type="accordion"> {/* data-type values: accordion, toggle */}
        {/* #1 accordion item */}
        <div onClick={() => handleToggle(1)} className={`acc__item ${isActive.key === 1 ? "opened" : ""}`} >
          <div className="acc__header">
            <h2 className="acc__title">Which features am I paying for?</h2>
            <div className="acc__icon" />
          </div>
          <div className="acc__content" style={isActive.key === 1 ? { "display": "block" } : { "display": "none" }}>
            <p>You are paying only for the main feature, which is the Premium Library Catalogs, and AI Research Engine.</p>
          </div>
        </div>
        {/* !#1 accordion item */}
        {/* #2 accordion item */}
        <div onClick={() => handleToggle(2)} className={`acc__item ${isActive.key === 2 ? "opened" : ""}`} >
          <div className="acc__header">
            <h2 className="acc__title">Who should I contact if I have technical issues?</h2>
            <div className="acc__icon" />
          </div>
          <div className="acc__content" style={isActive.key === 2 ? { "display": "block" } : { "display": "none" }} >
            <p>If you have any technical issues, reach out to us at info@studypoints24.com</p>
          </div>
        </div>
        {/* !#2 accordion item */}
        {/* #3 accordion item */}
        <div onClick={() => handleToggle(3)} className={`acc__item ${isActive.key === 3 ? "opened" : ""}`} >
          <div className="acc__header">
            <h2 className="acc__title">Who should I contact if I have payment issues?</h2>
            <div className="acc__icon" />
          </div>
          <div className="acc__content" style={isActive.key === 3 ? { "display": "block" } : { "display": "none" }}>
            <p>If you have any payment-related issues, reach out to us at info@studypoints24.com</p>
          </div>
        </div>
        {/* !#3 accordion item */}
      </div>

    </>
  )
}