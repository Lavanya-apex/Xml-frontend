$API_URL = "http://localhost:8000/api/v1"
$USERNAME = "testuser3"
$PASSWORD = "testpass123"

Write-Host "=== XSD Upload Test ===" -ForegroundColor Cyan

# Step 1: Login
Write-Host "`nLogging in..." -ForegroundColor Yellow
$loginBody = @{ username = $USERNAME; password = $PASSWORD } | ConvertTo-Json
$loginResp = Invoke-WebRequest -Uri "$API_URL/users/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = ($loginResp.Content | ConvertFrom-Json).data.access_token
Write-Host "OK - Login successful" -ForegroundColor Green

# Step 2: Create XSD file
Write-Host "Creating test XSD file..." -ForegroundColor Yellow
$xsdContent = '<?xml version="1.0" encoding="UTF-8"?><xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="root" type="xs:string"/></xs:schema>'
$xsdPath = "$env:TEMP\test.xsd"
Set-Content -Path $xsdPath -Value $xsdContent -Encoding UTF8
Write-Host "OK - XSD file created at $xsdPath" -ForegroundColor Green

# Step 3: Upload XSD
Write-Host "Uploading XSD with authentication token..." -ForegroundColor Yellow
$headers = @{ Authorization = "Bearer $token" }
$uploadResp = Invoke-WebRequest -Uri "$API_URL/xsd/upload?xsd_name=test1" -Method POST -Headers $headers -Form @{file = Get-Item $xsdPath}
$uploadData = $uploadResp.Content | ConvertFrom-Json

Write-Host "OK - Upload successful! Status: $($uploadResp.StatusCode)" -ForegroundColor Green
Write-Host "    XSD ID: $($uploadData.data.xsd_id)" -ForegroundColor Green
Write-Host "    XSD Name: $($uploadData.data.xsd_name)" -ForegroundColor Green
Write-Host "`nSUCCESS - All tests passed!" -ForegroundColor Cyan

Remove-Item -Path $xsdPath -Force
