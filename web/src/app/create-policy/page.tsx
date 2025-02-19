"use client";

import { useState } from "react";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiInfo } from "react-icons/fi";

const InfoIcon = ({ title, content }: { title: string; content: string }) => (
  <div className="relative inline-block ml-2 group">
    <FiInfo className="text-gray-400 hover:text-blue-500 cursor-pointer" />
    <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-2 w-64 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
      <strong className="block mb-1 text-blue-600">{title}</strong>
      <p className="text-gray-600 dark:text-gray-300">{content}</p>
    </div>
  </div>
);

export default function CreatePolicy() {
  const [formData, setFormData] = useState({
    coverageAmount: "",
    policyStartDate: new Date(),
    policyEndDate: new Date(),
    assetType: "credit-card",
    cropTypes: ["grains"],
    farmSize: "",
    location: "",
    deductible: "",
    coverageTypes: ["weather"]
  });

  const [newCoverageType, setNewCoverageType] = useState("");
  const [newCropType, setNewCropType] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentConfirmed) {
      setShowPaymentModal(true);
      return;
    }

    const durationInMonths = Math.round(
      (formData.policyEndDate.getTime() - formData.policyStartDate.getTime()) / 
      (1000 * 60 * 60 * 24 * 30)
    );

    const mockPolicy = {
      id: `POL-${Math.random().toString(36).slice(2, 11)}`,
      premium: (Number(formData.coverageAmount) * 0.05).toFixed(2),
      ...formData,
      duration: durationInMonths.toString(),
      status: "Active",
      startDate: formData.policyStartDate.toISOString()
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

  const handlePaymentConfirmation = async () => {
    setShowPaymentModal(false);
    setPaymentConfirmed(true);
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    await handleSubmit(fakeEvent);
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'credit-card': return 'Credit Card';
      case 'paypal': return 'PayPal';
      case 'crypto-wallet': return 'Crypto Wallet';
      case 'bank-transfer': return 'Bank Transfer';
      case 'sms': return 'SMS Payment';
      default: return 'Payment';
    }
  };

  const addCoverageType = (type: string) => {
    if (!formData.coverageTypes.includes(type)) {
      setFormData(prev => ({
        ...prev,
        coverageTypes: [...prev.coverageTypes, type]
      }));
    }
  };

  const removeCoverageType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      coverageTypes: prev.coverageTypes.filter(t => t !== type)
    }));
  };

  const addCropType = (type: string) => {
    if (type.trim() && !formData.cropTypes.includes(type)) {
      setFormData(prev => ({...prev, cropTypes: [...prev.cropTypes, type.trim()]}));
      setNewCropType("");
    }
  };

  const removeCropType = (type: string) => {
    setFormData(prev => ({...prev, cropTypes: prev.cropTypes.filter(t => t !== type)}));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Create New Policy</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700">
            <div>
              <div className="flex items-center mb-2">
                <label className="block text-lg text-gray-700 dark:text-gray-300">Coverage Amount (USD)</label>
                <InfoIcon 
                  title="Coverage Amount" 
                  content="Total protection value in USD for your assets"
                />
              </div>
              <input
                type="number"
                required
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                value={formData.coverageAmount}
                onChange={(e) => setFormData({...formData, coverageAmount: e.target.value})}
              />
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <label className="block text-lg text-gray-700 dark:text-gray-300">Policy Period</label>
                <InfoIcon 
                  title="Policy Duration" 
                  content="Select start and end dates for your insurance coverage period"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-1 block">Start Date</label>
                  <DatePicker
                    selected={formData.policyStartDate}
                    onChange={(date: Date) => setFormData({...formData, policyStartDate: date})}
                    minDate={new Date()}
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm mb-1 block">End Date</label>
                  <DatePicker
                    selected={formData.policyEndDate}
                    onChange={(date: Date) => setFormData({...formData, policyEndDate: date})}
                    minDate={formData.policyStartDate}
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <label className="block text-lg text-gray-700 dark:text-gray-300">Payment Method</label>
                <InfoIcon 
                  title="Payment Method" 
                  content="Select your preferred payment method for premium payments"
                />
              </div>
              <select
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                value={formData.assetType}
                onChange={(e) => setFormData({...formData, assetType: e.target.value})}
              >
                <option value="credit-card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="crypto-wallet">Crypto Wallet</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="sms">SMS</option>
              </select>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <label className="block text-lg text-gray-700 dark:text-gray-300">Crop Types</label>
                <InfoIcon 
                  title="Crop Types" 
                  content="Add specific agricultural products you want to insure"
                />
              </div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter crop type"
                  className="flex-1 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                  value={newCropType}
                  onChange={(e) => setNewCropType(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCropType(newCropType)}
                />
                <button
                  type="button"
                  onClick={() => addCropType(newCropType)}
                  className="px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.cropTypes.map(type => (
                  <div key={type} className="flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full">
                    <span className="mr-2 capitalize">{type}</span>
                    <button
                      type="button"
                      onClick={() => removeCropType(type)}
                      className="hover:text-green-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <label className="block text-lg text-gray-700 dark:text-gray-300">Farm Size (acres)</label>
                <InfoIcon 
                  title="Farm Size" 
                  content="Total agricultural land area being insured"
                />
              </div>
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
              <div className="flex items-center mb-2">
                <label className="block text-lg text-gray-700 dark:text-gray-300">Location</label>
                <InfoIcon 
                  title="Location" 
                  content="Geographical location of the insured assets"
                />
              </div>
              <input
                type="text"
                required
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>

            <div>
              <div className="flex items-center mb-2">
                <label className="block text-lg text-gray-700 dark:text-gray-300">Deductible (%)</label>
                <InfoIcon 
                  title="Deductible" 
                  content="Percentage of loss you'll cover before insurance applies"
                />
              </div>
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
              <div className="flex items-center mb-2">
                <label className="block text-lg text-gray-700 dark:text-gray-300">Coverage Types</label>
                <InfoIcon 
                  title="Coverage Types" 
                  content="Specific risks and scenarios covered by this policy"
                />
              </div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter coverage type"
                  className="flex-1 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                  value={newCoverageType}
                  onChange={(e) => setNewCoverageType(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCoverageType(newCoverageType)}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newCoverageType.trim()) {
                      addCoverageType(newCoverageType.trim());
                      setNewCoverageType("");
                    }
                  }}
                  className="px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.coverageTypes.map(type => (
                  <div key={type} className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                    <span className="mr-2 capitalize">{type}</span>
                    <button
                      type="button"
                      onClick={() => removeCoverageType(type)}
                      className="hover:text-blue-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
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
                className={`bg-gradient-to-r from-green-600 to-emerald-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium ${
                  !paymentConfirmed ? 'animate-pulse' : ''
                }`}
              >
                {paymentConfirmed ? 'Create Policy' : 'Confirm Payment'}
              </button>
            </div>
          </form>

          {showPaymentModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full space-y-4">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Confirm Payment
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  You're about to complete payment using {getPaymentMethodName(formData.assetType)}.
                  Confirm this transaction?
                </p>
                <div className="flex gap-4 justify-end">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePaymentConfirmation}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Confirm Payment
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}