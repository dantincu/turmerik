@echo off
for /f "usebackq delims=" %%A in (`powershell -noprofile -command ^
  "$p=$env:PATH; if (-not $p.EndsWith(';')) { $p+=';' }; $p += \"$env:USERPROFILE\portable-apps\aumid-stopgap-tools\"; Write-Output $p"`) do set "PATH=%%A"
