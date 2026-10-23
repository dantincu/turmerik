@echo off
set "_GTAYCB_FILE=%LOCALAPPDATA%\Turmerik\Apps\Content\localdevice-paths\paths\AYRAN_CSDRIVE_WEBHOST_INTERNAL_CLIPBOARD_FILE.txt"
set "_GTAYCB_TARGET="
set "_GTAYCB_DIR="
set "_GTAYCB_TARGET_PARENT="
set "_GTAYCB_BASE_FILE="
set "_GTAYCB_BASE="

if not exist "%_GTAYCB_FILE%" (
    echo File not found: "%_GTAYCB_FILE%"
    goto :cleanup
)

set /p _GTAYCB_TARGET=<"%_GTAYCB_FILE%"

if not defined _GTAYCB_TARGET (
    echo File is empty: "%_GTAYCB_FILE%"
    goto :cleanup
)

if not exist "%_GTAYCB_TARGET%" (
    echo File not found: "%_GTAYCB_TARGET%"
    goto :cleanup
)

set /p _GTAYCB_DIR=<"%_GTAYCB_TARGET%"

if not defined _GTAYCB_DIR (
    echo File is empty: "%_GTAYCB_TARGET%"
    goto :cleanup
)

if "%~1"=="" goto :change_dir

rem Resolve the base path file relative to the parent folder of the target file (absolute paths stay as they are)
for %%F in ("%_GTAYCB_TARGET%") do set "_GTAYCB_TARGET_PARENT=%%~dpF"
pushd "%_GTAYCB_TARGET_PARENT%"
for %%F in ("%~1") do set "_GTAYCB_BASE_FILE=%%~fF"
popd

if not exist "%_GTAYCB_BASE_FILE%" (
    echo File not found: "%_GTAYCB_BASE_FILE%"
    goto :cleanup
)

set /p _GTAYCB_BASE=<"%_GTAYCB_BASE_FILE%"

if not defined _GTAYCB_BASE (
    echo File is empty: "%_GTAYCB_BASE_FILE%"
    goto :cleanup
)

rem Join base and directory paths; %%~f collapses any duplicated separators
for %%F in ("%_GTAYCB_BASE%\%_GTAYCB_DIR%") do set "_GTAYCB_DIR=%%~fF"

:change_dir
echo %_GTAYCB_DIR%
cd /d "%_GTAYCB_DIR%"

:cleanup
set "_GTAYCB_FILE="
set "_GTAYCB_TARGET="
set "_GTAYCB_DIR="
set "_GTAYCB_TARGET_PARENT="
set "_GTAYCB_BASE_FILE="
set "_GTAYCB_BASE="
