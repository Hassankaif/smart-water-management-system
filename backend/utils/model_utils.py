import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
from datetime import datetime, timedelta

def load_model_and_scaler(floor_no, unit_no):
    """Load the LSTM model and scaler for a specific unit"""
    model_key = f"A{(floor_no-1):01d}{unit_no:02d}"
    try:
        model = load_model(f'models/lstm_model_{model_key}.keras')
        scaler = np.load(f'models/lstm_scaler_{model_key}.npy')
        return model, scaler
    except Exception as e:
        print(f"Error loading model and scaler: {e}")
        return None, None

def get_recent_data(floor_no, unit_no, look_back=7):
    """Get recent water consumption data for prediction"""
    try:
        df = pd.read_csv('water_consumption_data.csv')
        unit_data = df[(df['floor'] == floor_no) & 
                      (df['unit'] == unit_no)].copy()
        
        unit_data['date'] = pd.to_datetime(unit_data['date'])
        unit_data = unit_data.sort_values('date')
        
        return unit_data['water_usage'].tail(look_back).values
    except Exception as e:
        print(f"Error getting recent data: {e}")
        return None

def make_predictions(model, scaler, input_data, num_days=7):
    """Make predictions for the next n days"""
    try:
        predictions = []
        current_sequence = input_data.copy()
        
        # Get scaler values
        scaler_max = scaler[0]
        scaler_min = 0
        
        for _ in range(num_days):
            # Scale the sequence
            current_sequence_scaled = (current_sequence - scaler_min) / (scaler_max - scaler_min)
            
            # Reshape for LSTM input
            X = current_sequence_scaled.reshape(1, len(current_sequence), 1)
            
            # Make prediction
            next_day_scaled = model.predict(X, verbose=0)
            
            # Inverse transform prediction
            next_day = next_day_scaled[0][0] * (scaler_max - scaler_min) + scaler_min
            
            # Ensure prediction is non-negative
            next_day = max(0, next_day)
            
            predictions.append(float(next_day))
            
            # Update sequence for next prediction
            current_sequence = np.roll(current_sequence, -1)
            current_sequence[-1] = next_day
        
        return predictions
    except Exception as e:
        print(f"Error making predictions: {e}")
        return None

def get_historical_data(floor_no, unit_no, days=30):
    """Get historical water consumption data"""
    try:
        df = pd.read_csv('water_consumption_data.csv')
        unit_data = df[(df['floor'] == floor_no) & 
                      (df['unit'] == unit_no)].copy()
        
        unit_data['date'] = pd.to_datetime(unit_data['date'])
        unit_data = unit_data.sort_values('date')
        
        historical = unit_data.tail(days)[['date', 'water_usage']]
        
        return {
            'dates': historical['date'].dt.strftime('%Y-%m-%d').tolist(),
            'values': historical['water_usage'].tolist()
        }
    except Exception as e:
        print(f"Error getting historical data: {e}")
        return None