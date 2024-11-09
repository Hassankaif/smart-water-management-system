import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const forecastService = {
    getPrediction: async (floorNo, unitNo, days = 7) => {
        try {
            const response = await axios.post(`${API_URL}/predict`, {
                floor: floorNo,
                unit: unitNo,
                days: days
            });
            
            if (response.data.status === 'success') {
                return {
                    predictions: {
                        dates: response.data.predictions.map(p => p.date),
                        values: response.data.predictions.map(p => p.value)
                    },
                    unit_info: response.data.unit_info
                };
            } else {
                throw new Error(response.data.message || 'Failed to get prediction');
            }
        } catch (error) {
            console.error('Prediction error:', error);
            throw new Error(error.response?.data?.message || 'Failed to get prediction');
        }
    },

    getAvailableUnits: async () => {
        try {
            const response = await axios.get(`${API_URL}/units`);
            if (response.data.status === 'success') {
                return response.data.units;
            } else {
                throw new Error(response.data.message || 'Failed to get units');
            }
        } catch (error) {
            console.error('Units error:', error);
            throw new Error(error.response?.data?.message || 'Failed to get available units');
        }
    }
}; 