$p = $env:PATH
if (-not $p.EndsWith(";")) { $p += ";" }

$p += "$env:USERPROFILE\portable-apps\aumid-stopgap-tools"

Write-Output $p
