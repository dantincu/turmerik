@echo off

for %%a in ("..\..\apps\trmrk-react-testapp",
"..\..\apps\trmrk-notes-reactapp") do (
  cd %%a
  .\_\rm-ch_dst.bat
  npm run build
)
@echo on