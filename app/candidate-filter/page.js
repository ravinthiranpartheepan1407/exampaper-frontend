import React from 'react'
import Layout from '@/layouts/layout'
import HrDashboard from '@/components/HrDashboard';

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Studypoints24 - Research Assistant',
    content:'text/html',
    openGraph: {
      title:'Studypoints24 - Research Assistant',
      content:'text/html',
    },
  }

export default function page() {
    return (
        <Layout>
            <HrDashboard />
            {/* <ChatPage/> */}
        </Layout>
    )
}
