import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WaterUsageCard = ({ walletConnected }) => {
  const [usage, setUsage] = useState('0');
  const [allocation, setAllocation] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Smart contract details
  const CONTRACT_ADDRESS = '0x14f713b4cb00eFD22746b7964b41606f638E5919';
  const CONTRACT_ABI = [
    "function recordWaterUsage(uint256 usage) public",
    "function getAllocation() public view returns (uint256)",
    "function getCurrentUsage() public view returns (uint256)",
    "event WaterUsageRecorded(address user, uint256 usage, uint256 timestamp)"
  ];

  useEffect(() => {
    if (walletConnected) {
      fetchWaterData();
    }
  }, [walletConnected]);

  const fetchWaterData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      const currentAllocation = await contract.getAllocation();
      const currentUsage = await contract.getCurrentUsage();
      
      setAllocation(ethers.utils.formatUnits(currentAllocation, 'ether'));
      setUsage(ethers.utils.formatUnits(currentUsage, 'ether'));
    } catch (error) {
      console.error('Error fetching water data:', error);
      setErrorMsg('Failed to fetch water data');
    }
  };

  const recordUsage = async (newUsage) => {
    if (!walletConnected) {
      setErrorMsg('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const usageInWei = ethers.utils.parseUnits(newUsage.toString(), 'ether');
      const tx = await contract.recordWaterUsage(usageInWei);
      await tx.wait();

      await fetchWaterData();
    } catch (error) {
      console.error('Error recording water usage:', error);
      setErrorMsg('Failed to record water usage');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUsage = e.target.usage.value;
    if (newUsage && !isNaN(newUsage)) {
      recordUsage(newUsage);
      e.target.reset();
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h2 className="text-lg font-bold">Water Usage Tracking</h2>
      <div className="flex justify-between items-center">
        <span>Monthly Allocation:</span>
        <span className="font-bold">{allocation} Tokens</span>
      </div>
      <div className="flex justify-between items-center">
        <span>Current Usage:</span>
        <span className="font-bold">{usage} Tokens</span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="number"
            name="usage"
            placeholder="Enter water usage"
            min="0"
            step="0.01"
            disabled={!walletConnected || isLoading}
            className="border rounded p-2"
          />
          <button 
            type="submit"
            disabled={!walletConnected || isLoading}
            className="bg-blue-500 text-white rounded p-2"
          >
            {isLoading ? 'Recording...' : 'Record Usage'}
          </button>
        </div>
      </form>
      
      {errorMsg && (
        <div className="text-red-500 text-sm mt-2">
          {errorMsg}
        </div>
      )}
    </div>
  );
};

export default WaterUsageCard;