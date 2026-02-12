#!/usr/bin/env python
"""
Test script to verify the authentication and XSD upload flow
"""
import requests
import json
from pathlib import Path

API_URL = "http://localhost:8000/api/v1"
TEST_USERNAME = "testuser2"
TEST_PASSWORD = "testpass123"
TEST_EMAIL = "testuser2@example.com"

def test_registration():
    """Step 1: Register a user"""
    print("\n=== Step 1: Register ===")
    data = {
        "username": TEST_USERNAME,
        "password": TEST_PASSWORD,
        "name": "Test User",
        "email": TEST_EMAIL
    }
    resp = requests.post(f"{API_URL}/users/", json=data)
    print(f"Status: {resp.status_code}")
    if resp.status_code == 201:
        result = resp.json()
        token = result['data']['access_token']
        print(f"✓ Registered. Token: {token[:30]}...")
        return token
    elif resp.status_code == 400:
        # User already exists, try login instead
        print("User already exists, trying login...")
        return test_login()
    else:
        print(f"✗ Error: {resp.text}")
        return None

def test_login():
    """Step 2: Login to get token"""
    print("\n=== Step 2: Login ===")
    data = {
        "username": TEST_USERNAME,
        "password": TEST_PASSWORD
    }
    resp = requests.post(f"{API_URL}/users/login", json=data)
    print(f"Status: {resp.status_code}")
    if resp.status_code == 200:
        result = resp.json()
        token = result['data']['access_token']
        print(f"✓ Login successful. Token: {token[:30]}...")
        return token
    else:
        print(f"✗ Error: {resp.text}")
        return None

def test_xsd_upload(token):
    """Step 3: Upload XSD with authentication"""
    print("\n=== Step 3: XSD Upload ===")
    
    # Create a minimal XSD file for testing
    xsd_content = """<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
    <xs:element name="root" type="xs:string"/>
</xs:schema>"""
    
    files = {
        'file': ('test.xsd', xsd_content.encode(), 'application/xml')
    }
    headers = {
        'Authorization': f'Bearer {token}'
    }
    params = {
        'xsd_name': 'test1'
    }
    
    resp = requests.post(
        f"{API_URL}/xsd/upload",
        files=files,
        headers=headers,
        params=params
    )
    print(f"Status: {resp.status_code}")
    if resp.status_code == 201:
        result = resp.json()
        print(f"✓ XSD uploaded successfully: {result['data']}")
        return True
    else:
        print(f"✗ Error: {resp.text}")
        return False

if __name__ == "__main__":
    print("Starting authentication and XSD upload test...")
    
    # Step 1: Get token
    token = test_registration()
    if not token:
        print("\n✗ Failed to get token")
        exit(1)
    
    # Step 2: Test XSD upload with token
    if test_xsd_upload(token):
        print("\n✅ All tests passed!")
    else:
        print("\n✗ XSD upload failed")
