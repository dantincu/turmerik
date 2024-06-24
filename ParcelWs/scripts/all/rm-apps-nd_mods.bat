@echo off

for %%a in ("..\..\apps\trmrk-react-testapp") do (
  cd %%a
  .\_\rm-nd_mods.bat
)

@echo on