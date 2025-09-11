@echo off
setlocal

REM Get the full path to the PowerShell script
set "SCRIPT_DIR=%~dp0"
set "PS_SCRIPT=%SCRIPT_DIR%..\get-path-var.ps1"

REM Run the PowerShell script and capture its output
for /f "usebackq delims=" %%A in (`powershell -noprofile -ExecutionPolicy Bypass -File "%PS_SCRIPT%"`) do set "NEWPATH=%%A"

REM Confirm the change
echo Updated PATH:
echo %NEWPATH%

endlocal & set "PATH=%NEWPATH%"
