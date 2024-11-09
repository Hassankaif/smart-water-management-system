import os
import shutil
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def setup_models():
    # Define paths
    source_dir = os.path.join('train', 'models')
    target_dir = 'models'
    
    try:
        # Create target directory if it doesn't exist
        os.makedirs(target_dir, exist_ok=True)
        
        # Copy all files from source to target
        for file in os.listdir(source_dir):
            source_file = os.path.join(source_dir, file)
            target_file = os.path.join(target_dir, file)
            
            shutil.copy2(source_file, target_file)
            logger.info(f"Copied {file}")
            
        logger.info("Model setup completed successfully!")
        
    except Exception as e:
        logger.error(f"Error setting up models: {e}")

if __name__ == "__main__":
    setup_models() 