
"use client";

import { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken'
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function DashboardContent() {
  const [role, setRole] = useState('');
  const [products, setProducts] = useState([]);
  const router = useRouter();


  useEffect(() => {
    const token = localStorage.getItem('token'); 
        if(token){
          const decoded = jwt.decode(token); 
       
        const userRole=decoded.role
        
        
        
        setRole(userRole);
        }

  }, [ router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleClick = (product) => {
    router.push(`/products/${product._id}`);
  };

  return (
<div className='p-5'>
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5'>
    {products.map(product => (
      <div
        key={product._id}
        onClick={() => handleClick(product)}
        className='bg-gray-100 rounded-lg p-5 flex flex-col gap-2 cursor-pointer'
      >
        <Image
          src={product.imageUrl}
          className='rounded-md'
          width={500}
          height={500}
          alt={product.name}
        />
        <h1 className='font-medium text-center text-lg'>{product.name}</h1>
      </div>
    ))}
  </div>
</div>

  );
}
