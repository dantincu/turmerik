@echo off
setlocal

set "cmd=%~1"

set "exePath="
if /I "%cmd%"=="c"   set "exePath=%USERPROFILE%\AppData\Local\Turmerik\Apps\Bin\Turmerik.ExecuteCustomCommand.ConsoleApp\Release\net10.0\Turmerik.ExecuteCustomCommand.ConsoleApp.exe"
if /I "%cmd%"=="ls"  set "exePath=%USERPROFILE%\AppData\Local\Turmerik\Apps\Bin\Turmerik.LsFsDirPairs.ConsoleApp\Release\net10.0\Turmerik.LsFsDirPairs.ConsoleApp.exe"
if /I "%cmd%"=="lsd" set "exePath=%USERPROFILE%\AppData\Local\Turmerik\Apps\Bin\Turmerik.ListDirsDeep.ConsoleApp\Release\net10.0\Turmerik.ListDirsDeep.ConsoleApp.exe"
if /I "%cmd%"=="p"   set "exePath=%USERPROFILE%\AppData\Local\Turmerik\Apps\Bin\Turmerik.MkFsDirsPair.ConsoleApp\Release\net10.0\Turmerik.MkFsDirsPair.ConsoleApp.exe"
if /I "%cmd%"=="pdf" set "exePath=%USERPROFILE%\AppData\Local\Turmerik\Apps\Bin\Turmerik.MdToPdf.ConsoleApp\Release\net10.0\Turmerik.MdToPdf.ConsoleApp.exe"
if /I "%cmd%"=="rf"  set "exePath=%USERPROFILE%\AppData\Local\Turmerik\Apps\Bin\Turmerik.RfDirsPairNames.ConsoleApp\Release\net10.0\Turmerik.RfDirsPairNames.ConsoleApp.exe"
if /I "%cmd%"=="uc"  set "exePath=%USERPROFILE%\AppData\Local\Turmerik\Apps\Bin\Turmerik.UpdateNoteChildren.ConsoleApp\Release\net10.0\Turmerik.UpdateNoteChildren.ConsoleApp.exe"
if /I "%cmd%"=="ux"  set "exePath=%USERPROFILE%\AppData\Local\Turmerik\Apps\Bin\Turmerik.UpdFsDirPairsIdxes.ConsoleApp\Release\net10.0\Turmerik.UpdFsDirPairsIdxes.ConsoleApp.exe"

if not defined exePath (
    echo Unknown command: %cmd%
    echo Usage: _t.bat ^<c^|ls^|lsd^|p^|pdf^|rf^|uc^|ux^> [args...]
    exit /b 1
)

shift
set "rest="
:loop
if "%~1"=="" goto :done
set "rest=%rest% "%~1""
shift
goto :loop
:done

"%exePath%"%rest%
endlocal
