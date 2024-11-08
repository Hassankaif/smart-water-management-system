import React from 'react';
import PageLayout from '../components/PageLayout';

const Maintenance = () => {
    return (
        <PageLayout title="System Maintenance">
            <div className="p-4 rounded-lg shadow bg-white">
                <h2 className="text-lg font-semibold mb-4">Maintenance Schedule</h2>
                {/* Add maintenance schedule content */}
            </div>
            
            <div className="p-4 rounded-lg shadow bg-white">
                <h2 className="text-lg font-semibold mb-4">Service History</h2>
                {/* Add service history content */}
            </div>
        </PageLayout>
    );
};

export default Maintenance; 