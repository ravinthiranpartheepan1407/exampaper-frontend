import React from 'react'
import Layout from '@/layouts/layout'
import CourseMarket from '@/components/CourseMarket';
import Course1 from '@/components/Course/Course1';
// import ChatPage from '@/components/ChatBot/ChatPage'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Exam Paper Academy - Time Series Analysis using Rust',
    content:'text/html',
    openGraph: {
      title:'Exam Paper Academy - Time Series Analysis using Rust',
      content:'text/html',
    },
  }

export default function page() {
    return (
        <Layout>
            <Course1 />
            {/* <ChatPage/> */}
        </Layout>
    )
}
