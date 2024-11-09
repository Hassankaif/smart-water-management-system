import numpy as np
import os

def check_scaler_details(floor_no=4, unit_no=4):
    model_key = f"A{(floor_no-1):01d}{unit_no:02d}"
    models_dir = os.path.join(os.path.dirname(__file__), 'train', 'models')
    scaler_path = os.path.join(models_dir, f'lstm_scaler_{model_key}.npy')
    
    print(f"\nChecking scaler for Floor {floor_no} Unit {unit_no} (Key: {model_key})")
    print(f"Scaler path: {scaler_path}")
    
    scaler = np.load(scaler_path)
    print(f"\nScaler type: {type(scaler)}")
    print(f"Scaler shape: {scaler.shape}")
    print(f"Scaler content: {scaler}")
    print(f"Scaler dtype: {scaler.dtype}")

if __name__ == "__main__":
    check_scaler_details() 