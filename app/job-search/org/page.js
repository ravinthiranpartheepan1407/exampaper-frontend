import React from 'react'
import Layout from '@/layouts/layout'
import CompanyDashboard from '@/components/CompanyDashboard';
// import ChatPage from '@/components/ChatBot/ChatPage'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Studypoints24 - Job Search',
    content:'text/html',
    openGraph: {
      title:'Studypoints24 - Job Search',
      content:'text/html',
    },
  }

export default function page() {
    return (
        <Layout>
            <CompanyDashboard />
            {/* <ChatPage/> */}
        </Layout>
    )
}
