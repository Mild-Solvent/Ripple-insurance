"use client";

import { useState } from "react";
import Link from "next/link";

export default function CreatePolicy() {
  const [formData, setFormData] = useState({
    coverageAmount: "",
    duration: "",
    assetType: "crypto"
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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create New Policy</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg mb-2">Coverage Amount (USD)</label>
          <input
            type="number"
            required
            className="w-full p-3 border rounded-lg"
            value={formData.coverageAmount}
            onChange={(e) => setFormData({...formData, coverageAmount: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-lg mb-2">Policy Duration (months)</label>
          <select
            className="w-full p-3 border rounded-lg"
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
          <label className="block text-lg mb-2">Asset Type</label>
          <select
            className="w-full p-3 border rounded-lg"
            value={formData.assetType}
            onChange={(e) => setFormData({...formData, assetType: e.target.value})}
          >
            <option value="crypto">Cryptocurrency</option>
            <option value="nft">NFT</option>
            <option value="wallet">Digital Wallet</option>
          </select>
        </div>

        <div className="flex gap-4 mt-8">
          <Link href="/" className="px-6 py-3 border rounded-lg">
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Create Policy
          </button>
        </div>
      </form>
    </div>
  );
}