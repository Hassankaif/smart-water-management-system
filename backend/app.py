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
import mysql.connector  # Ensure you have mysql-connector-python installed

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'train', 'models')
CSV_PATH = os.path.join(os.path.dirname(__file__), 'water_consumption_data.csv')

# Database connection
def get_db_connection():
    return mysql.connector.connect(
        host='127.0.0.1',
        user='root',  # Replace with your MySQL username
        password='kaif&*9363',  # Replace with your MySQL password
        database='smart_water_management'
    )

@app.route('/')
def home():
    return jsonify({
        'status': 'online',
        'message': 'Water Usage Prediction API',
        'endpoints': {
            '/': 'This help message',
            '/api/health': 'Health check endpoint',
            '/api/predict': 'POST endpoint for predictions',
            '/api/units': 'GET endpoint for available units'
        }
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        logger.info(f"Received prediction request: {data}")

        floor = data.get('floor')
        unit = data.get('unit')
        days = data.get('days', 7)  # Default to 7 days if not specified

        # Load the CSV data
        df = pd.read_csv(CSV_PATH)
        
        # Prepare input data
        input_data = prepare_prediction_data(df, floor, unit)
        
        # Load model and make prediction
        model = tf.keras.models.load_model(os.path.join(MODELS_DIR, f'lstm_model_A{(floor-1):01d}{unit:02d}.keras'))
        
        # Reshape input data for LSTM (batch_size, timesteps, features)
        input_data = input_data.reshape(1, 7, 3)
        
        # Make predictions
        predictions = []
        current_sequence = input_data.copy()
        
        for _ in range(days):
            next_day = model.predict(current_sequence, verbose=0)
            predictions.append(float(next_day[0, 0]))
            
            # Update sequence for next prediction
            current_sequence[0, :-1] = current_sequence[0, 1:]  # Shift data
            current_sequence[0, -1, 0] = next_day[0, 0]  # Add new prediction
        
        # Format predictions with dates
        dates = [(datetime.now() + timedelta(days=i+1)).strftime('%Y-%m-%d') 
                for i in range(len(predictions))]
        
        prediction_list = [
            {"date": date, "value": round(value, 2)} 
            for date, value in zip(dates, predictions)
        ]
        
        return jsonify({
            'status': 'success',
            'predictions': prediction_list,
            'unit_info': {
                'floor': floor,
                'unit': unit,
                'residents': int(input_data[0, -1, 1]),
                'unit_size': int(input_data[0, -1, 2])
            }
        })

    except Exception as e:
        logger.error(f"Prediction error: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/units', methods=['GET'])
def get_available_units():
    try:
        # Read the CSV file using the absolute path
        df = pd.read_csv(CSV_PATH)
        
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

@app.route('/api/health')
def health():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'models_dir': os.path.exists(MODELS_DIR),
        'data_file': os.path.exists(CSV_PATH)
    })

@app.errorhandler(404)
def not_found(e):
    return jsonify({
        'status': 'error',
        'message': 'Route not found',
        'available_routes': {
            '/': 'API information',
            '/api/health': 'Health check',
            '/api/predict': 'Make predictions (POST)',
            '/api/units': 'Get available units (GET)'
        }
    }), 404

@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    name = data.get('name')
    flat_no = data.get('flatNo')
    phone_number = data.get('phoneNumber')
    email = data.get('email')
    password = data.get('password')  # Ensure to hash this in production

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO users (name, flat_no, phone_number, email, password_hash) VALUES (%s, %s, %s, %s, %s)',
            (name, flat_no, phone_number, email, password)  # Hash the password before storing
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/users', methods=['GET'])
def get_all_users():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT id, name, flat_no, phone_number, email FROM users')
        users = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'users': users})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting server...")
    logger.info(f"Models directory: {MODELS_DIR}")
    
    if os.path.exists(MODELS_DIR):
        logger.info("Found models directory")
        files = os.listdir(MODELS_DIR)
        logger.info(f"Number of files in models directory: {len(files)}")
    else:
        logger.error(f"Models directory not found: {MODELS_DIR}")
    
    if os.path.exists(CSV_PATH):
        logger.info(f"Found water consumption data at: {CSV_PATH}")
    else:
        logger.error(f"Water consumption data not found at: {CSV_PATH}")
    
    app.run(host='0.0.0.0', port=5000, debug=True)