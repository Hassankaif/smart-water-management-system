import React from 'react';
import { useNavigate } from 'react-router-dom';

const PageLayout = ({ title, children }) => {
    const navigate = useNavigate();

    return (
        <div className="p-6">
            <header className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">{title}</h1>
                <button 
                    className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => navigate('/')}
                >
                    Back to Dashboard
                </button>
            </header>
            <div className="grid gap-6">
                {children}
            </div>
        </div>
    );
};

export default PageLayout; 