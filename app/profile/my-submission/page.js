'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken'; 
import { useRouter } from 'next/navigation';

const statusColors = {
  pending: 'bg-yellow-200 text-yellow-800',
  approved: 'bg-green-200 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const MySubmissionPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

const router=useRouter()

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const decoded = jwt.decode(token); 
        const userId = decoded.userId; 
        const role=decoded.role
       
        const response = await axios.get(`/api/reviews?userId=${userId}&role=${role}`);

        setReviews(response.data.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);



  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold mb-6 text-gray-900">My Submissions</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          {reviews.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-4 text-left text-gray-700 font-semibold">Image</th>
                  <th className="p-4 text-left text-gray-700 font-semibold">Product Name</th>
                  <th className="p-4 text-left text-gray-700 font-semibold">Description</th>
                  <th className="p-4 text-left text-gray-700 font-semibold">Price</th>
                  <th className="p-4 text-left text-gray-700 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <img src={review.imageUrl} alt={review.name} className="w-16 h-16 object-cover rounded-md" />
                    </td>
                    <td className="p-4 text-gray-800">{review.name}</td>
                    <td className="p-4 text-gray-600">{review.description}</td>
                    <td className="p-4 text-gray-800">${review.price}</td>
                    <td className={`p-4 font-semibold ${statusColors[review.status]}`}>
                      {review.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">No submissions found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MySubmissionPage;
