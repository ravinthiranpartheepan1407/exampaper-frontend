import React from 'react'
import Layout from '@/layouts/layout'
import PracticeOfLifeInsurance from '@/components/Exams/PracticeOfLifeInsurance';

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Exam Paper Academy - IC 02 - Practice of Life Insurance',
    content:'text/html',
    openGraph: {
      title:'Exam Paper Academy - IC 02 - Practice of Life Insurance',
      content:'text/html',
    },
  }

export default function page() {
    return (
        <Layout>
            <PracticeOfLifeInsurance />
            {/* <ChatPage/> */}
        </Layout>
    )
}
