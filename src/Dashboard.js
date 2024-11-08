import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';
import ThemeSwitcher from './components/ThemeSwitcher';

const Dashboard = () => {
    const { theme, setTheme } = useTheme();
    const [showThemeForm, setShowThemeForm] = useState(false);

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
                    <p className="text-2xl">5</p>
                    <p className={textClass}>+4.8%</p>
                </div>
                <div className={cardClass} style={{ backgroundColor: theme.forecastCardBackground, color: theme.cardText }}>
                    <h2 className="text-lg font-semibold">Forecast & Analytics</h2>
                    <p className="text-2xl">4</p>
                    <p className={textClass}>+2.3%</p>
                </div>
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
                <h2 className="text-lg font-semibold">Balance</h2>
                <p className="text-2xl">10241.98</p>
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
                        <img src="https://openui.fly.dev/openui/24x24.svg?text=👨‍⚕️" alt="Doctor" className="w-16 h-16 rounded-full mr-4" />
                        <div>
                            <p className="font-bold"> Mr.Mohammed Mohsin A</p>
                            <p className={textClass}>Entrepreneur</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <img src="https://openui.fly.dev/openui/24x24.svg?text=👩‍⚕️" alt="Doctor" className="w-16 h-16 rounded-full mr-4" />
                        <div>
                            <p className="font-bold">Mr. Manikandan</p>
                            <p className={textClass}>building incharge</p>
                        </div>
                    </div>
                </div>
                <div className={cardClass} style={{ backgroundColor: theme.apartmentCardBackground, color: theme.cardText }}>
                    <h2 className="text-lg font-semibold">Apartment Details</h2>
                    <ul>
                        <li className="flex justify-between py-2">
                            <span>Mr. John Doe</span>
                            <span>Flat no: A101</span>
                        </li>
                        <li className="flex justify-between py-2">
                            <span>Mr. Alice Johnson</span>
                            <span>Flat no: A102</span>
                        </li>
                        <li className="flex justify-between py-2">
                            <span>Mr. Robert Smith</span>
                            <span>Flat no: A103</span>
                        </li>
                        <li className="flex justify-between py-2">
                            <span>Mrs. Emily Davis</span>
                            <span>Flat no: A201</span>
                        </li>
                    </ul>
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
        </div>
    );
};

export default Dashboard;
