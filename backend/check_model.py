import tensorflow as tf
import os

def check_model(floor_no, unit_no):
    models_dir = os.path.join(os.path.dirname(__file__), 'train', 'models')
    model_key = f"A{(floor_no-1):01d}{unit_no:02d}"
    model_path = os.path.join(models_dir, f'lstm_model_{model_key}.keras')
    
    print(f"\nChecking model for Floor {floor_no} Unit {unit_no} (Key: {model_key})")
    
    model = tf.keras.models.load_model(model_path)
    print("\nModel Summary:")
    model.summary()
    
    # Get input shape
    input_shape = model.input_shape
    print(f"\nExpected input shape: {input_shape}")

if __name__ == "__main__":
    check_model(4, 4)  # Check Floor 4 Unit 4