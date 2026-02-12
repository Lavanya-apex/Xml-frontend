import pytest
import os
import pandas as pd
import sys

# Setup path for importing from 'src'
try:
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src')))
    from utils.xml_utils import validate_xml
except ImportError as e:
    pytest.fail(f"Import failed: {e}")

# Define Excel test case file
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
FIXTURE_PATH = os.path.join(PROJECT_ROOT, "fixtures", "testcases_inputs.xlsx")

def load_test_data_from_excel(file_path):
    try:
        df = pd.read_excel(file_path)
        if not {'xml_content', 'expected_result'}.issubset(df.columns):
            raise ValueError("Excel file must contain 'xml_content' and 'expected_result' columns")
        
        # Return test data with row number as source
        return [
            (row['xml_content'], row['expected_result'], f"Excel row {i + 2}")
            for i, row in df.iterrows()
        ]
    except Exception as e:
        pytest.fail(f"Failed to load test data from Excel: {e}")

@pytest.mark.parametrize(
    "xml_content, expected_result, source_name",
    load_test_data_from_excel(FIXTURE_PATH)
)
def test_xml_content_direct(xml_content, expected_result, source_name):
    assert validate_xml(xml_content, source_name=source_name) == expected_result
