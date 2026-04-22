import React from 'react'
import Layout from '@/layouts/layout'
import InsurancePrinciples from '@/components/Exams/InsurancePrinciples';

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Exam Paper Academy - IC 01 - Principles of Insurance',
    content:'text/html',
    openGraph: {
      title:'Exam Paper Academy - IC 01 - Principles of Insurance',
      content:'text/html',
    },
  }

export default function page() {
    return (
        <Layout>
            <InsurancePrinciples />
            {/* <ChatPage/> */}
        </Layout>
    )
}
