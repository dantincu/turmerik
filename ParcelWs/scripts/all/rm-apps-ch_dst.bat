@echo off

for %%a in ("..\..\apps\trmrk-notes-blazorapp",
"..\..\apps\trmrk-react-testapp") do (
  cd %%a
  .\_\rm-ch_dst.bat
)
@echo on