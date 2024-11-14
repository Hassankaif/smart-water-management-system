import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserRegistrationForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        flatNo: '',
        phoneNumber: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/register', formData);
            if (response.data.success) {
                alert('Registration successful!');
                navigate('/users'); // Redirect to user list page
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
                <label>Flat No:</label>
                <input type="text" name="flatNo" value={formData.flatNo} onChange={handleChange} required />
            </div>
            <div>
                <label>Phone Number:</label>
                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit">Register</button>
            {error && <div>{error}</div>}
        </form>
    );
};

export default UserRegistrationForm;