cd /d %USERPROFILE%\AppData\Roaming\Ayran\Apps\Bin\lan-streamer\api-rs
set PORT=9443
rem Same reasoning as the Node deployment's run script: real-time audio
rem mixing happens on a 20ms tick that the OS can starve of CPU time when
rem other apps on this machine are busy - running this above normal
rem priority asks the Windows scheduler to favor it over that ordinary
rem background load instead of fighting for the same slice.
rem /B keeps output in this console (no new window); /WAIT keeps this
rem script blocked until the process exits, same as running it directly did.
start "" /HIGH /WAIT /B bins\lan-streamer-api.exe
