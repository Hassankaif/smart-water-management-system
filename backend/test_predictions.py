import pandas as pd
from utils.model_utils import load_model_and_scaler, make_predictions
import matplotlib.pyplot as plt

def test_predictions(floor_no, unit_no):
    # Load model and scaler
    model, scaler = load_model_and_scaler(floor_no, unit_no)
    if model is None or scaler is None:
        print(f"Could not load model for Floor {floor_no} Unit {unit_no}")
        return
    
    # Get recent data
    df = pd.read_csv('water_consumption_data.csv')
    unit_data = df[(df['floor'] == floor_no) & 
                   (df['unit'] == unit_no)].copy()
    
    unit_data['date'] = pd.to_datetime(unit_data['date'])
    unit_data = unit_data.sort_values('date')
    
    # Get last 7 days of data
    recent_data = unit_data['water_usage'].tail(7).values
    
    # Make predictions
    predictions = make_predictions(model, scaler, recent_data)
    
    if predictions is not None:
        # Plot results
        plt.figure(figsize=(12, 6))
        
        # Plot historical data
        plt.plot(unit_data['date'].tail(30), 
                unit_data['water_usage'].tail(30), 
                label='Historical')
        
        # Plot predictions
        last_date = unit_data['date'].iloc[-1]
        future_dates = pd.date_range(start=last_date, periods=8)[1:]
        plt.plot(future_dates, predictions, 'r--', label='Predictions')
        
        plt.title(f'Water Usage Predictions for Floor {floor_no} Unit {unit_no}')
        plt.xlabel('Date')
        plt.ylabel('Water Usage')
        plt.legend()
        plt.grid(True)
        
        # Save plot
        plt.savefig(f'predictions_floor{floor_no}_unit{unit_no}.png')
        plt.close()
        
        print(f"\nPredictions for next 7 days:")
        for date, pred in zip(future_dates, predictions):
            print(f"{date.date()}: {pred:.2f}")

if __name__ == "__main__":
    # Test predictions for a specific unit
    test_predictions(floor_no=1, unit_no=1) 