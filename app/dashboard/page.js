"use client"; 

import { Suspense } from 'react';
import DashboardContent from '../components/DashboardContent.jsx'; 
import { ClipLoader } from "react-spinners";

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <ClipLoader color="#4A90E2" loading={true} size={50} />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}