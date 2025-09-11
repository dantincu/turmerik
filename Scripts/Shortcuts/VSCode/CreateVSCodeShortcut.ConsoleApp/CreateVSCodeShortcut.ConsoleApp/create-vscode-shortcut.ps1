$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut("$env:APPDATA\Turmerik\Apps\Shortcuts\VSCodeAlt.lnk")
$shortcut.TargetPath = "$env:USERPROFILE\AppData\Local\Programs\Microsoft VS Code\Code.exe"
$shortcut.IconLocation = "$env:USERPROFILE\AppData\Local\Programs\Microsoft VS Code\Code.exe"
$shortcut.Save()
