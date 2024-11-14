import React, { useState } from 'react';
import { ethers } from 'ethers';

// Since we can't import the ABI file directly, we'll define it inline
const WATER_TOKEN_ABI = [
    "function getUserStats(address user) view returns (uint256 balance, uint256 allocation, string memory apartmentNo, uint256 lastUpdate)",
    "function recordWaterUsage(address user, uint256 amount)",
    "function balanceOf(address account) view returns (uint256)"
];

const WATER_TOKEN_ADDRESS = '0x123...'; // Replace with your deployed contract address

const WaterUsageForm = () => {
  const [formData, setFormData] = useState({
    userId: '',
    apartmentNo: '',
    tokensUsed: ''
  });
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (e.target.name === 'userId' && ethers.isAddress(e.target.value)) {
      fetchUserStats(e.target.value);
    }
  };

  const fetchUserStats = async (address) => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        WATER_TOKEN_ADDRESS,
        WATER_TOKEN_ABI,
        provider
      );

      const stats = await contract.getUserStats(address);
      setUserStats({
        balance: ethers.formatEther(stats.balance),
        allocation: ethers.formatEther(stats.allocation),
        apartmentNo: stats.apartmentNo,
        lastUpdate: new Date(Number(stats.lastUpdate) * 1000).toLocaleDateString()
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setError('Failed to fetch user statistics');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        WATER_TOKEN_ADDRESS,
        WATER_TOKEN_ABI,
        signer
      );

      const tx = await contract.recordWaterUsage(
        formData.userId,
        ethers.parseEther(formData.tokensUsed)
      );

      await tx.wait();
      alert('Water usage recorded successfully!');
      
      // Refresh user stats
      fetchUserStats(formData.userId);
      
      setFormData({
        userId: '',
        apartmentNo: '',
        tokensUsed: ''
      });
    } catch (error) {
      console.error('Error recording water usage:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Record Water Usage</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {userStats && (
          <div className="mb-6 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold mb-2">User Statistics</h3>
            <p>Current Balance: {userStats.balance} WATER</p>
            <p>Monthly Allocation: {userStats.allocation} WATER</p>
            <p>Apartment: {userStats.apartmentNo}</p>
            <p>Last Updated: {userStats.lastUpdate}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">User Address</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="0x..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Apartment No</label>
            <input
              type="text"
              name="apartmentNo"
              value={formData.apartmentNo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="A101"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Tokens Used</label>
            <input
              type="number"
              name="tokensUsed"
              value={formData.tokensUsed}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              step="0.01"
              placeholder="0.00"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded text-white ${
              loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Recording...' : 'Record Usage'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WaterUsageForm;
