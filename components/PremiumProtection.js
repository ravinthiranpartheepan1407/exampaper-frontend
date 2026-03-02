// components/PremiumProtection.js
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-toastify';

const PremiumProtection = ({ children }) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  const [userEmail, setUserEmail] = useState('');
  const [userSubscription, setUserSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Extract email from token
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

  // Check subscription status when email is available
  useEffect(() => {
    const checkSubscription = async () => {
      if (!userEmail) return;
      
      try {
        setLoading(true);
        
        // Query Supabase for the user's subscription
        const { data, error } = await supabase
          .from('users')
          .select('subscription')
          .eq('email', userEmail)
          .single();
        
        if (error) {
          router.push('/');
          return;
        }
        
        setUserSubscription(data?.subscription);
        
        // Redirect if not premium
        if (data?.subscription !== 'premium') {
          router.push('/s24-library');
        }
      } catch (err) {
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    
    checkSubscription();
  }, [userEmail, router, supabase]);

  
  return userSubscription === 'premium' ? children : null;
};

export default PremiumProtection;