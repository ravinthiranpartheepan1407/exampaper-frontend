import React from 'react'
import Signin from '@/components/Signin'

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = {
  title:'Sign In',
  content:'text/html',
  openGraph: {
    title:'Sign In',
    content:'text/html',
  },
}


export default function page() {
  return (
    <>
      <Signin />
    </>
  )
}
