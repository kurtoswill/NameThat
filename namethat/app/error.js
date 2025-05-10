'use client';

import { useEffect } from 'react';

export default function RootError({ error, reset }) {
  useEffect(() => {
    // You can log errors here or send to analytics
    console.error('Root error:', error);
  }, [error]);

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
      <p className="mb-6">{error.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Try Again
      </button>
    </div>
  );
}
