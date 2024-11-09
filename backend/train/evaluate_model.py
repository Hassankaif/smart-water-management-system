import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from tensorflow.keras.models import load_model
import os

def evaluate_predictions(true_values, predictions, title, save_path):
    """Evaluate and visualize model predictions"""
    # Calculate metrics
    mae = mean_absolute_error(true_values, predictions)
    mse = mean_squared_error(true_values, predictions)
    rmse = np.sqrt(mse)
    r2 = r2_score(true_values, predictions)
    
    # Create scatter plot
    plt.figure(figsize=(10, 6))
    plt.scatter(true_values, predictions, alpha=0.5)
    plt.plot([true_values.min(), true_values.max()], 
             [true_values.min(), true_values.max()], 
             'r--', lw=2)
    plt.xlabel('Actual Water Usage')
    plt.ylabel('Predicted Water Usage')
    plt.title(f'{title}\nMAE: {mae:.2f}, RMSE: {rmse:.2f}, R²: {r2:.2f}')
    plt.tight_layout()
    plt.savefig(save_path)
    plt.close()
    
    return {'mae': mae, 'rmse': rmse, 'r2': r2}

def plot_training_history(history, model_key):
    """Plot training history"""
    plt.figure(figsize=(12, 4))
    
    # Loss plot
    plt.subplot(1, 2, 1)
    plt.plot(history.history['loss'], label='Training Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.title('Model Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    
    # MAE plot
    plt.subplot(1, 2, 2)
    plt.plot(history.history['mae'], label='Training MAE')
    plt.plot(history.history['val_mae'], label='Validation MAE')
    plt.title('Model MAE')
    plt.xlabel('Epoch')
    plt.ylabel('MAE')
    plt.legend()
    
    plt.tight_layout()
    plt.savefig(f'plots/training_history_{model_key}.png')
    plt.close()

def evaluate_model(floor_no, unit_no, sequence_length=7):
    """Evaluate model performance for a specific unit"""
    model_key = f"A{(floor_no-1):01d}{unit_no:02d}"
    
    # Load model and scaler
    model = load_model(f'models/lstm_model_{model_key}.keras')
    scaler = np.load(f'models/lstm_scaler_{model_key}.npy')
    
    # Load data
    data = pd.read_csv('../water_consumption_data.csv')
    unit_data = data[(data['floor'] == floor_no) & 
                     (data['unit'] == unit_no)]['water_usage'].values
    
    # Scale data
    scaler_min = 0
    scaler_max = scaler[0]
    unit_data_scaled = (unit_data - scaler_min) / (scaler_max - scaler_min)
    
    # Prepare sequences
    sequences = []
    targets = []
    for i in range(len(unit_data_scaled) - sequence_length):
        sequences.append(unit_data_scaled[i:i+sequence_length])
        targets.append(unit_data_scaled[i+sequence_length])
    
    sequences = np.array(sequences)
    targets = np.array(targets)
    
    # Make predictions
    predictions_scaled = model.predict(sequences.reshape(-1, sequence_length, 1))
    
    # Inverse transform predictions and targets
    predictions = predictions_scaled * (scaler_max - scaler_min) + scaler_min
    targets = targets * (scaler_max - scaler_min) + scaler_min
    
    # Evaluate predictions
    metrics = evaluate_predictions(
        targets, 
        predictions, 
        f'Predictions for Floor {floor_no} Unit {unit_no}',
        f'plots/predictions_{model_key}.png'
    )
    
    return metrics

if __name__ == "__main__":
    # Create plots directory if it doesn't exist
    if not os.path.exists('plots'):
        os.makedirs('plots')
    
    # Evaluate all models
    df = pd.read_csv('../water_consumption_data.csv')
    units = df[['floor', 'unit']].drop_duplicates().values
    
    results = []
    for floor_no, unit_no in units:
        print(f"\nEvaluating model for Floor {floor_no} Unit {unit_no}")
        metrics = evaluate_model(floor_no, unit_no)
        results.append({
            'floor': floor_no,
            'unit': unit_no,
            **metrics
        })
    
    # Save results
    results_df = pd.DataFrame(results)
    results_df.to_csv('models/evaluation_results.csv', index=False)
    print("\nEvaluation results saved to models/evaluation_results.csv") 