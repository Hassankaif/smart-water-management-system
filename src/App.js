import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Analytics from './pages/Analytics';
import { ThemeProvider } from './contexts/ThemeContext';
import detectEthereumProvider from '@metamask/detect-provider';
import { useEffect, useState } from 'react';
import Forecast from './pages/Forecast';

function App() {
    const [hasProvider, setHasProvider] = useState(false);

    useEffect(() => {
        const getProvider = async () => {
            const provider = await detectEthereumProvider();
            setHasProvider(!!provider);
        };
        getProvider();
    }, []);

    useEffect(() => {
        if (!hasProvider) {
            console.log('Please install MetaMask!');
        }
    }, [hasProvider]);

    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/forecast" element={<Forecast />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
