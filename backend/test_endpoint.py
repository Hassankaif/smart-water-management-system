import requests
import json
from datetime import datetime, timedelta

def test_prediction():
    url = "http://localhost:5000/api/predict"
    
    # Test data - using floor 4 instead of 5 since data shows floors 1-5
    payload = {
        "floor": 4,  # This will look for model A304
        "unit": 4,
        "days": 7
    }
    
    try:
        print(f"\nSending request to {url}")
        print(f"Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(url, json=payload)
        
        print(f"\nStatus Code: {response.status_code}")
        print("\nResponse:")
        print(json.dumps(response.json(), indent=2))
        
        if response.status_code == 200:
            predictions = response.json().get('predictions', [])
            
            # Print predictions in a readable format
            print("\nPredicted Water Usage:")
            dates = [(datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d') 
                    for i in range(1, len(predictions) + 1)]
                    
            for date, pred in zip(dates, predictions):
                print(f"{date}: {pred:.2f} units")
                
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the server. Make sure Flask is running.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_prediction() 