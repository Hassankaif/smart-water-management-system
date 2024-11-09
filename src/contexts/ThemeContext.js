import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

// Define default theme
const defaultTheme = {
    backgroundColor: '#FBFBFB',
    headerBackground: '#222831',
    headerText: '#F9F7F7',
    usageCardBackground: '#88C273',
    forecastCardBackground: '#88C273',
    billingCardBackground: '#88C273',
    notificationsCardBackground: '#88C273',
    analyticsCardBackground: '#7AB2D3',
    balanceCardBackground: '#71C9CE',
    ownerCardBackground: '#B59F78',
    apartmentCardBackground: '#D8DBBD',
    cardText: '#000000',
    buttonBackground: '#3b82f6',
    analyticsButtonBackground: '#3B82F6',
    analyticsButtonText: '#FFFFFF',
    footerBackground: '#DBE2EF',
    footerText: '#000000',
    chartPrimaryColor: 'rgb(75, 192, 192)',
    chartSecondaryColor: 'rgb(255, 99, 132)'
};

export const ThemeProvider = ({ children }) => {
    // Initialize theme from localStorage or use default
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
    });

    const updateTheme = (updates) => {
        setTheme(prevTheme => {
            const newTheme = {
                ...prevTheme,
                ...(typeof updates === 'function' ? updates(prevTheme) : updates)
            };
            // Save to localStorage
            localStorage.setItem('theme', JSON.stringify(newTheme));
            return newTheme;
        });
    };

    const resetTheme = () => {
        localStorage.setItem('theme', JSON.stringify(defaultTheme));
        setTheme(defaultTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme: updateTheme, resetTheme, defaultTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}; 