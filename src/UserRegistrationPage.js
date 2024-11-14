import React, { useState } from 'react';
import axios from 'axios';

const INPUT_CLASS = "mt-1 block w-full border border-border rounded-md p-2";
const LABEL_CLASS = "block text-sm font-medium text-muted-foreground";

const UserRegistrationPage = () => {
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
        // Redirect to user list page or dashboard
        window.location.href = '/users'; // Change this to your desired route
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primary mb-4">SMART WATER MANAGEMENT SYSTEM</h2>
      <h3 className="text-lg font-semibold text-muted">New User Registration</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField label="Name" type="text" name="name" placeholder="Enter your name" required onChange={handleChange} />
        <InputField label="Flat No" type="text" name="flatNo" placeholder="Enter your flat no" required onChange={handleChange} />
        <InputField label="Phone Number" type="tel" name="phoneNumber" placeholder="Enter your phone number" required onChange={handleChange} />
        <InputField label="Mail ID" type="email" name="email" placeholder="Enter your email" required onChange={handleChange} />
        <InputField label="Password" type="password" name="password" placeholder="Enter your password" required onChange={handleChange} />
        <button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 p-2 rounded-md">Register</button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  );
};

const InputField = ({ label, type, name, placeholder, required, onChange }) => {
  return (
    <div>
      <label className={LABEL_CLASS} htmlFor={name}>{label}</label>
      <input className={INPUT_CLASS} type={type} name={name} placeholder={placeholder} required={required} onChange={onChange} />
    </div>
  );
};

export default UserRegistrationPage;
