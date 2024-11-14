import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';
import ThemeSwitcher from './components/ThemeSwitcher';
import WalletConnect from './components/WalletConnect';
import { forecastService } from './services/forecastService';
import { ethers } from 'ethers';
import WaterTokenAllocation from './components/WaterTokenAllocation'; // Import the new component
import axios from 'axios'; // Make sure to install axios
import UserRegistrationForm from './components/UserRegistrationForm'; // Import the registration form

const CONTRACT_ADDRESS = '0x14f713b4cb00eFD22746b7964b41606f638E5919'; // change if deployed again

const Dashboard = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [latestPrediction, setLatestPrediction] = useState(null);
    const [showThemeForm, setShowThemeForm] = useState(false);
    const [walletBalance, setWalletBalance] = useState('0');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);

    const cardClass = `p-4 rounded-lg shadow`;
    const buttonClass = `p-2 rounded`;
    const textClass = "your-tailwind-classes-here";

    const toggleThemeForm = (e) => {
        e && e.preventDefault();
        setShowThemeForm(!showThemeForm);
    };

    const onNavigateToAnalytics = () => {
        window.location.href = '/analytics';
    };

    const handleBalanceChange = (balance) => {
        setWalletBalance(balance);
    };

    useEffect(() => {
        const fetchLatestPrediction = async () => {
            try {
                const data = await forecastService.getPrediction(1, 1, 2);
                if (data && data.predictions) {
                    setLatestPrediction({
                        nextDay: data.predictions.values[0],
                        trend: data.predictions.values[0] > data.predictions.values[1] ? 'up' : 'down'
                    });
                }
            } catch (error) {
                console.error('Error fetching prediction:', error);
            }
        };

        fetchLatestPrediction();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users');
            if (response.data.success) {
                setUsers(response.data.users);
            } else {
                throw new Error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };



    const toggleRegistrationForm = () => {
        navigate('/register-user');
    };

    const defaultImage = "/owner_icon.webp"; // Path to the image in the public directory

    return (
        <div
            className="bg-background text-foreground p-6"
            style={{
                backgroundColor: theme.backgroundColor,
            }}
        >
            <header 
                className="flex justify-between items-center mb-6"
                style={{
                    backgroundColor: theme.headerBackground,
                    color: theme.headerText,
                    padding: '1rem',
                    borderRadius: '0.5rem'
                }}
            >
                <h1 className="text-2xl font-bold">SMART WATER MANAGEMENT SYSTEM</h1>
                <nav className="flex space-x-4">
                    <Link to="/" className={textClass}>Dashboard</Link>
                    <Link to="/analytics" className={textClass}>Analytics</Link>
                    <Link to="/water-quality" className={textClass}>Water Quality</Link>
                    <Link to="/maintenance" className={textClass}>Maintenance</Link>
                    <Link to="/settings" className={textClass}>Settings</Link>
                    <Link to="/alerts" className={textClass}>Alerts</Link>
                    <a href="#" className={textClass} onClick={toggleThemeForm}>Theme</a>
                    <Link to="/chat" className={textClass}>Chat</Link>
                    <Link to="/ask-ai" className={textClass}>Ask AI</Link>

                </nav>
            </header>

            {showThemeForm && (
                <ThemeSwitcher 
                    onClose={toggleThemeForm}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className={cardClass} style={{ backgroundColor: theme.usageCardBackground, color: theme.cardText }}>
                    <h2 className="text-lg font-semibold">Water Usage Tracking</h2>
                    <p className="text-2xl"> WATER</p>
                    <p className={textClass}>Monthly Allocation: </p>
                    <Link 
                        to="/water-usage" 
                        className="text-blue-500 hover:text-blue-600"
                    >
                        Record Usage
                    </Link>
                    <Link 
                        to="/allocate-tokens" 
                        className="text-blue-500 hover:text-blue-600"
                    >
                        Allocate Tokens
                    </Link>
                </div>
                
                <Link 
                    to="/forecast" 
                    className={`${cardClass} cursor-pointer transition-transform hover:scale-105`}
                    style={{ backgroundColor: theme.forecastCardBackground, color: theme.cardText }}
                >
                    <div className="flex flex-col items-center">
                        <h2 className="text-lg font-semibold">Forecast & Analytics</h2>
                        <div className="text-center mt-2">
                            <p className="text-2xl font-bold">7 Days</p>
                            {latestPrediction && (
                                <div className="mt-2">
                                    <p className="text-sm">Next Day Prediction:</p>
                                    <p className={`${textClass} font-bold flex items-center justify-center`}>
                                        {latestPrediction.nextDay.toFixed(1)}L
                                        {latestPrediction.trend === 'up' ? (
                                            <span className="text-green-500 ml-2">↑</span>
                                        ) : (
                                            <span className="text-red-500 ml-2">↓</span>
                                        )}
                                    </p>
                                </div>
                            )}
                            <p className={`${textClass} mt-1`}>View Predictions</p>
                        </div>
                        <div className="mt-2">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-6 w-6" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                                />
                            </svg>
                        </div>
                    </div>
                </Link>
                <div className={cardClass} style={{ backgroundColor: theme.billingCardBackground, color: theme.cardText }}>
                    <h2 className="text-lg font-semibold">Billing and Payments</h2>
                    <p className="text-2xl">6</p>
                    <p className={textClass}>-2.5%</p>
                </div>
                <div className={cardClass} style={{ backgroundColor: theme.notificationsCardBackground, color: theme.cardText }}>
                    <h2 className="text-lg font-semibold">Notifications</h2>
                    <p className="text-2xl">48</p>
                    <p className={textClass}>+5.9%</p>
                </div>
            </div>
            <div className={`${cardClass} mb-6`} style={{ backgroundColor: theme.balanceCardBackground, color: theme.cardText }}>
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold">Balance</h2>
                        <p className="text-2xl">{Number(walletBalance).toFixed(4)} ETH</p>
                    </div>
                    <WalletConnect onBalanceChange={handleBalanceChange} />
                </div>
            </div>

            
            <div className="mb-6 mt-6">
                <div className={cardClass} style={{ 
                    backgroundColor: theme.analyticsCardBackground,
                    color: theme.cardText,
                    width: '50%'
                }}>
                    <h2 className="text-lg font-semibold mb-4">Analytics Dashboard</h2>
                    <div className="flex flex-col space-y-4">
                        <p className="text-xl">Water Usage Trends</p>
                        <p>View detailed consumption patterns and analytics</p>
                        <button 
                            className={`${buttonClass} hover:bg-blue-600 transition-colors duration-200`}
                            style={{
                                backgroundColor: theme.AnalyticsCardBackground,
                                color: theme.analyticsButtonText,
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem'
                            }}
                            onClick={onNavigateToAnalytics}
                        >
                            View Analytics
                        </button>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={cardClass} style={{ backgroundColor: theme.ownerCardBackground, color: theme.cardText }}>
                    <h2 className="text-lg font-semibold">Building Owner Details</h2>
                    <div className="flex items-center mb-4">
                        <a href="https://www.linkedin.com/in/hassan-kaif-a03028257/" target="_blank" rel="noopener noreferrer">
                            <img src={defaultImage} alt="Mr. Mohammed Mohsin A" className="w-16 h-16 rounded-full mr-4" />
                        </a>
                        <div>
                            <p className="font-bold">Mr. Mohammed Mohsin A</p>
                            <p className="text-gray-600">Entrepreneur</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <a href="https://www.linkedin.com/in/manikandan-t-5a2405293?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer">
                            <img src={defaultImage} alt="Mr. Manikandan" className="w-16 h-16 rounded-full mr-4" />
                        </a>
                        <div>
                            <p className="font-bold">Mr. Manikandan</p>
                            <p className="text-gray-600">Building Incharge</p>
                        </div>
                    </div>
                </div>
                <div className={cardClass} style={{ backgroundColor: theme.apartmentCardBackground, color: theme.cardText }}>
                    <h2 className="text-lg font-semibold">Apartment Details</h2>
                    <div className="flex flex-col space-y-4">
                        {error ? (
                            <div className="text-red-500 py-2">Error: {error}</div>
                        ) : (
                            <>
                                <ul>
                                    {loading ? (
                                        <li className="py-2">Loading...</li>
                                    ) : users.length === 0 ? (
                                        <li className="py-2">No registered users</li>
                                    ) : (
                                        users.map((user, index) => (
                                            <li key={index} className="flex justify-between py-2">
                                                <span>{user.name}</span>
                                                <span>Flat no: {user.flat_no}</span>
                                            </li>
                                        ))
                                    )}
                                </ul>
                                <div className="flex space-x-4">
                                    <button onClick={toggleRegistrationForm}
                                        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
                                        >
                                            Register New User
                                    </button>
                                    <Link to="/users"
                                        className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/80"
                                        >
                                            View All Users
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <footer 
                className="mt-6 text-center"
                style={{
                    backgroundColor: theme.footerBackground,
                    color: theme.footerText,
                    padding: '1rem',
                    borderRadius: '0.5rem'
                }}
            >
                <p className={textClass}>
                    Developed by:{' '}
                    <a 
                        href="https://www.linkedin.com/in/hassan-kaif-a03028257/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-600 underline"
                        style={{ color: theme.footerText
                         , fontWeight: 'bold',
                         fontSize: '1.1rem'
                         }}
                    >
                        Hassan Kaif
                    </a>
                </p>
                <p className="text-xs" style={{ color: theme.footerText ,fontSize: '1.1rem' }}>
                    Smart Water Management System Admin Dashboard 2023 All Rights Reserved
                    </p>
            </footer>

            {showRegistrationForm && <UserRegistrationForm />}
        </div>
    );
};

export default Dashboard;
