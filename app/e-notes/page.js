import React from 'react'
import Layout from '@/layouts/layout'
import ExamMarket from '@/components/ExamMarket';
import KnowbleIC88 from '@/components/knowble/Ic88/page';
import KnowbleMarket from '@/components/KnowbleMarket';
// import ChatPage from '@/components/ChatBot/ChatPage'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Exam Paper Academy - E-Notes',
    content:'text/html',
    openGraph: {
      title:'Exam Paper Academy - E-Notes',
      content:'text/html',
    },
  }

export default function page() {
    return (
        <Layout>
            <KnowbleMarket />
        </Layout>
    )
}
