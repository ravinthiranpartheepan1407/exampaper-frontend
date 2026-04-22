import React from 'react'
import Layout from '@/layouts/layout'
import ResetPassword from '@/components/ResetPassword';
// import ChatPage from '@/components/ChatBot/ChatPage'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Exam Paper Academy - Update Password',
    content:'text/html',
    openGraph: {
      title:'Exam Paper Academy - Update Password',
      content:'text/html',
    },
  }

export default function page() {
    return (
        <Layout>
            <ResetPassword />
            {/* <AIChatbot /> */}
        </Layout>
    )
}
