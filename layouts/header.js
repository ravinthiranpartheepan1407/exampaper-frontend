'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu } from '@headlessui/react'
import screenfull from 'screenfull';
import { BookOpen, Disc2, LucideLogOut, Rocket, Search, Zap } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { SpeedInsights } from "@vercel/speed-insights/next"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default function Header({ searchToggle }) {
    // Light/Dark switcher
    const [skin, setSkin] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [userEmail, setUserEmail] = useState('')
    const [isPremium, setIsPremium] = useState(false)

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('authToken')
        if (!token) {
            // router.push('/')
            return
        }

        try {
            const tokenData = JSON.parse(atob(token.split('.')[1]))
            const decodedEmail = tokenData.email
            setUserEmail(decodedEmail)
            
            // Fetch subscription status from Supabase
            const checkSubscription = async () => {
                try {
                    const { data, error } = await supabase
                        .from('users')
                        .select('subscription')
                        .eq('email', decodedEmail)
                        .single()

                    if (error) {
                        console.error('Error fetching subscription:', error)
                        return
                    }

                    setIsPremium(data?.subscription === 'premium')
                } catch (err) {
                    console.error('Error checking subscription:', err)
                }
            }

            checkSubscription()
        } catch (err) {
            console.error('Error decoding token:', err)
            // router.push('/')
        }
    }, [])

    useEffect(() => {
        // Check if running in the browser (client side)
        if (typeof window !== 'undefined') {
            const storedSkin = localStorage.getItem('frenify_skin');
            if (storedSkin) {
                setSkin(storedSkin);
            }
        }
    }, []);

    const toggleSkin = () => {
        const newSkin = skin === 'light' ? 'dark' : 'light';
        setSkin(newSkin);
    };


    useEffect(() => {
        // Check if running in the browser (client side)
        if (typeof window !== 'undefined') {
            // Update local storage and document attribute
            localStorage.setItem('frenify_skin', skin);
            document.documentElement.setAttribute('data-techwave-skin', skin);
        }
    }, [skin]);


    // Full Screen Handler
    const toggleFullscreen = () => {
        if (screenfull.isEnabled) {
            screenfull.toggle();
        }
    };

    const handleFullscreenChange = () => {
        setIsFullscreen(screenfull.isFullscreen);
    };

    useEffect(() => {
        // Fullscreen handlers
        if (screenfull.isEnabled) {
            screenfull.on('change', handleFullscreenChange);
        }

        return () => {
            if (screenfull.isEnabled) {
                screenfull.off('change', handleFullscreenChange);
            }
        };
    }, []);

    return (
        <>
            <SpeedInsights/>
            
        </>
    )
}
