import React from 'react'
import Layout from '@/layouts/layout'
import PracticeOfGeneralInsurance from '@/components/Exams/PracticeOfGeneralInsurance';
import Az900 from '@/components/Exams/Az900';

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
    title:'Studypoints24 - IC 11 - Practice of General Insurance',
    content:'text/html',
    openGraph: {
      title:'Studypoints24 - IC 11 - Practice of General Insurance',
      content:'text/html',
    },
  }

export default function page() {
    return (
        <Layout>
            <Az900 />
        </Layout>
    )
}
