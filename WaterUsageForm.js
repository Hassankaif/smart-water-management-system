import React, { useState } from 'react';
import WaterUsageForm from './components/WaterUsageForm'; // Use the correct case

const WaterUsageForm = () => {
    const [usageAmount, setUsageAmount] = useState('');
    const [usageDate, setUsageDate] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate input
        if (!usageAmount || !usageDate) {
            setError('Please fill in all fields.');
            return;
        }

        // Here you would typically send the data to your backend or smart contract
        console.log('Water Usage Submitted:', { usageAmount, usageDate });

        // Reset form
        setUsageAmount('');
        setUsageDate('');
        setError('');
    };

    return (
        <div className="water-usage-form">
            <h2>Record Water Usage</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="usageAmount">Water Usage (liters):</label>
                    <input
                        type="number"
                        id="usageAmount"
                        value={usageAmount}
                        onChange={(e) => setUsageAmount(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="usageDate">Date:</label>
                    <input
                        type="date"
                        id="usageDate"
                        value={usageDate}
                        onChange={(e) => setUsageDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default WaterUsageForm; 