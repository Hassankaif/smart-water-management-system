import React, { useState } from 'react';
import { ethers } from 'ethers';
import UserManagementABI from './abis/UserManagement.json';
import { CONTRACT_ADDRESS } from './config/contracts';

const UserRegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        flatNo: '',
        phoneNumber: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!window.ethereum) {
                throw new Error("Please install MetaMask!");
            }

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contract = new ethers.Contract(
                CONTRACT_ADDRESS,
                UserManagementABI.abi,
                signer
            );

            const tx = await contract.registerUser(
                formData.name,
                formData.flatNo,
                formData.phoneNumber,
                formData.email,
                formData.password
            );

            console.log('Transaction sent:', tx.hash);
            await tx.wait();

            alert('Registration successful!');
            setFormData({
                name: '',
                flatNo: '',
                phoneNumber: '',
                email: '',
                password: ''
            });
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.message);
            alert(`Registration failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Form fields for name, flatNo, phoneNumber, email, password */}
            <button type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
            </button>
        </form>
    );
};

export default UserRegistrationForm; 