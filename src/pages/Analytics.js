import React from 'react';
import { useNavigate } from 'react-router-dom';
import WaterConsumptionPlot from '../components/WaterConsumptionPlot';

const Analytics = () => {
    const navigate = useNavigate();

    const handleNavigateBack = () => {
        navigate('/');
    };

    return (
        <div className="p-6">
            <header className="mb-6">
                <h1 className="text-2xl font-bold">Water Consumption Analytics</h1>
                <button 
                    className="mt-4 p-2 rounded bg-blue-500 text-white"
                    onClick={handleNavigateBack}
                >
                    Back to Dashboard
                </button>
            </header>
            
            <div className="grid gap-6">
                <div className="p-4 rounded-lg shadow bg-white">
                    <h2 className="text-lg font-semibold mb-4">Water Consumption Trends</h2>
                    <WaterConsumptionPlot />
                </div>
                
                <div className="p-4 rounded-lg shadow bg-white">
                    <h2 className="text-lg font-semibold mb-4">Usage Statistics</h2>
                    {/* Add additional statistics or charts here */}
                </div>
            </div>
        </div>
    );
};

export default Analytics; 