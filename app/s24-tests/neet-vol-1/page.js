import React from 'react'
import Layout from '@/layouts/layout'
import NeetPractice1 from '@/components/Exams/NeetPractice1';

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Studypoints24 - NEET Vol.1 Mock Engine',
    content:'text/html',
    openGraph: {
      title:'Studypoints24 - NEET Vol.1 Mock Engine',
      content:'text/html',
    },
  }

export default function page() {
    return (
        <Layout>
            <NeetPractice1 />
            {/* <ChatPage/> */}
        </Layout>
    )
}
