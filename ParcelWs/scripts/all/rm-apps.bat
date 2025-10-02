@echo off

for %%a in ("..\..\apps\trmrk-filemanager-ngapp",
"..\..\apps\trmrk-http-proxy-nodejsapp",
"..\..\apps\trmrk-mailbox-ngapp",
"..\..\apps\trmrk-notes-ngapp") do (
  cd %%a
  .\_\rm.bat
)

@echo on