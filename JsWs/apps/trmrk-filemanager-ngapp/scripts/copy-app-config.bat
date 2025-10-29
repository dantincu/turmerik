@echo off
REM First argument is the environment name (e.g. dev, prod)
set ENV=%1

REM Construct source and destination paths
set SRC=src\env\app-config.%ENV%.json
set DEST=public\app-config.env.json

echo Copying %SRC% to %DEST% ...
copy /Y "%SRC%" "%DEST%"

REM Exit with the same errorlevel as copy
exit /b %errorlevel%
