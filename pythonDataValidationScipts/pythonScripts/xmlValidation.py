import xml.etree.ElementTree as ET
import requests
import os
import logging

# Setup basic logger
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("xml_validator")

def validate_xml_file(file_path: str) -> bool:
    """
    Validate if the XML in the given file path is well-formed.
    """
    if not os.path.exists(file_path):
        logger.error(f"❌ File not found: {file_path}")
        return False

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            xml_content = file.read()
        ET.fromstring(xml_content)
        logger.info(f"✅ {file_path} is a valid XML file!")
        return True
    except ET.ParseError as e:
        logger.error(f"❌ XML Parsing Error in {file_path}: {e}")
        return False
    except Exception as e:
        logger.error(f"❌ Unexpected error reading {file_path}: {e}")
        return False

def validate_xml_from_url(url: str) -> bool:
    """
    Validate if the XML fetched from the given URL is well-formed.
    """
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        content_type = response.headers.get("Content-Type", "")
        if "xml" not in content_type and not response.text.strip().startswith("<"):
            logger.warning(f"⚠️ Content from {url} may not be XML (Content-Type: {content_type})")

        ET.fromstring(response.text)
        logger.info(f"✅ XML from {url} is valid!")
        return True
    except (requests.RequestException, ET.ParseError) as e:
        logger.error(f"❌ Error fetching or parsing XML from {url}: {e}")
        return False
    except Exception as e:
        logger.error(f"❌ Unexpected error with URL {url}: {e}")
        return False

if __name__ == "__main__":
    # Validate XML files
    validate_xml_file("fixtures/SampleData1.xml")        # Replace with actual path
    validate_xml_file("fixtures/invalidSample.xml")

    # Validate XML from a remote URL
    validate_xml_from_url("https://www.w3schools.com/xml/note.xml")
