import React from 'react'
import Layout from '@/layouts/layout'
import ExamMarket from '@/components/ExamMarket';
import KnowbleResearch from '@/components/KnowbleResearch';
// import ChatPage from '@/components/ChatBot/ChatPage'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Studypoints24 - Research Assistant',
    content:'text/html',
    openGraph: {
      title:'Studypoints24 - Research Assistant',
      content:'text/html',
    },
  }

export default function page() {
    return (
        <Layout>
            <KnowbleResearch />
            {/* <ChatPage/> */}
        </Layout>
    )
}
