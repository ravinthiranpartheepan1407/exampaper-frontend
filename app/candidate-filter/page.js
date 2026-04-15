import React from 'react'
import Layout from '@/layouts/layout'
import HrDashboard from '@/components/HrDashboard';

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Exam Paper Academy',
    content:'text/html',
    openGraph: {
      title:'Exam Paper Academy',
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
