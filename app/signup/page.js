
"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'team_member', 
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/auth/signup', formData);
      console.log('Signup successful!'); 

      router.push('/signin'); 
    } catch (err) {
      toast.error(err.response.data.message || 'Error signing up');
      console.error('Error signing up:', err);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full rounded-md"
              required
            />
          </div>
          <div>
            <fieldset>
              <legend className="text-sm font-medium mb-2">Role:</legend>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === 'admin'}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span className="ml-2">Admin</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="team_member"
                    checked={formData.role === 'team_member'}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span className="ml-2">Team Member</span>
                </label>
              </div>
            </fieldset>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600 transition duration-300"
            disabled={loading}
            >{
              loading?
              (<ClipLoader color="#ffffff" loading={true} size={20} />):(
  
                "Sign Up"
              )
            }
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{' '}
          <a href="/signin" className="text-blue-500 underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}