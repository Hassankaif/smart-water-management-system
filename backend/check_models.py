import os
import pandas as pd

def check_model_files():
    # Check models directory
    if not os.path.exists('models'):
        print("Error: models directory not found!")
        return
        
    # List all files in models directory
    files = os.listdir('models')
    print("\nFound files:", files)
    
    # Check for specific unit
    floor_no = 4
    unit_no = 4
    model_key = f"A{(floor_no-1):01d}{unit_no:02d}"
    
    expected_files = [
        f'lstm_model_{model_key}.keras',
        f'lstm_scaler_{model_key}.npy'
    ]
    
    for file in expected_files:
        if file in files:
            print(f"\nFound {file}")
        else:
            print(f"\nMissing {file}")
            
if __name__ == "__main__":
    check_model_files() 