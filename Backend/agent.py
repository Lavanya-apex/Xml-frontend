import os
import requests
from lxml import etree
from pathlib import Path
import sys

# --- CONFIGURATION ---
# These should be set via environment variables in production
TEST_FOLDER_PATH = os.getenv("XML_VALIDATION_FOLDER", "")
TEST_API_TOKEN = os.getenv("API_TOKEN", "")
TEST_API_URL = os.getenv("API_URL", "http://127.0.0.1:8000/api/v1/Agent/bulk-results")

def validate_xml_locally(xml_content: bytes):
    """Core logic to check XML on the user's machine."""
    parser = etree.XMLParser(recover=False, resolve_entities=False)
    try:
        etree.fromstring(xml_content, parser)
        return True, "None"
    except etree.XMLSyntaxError:
        errors = [f"Line {e.line}: {e.message}" for e in parser.error_log]
        return False, " | ".join(errors)
    except Exception as e:
        return False, f"Unexpected Error: {str(e)}"

def run_test_validation():
    """Main function to validate XML files and sync results with the server."""
    
    # Validate configuration
    if not TEST_FOLDER_PATH:
        print("❌ Error: XML_VALIDATION_FOLDER environment variable not set.")
        sys.exit(1)
    
    if not TEST_API_TOKEN:
        print("❌ Error: API_TOKEN environment variable not set.")
        sys.exit(1)
    
    results = []
    
    if not os.path.exists(TEST_FOLDER_PATH):
        print(f"❌ Error: The folder '{TEST_FOLDER_PATH}' does not exist.")
        return

    print(f"🔍 Scanning Folder: {TEST_FOLDER_PATH}")
    
    # 1. Validation Logic
    files = [f for f in os.listdir(TEST_FOLDER_PATH) if f.endswith(".xml")]
    print(f"📂 Found {len(files)} files. Validating...")

    for file_name in files:
        full_path = os.path.join(TEST_FOLDER_PATH, file_name)
        try:
            with open(full_path, "rb") as f:
                content = f.read()
                is_valid, error = validate_xml_locally(content)
                results.append({
                    "file_name": file_name,
                    "is_valid": is_valid,
                    "error": error
                })
        except Exception as e:
            print(f"⚠️ Error reading {file_name}: {e}")

    # 2. Sync Logic
    if not results:
        print("ℹ️ No XML results to send.")
        return

    print(f"🚀 Sending {len(results)} results to server...")
    headers = {"Authorization": f"Bearer {TEST_API_TOKEN}"}
    
    try:
        response = requests.post(TEST_API_URL, json={"results": results}, headers=headers)
        if response.status_code == 200:
            print("✅ Success: Server updated successfully!")
            print(f"Server Response: {response.json()}")
        else:
            print(f"❌ Sync Failed: {response.status_code}")
            print(f"Reason: {response.text}")
    except Exception as e:
        print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    # Just call the function directly for testing
    run_test_validation()