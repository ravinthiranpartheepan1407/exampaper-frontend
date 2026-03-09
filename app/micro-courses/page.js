import React from 'react'
import Layout from '@/layouts/layout'
import CourseMarket from '@/components/CourseMarket';
// import ChatPage from '@/components/ChatBot/ChatPage'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Studypoints24 - Courses',
    content:'text/html',
    openGraph: {
      title:'Studypoints24 - Courses',
      content:'text/html',
    },
  }

export default function page() {
    return (
        <Layout>
            <CourseMarket />
            {/* <ChatPage/> */}
        </Layout>
    )
}
