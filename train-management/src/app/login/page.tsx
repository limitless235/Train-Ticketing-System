'use client'; // Make sure this is a client-side component

import React, { useState } from 'react';
import { supabase } from 'src/app/lib/supabaseClient'; // Import your Supabase client
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  // Handle email login
  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { error: loginError } = await supabase.auth.signInWithOtp({
        email,
      });

      if (loginError) {
        setError('Failed to log in. Please try again.');
      } else {
        setSuccessMessage('Check your email for the login link!');
        setTimeout(() => {
          router.push('/client/dashboard');
        }, 2000); // Redirect after 2 seconds
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Login to Your Account</h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-600 text-center mb-4">{successMessage}</p>}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your email"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 transition duration-200"
        >
          {loading ? 'Sending Link...' : 'Send Login Link'}
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <a href="/register" className="text-indigo-600 hover:text-indigo-700">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
