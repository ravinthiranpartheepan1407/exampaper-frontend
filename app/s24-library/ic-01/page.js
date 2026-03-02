import React from 'react'
import Layout from '@/layouts/layout'
import KnowbleIC01 from '@/components/knowble/Ic01/page';
import PremiumProtection from '@/components/PremiumProtection';
// import ChatPage from '@/components/ChatBot/ChatPage'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Studypoints24 - Knowble IC-01 Research',
    content:'text/html',
    openGraph: {
      title:'Studypoints24 - Knowble IC-01 Research',
      content:'text/html',
    },
  }

export default function page() {
    return (
      <PremiumProtection>
        <Layout>
            <KnowbleIC01 />
            {/* <ChatPage/> */}
        </Layout>
      </PremiumProtection>
    )
}
