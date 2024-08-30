'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function RequestDetails({ params }) {
  const [review, setReview] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviewAndProduct = async () => {
      try {
       
        const reviewResponse = await axios.get(`/api/reviews?requestId=${params.request_id}`);
        const fetchedReview = reviewResponse.data.reviews;
        setReview(fetchedReview);

       
        if (fetchedReview && fetchedReview.productId) {
          const productResponse = await axios.get(`/api/products/${fetchedReview.productId}`);
          setProduct(productResponse.data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchReviewAndProduct();
  }, [params.request_id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await axios.patch(`/api/reviews?reviewId=${params.request_id}`, {
        status: newStatus,
      });

      setReview({ ...review, status: response.data.updatedReview.status });
      toast.success("status updated successfully")
    } catch (error) {
      toast.error("error updating")
      console.error('Error updating status:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!review) return <div>No review found.</div>;

  return (
    <div className="flex justify-center mt-10">
      <div className="flex space-x-6">
       
        {product && (
          <div className="flex flex-col gap-5 font-semibold text-lg">
            <h1>Product Details</h1>
            <div className="max-w-sm w-full bg-gray-50 shadow-md rounded-lg overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full p-4 h-64 object-cover"
              />
              <div className="p-6 flex flex-col gap-3">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2"></h3>
                <p className="text-lg font-medium text-gray-800">Name: {product.name}</p>
                <p className="text-gray-800">Description: {product.description}</p>
                <p className="text-lg font-medium text-gray-800">Price: ${product.price}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-5 font-semibold text-lg">
          <h1>Requested Product Changes</h1>
          <div className="max-w-sm w-full bg-gray-50 shadow-md rounded-lg overflow-hidden">
            <img
              src={review.imageUrl}
              alt={review.name}
              className={`w-full p-4 h-64 object-cover ${
                product && review.imageUrl !== product.imageUrl ? 'border-4  border-red-500 shadow-xl' : ''
              }`}
            />
            <div className="p-6">
              <h2
                className={`text-xl font-semibold mb-2 ${
                  product && review.name !== product.name ? 'text-red-600 ' : 'text-gray-800'
                }`}
              >
               <span className='text-black'>Name:</span> {review.name}
              </h2>
              <p
                className={`mb-4 ${
                  product && review.description !== product.description ? 'text-red-600' : 'text-gray-600'
                }`}
              >
               <span className='text-black'>Description:</span> {review.description}
              </p>
              <p
                className={`text-lg font-medium mb-4 ${
                  product && review.price !== product.price ? 'text-red-600' : 'text-gray-600'
                }`}
              >
               <span className='text-black'>Price:</span> ${review.price}
              </p>

              <p
  className={`text-md font-medium mb-4 ${
    review.status === 'approved'
      ? 'text-green-500'
      : review.status === 'rejected'
      ? 'text-red-500'
      : review.status === 'pending'
      ? 'text-yellow-500'
      : 'text-gray-700'
  }`}
>
<span className='text-black'>Status:</span> {review.status}
</p>

              {review.status === 'pending' && (
                <div className="flex space-x-4">
                  <button
                    className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
                    onClick={() => handleStatusChange('approved')}
                  >
                    Accept
                  </button>
                  <button
                    className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
                    onClick={() => handleStatusChange('rejected')}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestDetails;
