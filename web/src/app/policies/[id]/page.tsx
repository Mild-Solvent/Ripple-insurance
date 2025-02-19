"use client";

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';

export default function PolicyDetails() {
  const { id } = useParams();
  const [policy, setPolicy] = useState<any>(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await fetch(`/api/policies/${id}`);
        const data = await response.json();
        setPolicy(data);
      } catch (error) {
        console.error('Error fetching policy:', error);
      }
    };
    fetchPolicy();
  }, [id]);

  if (!policy) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Policy Details: {policy.id}
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Coverage Amount</h3>
              <p className="text-2xl font-semibold">{policy.coverageAmount} USD</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Duration</h3>
              <p className="text-2xl font-semibold">{policy.duration} months</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Asset Type</h3>
              <p className="text-2xl font-semibold">{policy.assetType}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Status</h3>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400">{policy.status}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
            <h3 className="text-lg font-semibold mb-4">Policy Terms</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {policy.terms || 'Standard coverage terms apply...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 