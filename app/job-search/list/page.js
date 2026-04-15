import React from 'react'
import Layout from '@/layouts/layout'
import JobMatch from '@/components/JobMatch';
import AllJobs from '@/components/AllJobs';
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
        <Layout>
            <AllJobs/>
            {/* <ChatPage/> */}
        </Layout>
    )
}
