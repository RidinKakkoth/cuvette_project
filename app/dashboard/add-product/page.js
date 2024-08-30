'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { storage } from '../../../lib/firebaseConfig'; // Import your Firebase config
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = '';

      if (image) {
        const imageRef = ref(storage, `products/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const productData = {
        name,
        description,
        price,
        imageUrl,
      };

      await axios.post('/api/products', productData);
      setName('');
    setPrice('');
    setDescription('');
    setImage(null);
      // router.push('/dashboard');
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add product. Please try again.');
    }
  };
  const goBack = () => {
    router.back(); // This will navigate to the previous page in the history
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <button onClick={goBack} className='self-start rounded-md bg-gray-400 px-5 py-2 text-white font-semibold'>back</button>
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Product</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">Product Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">Product Description:</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="price">Price:</label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="image">Product Image:</label>
            <input
              id="image"
              type="file"
              onChange={handleImageChange}
              className="border border-gray-300 p-2 w-full rounded-md"
              accept="image/*"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600 transition duration-300"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
