@echo off

for %%a in ("..\..\apps\trmrk-react-testapp",
"..\..\apps\trmrk-notes-reactapp",
"..\..\apps\trmrk-notes-lithtmlapp") do (
  cd %%a
  .\_\upd-pcks.bat
)

@echo on