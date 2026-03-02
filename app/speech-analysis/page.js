import React from 'react'
import Layout from '@/layouts/layout'
import AudioPitch from '@/components/AudioPitch';

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Studypoints24 - Speech Analysis',
    content:'text/html',
    openGraph: {
      title:'Studypoints24 - Speech Analysis',
      content:'text/html',
    },
  }

export default function page() {
    return (
        <Layout>
            <AudioPitch />
            {/* <AIChatbot /> */}
        </Layout>
    )
}
