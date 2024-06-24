@echo off

for %%a in ("..\..\apps\trmrk-react-testapp") do (
  cd %%a
  .\_\rm-ch_dst.bat
)
@echo on