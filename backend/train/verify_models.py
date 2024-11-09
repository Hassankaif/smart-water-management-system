import os
import tensorflow as tf
import numpy as np

def verify_trained_models():
    models_dir = 'models'
    
    # Check if models directory exists
    if not os.path.exists(models_dir):
        print("Error: Models directory not found!")
        return False
        
    # List all files in models directory
    files = os.listdir(models_dir)
    model_files = [f for f in files if f.endswith('.keras')]
    scaler_files = [f for f in files if f.endswith('.npy')]
    
    print(f"\nFound {len(model_files)} model files and {len(scaler_files)} scaler files")
    
    # Test load each model
    for model_file in model_files:
        try:
            model_path = os.path.join(models_dir, model_file)
            model = tf.keras.models.load_model(model_path)
            print(f"Successfully loaded: {model_file}")
        except Exception as e:
            print(f"Error loading {model_file}: {e}")
            
    return True

if __name__ == "__main__":
    verify_trained_models() 