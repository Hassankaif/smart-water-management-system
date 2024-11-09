import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { forecastService } from '../services/forecastService';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Forecast = () => {
    const { theme } = useTheme();
    const [floorNo, setFloorNo] = useState('');
    const [unitNo, setUnitNo] = useState('');
    const [availableUnits, setAvailableUnits] = useState([]);
    const [predictionData, setPredictionData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [unitsLoading, setUnitsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadAvailableUnits();
    }, []);

    const loadAvailableUnits = async () => {
        try {
            setUnitsLoading(true);
            const units = await forecastService.getAvailableUnits();
            setAvailableUnits(units);
            setError(null);
        } catch (error) {
            setError('Failed to load available units: ' + error.message);
        } finally {
            setUnitsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const data = await forecastService.getPrediction(
                parseInt(floorNo),
                parseInt(unitNo),
                7
            );
            setPredictionData(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const chartData = predictionData ? {
        labels: predictionData.predictions.dates,
        datasets: [
            {
                label: 'Predicted Water Usage',
                data: predictionData.predictions.values,
                borderColor: theme.chartPrimaryColor || 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    } : null;

    return (
        <div className="p-6" style={{ backgroundColor: theme.backgroundColor, color: theme.foregroundColor }}>
            <h1 className="text-2xl font-bold mb-6">Water Consumption Forecast</h1>
            
            <div className="bg-white rounded-lg shadow p-6 mb-6" style={{ backgroundColor: theme.cardBackground }}>
                {unitsLoading ? (
                    <div className="text-center py-4">
                        <p>Loading available units...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-2">Floor Number:</label>
                            <select 
                                value={floorNo}
                                onChange={(e) => setFloorNo(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Select Floor</option>
                                {[...new Set(availableUnits.map(u => u.floor))]
                                    .sort((a, b) => a - b)
                                    .map(floor => (
                                        <option key={floor} value={floor}>{floor}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2">Unit Number:</label>
                            <select
                                value={unitNo}
                                onChange={(e) => setUnitNo(e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                                disabled={!floorNo}
                            >
                                <option value="">Select Unit</option>
                                {availableUnits
                                    .filter(u => u.floor === parseInt(floorNo))
                                    .sort((a, b) => a.unit - b.unit)
                                    .map(u => (
                                        <option key={u.unit} value={u.unit}>{u.unit}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <button 
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                            disabled={loading || !floorNo || !unitNo}
                        >
                            {loading ? 'Getting Forecast...' : 'Get Forecast'}
                        </button>
                    </form>
                )}

                {error && (
                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}
            </div>

            {predictionData && (
                <div className="bg-white rounded-lg shadow p-6" style={{ backgroundColor: theme.cardBackground }}>
                    <h2 className="text-xl font-semibold mb-4">Forecast Results</h2>
                    {predictionData.unit_info && (
                        <div className="mb-4">
                            <p>Floor: {predictionData.unit_info.floor}</p>
                            <p>Unit: {predictionData.unit_info.unit}</p>
                            <p>Residents: {predictionData.unit_info.residents}</p>
                            <p>Unit Size: {predictionData.unit_info.unit_size}m²</p>
                        </div>
                    )}
                    <div className="h-[400px]">
                        <Line
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Water Usage (Liters)'
                                        }
                                    },
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Date'
                                        }
                                    }
                                },
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: `Water Usage Forecast for Floor ${floorNo} Unit ${unitNo}`
                                    }
                                }
                            }}
                        />
                    </div>
                    
                    <div className="mt-6">
                        <h3 className="font-semibold mb-2">Predicted Values</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {predictionData.predictions.dates.map((date, index) => (
                                <div key={date} className="p-3 bg-gray-50 rounded">
                                    <div className="text-sm text-gray-600">{date}</div>
                                    <div className="font-semibold">
                                        {predictionData.predictions.values[index].toFixed(2)} L
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Forecast;