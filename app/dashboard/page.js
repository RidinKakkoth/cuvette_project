"use client"; 

import { Suspense } from 'react';
import DashboardContent from '../components/DashboardContent.jsx'; // Import the separated component

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}