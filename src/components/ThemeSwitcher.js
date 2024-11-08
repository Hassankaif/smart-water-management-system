import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSwitcher = ({ onClose }) => {
    const { theme, setTheme, resetTheme } = useTheme();

    const saveCurrentTheme = () => {
        localStorage.setItem('theme', JSON.stringify(theme));
    };

    const handleThemeChange = (e) => {
        const { name, value } = e.target;
        setTheme(prevTheme => ({
            ...prevTheme,
            [name]: value
        }));
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow fixed top-20 right-4 z-50 w-80 max-h-[80vh] overflow-y-auto" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Theme Settings</h3>
                <div className="flex gap-2">
                    <button 
                        onClick={saveCurrentTheme}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Save
                    </button>
                    <button 
                        onClick={resetTheme}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Reset
                    </button>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
            </div>
            <form className="space-y-6">
                {/* Page Background */}
                <section className="space-y-2">
                    <h4 className="font-medium">Page Background</h4>
                    <div className="flex items-center gap-2">
                        <input 
                            type="color" 
                            name="backgroundColor"
                            value={theme.backgroundColor}
                            onChange={handleThemeChange}
                            className="w-12 h-8"
                        />
                        <label>Background Color</label>
                    </div>
                </section>

                {/* Card Colors */}
                <section className="space-y-2">
                    <h4 className="font-medium">Card Colors</h4>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <input 
                                type="color" 
                                name="usageCardBackground"
                                value={theme.usageCardBackground}
                                onChange={handleThemeChange}
                                className="w-12 h-8"
                            />
                            <label>Usage Card</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                                type="color" 
                                name="forecastCardBackground"
                                value={theme.forecastCardBackground}
                                onChange={handleThemeChange}
                                className="w-12 h-8"
                            />
                            <label>Forecast Card</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                                type="color" 
                                name="billingCardBackground"
                                value={theme.billingCardBackground}
                                onChange={handleThemeChange}
                                className="w-12 h-8"
                            />
                            <label>Billing Card</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                                type="color" 
                                name="notificationsCardBackground"
                                value={theme.notificationsCardBackground}
                                onChange={handleThemeChange}
                                className="w-12 h-8"
                            />
                            <label>Notifications Card</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                                type="color" 
                                name="balanceCardBackground"
                                value={theme.balanceCardBackground}
                                onChange={handleThemeChange}
                                className="w-12 h-8"
                            />
                            <label>Balance Card</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                                type="color" 
                                name="analyticsCardBackground"
                                value={theme.analyticsCardBackground}
                                onChange={handleThemeChange}
                                className="w-12 h-8"
                            />
                            <label>Analytics Card</label>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <input 
                                type="color" 
                                name="ownerCardBackground"
                                value={theme.ownerCardBackground}
                                onChange={handleThemeChange}
                                className="w-12 h-8"
                            />
                            <label>Owner Details Card</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                                type="color" 
                                name="apartmentCardBackground"
                                value={theme.apartmentCardBackground}
                                onChange={handleThemeChange}
                                className="w-12 h-8"
                            />
                            <label>Apartment Details Card</label>
                        </div>
                    </div>
                </section>

                {/* Text Color */}
                <section className="space-y-2">
                    <h4 className="font-medium">Text Color</h4>
                    <div className="flex items-center gap-2">
                        <input 
                            type="color" 
                            name="textColor"
                            value={theme.textColor}
                            onChange={handleThemeChange}
                            className="w-12 h-8"
                        />
                        <label>Text Color</label>
                    </div>
                </section>
            </form>
        </div>
    );
};

export default ThemeSwitcher; 