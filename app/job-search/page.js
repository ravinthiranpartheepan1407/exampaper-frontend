"use client";

import React from 'react'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/layouts/layout';
import JobMatch from '@/components/JobMatch';


export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/job-search/list');
      return;
    }
    try {
      JSON.parse(atob(token.split('.')[1])); // validate token is decodable
    } catch {
      router.push('/job-search/list');
    }
  }, []);

  return (
    <Layout>
      <JobMatch />
    </Layout>
  );
}