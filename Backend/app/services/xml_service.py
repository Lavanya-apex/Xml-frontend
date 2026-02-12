import requests
from lxml import etree
from urllib.parse import urlparse
import logging

logger = logging.getLogger("xml_validator")
ALLOWED_EXTENSIONS = {'xml'}

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def url_validation(url: str) -> bool:
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except Exception:
        return False

def validate_xml_all_errors(xml_content: bytes):
    # Parser configured to handle large files or specific constraints if needed
    parser = etree.XMLParser(recover=False)
    try:
        etree.fromstring(xml_content, parser)
        return True, None
    except etree.XMLSyntaxError:
        # Format the error log into a readable string
        errors = [f"Line {e.line}: {e.message}" for e in parser.error_log]
        return False, " | ".join(errors)

def validate_xml_from_url(url: str):
    try:
        response = requests.get(url, timeout=10,verify=False)
        response.raise_for_status()
        
        # Using response.content (bytes) is better for lxml
        is_valid, error_msg = validate_xml_all_errors(response.content)
        return is_valid, error_msg
        
    except requests.RequestException as e:
        return False, f"Network Error: {str(e)}"
    except Exception as e:
        return False, f"Unexpected Error: {str(e)}"