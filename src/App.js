import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Dashboard from './Dashboard';
import UserList from './components/UserList';
import UserRegistrationForm from './components/UserRegistrationForm';
import Forecast from './pages/Forecast';
import Analytics from './pages/Analytics';
import ErrorBoundary from './components/ErrorBoundary';
import WaterTokenAllocation from './components/WaterTokenAllocation'; // Import the new component

function App() {
    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/users" element={<UserList />} />
                    <Route 
                        path="/register-user" 
                        element={
                            <ErrorBoundary>
                                <UserRegistrationForm />
                            </ErrorBoundary>
                        } 
                    />
                    <Route path="/water-usage" element={<WaterUsageForm />} />
                    <Route path="/allocate-tokens" element={<WaterTokenAllocation />} />
                    <Route path="/forecast" element={<Forecast />} />
                    <Route path="/analytics" element={<Analytics />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
