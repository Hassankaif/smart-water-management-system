import numpy as np
import pandas as pd

def scale_features(data, scaler_value):
    """
    Scale features using the single scaler value
    data: numpy array of shape (sequence_length, features)
    scaler_value: single numpy value for scaling
    """
    # Extract the scalar value from the array
    scale_factor = scaler_value[0]  # Get the single value (989.87)
    
    # Scale only the water usage (first column)
    scaled_data = data.copy()  # Make a copy to avoid modifying original
    scaled_data[:, 0] = data[:, 0] / scale_factor
    
    # Keep other features (residents and unit size) as is
    # They were likely normalized differently during training
    scaled_data[:, 1:] = data[:, 1:] / np.max(data[:, 1:], axis=0)
    
    return scaled_data

def unscale_predictions(predictions, scaler_value):
    """
    Unscale predictions using the single scaler value
    predictions: numpy array of predictions
    scaler_value: single numpy value for scaling
    """
    return predictions * scaler_value[0]