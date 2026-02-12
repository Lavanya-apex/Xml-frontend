import pytest
from unittest.mock import patch, mock_open
import sys
import os

# Append path for module import
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src')))
from utils.xml_utils import validate_xml

# Parameterized test with different file scenarios
@pytest.mark.parametrize(
    "file_path, file_exists, file_content, expected",
    [
        ("fixtures/sample1.xml", True, "<root><child></child></root>", True),     # Well-formed XML
        ("fixtures/invalidSample.xml", True, "<root><child></child>", False),     # Malformed XML
        ("fixtures/SampleData1.xml", True, "<root><child></child></root>", True), # Another valid XML
        ("fixtures/sample3.xml", False, "", False)                                # File does not exist
    ],
    ids=["Simple Valid XML", "Malformed XML", "Valid XML with many data", "File does not exist"]
)
@patch("os.path.exists")  
@patch("builtins.open", new_callable=mock_open) 
def test_validate_xml_file(mock_file, mock_exists, file_path, file_exists, file_content, expected):
    mock_exists.return_value = file_exists

    if file_exists:
        mock_file.return_value.read.return_value = file_content

    # ✅ Explicitly pass file path as source name to help logger
    result = validate_xml(file_path, source_name=file_path)

    assert result == expected
