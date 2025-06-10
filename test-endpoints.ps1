# Test the ping endpoint
Write-Host "Testing /api/ping endpoint..." -ForegroundColor Cyan
$pingResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/ping" -Method Get -UseBasicParsing
Write-Host "Status: $($pingResponse.StatusCode) $($pingResponse.StatusDescription)"
Write-Host "Response: $($pingResponse.Content)"

# Test the echo endpoint with POST
Write-Host "`nTesting /api/echo endpoint with POST..." -ForegroundColor Cyan
$headers = @{
    "Content-Type" = "application/json"
}
$body = @{
    message = "Hello, Vercel!"
    timestamp = Get-Date -Format o
} | ConvertTo-Json

$echoResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/echo" -Method Post -Headers $headers -Body $body -UseBasicParsing
Write-Host "Status: $($echoResponse.StatusCode) $($echoResponse.StatusDescription)"
Write-Host "Response: $($echoResponse.Content)"
