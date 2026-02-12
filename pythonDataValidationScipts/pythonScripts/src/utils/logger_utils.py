from datetime import datetime
import logging
import os

#function defining the logger required to update the logs for debigging and checking the issues in XML validation
def setup_logger():
    try:
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        LOG_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "logs")
        os.makedirs(LOG_DIR, exist_ok=True)
        LOG_FILE = os.path.join(LOG_DIR, f"validationLog_{timestamp}.log")
        
        logger = logging.getLogger("validation_logger")
        logger.setLevel(logging.DEBUG)

        if not logger.handlers:
            file_handler = logging.FileHandler(LOG_FILE)
            file_handler.setLevel(logging.DEBUG)

            formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
            file_handler.setFormatter(formatter)

            logger.addHandler(file_handler)

        return logger

    except Exception as e:
        # Fallback to a basic console logger in case of failure
        fallback_logger = logging.getLogger("fallback_logger")
        if not fallback_logger.handlers:
            console_handler = logging.StreamHandler()
            console_handler.setLevel(logging.ERROR)
            formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
            console_handler.setFormatter(formatter)
            fallback_logger.addHandler(console_handler)
        fallback_logger.error(f"Logger setup failed: {e}")
        return fallback_logger
