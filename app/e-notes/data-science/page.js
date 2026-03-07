import React from 'react'
import Layout from '@/layouts/layout'
import ExamMarket from '@/components/ExamMarket';
import KnowbleIC88 from '@/components/knowble/Ic88/page';
import KnowblePhsyics12thVol2 from '@/components/knowble/12th-physics-vol2/page';
import Knowble10ThMathematics from '@/components/knowble/10th-mathematics/page';
import KnowbleDataScience from '@/components/knowble/DataScience/page';
// import ChatPage from '@/components/ChatBot/ChatPage'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Studypoints24 - Knowble Data Science Research',
    content:'text/html',
    openGraph: {
      title:'Studypoints24 - Knowble Data Science Research',
      content:'text/html',
    },
  }

export default function page() {
    return (
        <Layout>
            <KnowbleDataScience />
            {/* <ChatPage/> */}
        </Layout>
    )
}
