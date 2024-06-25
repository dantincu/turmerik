@echo off

for %%a in ("..\..\apps\trmrk-react-testapp",
"..\..\apps\trmrk-notes-reactapp") do (
  cd %%a
  .\_\rm-nd_mods.bat
)

@echo on