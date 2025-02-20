"use client";

import { useState } from "react";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiInfo, FiCreditCard, FiLock, FiCheckCircle } from "react-icons/fi";
import { ethers } from "ethers";

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
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

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

  const handleMetaMaskPayment = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      setPaymentProcessing(true);
      
      await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      setPaymentProcessing(false);
      setShowPaymentModal(false);
      setPaymentConfirmed(true);

    } catch (error) {
      console.error("Payment error:", error);
      setPaymentProcessing(false);
      alert("Payment failed. Please try again.");
    }
  };

  const handlePaymentConfirmation = async () => {
    if (formData.assetType === 'crypto-wallet') {
      await handleMetaMaskPayment();
    } else {
      setPaymentProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentProcessing(false);
      setShowPaymentModal(false);
      setPaymentConfirmed(true);
    }
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
                <option value="crypto-wallet">MetaMask (ETH)</option>
                <option value="paypal">PayPal</option>
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
                {paymentConfirmed ? 'Complete Policy Creation' : 'Proceed to Payment'}
              </button>
            </div>
          </form>

          {showPaymentModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Payment Details
                  </h3>
                  <FiLock className="text-green-500 text-xl" />
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Premium Amount:</span>
                    <span className="font-semibold">${(Number(formData.coverageAmount) * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                    <span className="font-semibold flex items-center">
                      <FiCreditCard className="mr-2" />
                      {getPaymentMethodName(formData.assetType)}
                    </span>
                  </div>
                </div>

                {paymentProcessing ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Processing payment...</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {formData.assetType === 'crypto-wallet' ? (
                        <div className="text-center">
                          <img src="/metamask-fox.svg" alt="MetaMask" className="w-16 h-16 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            You will be prompted to confirm the transaction in MetaMask
                          </p>
                          <p className="font-semibold">
                            Amount: {(Number(formData.coverageAmount) * 0.05).toFixed(4)} ETH
                          </p>
                        </div>
                      ) : (
                        <>
                          <input
                            type="text"
                            placeholder="Card Number"
                            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                            />
                            <input
                              type="text"
                              placeholder="CVC"
                              className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex gap-4 justify-end">
                      <button
                        onClick={() => setShowPaymentModal(false)}
                        className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handlePaymentConfirmation}
                        className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center"
                      >
                        <FiCheckCircle className="mr-2" />
                        {formData.assetType === 'crypto-wallet' ? 'Pay with MetaMask' : `Pay $${(Number(formData.coverageAmount) * 0.05).toFixed(2)}`}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
