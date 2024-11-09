import numpy as np
import pandas as pd
import tensorflow as tf
from utils.data_prep import prepare_prediction_data
from utils.scaler import scale_features, unscale_predictions
import os
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def test_prediction_pipeline(floor_no=4, unit_no=4):
    try:
        # 1. Load data
        logger.info("Loading data...")
        df = pd.read_csv('water_consumption_data.csv')
        
        # 2. Prepare input sequence
        logger.info("Preparing input sequence...")
        input_sequence = prepare_prediction_data(df, floor_no, unit_no)
        logger.info(f"Input sequence shape: {input_sequence.shape}")
        logger.debug(f"Input sequence:\n{input_sequence}")
        
        # 3. Load model and scaler
        logger.info("Loading model and scaler...")
        model_key = f"A{(floor_no-1):01d}{unit_no:02d}"
        models_dir = os.path.join(os.path.dirname(__file__), 'train', 'models')
        
        model = tf.keras.models.load_model(
            os.path.join(models_dir, f'lstm_model_{model_key}.keras')
        )
        scaler = np.load(
            os.path.join(models_dir, f'lstm_scaler_{model_key}.npy')
        )
        
        logger.info(f"Model input shape: {model.input_shape}")
        logger.info(f"Scaler value: {scaler[0]}")
        
        # 4. Scale features
        logger.info("Scaling features...")
        scaled_sequence = scale_features(input_sequence, scaler)
        logger.info(f"Scaled sequence shape: {scaled_sequence.shape}")
        logger.debug(f"Scaled sequence:\n{scaled_sequence}")
        
        # 5. Make prediction
        logger.info("Making prediction...")
        X = scaled_sequence.reshape(1, 7, 3)
        logger.debug(f"Model input shape: {X.shape}")
        prediction_scaled = model.predict(X, verbose=0)
        logger.debug(f"Scaled prediction: {prediction_scaled[0][0]}")
        
        # 6. Unscale prediction
        prediction = unscale_predictions(prediction_scaled, scaler)
        # Convert numpy float to Python float for formatting
        final_prediction = float(prediction[0])
        logger.info(f"Final prediction: {final_prediction:.2f} liters")
        
        return True
        
    except Exception as e:
        logger.error(f"Error in prediction pipeline: {str(e)}", exc_info=True)
        return False

if __name__ == "__main__":
    test_prediction_pipeline()