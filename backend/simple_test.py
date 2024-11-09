import requests
import json
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def test_simple_prediction():
    url = "http://localhost:5000/api/predict"
    
    # Test data for Floor 4 Unit 4
    payload = {
        "floor": 4,
        "unit": 4,
        "days": 7
    }
    
    logger.info(f"Testing prediction for Floor {payload['floor']} Unit {payload['unit']}")
    
    try:
        # Make request
        logger.debug(f"Sending POST request to {url}")
        logger.debug(f"Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(url, json=payload)
        
        logger.info(f"Response Status Code: {response.status_code}")
        logger.info(f"Response Headers: {dict(response.headers)}")
        logger.info(f"Response Content: {response.text}")
        
        # Parse response
        if response.status_code == 200:
            data = response.json()
            logger.info("Prediction successful!")
            logger.info(f"Predictions: {json.dumps(data['predictions'], indent=2)}")
        else:
            logger.error(f"Prediction failed with status code {response.status_code}")
            logger.error(f"Error message: {response.text}")
            
    except Exception as e:
        logger.error(f"Exception occurred: {str(e)}", exc_info=True)

if __name__ == "__main__":
    test_simple_prediction() 