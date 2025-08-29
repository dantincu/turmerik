# Define the base directory where Node.js versions are installed
$baseDir = "C:\Program Files\nodejs"

# Find the latest version folder (assuming versioned names like v20.5.1)
$latestNodeDir = Get-ChildItem -Path $baseDir -Directory |
Where-Object { $_.Name -match "^v\d+\.\d+\.\d+$" } |
Sort-Object Name -Descending |
Select-Object -First 1

if (-not $latestNodeDir) {
  Write-Host "No versioned Node.js directory found in $baseDir"
  exit
}

# Build the full path to node.exe
$newNodePath = Join-Path $latestNodeDir.FullName "node.exe"

if (-not (Test-Path $newNodePath)) {
  Write-Host "node.exe not found in $($latestNodeDir.FullName)"
  exit
}

# Get current user PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")

# Remove any existing node.exe paths
$updatedPath = $currentPath -split ";" |
Where-Object { -not ($_ -match "node\.exe") } |
ForEach-Object { $_.Trim() }

# Add the new Node.js directory (not node.exe itself)
$updatedPath += $latestNodeDir.FullName

# Join and update the PATH
$newPathString = ($updatedPath -join ";")
[Environment]::SetEnvironmentVariable("PATH", $newPathString, "User")

Write-Host "PATH updated to use Node.js from: $($latestNodeDir.FullName)"
