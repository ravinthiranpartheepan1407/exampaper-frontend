import React from 'react'
import Layout from '@/layouts/layout'
import ExamMarket from '@/components/ExamMarket';
import KnowbleWebResearch from '@/components/KnowbleWebResearch';
import PennyParkAdventure from '@/components/SpokenEnglish/PennyParkAdventure';
import TaraAndTurtle from '@/components/SpokenEnglish/TaraAndTurtle';
import ParadoxProtocol from '@/components/SpokenEnglish/ParadoxProtocol';
// import ChatPage from '@/components/ChatBot/ChatPage'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Studypoints24 - The Paradox Protocol',
    content:'text/html',
    openGraph: {
      title:'Studypoints24 - The Paradox Protocol',
      content:'text/html',
    },
  }

export default function page() {
    return (
        <Layout>
            <ParadoxProtocol />
            {/* <ChatPage/> */}
        </Layout>
    )
}
