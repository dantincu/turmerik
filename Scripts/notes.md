# Turmerik Scripts

How to edit my PATH variable from powershell:

```powershell
[Environment]::GetEnvironmentVariable("PATH", "User") -split ";" | Out-File "$env:USERPROFILE\path_user.txt"
# edit the file, then reimport:
$updated = (Get-Content "$env:USERPROFILE\path_user.txt") -join ";"
[Environment]::SetEnvironmentVariable("PATH", $updated, "User")
```

How do permanently edit my PATH variable from cmd:
```cmd
setx PATH "%PATH%;c:\A\T\turmerik\Scripts\global"
```