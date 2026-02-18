param(
  [Parameter(Mandatory = $true)]
  [string]$Url,

  [Parameter(Mandatory = $true)]
  [string]$PayloadPath
)

if (-not $env:RAZORPAY_WEBHOOK_SECRET) {
  throw "RAZORPAY_WEBHOOK_SECRET is not set."
}

if (-not (Test-Path -LiteralPath $PayloadPath)) {
  throw "Payload file not found: $PayloadPath"
}

$body = Get-Content -LiteralPath $PayloadPath -Raw
$secretBytes = [Text.Encoding]::UTF8.GetBytes($env:RAZORPAY_WEBHOOK_SECRET)
$bodyBytes = [Text.Encoding]::UTF8.GetBytes($body)

$hmac = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key = $secretBytes
$hash = $hmac.ComputeHash($bodyBytes)
$signature = -join ($hash | ForEach-Object { $_.ToString("x2") })

$headers = @{
  "x-razorpay-signature" = $signature
  "Content-Type" = "application/json"
}

Write-Host "POST $Url"
Write-Host "Payload: $PayloadPath"

$response = Invoke-RestMethod -Uri $Url -Method Post -Headers $headers -Body $body
$response | ConvertTo-Json -Depth 10
