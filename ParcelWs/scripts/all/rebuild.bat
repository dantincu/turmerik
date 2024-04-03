@echo off

for %%a in ("..\..\libs\trmrk",
"..\..\libs\trmrk-axios",
"..\..\libs\trmrk-blazor",
"..\..\libs\trmrk-browser",
"..\..\libs\trmrk-react",
"..\..\apps\trmrk-notes-blazorapp",
"..\..\apps\trmrk-react-testapp",
"..\..\apps\trmrk-text-transform-behavior",
"..\..\apps\trmrk-text-transform-behavior-testapp",
"..\..\apps\trmrk-text-transform-defaultbehavior",
"..\..\apps\trmrk-text-transform-mybehavior") do (
  cd %%a
  .\_\rm-ch_dst.bat
  npm run build
)
@echo on