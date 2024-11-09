import os
import logging
import pandas as pd

def verify_saved_models():
    models_dir = 'models'
    expected_files = []
    
    # Get all unit numbers from your data
    data = pd.read_csv('water_consumption_data.csv')
    units = data[['floor', 'unit']].drop_duplicates().values
    
    for floor_no, unit_no in units:
        model_key = f"A{(floor_no-1):01d}{unit_no:02d}"
        expected_files.extend([
            f'lstm_model_{model_key}.keras',
            f'lstm_scaler_{model_key}.npy',
            f'architecture_{model_key}.txt'
        ])
    
    # Check files
    existing_files = os.listdir(models_dir)
    missing_files = [f for f in expected_files if f not in existing_files]
    
    if missing_files:
        print("Missing files:", missing_files)
        return False
    
    print("All model files present!")
    return True 