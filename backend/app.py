from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import numpy as np
import pandas as pd
import tensorflow as tf
import os
import logging
from datetime import datetime, timedelta
from utils.scaler import scale_features, unscale_predictions
from utils.data_prep import prepare_prediction_data

app = Flask(__name__)
CORS(app)

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

MODELS_DIR = os.path.join(os.path.dirname(__file__), 'train', 'models')

@app.route('/')
def home():
    return jsonify({
        'status': 'online',
        'message': 'Water Usage Prediction API',
        'endpoints': {
            '/': 'This help message',
            '/health': 'Health check endpoint',
            '/api/predict': 'POST endpoint for predictions'
        }
    })

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'models_dir': os.path.exists(MODELS_DIR),
        'data_file': os.path.exists('water_consumption_data.csv')
    })

@app.errorhandler(404)
def not_found(e):
    return jsonify({
        'status': 'error',
        'message': 'Route not found',
        'available_routes': {
            '/': 'API information',
            '/health': 'Health check',
            '/api/predict': 'Make predictions (POST)'
        }
    }), 404

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        logger.info(f"Received prediction request: {data}")
        
        floor_no = data['floor']
        unit_no = data['unit']
        days = data.get('days', 7)
        
        # Load model and scaler
        model_key = f"A{(floor_no-1):01d}{unit_no:02d}"
        model_path = os.path.join(MODELS_DIR, f'lstm_model_{model_key}.keras')
        scaler_path = os.path.join(MODELS_DIR, f'lstm_scaler_{model_key}.npy')
        
        if not os.path.exists(model_path) or not os.path.exists(scaler_path):
            return jsonify({
                'status': 'error',
                'message': f'Model or scaler not found for Floor {floor_no} Unit {unit_no}'
            }), 404
        
        # Load model and scaler
        model = tf.keras.models.load_model(model_path)
        scaler = np.load(scaler_path)
        
        # Get recent data
        df = pd.read_csv('water_consumption_data.csv')
        input_sequence = prepare_prediction_data(df, floor_no, unit_no)
        
        # Make predictions
        predictions = []
        current_sequence = input_sequence.copy()
        
        for _ in range(days):
            # Scale features
            scaled_sequence = scale_features(current_sequence, scaler)
            
            # Reshape for model input
            X = scaled_sequence.reshape(1, 7, 3)
            
            # Predict
            next_day_scaled = model.predict(X, verbose=0)
            
            # Unscale prediction and convert to Python float
            next_day = float(unscale_predictions(next_day_scaled, scaler)[0])
            predictions.append(next_day)
            
            # Update sequence for next prediction
            new_row = current_sequence[-1].copy()
            new_row[0] = next_day  # Update water usage only
            current_sequence = np.roll(current_sequence, -1, axis=0)
            current_sequence[-1] = new_row
        
        # Format predictions
        prediction_dates = [(datetime.now() + timedelta(days=i+1)).strftime('%Y-%m-%d') 
                          for i in range(len(predictions))]
        
        formatted_predictions = [
            {"date": date, "value": round(float(value), 2)} 
            for date, value in zip(prediction_dates, predictions)
        ]
        
        return jsonify({
            'status': 'success',
            'predictions': formatted_predictions,
            'unit_info': {
                'floor': floor_no,
                'unit': unit_no,
                'residents': int(current_sequence[-1, 1]),
                'unit_size': int(current_sequence[-1, 2])
            }
        })
        
    except Exception as e:
        logger.error(f"Error in predict endpoint: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/units', methods=['GET'])
def get_available_units():
    try:
        # Read the CSV file
        df = pd.read_csv('water_consumption_data.csv')
        
        # Get unique combinations of floor and unit
        units = []
        for floor in df['floor'].unique():
            floor_units = df[df['floor'] == floor]['unit'].unique()
            for unit in floor_units:
                units.append({
                    'floor': int(floor),
                    'unit': int(unit)
                })
        
        return jsonify({
            'status': 'success',
            'units': units
        })
        
    except Exception as e:
        logger.error(f"Error in get_available_units: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    logger.info("Starting server...")
    logger.info(f"Models directory: {MODELS_DIR}")
    
    if os.path.exists(MODELS_DIR):
        logger.info("Found models directory")
        files = os.listdir(MODELS_DIR)
        logger.info(f"Number of files in models directory: {len(files)}")
    else:
        logger.error(f"Models directory not found: {MODELS_DIR}")
    
    if os.path.exists('water_consumption_data.csv'):
        logger.info("Found water_consumption_data.csv")
    else:
        logger.error("water_consumption_data.csv not found!")
    
    app.run(host='0.0.0.0', port=5000, debug=True)