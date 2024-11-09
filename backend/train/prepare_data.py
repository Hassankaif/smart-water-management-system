import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

def load_and_prepare_data(file_path, floor_no, unit_no):
    """Load and prepare data for a specific unit"""
    # Read the data
    df = pd.read_csv(file_path)
    
    # Filter for specific floor and unit
    unit_data = df[(df['floor'] == floor_no) & (df['unit'] == unit_no)].copy()
    
    # Convert date to datetime
    unit_data['date'] = pd.to_datetime(unit_data['date'])
    
    # Sort by date
    unit_data = unit_data.sort_values('date')
    
    # Check for missing dates
    date_range = pd.date_range(start=unit_data['date'].min(), end=unit_data['date'].max())
    missing_dates = date_range.difference(unit_data['date'])
    
    if len(missing_dates) > 0:
        print(f"Warning: Found {len(missing_dates)} missing dates")
        # Fill missing dates with forward fill then backward fill
        unit_data = unit_data.set_index('date').reindex(date_range)
        unit_data['water_usage'] = unit_data['water_usage'].fillna(method='ffill').fillna(method='bfill')
        unit_data = unit_data.reset_index().rename(columns={'index': 'date'})
    
    return unit_data

def analyze_data(data):
    """Analyze the water consumption patterns"""
    # Basic statistics
    stats = data['water_usage'].describe()
    print("\nBasic Statistics:")
    print(stats)
    
    # Create plots directory if it doesn't exist
    import os
    if not os.path.exists('plots'):
        os.makedirs('plots')
    
    # Time series plot
    plt.figure(figsize=(15, 6))
    plt.plot(data['date'], data['water_usage'])
    plt.title('Water Consumption Over Time')
    plt.xlabel('Date')
    plt.ylabel('Water Usage')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('plots/time_series.png')
    plt.close()
    
    # Distribution plot
    plt.figure(figsize=(10, 6))
    sns.histplot(data['water_usage'], bins=30)
    plt.title('Water Usage Distribution')
    plt.xlabel('Water Usage')
    plt.savefig('plots/distribution.png')
    plt.close()
    
    # Weekly pattern
    data['day_of_week'] = data['date'].dt.day_name()
    weekly_avg = data.groupby('day_of_week')['water_usage'].mean()
    
    plt.figure(figsize=(10, 6))
    weekly_avg.plot(kind='bar')
    plt.title('Average Water Usage by Day of Week')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('plots/weekly_pattern.png')
    plt.close()
    
    return stats

def prepare_sequences(data, sequence_length=7):
    """Prepare sequences for LSTM training"""
    sequences = []
    targets = []
    
    for i in range(len(data) - sequence_length):
        sequence = data[i:(i + sequence_length)]
        target = data[i + sequence_length]
        sequences.append(sequence)
        targets.append(target)
    
    return np.array(sequences), np.array(targets)

if __name__ == "__main__":
    # Example usage
    floor_no = 1
    unit_no = 1
    
    # Load and prepare data
    data = load_and_prepare_data('../water_consumption_data.csv', floor_no, unit_no)
    
    # Analyze data
    stats = analyze_data(data)
    
    # Prepare sequences (example)
    water_usage = data['water_usage'].values
    scaler = MinMaxScaler()
    water_usage_scaled = scaler.fit_transform(water_usage.reshape(-1, 1))
    
    sequences, targets = prepare_sequences(water_usage_scaled)
    print(f"\nPrepared {len(sequences)} sequences for training") 