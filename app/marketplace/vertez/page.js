import CompetitionModel from '@/components/CompetitionModel';
import DataHub from '@/components/DataHub';
import EventTicket from '@/components/EventTicket';
import ProductHub from '@/components/ProductHub';
import Layout from '@/layouts/layout'
import React from 'react'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
  title:'Studypoints24 - Marketplace',
  content:'text/html',
  openGraph: {
    title:'Studypoints24 - Marketplace',
    content:'text/html',
  },
}

// const CommunityFeed = dynamic(
//   () => {
//       return import("@/components/CommunityFeed");
//   },
//   { ssr: false }
// );
export default function page() {
  return (
    <Layout>
      <ProductHub />
    </Layout>
  )
}
