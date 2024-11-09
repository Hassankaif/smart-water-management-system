import os
import pandas as pd

def check_data():
    try:
        if not os.path.exists('water_consumption_data.csv'):
            print("Error: water_consumption_data.csv not found!")
            return
            
        df = pd.read_csv('water_consumption_data.csv')
        print(f"\nData shape: {df.shape}")
        print("\nColumns:", df.columns.tolist())
        print("\nSample data:")
        print(df.head())
        
        # Check unique floors and units
        floors = df['floor'].unique()
        units = df['unit'].unique()
        print(f"\nUnique floors: {sorted(floors)}")
        print(f"Unique units: {sorted(units)}")
        
    except Exception as e:
        print(f"Error checking data: {e}")

if __name__ == "__main__":
    check_data() 