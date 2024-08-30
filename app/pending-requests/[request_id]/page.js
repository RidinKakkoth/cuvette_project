'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function RequestDetails({ params }) {
  const [review, setReview] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const changeAlert=<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
</svg>


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

  if (loading){ return <div className="flex justify-center items-center h-screen">
  <ClipLoader color="#4A90E2" loading={true} size={50} /> 
</div>}
  if (error) return <div>{error}</div>;
  if (!review) return <div>No review found.</div>;

  return (
    <div className="flex justify-center mt-10">
      <div className="flex space-x-6">
       

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
                className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
                  product && review.name !== product.name ? 'text-red-600 ' : 'text-gray-800'
                }`}
              >
               <span className='text-black text-lg'>Name:</span> {review.name}{product && review.name !== product.name ?changeAlert:""}
              </h2>
              <p
                className={`mb-4 text-sm flex flex-col gap-2 ${
                  product && review.description !== product.description ? 'text-red-600' : 'text-gray-600'
                }`}
              >
               <span className='text-black text-lg '>Description:</span> {review.description}{product && review.description !== product.description ?changeAlert:""}
              </p>
              <p
                className={`text-sm font-medium mb-4 flex items-center gap-2 ${
                  product && review.price !== product.price ? 'text-red-600' : 'text-gray-600'
                }`}
              >
               <span className='text-black font-bold'>Price:</span> ${review.price} {product && review.price !== product.price ?changeAlert
:""}
              </p>

              <p
  className={`text-sm font-bold mb-4 ${
    review.status === 'approved'
      ? 'text-green-500'
      : review.status === 'rejected'
      ? 'text-red-500'
      : review.status === 'pending'
      ? 'text-yellow-500'
      : 'text-gray-700'
  }`}
>
<span className='text-black text-sm'>Status:</span> {review.status}
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
