# Get the full path to the child script
$scriptPath = Join-Path $PSScriptRoot "..\powershell\get-path-var.ps1"

# Capture the output of the child script
$newPath = & $scriptPath

# Update the current session's PATH
$env:PATH = $newPath

# Confirm the change
Write-Host "Updated PATH:"
Write-Host $env:PATH
