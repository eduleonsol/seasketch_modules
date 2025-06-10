# Helper function to make API requests and display formatted output
function Test-ApiEndpoint {
    param (
        [string]$Url,
        [string]$Method = 'GET',
        [object]$Body = $null,
        [hashtable]$Headers = @{}
    )

    Write-Host "`n$(Get-Date -Format 'HH:mm:ss') Testing $Method $Url" -ForegroundColor Cyan
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            UseBasicParsing = $true
            ErrorAction = 'Stop'
        }

        if ($Body) {
            if ($Body -is [string]) {
                $params.Body = $Body
            } else {
                $params.Body = $Body | ConvertTo-Json -Depth 5
            }
            if (-not $params.Headers.ContainsKey('Content-Type')) {
                $params.Headers['Content-Type'] = 'application/json'
            }
        }

        $response = Invoke-WebRequest @params
        
        Write-Host "Status: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
        
        # Try to parse as JSON, fall back to raw content
        try {
            $response.Content | ConvertFrom-Json -ErrorAction Stop | 
                ConvertTo-Json -Depth 5 | 
                Write-Host -ForegroundColor White
        } catch {
            Write-Host $response.Content -ForegroundColor White
        }
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response: $responseBody" -ForegroundColor Red
        }
    }
}

# Test ping endpoint
Test-ApiEndpoint -Url "http://localhost:3001/api/ping" -Method GET

# Test echo endpoint with POST
$testData = @{
    message = "Hello, Vercel!"
    timestamp = Get-Date -Format o
    testArray = @(1, 2, 3)
    testNested = @{
        key1 = "value1"
        key2 = 42
    }
}

Test-ApiEndpoint -Url "http://localhost:3001/api/echo" -Method POST -Body $testData

# Test with invalid endpoint
Test-ApiEndpoint -Url "http://localhost:3001/api/nonexistent" -Method GET
