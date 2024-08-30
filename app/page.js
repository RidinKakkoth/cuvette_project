"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();
  const[userRole,setUserRole]=useState(null)
  
  useEffect(() => {

    const token = localStorage.getItem('token'); 
    
    

    
    
    if (token) {
      router.push(`/dashboard`);
 
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
