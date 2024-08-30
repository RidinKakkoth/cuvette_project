'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export default function Profile() {
  const [userRole, setUserRole] = useState("");
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [approvedReviews, setApprovedReviews] = useState(0);
  const [rejectedReviews, setRejectedReviews] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const { role, userId } = jwt.decode(token);
          setUserRole(role);

          const response = await axios.get(`/api/reviews?userId=${userId}&role=${role}`);
          const reviewsData = response.data.reviews;
          setReviews(reviewsData);

          const total = reviewsData.length;
          const approved = reviewsData.filter(review => review.status === 'approved').length;
          const rejected = reviewsData.filter(review => review.status === 'rejected').length;

          setTotalReviews(total);
          setApprovedReviews(approved);
          setRejectedReviews(rejected);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [userRole]);

  const handleSubmissionClick = () => {
    router.push('/profile/my-submission');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      {userRole === 'team_member' && (
        <button
          onClick={handleSubmissionClick}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Go to My Submissions
        </button>
      )}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
          <div className="text-xl font-semibold text-gray-700">Total Reviews</div>
          <div className="text-3xl font-bold text-gray-900">{totalReviews}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
          <div className="text-xl font-semibold text-green-600">Approved Reviews</div>
          <div className="text-3xl font-bold text-gray-900">{approvedReviews}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
          <div className="text-xl font-semibold text-red-600">Rejected Reviews</div>
          <div className="text-3xl font-bold text-gray-900">{rejectedReviews}</div>
        </div>
      </div>
    </div>
  );
}
