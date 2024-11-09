import os

def verify_unit_files(floor_no, unit_no):
    models_dir = os.path.join(os.path.dirname(__file__), 'train', 'models')
    model_key = f"A{(floor_no-1):01d}{unit_no:02d}"
    
    print(f"\nChecking files for Floor {floor_no} Unit {unit_no} (Key: {model_key})")
    
    # Expected files
    model_file = f'lstm_model_{model_key}.keras'
    scaler_file = f'lstm_scaler_{model_key}.npy'
    
    # Check files
    files = os.listdir(models_dir)
    
    print(f"\nLooking for:")
    print(f"1. {model_file}")
    print(f"2. {scaler_file}")
    
    if model_file in files:
        print(f"\n✓ Found model file: {model_file}")
    else:
        print(f"\n✗ Missing model file: {model_file}")
        
    if scaler_file in files:
        print(f"✓ Found scaler file: {scaler_file}")
    else:
        print(f"✗ Missing scaler file: {scaler_file}")

if __name__ == "__main__":
    verify_unit_files(4, 4) 