import React from 'react'
import Layout from '@/layouts/layout'
import ExamMarket from '@/components/ExamMarket';
// import ChatPage from '@/components/ChatBot/ChatPage'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Exam Paper Academy - Mock Exam Engine',
    content:'text/html',
    openGraph: {
      title:'Exam Paper Academy - Mock Exam Engine',
      content:'text/html',
    },
  }

export default function page() {
    return (
        <Layout>
            <ExamMarket />
            {/* <ChatPage/> */}
        </Layout>
    )
}
