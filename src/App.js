import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Analytics from './pages/Analytics';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/analytics" element={<Analytics />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
