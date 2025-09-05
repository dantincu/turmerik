param (
  [Parameter(Mandatory = $true, Position = 0)]
  [string]$Name
)

# Define the HTML content as a here-string (preserves formatting)
$htmlContent = @"
<!DOCTYPE html>
<html>
  <head>
    <title></title>
    <style></style>
  </head>
  <body></body>
</html>
"@

# Build the full filename with .html extension
$filePath = "$Name.html"

# Write the content to the file
Set-Content -Path $filePath -Value $htmlContent -Encoding UTF8

Write-Host "Created file: $filePath"
