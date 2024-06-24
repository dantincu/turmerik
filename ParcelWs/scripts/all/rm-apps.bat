@echo off

for %%a in ("..\..\apps\trmrk-react-testapp") do (
  cd %%a
  .\_\rm.bat
)

@echo on