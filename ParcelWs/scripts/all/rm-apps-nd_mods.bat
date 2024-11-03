@echo off

for %%a in ("..\..\apps\trmrk-http-proxy-nodejsapp",
"..\..\apps\trmrk-notes-lithtmlapp",
"..\..\apps\trmrk-notes-reactapp",
"..\..\apps\trmrk-notes-solidjsapp",
"..\..\apps\trmrk-react-testapp") do (
  cd %%a
  .\_\rm-nd_mods.bat
)

@echo on