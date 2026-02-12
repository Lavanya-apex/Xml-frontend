#script to check ag presence and data type of a Tag
import pytest
import sys
import os
# Setup path for importing from 'src'
try:
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src')))
    from utils.xml_utils import validate_xml, check_required_elements, validate_element_data_types
except ImportError as e:
    pytest.fail(f"Import failed: {e}")

# Sample well-formed XML string
valid_xml = """
<Person>
    <Name>John Doe</Name>
    <Age>30</Age>
    <Height>5.9</Height>
</Person>
"""

# Sample malformed XML string
malformed_xml = "<Person><Name>Missing closing tag</Name>"

def test_validate_xml_valid():
    assert validate_xml(valid_xml, source_name="Test XML") == True

def test_validate_xml_invalid():
    assert validate_xml(malformed_xml, source_name="Malformed XML") == False

def test_check_required_elements_present():
    required_elements = ['Name', 'Age']
    assert check_required_elements(valid_xml, required_elements, source_name="Test XML") == True

def test_check_required_elements_missing():
    required_elements = ['Name', 'Gender']
    assert check_required_elements(valid_xml, required_elements, source_name="Test XML") == False

def test_validate_element_data_types_correct():
    element_types = {'Age': int, 'Height': float}
    assert validate_element_data_types(valid_xml, element_types, source_name="Test XML") == True

def test_validate_element_data_types_incorrect():
    # Age is a string here to simulate a type mismatch
    invalid_xml = """
    <Person>
        <Name>Jane</Name>
        <Age>Thirty</Age>
        <Height>5.9</Height>
    </Person>
    """
    element_types = {'Age': int, 'Height': float}
    assert validate_element_data_types(invalid_xml, element_types, source_name="Invalid Types") == False
