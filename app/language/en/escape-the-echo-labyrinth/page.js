import React from 'react'
import Layout from '@/layouts/layout'
import ExamMarket from '@/components/ExamMarket';
import KnowbleWebResearch from '@/components/KnowbleWebResearch';
import PennyParkAdventure from '@/components/SpokenEnglish/PennyParkAdventure';
import EscapeEchoLabyrinth from '@/components/SpokenEnglish/EscapeEchoLabyrinth';
// import ChatPage from '@/components/ChatBot/ChatPage'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Studypoints24 - Escape the Echo Labyrinth',
    content:'text/html',
    openGraph: {
      title:'Studypoints24 - Escape the Echo Labyrinth',
      content:'text/html',
    },
  }

export default function page() {
    return (
        <Layout>
            <EscapeEchoLabyrinth />
            {/* <ChatPage/> */}
        </Layout>
    )
}
