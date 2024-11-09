import numpy as np
import os

def check_scaler(floor_no, unit_no):
    models_dir = os.path.join(os.path.dirname(__file__), 'train', 'models')
    model_key = f"A{(floor_no-1):01d}{unit_no:02d}"
    scaler_path = os.path.join(models_dir, f'lstm_scaler_{model_key}.npy')
    
    print(f"\nChecking scaler for Floor {floor_no} Unit {unit_no} (Key: {model_key})")
    print(f"Scaler path: {scaler_path}")
    
    if os.path.exists(scaler_path):
        scaler = np.load(scaler_path)
        print(f"\nScaler shape: {scaler.shape}")
        print(f"Scaler content:\n{scaler}")
        print(f"\nScaler min: {np.min(scaler)}")
        print(f"Scaler max: {np.max(scaler)}")
    else:
        print(f"\nScaler file not found!")

if __name__ == "__main__":
    check_scaler(4, 4)  # Check Floor 4 Unit 4 