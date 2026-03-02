import React from 'react'
import Layout from '@/layouts/layout'
import ExamMarket from '@/components/ExamMarket';
import KnowbleWebResearch from '@/components/KnowbleWebResearch';
import PennyParkAdventure from '@/components/SpokenEnglish/PennyParkAdventure';
import LanguageMarket from '@/components/LanguageMarket';
// import ChatPage from '@/components/ChatBot/ChatPage'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Studypoints24 - Learn A Language',
    content:'text/html',
    openGraph: {
      title:'Studypoints24 - Learn A Language',
      content:'text/html',
    },
  }

export default function page() {
    return (
        <Layout>
            <LanguageMarket />
            {/* <ChatPage/> */}
        </Layout>
    )
}
