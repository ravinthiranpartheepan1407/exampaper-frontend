import React from 'react'
import Layout from '@/layouts/layout'
import MindTrack from '@/components/MindTrack';
import KidGame1 from '@/components/KidGames/KidGame1';
import KidGame2 from '@/components/KidGames/KidGame2';
// import ChatPage from '@/components/ChatBot/ChatPage'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Studypoints24 - Riddle Detective',
    content:'text/html',
    openGraph: {
      title:'Studypoints24 - Riddle Detective',
      content:'text/html',
    },
  }

export default function page() {
    return (
        <Layout>
            <KidGame2 />
            {/* <ChatPage/> */}
        </Layout>
    )
}
