import React from 'react'
import PublicDashboard from '@/components/PublicDashboard';
// import ChatPage from '@/components/ChatBot/ChatPage'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Exam Paper Academy',
    content:'text/html',
    openGraph: {
      title:'Exam Paper Academy',
      content:'text/html',
    },
  }

export default function page() {
    return (
        <PublicDashboard />
    )
}
