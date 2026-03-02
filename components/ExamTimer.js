import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import styles from "../public/InsurancePrinciples.module.css"

const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const calculateRemainingTime = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffInSeconds = Math.max(0, Math.floor((expiry - now) / 1000));
    return diffInSeconds;
};

export default function ExamTimer({ expiryDate }) {
    const [timeRemaining, setTimeRemaining] = useState(calculateRemainingTime(expiryDate));
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            const remaining = calculateRemainingTime(expiryDate);
            
            if (remaining <= 0) {
                setIsExpired(true);
                clearInterval(timer);
            } else {
                setTimeRemaining(remaining);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [expiryDate]);

    if (isExpired) {
        return (
            <div className={styles.timer} style={{ color: 'red' }}>
                <Clock size={16} /> Exam Expired
            </div>
        );
    }

    return (
        <div className={styles.timer}>
            <Clock size={16} /> {formatTime(timeRemaining)}
        </div>
    );
}