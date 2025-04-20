'use client'; // Make sure the file is treated as a client component

import React from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from 'src/app/lib/supabaseClient'; // Your Supabase client import

const ClientDashboard = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-1/4 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Client Dashboard</h2>
            <div className="space-y-4">
              <button
                onClick={() => router.push('/client/search-trains')}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
              >
                Search Trains
              </button>

              <button
                onClick={() => router.push('/client/profile')}
                className="w-full bg-green-600 text-white py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
              >
                View Profile
              </button>

              <button
                onClick={() => router.push('/client/fare-enquiry')}
                className="w-full bg-yellow-600 text-white py-3 rounded-lg shadow-md hover:bg-yellow-700 transition duration-200"
              >
                Fare Enquiry
              </button>

              <button
                onClick={() => router.push('/client/book-tickets')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
              >
                Book Tickets
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-3 rounded-lg shadow-md hover:bg-red-700 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 ml-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">Welcome to Your Dashboard</h2>
              <p className="text-lg text-gray-600">
                Select an option from the sidebar to manage your trains, check fares, or view your profile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
