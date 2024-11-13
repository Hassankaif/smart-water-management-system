import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserManagementABI from '../abis/UserManagement.json';
import { CONTRACT_ADDRESS } from '../config/contracts';
import { ethers } from 'ethers';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(
                CONTRACT_ADDRESS,
                UserManagementABI.abi,
                provider
            );

            const userAddresses = await contract.getAllUsers();
            const userPromises = userAddresses.map(async (address) => {
                const userData = await contract.getUserDetails(address);
                return {
                    address,
                    name: userData.name,
                    flatNo: userData.flatNo,
                    phoneNumber: userData.phoneNumber,
                    email: userData.email
                };
            });

            const userList = await Promise.all(userPromises);
            setUsers(userList);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Registered Users</h1>
            <Link to="/register-user" className="bg-primary text-white px-4 py-2 rounded mb-4 inline-block">
                Register New User
            </Link>
            {loading ? (
                <p>Loading users...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : users.length === 0 ? (
                <p>No users registered yet.</p>
            ) : (
                <table className="w-full mt-4">
                    <thead>
                        <tr>
                            <th className="text-left p-2">Name</th>
                            <th className="text-left p-2">Flat No</th>
                            <th className="text-left p-2">Phone</th>
                            <th className="text-left p-2">Email</th>
                            <th className="text-left p-2">Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index} className="border-t">
                                <td className="p-2">{user.name}</td>
                                <td className="p-2">{user.flatNo}</td>
                                <td className="p-2">{user.phoneNumber}</td>
                                <td className="p-2">{user.email}</td>
                                <td className="p-2">{user.address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserList;