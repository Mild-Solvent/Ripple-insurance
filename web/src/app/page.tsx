"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function Home() {
  const [accountAddress, setAccountAddress] = useState('');
  const [policies, setPolicies] = useState<any[]>([]);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  useEffect(() => {
    if (accountAddress) {
      const loadPolicies = async () => {
        try {
          const response = await fetch('/api/policies/load');
          const data = await response.json();
          setPolicies(data);
        } catch (error) {
          console.error('Error loading policies:', error);
        }
      };
      loadPolicies();
    }
  }, [accountAddress]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccountAddress(address);
        setProvider(provider);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const handleDisconnect = () => {
    setAccountAddress('');
    setPolicies([]);
    setProvider(null);
  };

  const formatAddress = (addr: string) => 
    `${addr.slice(0, 5)}...${addr.slice(-4)}`;

  const loadPoliciesFromFile = async () => {
    try {
      const response = await fetch('/api/policies/load');
      const data = await response.json();
      setPolicies(data);
    } catch (error) {
      console.error('Error loading policies:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center p-4 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Image
            className="dark:invert hover:scale-105 transition-transform"
            src="/insurance.png"
            alt="Logo"
            width={100}
            height={24}
          />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">ShieldCrowd</span>
        </div>
        
        {!accountAddress ? (
          <button 
            onClick={connectWallet}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">
              {formatAddress(accountAddress)}
            </span>
            <button 
              onClick={handleDisconnect}
              className="bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
            >
              Disconnect
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 bg-clip-text text-transparent">
            Insuring Resilience: Blockchain for Climate-Stressed Farmers
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
            Imagine instant compensation after a climate disaster. Our blockchain dApp delivers fraud-proof crop insurance 
            with auto-payouts triggered by satellite and IoT data. Empowering 300 million smallholder farmers to overcome 
            climate vulnerability through XRPL's 3-second settlements and Ethereum smart contracts.
          </p>
          
          <Link 
            href="/create-policy"
            className="inline-block bg-gradient-to-r from-green-600 to-emerald-500 text-white px-10 py-4 rounded-xl text-lg font-medium hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Get Protected Now
          </Link>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Parametric Smart Contracts</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Auto-payouts triggered by satellite data, reducing claim times from 45 days to 3 hours
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-green-500 bg-clip-text text-transparent">RLUSD Stablecoin</h3>
              <p className="text-gray-600 dark:text-gray-400">
                NYDFS-regulated payouts are 100x cheaper with transparent transfers
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">Real-Time Monitoring</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Chainlink oracles track NASA and MODIS satellite data for accurate payouts
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-16 mt-20">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Active Insurance Policies
            </h2>
            <div className="flex gap-4">
              <button
                onClick={loadPoliciesFromFile}
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
              >
                Load Policies
              </button>
              <Link 
                href="/create-policy"
                className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
              >
                + New Policy
              </Link>
            </div>
          </div>

          {/* Policies list */}
          {policies.length > 0 ? (
            <div className="space-y-4">
              {policies.map((policy) => (
                <Link 
                  key={policy.id} 
                  href={`/policies/${policy.id}`}
                  className="group block hover:-translate-y-0.5 transition-transform"
                >
                  <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{policy.id}</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {policy.coverageAmount} RLUSD • {policy.duration} months • {policy.assetType}
                        </p>
                      </div>
                      <span className="px-4 py-1.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-600 dark:text-green-400 rounded-full font-medium">
                        {policy.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              No active policies found. Start protecting your crops today.
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 mt-12 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-12">
          <div>
            <h4 className="font-bold text-lg mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">ShieldCrowd</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Transforming agriculture with blockchain-powered crop insurance
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Products</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Crop Insurance</Link></li>
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Climate Protection</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 bg-gradient-to-r from-cyan-500 to-green-500 bg-clip-text text-transparent">Partners</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Ripple Climate Fund</Link></li>
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">UN World Food Programme</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">Community</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Farmer Network</Link></li>
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Impact Stories</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
