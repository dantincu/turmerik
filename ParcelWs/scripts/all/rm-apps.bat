@echo off

for %%a in ("..\..\apps\trmrk-react-testapp",
"..\..\apps\trmrk-notes-reactapp",
"..\..\apps\trmrk-notes-lithtmlapp",
"..\..\apps\trmrk-http-proxy-nodejsapp") do (
  cd %%a
  .\_\rm.bat
)

@echo on