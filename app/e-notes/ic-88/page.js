import React from 'react'
import Layout from '@/layouts/layout'
import ExamMarket from '@/components/ExamMarket';
import KnowbleIC88 from '@/components/knowble/Ic88/page';
import PremiumProtection from '@/components/PremiumProtection';
// import ChatPage from '@/components/ChatBot/ChatPage'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Studypoints24 - Knowble IC-88 Research',
    content:'text/html',
    openGraph: {
      title:'Studypoints24 - Knowble IC-88 Research',
      content:'text/html',
    },
  }

export default function page() {
    return (
      <PremiumProtection>
        <Layout>
            <KnowbleIC88 />
            {/* <ChatPage/> */}
        </Layout>
      </PremiumProtection>
    )
}
