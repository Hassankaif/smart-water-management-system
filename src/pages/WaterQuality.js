import React from 'react';
import PageLayout from '../components/PageLayout';

const WaterQuality = () => {
    return (
        <PageLayout title="Water Quality Monitoring">
            <div className="p-4 rounded-lg shadow bg-white">
                <h2 className="text-lg font-semibold mb-4">Quality Parameters</h2>
                {/* Add your water quality content here */}
            </div>
            
            <div className="p-4 rounded-lg shadow bg-white">
                <h2 className="text-lg font-semibold mb-4">Historical Data</h2>
                {/* Add historical data content here */}
            </div>
        </PageLayout>
    );
};

export default WaterQuality; 