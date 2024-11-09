import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model

def load_best_model(floor_no, unit_no):
    """Load the best performing model for a unit"""
    model_key = f"A{(floor_no-1):01d}{unit_no:02d}"
    
    # Load architecture info
    with open(f'models/architecture_{model_key}.txt', 'r') as f:
        architecture = f.read().strip()
    
    # Load model and scaler
    model = load_model(f'models/lstm_model_{model_key}.keras')
    scaler = np.load(f'models/lstm_scaler_{model_key}.npy')
    
    return model, scaler, architecture

def make_prediction(floor_no, unit_no, days=7):
    """Make predictions using the best model"""
    try:
        # Load model
        model, scaler, architecture = load_best_model(floor_no, unit_no)
        print(f"Using {architecture} for predictions")
        
        # Get recent data
        recent_data = get_recent_data(floor_no, unit_no)
        
        # Make predictions
        predictions = predict_next_days(model, scaler, recent_data, days)
        
        return predictions
    except Exception as e:
        print(f"Error making prediction: {e}")
        return None 