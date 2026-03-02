import React from 'react'
import Layout from '@/layouts/layout'
import ParaphraseText from '@/components/ParaphraseText';
// import ChatPage from '@/components/ChatBot/ChatPage'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Studypoints24 - Paraphrase AI',
    content:'text/html',
    openGraph: {
      title:'Studypoints24 - Paraphrase AI',
      content:'text/html',
    },
  }

export default function page() {
    return (
        <Layout>
            <ParaphraseText />
            {/* <ChatPage/> */}
        </Layout>
    )
}
