@echo off

for %%a in ("..\..\apps\trmrk-react-testapp") do (
  cd %%a
  .\_\upd-pcks.bat
)

@echo on