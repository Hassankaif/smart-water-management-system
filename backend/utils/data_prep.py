import pandas as pd
import numpy as np

def prepare_prediction_data(df, floor_no, unit_no, sequence_length=7):
    """Prepare data for prediction"""
    # Filter data for specific unit
    unit_data = df[(df['floor'] == floor_no) & 
                   (df['unit'] == unit_no)].copy()
    
    if len(unit_data) < sequence_length:
        raise ValueError(f"Insufficient data for Floor {floor_no} Unit {unit_no}")
    
    # Sort by date
    unit_data['date'] = pd.to_datetime(unit_data['date'])
    unit_data = unit_data.sort_values('date')
    
    # Get last N days of data
    recent_data = unit_data[['water_usage', 'num_residents', 'unit_size']].tail(sequence_length)
    
    return recent_data.values  # Shape: (7, 3) 