import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential, Model
from tensorflow.keras.layers import (LSTM, Dense, Dropout, Input, 
                                   Bidirectional, Conv1D, MaxPooling1D, 
                                   GRU, Attention, concatenate)
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import TimeSeriesSplit
import os
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelArchitectures:
    @staticmethod
    def create_simple_lstm(sequence_length, features=1):
        """Simple LSTM model"""
        model = Sequential([
            LSTM(64, input_shape=(sequence_length, features), return_sequences=True),
            Dropout(0.2),
            LSTM(32),
            Dropout(0.2),
            Dense(16, activation='relu'),
            Dense(1)
        ])
        return model
    
    @staticmethod
    def create_bidirectional_lstm(sequence_length, features=1):
        """Bidirectional LSTM model"""
        model = Sequential([
            Bidirectional(LSTM(64, return_sequences=True), 
                         input_shape=(sequence_length, features)),
            Dropout(0.2),
            Bidirectional(LSTM(32)),
            Dropout(0.2),
            Dense(16, activation='relu'),
            Dense(1)
        ])
        return model
    
    @staticmethod
    def create_cnn_lstm(sequence_length, features=1):
        """CNN-LSTM hybrid model"""
        model = Sequential([
            Conv1D(filters=64, kernel_size=3, activation='relu',
                  input_shape=(sequence_length, features)),
            MaxPooling1D(pool_size=2),
            Conv1D(filters=32, kernel_size=3, activation='relu'),
            LSTM(32, return_sequences=True),
            LSTM(16),
            Dense(16, activation='relu'),
            Dense(1)
        ])
        return model
    
    @staticmethod
    def create_attention_lstm(sequence_length, features=1):
        """LSTM with Attention mechanism"""
        inputs = Input(shape=(sequence_length, features))
        lstm_out = LSTM(64, return_sequences=True)(inputs)
        attention = Attention()([lstm_out, lstm_out])
        lstm_out2 = LSTM(32)(attention)
        dense1 = Dense(16, activation='relu')(lstm_out2)
        outputs = Dense(1)(dense1)
        model = Model(inputs=inputs, outputs=outputs)
        return model
    
    @staticmethod
    def create_gru_lstm_hybrid(sequence_length, features=1):
        """GRU-LSTM hybrid model"""
        inputs = Input(shape=(sequence_length, features))
        gru = GRU(64, return_sequences=True)(inputs)
        lstm = LSTM(32, return_sequences=True)(gru)
        attention = Attention()([lstm, lstm])
        dense1 = Dense(16, activation='relu')(attention)
        outputs = Dense(1)(dense1)
        model = Model(inputs=inputs, outputs=outputs)
        return model

def prepare_sequences(data, sequence_length=7):
    """Prepare sequences for training with additional features"""
    sequences = []
    targets = []
    
    # Add day of week and month as features
    data['day_of_week'] = data['date'].dt.dayofweek
    data['month'] = data['date'].dt.month
    
    # Normalize additional features
    scaler_dow = MinMaxScaler()
    scaler_month = MinMaxScaler()
    
    dow_normalized = scaler_dow.fit_transform(data['day_of_week'].values.reshape(-1, 1))
    month_normalized = scaler_month.fit_transform(data['month'].values.reshape(-1, 1))
    
    # Combine features
    features = np.column_stack([
        data['water_usage'].values,
        dow_normalized,
        month_normalized
    ])
    
    for i in range(len(features) - sequence_length):
        sequences.append(features[i:(i + sequence_length)])
        targets.append(features[i + sequence_length, 0])  # Only predict water usage
    
    return np.array(sequences), np.array(targets)

def train_with_cross_validation(data, model_fn, floor_no, unit_no, 
                              sequence_length=7, n_splits=5):
    """Train model with time series cross-validation"""
    # Prepare data
    unit_data = data[(data['floor'] == floor_no) & 
                     (data['unit'] == unit_no)].copy()
    unit_data['date'] = pd.to_datetime(unit_data['date'])
    unit_data = unit_data.sort_values('date')
    
    # Scale the data
    scaler = MinMaxScaler()
    water_usage_scaled = scaler.fit_transform(unit_data['water_usage'].values.reshape(-1, 1))
    unit_data['water_usage'] = water_usage_scaled
    
    # Prepare sequences
    X, y = prepare_sequences(unit_data, sequence_length)
    
    # Time series cross-validation
    tscv = TimeSeriesSplit(n_splits=n_splits)
    cv_scores = []
    
    for fold, (train_idx, val_idx) in enumerate(tscv.split(X)):
        logger.info(f"Training fold {fold + 1}/{n_splits}")
        
        X_train, X_val = X[train_idx], X[val_idx]
        y_train, y_val = y[train_idx], y[val_idx]
        
        # Create and compile model
        model = model_fn(sequence_length, X.shape[-1])
        model.compile(optimizer=Adam(learning_rate=0.001),
                     loss='mse',
                     metrics=['mae'])
        
        # Callbacks
        callbacks = [
            EarlyStopping(monitor='val_loss', patience=10, 
                         restore_best_weights=True),
            ReduceLROnPlateau(monitor='val_loss', factor=0.5, 
                             patience=5, min_lr=0.0001)
        ]
        
        # Train model
        history = model.fit(
            X_train, y_train,
            epochs=100,
            batch_size=32,
            validation_data=(X_val, y_val),
            callbacks=callbacks,
            verbose=1
        )
        
        # Evaluate
        _, mae = model.evaluate(X_val, y_val, verbose=0)
        cv_scores.append(mae)
    
    return np.mean(cv_scores), np.std(cv_scores), model, scaler

def train_unit_models(data, floor_no, unit_no):
    """Train all model architectures for a unit"""
    architectures = {
        'simple_lstm': ModelArchitectures.create_simple_lstm,
        'bidirectional_lstm': ModelArchitectures.create_bidirectional_lstm,
        'cnn_lstm': ModelArchitectures.create_cnn_lstm,
        'attention_lstm': ModelArchitectures.create_attention_lstm,
        'gru_lstm_hybrid': ModelArchitectures.create_gru_lstm_hybrid
    }
    
    results = []
    best_mae = float('inf')
    best_model = None
    best_scaler = None
    best_architecture = None
    
    for name, model_fn in architectures.items():
        logger.info(f"\nTraining {name} for Floor {floor_no} Unit {unit_no}")
        try:
            mae, mae_std, model, scaler = train_with_cross_validation(
                data, model_fn, floor_no, unit_no
            )
            
            results.append({
                'architecture': name,
                'mae_mean': mae,
                'mae_std': mae_std
            })
            
            if mae < best_mae:
                best_mae = mae
                best_model = model
                best_scaler = scaler
                best_architecture = name
                
        except Exception as e:
            logger.error(f"Error training {name}: {e}")
    
    # Save best model
    if best_model is not None:
        model_key = f"A{(floor_no-1):01d}{unit_no:02d}"
        best_model.save(f'models/lstm_model_{model_key}.keras')
        np.save(f'models/lstm_scaler_{model_key}.npy', best_scaler.data_range_)
        
        # Save architecture info
        with open(f'models/architecture_{model_key}.txt', 'w') as f:
            f.write(best_architecture)
    
    return results

def train_all_units():
    """Train models for all units"""
    # Create directories
    os.makedirs('models', exist_ok=True)
    os.makedirs('logs', exist_ok=True)
    
    # Load data
    try:
        data = pd.read_csv('../water_consumption_data.csv')
    except Exception as e:
        logger.error(f"Error loading data: {e}")
        return
    
    # Get unique units
    units = data[['floor', 'unit']].drop_duplicates().values
    
    all_results = []
    for floor_no, unit_no in units:
        try:
            results = train_unit_models(data, floor_no, unit_no)
            for result in results:
                all_results.append({
                    'floor': floor_no,
                    'unit': unit_no,
                    **result
                })
        except Exception as e:
            logger.error(f"Error training models for Floor {floor_no} Unit {unit_no}: {e}")
    
    # Save results
    results_df = pd.DataFrame(all_results)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    results_df.to_csv(f'logs/training_results_{timestamp}.csv', index=False)
    
    # Print summary
    print("\nTraining Summary:")
    summary = results_df.groupby('architecture')[['mae_mean', 'mae_std']].mean()
    print(summary)

if __name__ == "__main__":
    train_all_units() 