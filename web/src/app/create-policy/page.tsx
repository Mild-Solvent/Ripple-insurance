"use client";

import { useState } from "react";
import Link from "next/link";

export default function CreatePolicy() {
  const [formData, setFormData] = useState({
    coverageAmount: "",
    duration: "",
    assetType: "crypto",
    cropType: "grains", 
    farmSize: "",
    location: "",
    deductible: "",
    coverageType: "weather"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mockPolicy = {
      id: `POL-${Math.random().toString(36).slice(2, 11)}`,
      premium: (Number(formData.coverageAmount) * 0.05).toFixed(2),
      ...formData,
      status: "Active",
      startDate: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/policies/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockPolicy),
      });

      if (!response.ok) throw new Error('Failed to save policy');
      
      window.location.href = "/";
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save policy. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Create New Policy</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700">
            <div>
              <label className="block text-lg mb-2 text-gray-700 dark:text-gray-300">Coverage Amount (USD)</label>
              <input
                type="number"
                required
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                value={formData.coverageAmount}
                onChange={(e) => setFormData({...formData, coverageAmount: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-lg mb-2 text-gray-700 dark:text-gray-300">Policy Duration (months)</label>
              <select
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
              >
                <option value="">Select duration</option>
                <option value="6">6 months</option>
                <option value="12">12 months</option>
                <option value="24">24 months</option>
              </select>
            </div>

            <div>
              <label className="block text-lg mb-2 text-gray-700 dark:text-gray-300">Asset Type</label>
              <select
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                value={formData.assetType}
                onChange={(e) => setFormData({...formData, assetType: e.target.value})}
              >
                <option value="crypto">Cryptocurrency</option>
                <option value="nft">NFT</option>
                <option value="wallet">Digital Wallet</option>
              </select>
            </div>

            <div>
              <label className="block text-lg mb-2 text-gray-700 dark:text-gray-300">Crop Type</label>
              <select
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                value={formData.cropType}
                onChange={(e) => setFormData({...formData, cropType: e.target.value})}
              >
                <option value="grains">Grains</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="livestock">Livestock</option>
              </select>
            </div>

            <div>
              <label className="block text-lg mb-2 text-gray-700 dark:text-gray-300">Farm Size (acres)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                required
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                value={formData.farmSize}
                onChange={(e) => setFormData({...formData, farmSize: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-lg mb-2 text-gray-700 dark:text-gray-300">Location</label>
              <input
                type="text"
                required
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-lg mb-2 text-gray-700 dark:text-gray-300">Deductible (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                required
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                value={formData.deductible}
                onChange={(e) => setFormData({...formData, deductible: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-lg mb-2 text-gray-700 dark:text-gray-300">Coverage Type</label>
              <select
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                value={formData.coverageType}
                onChange={(e) => setFormData({...formData, coverageType: e.target.value})}
              >
                <option value="weather">Weather Damage</option>
                <option value="pests">Pest Infestation</option>
                <option value="disease">Crop Disease</option>
                <option value="fire">Wildfire</option>
              </select>
            </div>

            <div className="flex gap-4 mt-8">
              <Link 
                href="/" 
                className="px-8 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium text-gray-700 dark:text-gray-300"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
              >
                Create Policy
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}