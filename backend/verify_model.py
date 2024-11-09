import os
import numpy as np
import tensorflow as tf
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def verify_model_files():
    # Define paths
    models_dir = os.path.join(os.path.dirname(__file__), 'train', 'models')
    floor_no = 4
    unit_no = 4
    model_key = f"A{(floor_no-1):01d}{unit_no:02d}"  # Should be A304
    
    logger.info(f"Verifying model files for Floor {floor_no} Unit {unit_no} (Key: {model_key})")
    
    # Check model file
    model_path = os.path.join(models_dir, f'lstm_model_{model_key}.keras')
    if os.path.exists(model_path):
        logger.info(f"Found model file: {model_path}")
        try:
            model = tf.keras.models.load_model(model_path)
            logger.info("Successfully loaded model")
            logger.info(f"Model summary: {model.summary()}")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
    else:
        logger.error(f"Model file not found: {model_path}")
    
    # Check scaler file
    scaler_path = os.path.join(models_dir, f'lstm_scaler_{model_key}.npy')
    if os.path.exists(scaler_path):
        logger.info(f"Found scaler file: {scaler_path}")
        try:
            scaler = np.load(scaler_path)
            logger.info(f"Successfully loaded scaler")
            logger.info(f"Scaler shape: {scaler.shape}")
            logger.info(f"Scaler range: min={np.min(scaler)}, max={np.max(scaler)}")
        except Exception as e:
            logger.error(f"Error loading scaler: {e}")
    else:
        logger.error(f"Scaler file not found: {scaler_path}")

if __name__ == "__main__":
    verify_model_files() 