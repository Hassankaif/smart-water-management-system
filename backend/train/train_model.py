import numpy as np
import tensorflow as tf
import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from sklearn.model_selection import train_test_split
from prepare_data import load_and_prepare_data, prepare_sequences
from sklearn.preprocessing import MinMaxScaler
import os


def create_lstm_model(sequence_length):
    """Create LSTM model architecture"""
    model = Sequential([
        LSTM(64, input_shape=(sequence_length, 1), return_sequences=True),
        Dropout(0.2),
        LSTM(32),
        Dropout(0.2),
        Dense(16, activation='relu'),
        Dense(1)
    ])
    
    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss='mse',
        metrics=['mae']
    )
    
    return model

def train_model(floor_no, unit_no, epochs=100, sequence_length=7):
    """Train LSTM model for a specific unit"""
    # Create models directory if it doesn't exist
    if not os.path.exists('models'):
        os.makedirs('models')
    
    # Load and prepare data
    data = load_and_prepare_data('../water_consumption_data.csv', floor_no, unit_no)
    water_usage = data['water_usage'].values
    
    # Scale the data
    scaler = MinMaxScaler()
    water_usage_scaled = scaler.fit_transform(water_usage.reshape(-1, 1))
    
    # Save scaler
    model_key = f"A{(floor_no-1):01d}{unit_no:02d}"
    scaler_filename = f'models/lstm_scaler_{model_key}.npy'
    np.save(scaler_filename, scaler.data_range_)
    
    # Prepare sequences
    sequences, targets = prepare_sequences(water_usage_scaled, sequence_length)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        sequences, targets, test_size=0.2, random_state=42
    )
    
    # Create and train model
    model = create_lstm_model(sequence_length)
    
    # Add early stopping
    early_stopping = tf.keras.callbacks.EarlyStopping(
        monitor='val_loss',
        patience=10,
        restore_best_weights=True
    )
    
    # Train model
    history = model.fit(
        X_train, y_train,
        epochs=epochs,
        batch_size=32,
        validation_data=(X_test, y_test),
        callbacks=[early_stopping],
        verbose=1
    )
    
    # Save model
    model_filename = f'models/lstm_model_{model_key}.keras'
    model.save(model_filename)
    
    # Evaluate model
    test_loss, test_mae = model.evaluate(X_test, y_test, verbose=0)
    print(f"\nTest MAE: {test_mae:.4f}")
    
    return model, scaler, history

if __name__ == "__main__":
    # Train models for all units
    df = pd.read_csv('../water_consumption_data.csv')
    units = df[['floor', 'unit']].drop_duplicates().values
    
    for floor_no, unit_no in units:
        print(f"\nTraining model for Floor {floor_no} Unit {unit_no}")
        model, scaler, history = train_model(floor_no, unit_no) 