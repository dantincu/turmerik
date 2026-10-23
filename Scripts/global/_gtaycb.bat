@echo off
set "_GTAYCB_FILE=%LOCALAPPDATA%\Turmerik\Apps\Content\localdevice-paths\paths\AYRAN_CSDRIVE_WEBHOST_INTERNAL_CLIPBOARD_FILE.txt"
set "_GTAYCB_TARGET="
set "_GTAYCB_DIR="

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

cd /d "%_GTAYCB_DIR%"

:cleanup
set "_GTAYCB_FILE="
set "_GTAYCB_TARGET="
set "_GTAYCB_DIR="
