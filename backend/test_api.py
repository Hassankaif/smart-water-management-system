import requests
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_prediction_api(floor=4, unit=4, days=7):
    url = "http://localhost:5000/api/predict"
    
    payload = {
        "floor": floor,
        "unit": unit,
        "days": days
    }
    
    logger.info(f"Sending request to {url}")
    logger.info(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(url, json=payload)
        
        logger.info(f"Status Code: {response.status_code}")
        logger.info(f"Response:\n{json.dumps(response.json(), indent=2)}")
        
        return response.json()
        
    except Exception as e:
        logger.error(f"Error testing API: {str(e)}")
        return None

if __name__ == "__main__":
    test_prediction_api() 