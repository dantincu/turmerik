cd /d %USERPROFILE%\AppData\Roaming\Ayran\Apps\Bin\lan-streamer
set PORT=9443
rem Real-time audio mixing happens on a setInterval tick that the OS can
rem starve of CPU time when other apps on this machine are busy (e.g. a
rem browser tab decoding/playing the very audio being streamed) - running
rem this above normal priority asks the Windows scheduler to favor it over
rem that ordinary background load instead of fighting for the same slice.
rem /B keeps output in this console (no new window); /WAIT keeps this
rem script blocked until node exits, same as running it directly did.
start "" /HIGH /WAIT /B node dist\bundle.cjs
