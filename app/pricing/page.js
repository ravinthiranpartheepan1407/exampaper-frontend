import FAQ from '@/components/FAQ'
import PricingList from '@/components/PricingList'
import Layout from '@/layouts/layout'
import Link from 'next/link'
import React from 'react'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
  title:'Studypoints24 - Pricing',
  content:'text/html',
  openGraph: {
    title:'Studypoints24 - Pricing',
    content:'text/html',
  },
}


export default function page() {
  return (
    <Layout>
      <div className="techwave_fn_pricing_page">
        <div className="techwave_fn_title_holder">
          <div className="container">
            <h1 className="title hs-title-1">Built for Your Growth</h1>
            <br />
            <p className="desc fn__animated_text hs-title-6">Start small and free, upgrade as you go. Take control of everything.</p>
          </div>
        </div>
        {/* Pricing Shortcode */}
        <div className="techwave_fn_pricing">
          <div className="container">
            <PricingList />
          </div>
        </div>
        {/* !Pricing Shortcode */}
        <div className="techwave_fn_title_holder">
          <div className="container">
            <h1 className="title">Frequently Asked Questions</h1>
            <p className="desc fn__animated_text">Many support queries and technical questions will already be answered</p>
          </div>
        </div>
        <div className="container medium">
          <FAQ />
        </div>
      </div>

    </Layout>
  )
}
