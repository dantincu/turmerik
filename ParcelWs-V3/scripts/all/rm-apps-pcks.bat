@echo off

for %%a in ("..\..\apps\trmrk-notes-blazorapp",
"..\..\apps\trmrk-react-testapp",
"..\..\apps\trmrk-text-transform-behavior",
"..\..\apps\trmrk-text-transform-behavior-testapp",
"..\..\apps\trmrk-text-transform-defaultbehavior",
"..\..\apps\trmrk-text-transform-mybehavior") do (
  cd %%a
  .\_\rm-pcks.bat
)

@echo on