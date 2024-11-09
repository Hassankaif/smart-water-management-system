import numpy as np
import pandas as pd
from utils.data_prep import prepare_prediction_data
from utils.scaler import scale_features, unscale_predictions
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def test_scaling():
    try:
        # 1. Load data
        logger.info("Loading test data...")
        df = pd.read_csv('water_consumption_data.csv')
        
        # 2. Get sample data for Floor 4 Unit 4
        input_sequence = prepare_prediction_data(df, floor_no=4, unit_no=4)
        logger.info("\nOriginal sequence:")
        logger.info(f"Shape: {input_sequence.shape}")
        logger.info("Data:")
        logger.info(input_sequence)
        
        # 3. Load scaler
        scaler = np.load('train/models/lstm_scaler_A304.npy')
        logger.info(f"\nScaler value: {scaler[0]}")
        
        # 4. Scale features
        scaled_sequence = scale_features(input_sequence, scaler)
        logger.info("\nScaled sequence:")
        logger.info(f"Shape: {scaled_sequence.shape}")
        logger.info("Data:")
        logger.info(scaled_sequence)
        
        # 5. Test water usage values are properly scaled
        logger.info("\nWater usage scaling check:")
        logger.info(f"Original first value: {input_sequence[0, 0]}")
        logger.info(f"Scaled first value: {scaled_sequence[0, 0]}")
        logger.info(f"Scale ratio: {input_sequence[0, 0] / scaled_sequence[0, 0]:.2f}")
        logger.info(f"Expected ratio: {scaler[0]:.2f}")
        
        return True
        
    except Exception as e:
        logger.error(f"Error in scaling test: {str(e)}", exc_info=True)
        return False

if __name__ == "__main__":
    test_scaling() 