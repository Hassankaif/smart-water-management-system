import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WaterTokenAllocatorABI from '../abis/WaterTokenAllocator.json'; // Add ABI for WaterTokenAllocator

const WATER_TOKEN_ALLOCATOR_ADDRESS = '0xYourWaterTokenAllocatorAddress'; // Replace with your deployed contract address

const WaterTokenAllocation = () => {
    const [users, setUsers] = useState([]);
    const [averageConsumption, setAverageConsumption] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        // Fetch users from your backend or smart contract
        // This is a placeholder; implement your logic to fetch users
        const userAddresses = ['0xUser1', '0xUser2']; // Replace with actual user addresses
        const consumptionData = [300, 400]; // Replace with actual average consumption data
        setUsers(userAddresses);
        setAverageConsumption(consumptionData);
    };

    const allocateTokens = async () => {
        setLoading(true);
        setError('');

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(WATER_TOKEN_ALLOCATOR_ADDRESS, WaterTokenAllocatorABI, signer);

            const tx = await contract.allocateTokens(users, averageConsumption);
            await tx.wait();
            alert('Tokens allocated successfully!');
        } catch (error) {
            console.error('Error allocating tokens:', error);
            setError('Failed to allocate tokens');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <h2>Allocate Water Tokens</h2>
            {error && <div className="text-red-500">{error}</div>}
            <button onClick={allocateTokens} disabled={loading}>
                {loading ? 'Allocating...' : 'Allocate Tokens'}
            </button>
        </div>
    );
};

export default WaterTokenAllocation; 