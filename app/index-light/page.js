import HomeLight from '@/components/HomeLight'
import Layout from '@/layouts/layout-2'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
  title:'Home Light',
  content:'text/html',
  openGraph: {
    title:'Home Light',
    content:'text/html',
  },
}

export default function page() {
  return (
    <Layout>
      <HomeLight />
    </Layout>
  )
}
