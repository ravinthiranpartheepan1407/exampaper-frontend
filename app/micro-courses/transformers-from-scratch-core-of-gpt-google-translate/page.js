import React from 'react'
import Layout from '@/layouts/layout'
import CourseMarket from '@/components/CourseMarket';
import Course1 from '@/components/Course/Course1';
import Course2 from '@/components/Course/Course2';
// import ChatPage from '@/components/ChatBot/ChatPage'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Exam Paper Academy - Transformers From Scratch : Core of Chatgpt & Google Translate',
    content:'text/html',
    openGraph: {
      title:'Exam Paper Academy - Transformers From Scratch : Core of Chatgpt & Google Translate',
      content:'text/html',
    },
  }

export default function page() {
    return (
        <Layout>
            <Course2 />
            {/* <ChatPage/> */}
        </Layout>
    )
}
