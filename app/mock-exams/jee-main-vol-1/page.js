import React from 'react'
import Layout from '@/layouts/layout'
import NeetPractice1 from '@/components/Exams/NeetPractice1';
import JeeVol1 from '@/components/Exams/JeeVol1';

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Exam Paper Academy - JEE Main Vol.1 Mock Engine',
    content:'text/html',
    openGraph: {
      title:'Exam Paper Academy - JEE Main Vol.1 Mock Engine',
      content:'text/html',
    },
  }

export default function page() {
    return (
        <Layout>
            <JeeVol1/>
            {/* <ChatPage/> */}
        </Layout>
    )
}
