"./HRDashboard.js"

"use client";

import CandidateTestAnalysis from "@/components/CandidateTestAnalysis";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default function HrDashboard(){
    const [userEmail, setUserEmail] = useState('');
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
    }, []);
    return(
        <>
            {userEmail && <CandidateTestAnalysis hrEmail={userEmail} />}
        </>
    )
}

