import FAQ from '@/components/FAQ'
import Layout from '@/layouts/layout'
import React from 'react'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
  title:'FAQ',
  content:'text/html',
  openGraph: {
    title:'FAQ',
    content:'text/html',
  },
}


export default function page() {
  return (
    <Layout>
      <div className="techwave_fn_faq_page">
        {/* Page Title */}
        <div className="techwave_fn_pagetitle">
          <h2 className="title">Frequently Asked Questions</h2>
        </div>
        {/* !Page Title */}
        <div className="faq">
          <div className="container small">
              <FAQ />
          </div>
        </div>
      </div>
    </Layout>
  )
}
