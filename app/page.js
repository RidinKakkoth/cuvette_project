"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken'

export default function Home() {
  const router = useRouter();

  useEffect(() => {

    const token = localStorage.getItem('token'); 
    const decoded=jwt.decode(token)
    const role=decoded.role
    if (token) {
      router.push(`/dashboard?role=${role}`);
    } else {
      router.push('/signin');
    }
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>Loading...</p>
    </main>
  );
}
