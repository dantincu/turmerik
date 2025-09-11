if (-not $env:PATH.EndsWith(";")) {
  $env:PATH += ";"
}
$env:PATH += "$env:USERPROFILE\portable-apps\aumid-stopgap-tools"
