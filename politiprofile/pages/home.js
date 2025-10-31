import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-2xl mx-auto">
        {/* Feed Container */}
        <div className="bg-white rounded-lg shadow">
          {/* Feed Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-800">Home</h1>
          </div>

          {/* Empty Feed State */}
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              className="w-16 h-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-xl text-gray-600 font-medium">Follow fighters to see content!</p>
            <p className="text-gray-500 mt-2">
              Their activities and updates will appear in your feed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}